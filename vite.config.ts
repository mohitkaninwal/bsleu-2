import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// Small dev helper to avoid 404 for /favicon.ico in Vite dev server
const serveFaviconIcoFromSvg = () => ({
  name: 'serve-favicon-ico-from-svg',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/favicon.ico') {
        const svgPath = path.resolve(__dirname, 'public/favicon.svg');
        if (fs.existsSync(svgPath)) {
          res.setHeader('Content-Type', 'image/svg+xml');
          fs.createReadStream(svgPath).pipe(res);
          return;
        }
      }
      next();
    });
  },
});

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    serveFaviconIcoFromSvg(),
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
