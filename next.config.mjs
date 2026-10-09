/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site is published under the repo name on GitHub Pages
  // (https://<user>.github.io/<repo>/). Next.js prepends `basePath`
  // to every asset URL and every <Link href>, so the static export
  // resolves correctly when served from a subpath.
  basePath: '/kubedocs',
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;