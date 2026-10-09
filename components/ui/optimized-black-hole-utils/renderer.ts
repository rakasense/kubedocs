/**
 * WebGL black-hole renderer.
 *
 * Single fullscreen-quad fragment shader that does:
 *   1. A procedural starfield sampled per ray direction
 *   2. Inverse-mapped ray tracing under the Schwarzschild metric
 *      to produce gravitational lensing of the background
 *   3. An accretion disk with relativistic Doppler beaming
 *   4. A photon ring at r = 1.5 r_s
 *   5. A black event horizon at r < r_s
 *
 * Public contract matches the host component:
 *   createRenderer({ canvas }) → { ready: Promise, dispose: () => void }
 *
 * No external assets. No extensions beyond WebGL1. Pauses on tab hidden
 * to keep it from burning the laptop on a backgrounded tab.
 */

export type Renderer = {
  ready: Promise<void>;
  dispose: () => void;
};

export type CreateRendererOptions = {
  canvas: HTMLCanvasElement;
};

// ---------- shaders ----------

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Hash, noise, starfield, lensing, disk. The lensing math is the
// standard Schwarzschild inverse-mapping: the ray's impact parameter
// determines the closest approach, which determines how much the
// incoming direction is bent. We solve it numerically per pixel.
const FRAG = `
precision highp float;

varying vec2 vUv;
uniform vec2  uRes;
uniform float uTime;
uniform float uYaw;   // camera yaw around the black hole (radians)
uniform float uPitch; // camera pitch (radians)

// --- hash + value noise for the starfield ---
float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 19.19);
  return fract((p.x + p.y) * p.z);
}

float stars(vec3 dir) {
  // Project direction onto a 3D grid, sample inside each cell. Multiplied
  // through 3 octaves for density. This is cheap and runs in a fragment
  // shader without precomputed textures.
  vec3 d = normalize(dir);
  float s = 0.0;
  for (int i = 0; i < 3; i++) {
    float scale = pow(2.0, float(i));
    vec3 p = d * scale * 90.0;
    vec3 c = floor(p);
    vec3 f = fract(p);
    for (int z = -1; z <= 1; z++) {
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec3 g = vec3(float(x), float(y), float(z));
          vec3 o = g + 0.5 + 0.4 * (hash13(c + g) - 0.5) - f;
          float r2 = dot(o, o);
          float w = exp(-r2 * 18.0);
          float h = hash13(c + g + 7.13);
          // only the brightest subset becomes a star
          if (h > 0.985) s += w;
        }
      }
    }
  }
  return s;
}

float starColor(vec3 dir) {
  // Pick a colour per star from the hash. Returned as 0..1 brightness.
  vec3 d = normalize(dir);
  vec3 p = floor(d * 200.0);
  return hash13(p);
}

// --- rotate a 3D direction by yaw/pitch ---
vec3 rotateDir(vec3 d, float yaw, float pitch) {
  // yaw around +Y
  float cy = cos(yaw), sy = sin(yaw);
  d = vec3(cy * d.x + sy * d.z, d.y, -sy * d.x + cy * d.z);
  // pitch around +X
  float cp = cos(pitch), sp = sin(pitch);
  d = vec3(d.x, cp * d.y - sp * d.z, sp * d.y + cp * d.z);
  return d;
}

// --- the actual black hole ---
// All distances in units of the Schwarzschild radius r_s. The black hole
// sits at the origin, the disk lies in the xz-plane at y = 0.
//
// Camera model: the camera is far away on +z, looking back at the
// origin. A screen-space coordinate uv = (x, y) in [-0.7, 0.7]^2 maps
// to an incoming ray direction with components (~F*uv.x, ~F*uv.y, 1)
// where F is the focal-length factor — this controls how big the BH
// appears on screen. Higher F = smaller BH.
//
// Impact parameter: for parallel rays at distance D, the impact
// parameter b is just D * lateral_offset. We treat the screen-space
// direction as the angular velocity from far away, so b is in units of
// r_s proportional to F * |uv|. With F=12.5, a screen edge ray has
// b ~ 12.5 * 0.7 = 8.75 — well outside the photon sphere at 2.6 —
// and a ray through the screen center has b ~ 0 (falls in).
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);

  // Focal length: how large the black hole appears on screen.
  // Higher F = smaller BH. 12.5 makes the event horizon ~ 8% of the
  // canvas radius, which reads cleanly at 1440x900.
  float focal = 12.5;

  // Tilted camera: slight elevation so the disk is visible, almost
  // edge-on. incl ~ 0 means edge-on (disk perpendicular to view);
  // incl ~ pi/2 means face-on. ~0.5 rad ≈ 28° gives a clear crescent
  // without losing the cinematic "edge-on" feel.
  float incl = 0.5; // ~28 degrees from edge-on
  float ci = cos(incl), si = sin(incl);

  // Incoming ray direction from screen uv. We keep this UNNORMALIZED so
  // the impact parameter is the lateral offset at unit distance — i.e.
  // b = |uv * focal|. We only normalize at the end when we need a
  // unit direction to sample the starfield and disk.
  vec3 incoming = vec3(uv.x * focal, uv.y * focal * ci - si, 1.0);

  // Impact parameter: lateral offset at unit distance, with elevation
  // folded in. b is just the length of the lateral part because z=1
  // represents unit forward distance. The elevation is baked into
  // incoming.y, so |xy| already carries it.
  float b = length(incoming.xy);
  if (b < 1e-3) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  // Unit direction (for starfield + disk sampling) and rotated unit
  // direction (so the world appears to spin around the black hole).
  vec3 incomingDir = normalize(incoming);
  incomingDir = rotateDir(incomingDir, uYaw, uPitch);

  // For the deflection math, we want the unrotated lateral offset in
  // the screen plane. incoming is in the unrotated camera frame; b is
  // already the magnitude of that lateral offset, so we can reuse it
  // directly. (b does not depend on z.)

  // The photon-sphere inverse equation 1/r0^2 * (1 - 1/r0) = 1/b^2 has a
  // real solution only when 1/b^2 <= f(1.5) = 4/27. Below that, the ray
  // crosses the photon sphere and falls in.
  float b2 = b * b;
  if (1.0 / b2 > 4.0 / 27.0) {
    // Event horizon: pure black
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  // Bisect for r0: f(r) = 1/r^2 - 1/r^3 - 1/b^2, monotone on r > 1.5.
  float lo = 1.5 + 1e-3, hi = 200.0;
  for (int i = 0; i < 28; i++) {
    float mid = 0.5 * (lo + hi);
    float fm = 1.0 / (mid * mid) - 1.0 / (mid * mid * mid) - 1.0 / b2;
    if (fm > 0.0) lo = mid; else hi = mid;
  }
  float r0 = 0.5 * (lo + hi);

  // Deflection. Standard closed form for the asymptotic bending angle:
  //   alpha = 2 * (1 / sqrt(1 - 1/r0) - 1)
  // plus an extra boost near the photon sphere so the photon ring
  // lights up cleanly.
  float deflect = 0.0;
  if (r0 > 1.5) {
    float sq = sqrt(1.0 - 1.0 / r0);
    deflect = 2.0 * (1.0 / max(sq, 0.001) - 1.0);
    // Boost near the photon sphere
    deflect *= 1.0 + 1.2 / max(r0 - 1.49, 0.001);
  }

  // Bend the incoming direction. The deflection rotates the ray in
  // the plane containing the ray and the radial direction. We work
  // in the rotated camera frame so the world spins under the camera.
  vec2 xy = vec2(incomingDir.x, incomingDir.y);
  float xyLen = length(xy);
  vec2 perpDir = xy / max(xyLen, 1e-4);
  // Rotation matrix: bend = R(perpDir) * (1, deflect)
  vec2 bent = mat2(perpDir.x, perpDir.y, -perpDir.y, perpDir.x) * vec2(1.0, deflect);

  // Now express the *source* direction in the unrotated camera frame.
  // The bent direction lives in (x,y); the z is unchanged.
  vec3 sourceDir = normalize(vec3(bent.x, bent.y, incomingDir.z));

  // ---- background starfield, lensed ----
  float s = stars(sourceDir);
  float sb = starColor(sourceDir);
  vec3 starTint = mix(vec3(0.8, 0.9, 1.0), vec3(1.0, 0.85, 0.7), sb);
  vec3 col = starTint * s * 1.6;

  // a very faint nebula wash so the background isn't pure black between
  // stars
  col += vec3(0.025, 0.035, 0.06) * (0.5 + 0.5 * sin(sourceDir.x * 3.0 + sourceDir.y * 2.0));

  // ---- accretion disk ----
  // We use a simpler disk model: any ray whose bent direction has a
  // small y-component (close to the disk plane) AND whose projected
  // xz radius falls in the annulus [3 r_s, 9 r_s] is treated as
  // hitting the disk. The annulus is "unfolded" from the sourceDir
  // by reading the angular coordinate and radial mapping.
  //
  // Top and bottom of the disk both contribute (we see the disk's
  // top half AND its bottom half through the lens), so the band is
  // widened to capture both edges.
  float band = exp(-sourceDir.y * sourceDir.y * 28.0);
  // Re-project sourceDir back to the disk plane (xz). The "apparent
  // radial coordinate" of the disk in the sky is the projected r of
  // the bent direction.
  float rXZ = length(vec2(sourceDir.x, sourceDir.z));
  float diskR = rXZ * 14.0;          // map [0,1] of bent xz to disk radius r_s
  // Annulus mask
  float inDisk = smoothstep(2.6, 3.2, diskR) * (1.0 - smoothstep(7.5, 9.0, diskR));

  // angular position around the disk (in the xz plane)
  float phi = atan(sourceDir.z, sourceDir.x);
  // Keplerian rotation rate: omega proportional to r^(-3/2)
  float omega = pow(max(diskR, 0.1), -1.5);
  float phase = phi + uYaw + uTime * 0.7 * omega * 0.5;
  // Bright filament banding
  float filament = 0.5 + 0.5 * sin(phase * 3.0 + diskR * 0.7)
                       * cos(phase * 1.3 - diskR * 0.3);
  filament = pow(max(filament, 0.0), 1.4);

  // Doppler beaming: at angle phi the disk material moves in the
  // +phi direction. Project onto the line of sight.
  float diskSpeed = sqrt(1.0 / (2.0 * max(diskR - 0.5, 0.5)));
  diskSpeed = min(diskSpeed, 0.85);
  vec3 diskV = vec3(-sin(phi + uYaw), 0.0, cos(phi + uYaw)) * diskSpeed;
  vec3 lineOfSight = vec3(0.0, sin(incl), cos(incl));
  float vDotL = dot(diskV, lineOfSight);
  float gamma = 1.0 / sqrt(1.0 - diskSpeed * diskSpeed);
  float dopp = 1.0 / (gamma * (1.0 - vDotL));
  vec3 cool = vec3(1.0, 0.45, 0.18);
  vec3 hot  = vec3(0.9, 0.95, 1.0);
  vec3 diskCol = mix(cool, hot, smoothstep(0.6, 1.6, dopp));
  float diskBright = pow(max(dopp, 0.05), 2.6) * filament * inDisk * band;

  col += diskCol * diskBright * 2.6;

  // ---- photon ring: thin bright ring along r=1.5 r_s ----
  // The visible radius of the ring on screen corresponds to b ≈ 2.6.
  // b is the screen-space impact parameter (lateral offset at unit
  // distance). Light the pixels where b is near 2.6.
  float ring = exp(-pow((b - 2.6) * 60.0, 2.0)) * 1.2;
  col += vec3(0.85, 0.95, 1.0) * ring;

  // ---- event horizon: already returned black above ----

  // ---- subtle vignette so the focus stays on the apparatus ----
  float vig = 1.0 - 0.35 * dot(uv, uv);
  col *= vig;

  // tone map (Reinhard)
  col = col / (1.0 + col);

  // gamma
  col = pow(col, vec3(1.0 / 2.2));

  gl_FragColor = vec4(col, 1.0);
}
`;

