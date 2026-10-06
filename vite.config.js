import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import sirv from 'sirv';
import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import { apiMiddleware } from './api.js';

const root = import.meta.dirname;

// Only the webcomponents app is bundled by Vite. Everything else is copied
// as-is so the benchmark pages are not altered by the build: the landing page,
// the vendored jQuery app, the prebuilt Polymer apps, classic scripts and
// polyfills. Maps URL path -> source directory or file.
const staticFiles = {
  'index.html': 'index.html',
  jQuery: 'jQuery',
  'polymer-ie': 'polymer/build/es5-bundled',
  'polymer-modern': 'polymer/build/es6-bundled',
  'polymer-paper-ie': 'polymer-paper/build/es5-bundled',
  'polymer-paper-modern': 'polymer-paper/build/es6-bundled',
  'node_modules/@webcomponents/webcomponentsjs': 'node_modules/@webcomponents/webcomponentsjs',
  'webcomponents/bootstrap.min.css': 'webcomponents/bootstrap.min.css',
  'webcomponents/polyfill.min.js': 'webcomponents/polyfill.min.js',
  'webcomponents/fetch.js': 'webcomponents/fetch.js'
};

function benchmarkServer() {
  let outDir;
  return {
    name: 'benchmark-server',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    configureServer(server) {
      server.middlewares.use('/api', apiMiddleware);
      for (const [url, dir] of Object.entries(staticFiles)) {
        if (url.startsWith('polymer')) {
          server.middlewares.use(`/${url}`, sirv(resolve(root, dir), { dev: true }));
        }
      }
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', apiMiddleware);
    },
    writeBundle() {
      for (const [url, src] of Object.entries(staticFiles)) {
        cpSync(resolve(root, src), resolve(outDir, url), { recursive: true });
      }
    }
  };
}

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        webcomponents: resolve(root, 'webcomponents/index.html')
      },
      // GluonElement derives the custom element tag name from the class name
      output: { keepNames: true }
    }
  },
  plugins: [legacy({ targets: ['ie >= 11'] }), benchmarkServer()]
});