// ---------- WebGL plumbing ----------

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type);
  if (!sh) throw new Error('createShader failed');
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh) || '';
    gl.deleteShader(sh);
    throw new Error('shader compile failed: ' + log);
  }
  return sh;
}

function link(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
  const p = gl.createProgram();
  if (!p) throw new Error('createProgram failed');
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p) || '';
    gl.deleteProgram(p);
    throw new Error('program link failed: ' + log);
  }
  return p;
}

export function createRenderer({ canvas }: CreateRendererOptions): Renderer {
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
  });
  if (!gl) {
    // Fall back to a 2D canvas that paints black so the host still
    // resolves ready without crashing. The host gates opacity on
    // ready, so a black canvas is the right "no GPU" state.
    const ctx2d = canvas.getContext('2d');
    if (ctx2d) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const resize = () => {
        const r = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.floor(r.width * dpr));
        canvas.height = Math.max(1, Math.floor(r.height * dpr));
        ctx2d.fillStyle = '#000';
        ctx2d.fillRect(0, 0, canvas.width, canvas.height);
      };
      resize();
      window.addEventListener('resize', resize);
      return {
        ready: Promise.resolve(),
        dispose: () => window.removeEventListener('resize', resize),
      };
    }
    return { ready: Promise.resolve(), dispose: () => {} };
  }

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const prog = link(gl, vs, fs);
  gl.useProgram(prog);

  // Fullscreen quad
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uYaw = gl.getUniformLocation(prog, 'uYaw');
  const uPitch = gl.getUniformLocation(prog, 'uPitch');

  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(r.width * dpr));
    const h = Math.max(1, Math.floor(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
  };

  resize();
  const onResize = () => resize();
  window.addEventListener('resize', onResize);

  const start = performance.now();
  let yaw = 0;
  let raf = 0;
  let disposed = false;
  let visible = !document.hidden;
  const onVis = () => {
    visible = !document.hidden;
  };
  document.addEventListener('visibilitychange', onVis);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const draw = () => {
    if (disposed) return;
    if (visible && !reduceMotion) {
      resize();
      const t = (performance.now() - start) / 1000;
      yaw = t * 0.06; // slow camera roll
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uYaw, yaw);
      gl.uniform1f(uPitch, 0.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else if (visible && reduceMotion) {
      // Reduced motion: paint a single static frame.
      resize();
      const t = 0;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uYaw, 0.4); // a composed angle, not the live roll
      gl.uniform1f(uPitch, 0.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    raf = requestAnimationFrame(draw);
  };

  const ready = new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      if (!disposed) {
        // First paint so the host can flip opacity off the loading state.
        resize();
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, 0);
        gl.uniform1f(uYaw, 0.4);
        gl.uniform1f(uPitch, 0.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(draw);
      }
      resolve();
    });
  });

  return {
    ready,
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}
