import react from '@vitejs/plugin-react';
import glob from 'glob';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

const loadVite = ({ mode }: any) => {
  const { PORT, ...env } = loadEnv(mode, process.cwd(), '');
  const polyfills = rollupNodePolyFill();

  // console.log('env ========>>> ', env);

  return defineConfig({
    define: {
      'process.env': env
    },

    server: {
      port: PORT && isNaN(parseInt(PORT)) === false ? parseInt(PORT) : 3000
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020'
      }
    },

    resolve: {
      alias: {
        './runtimeConfig': './runtimeConfig.browser' // <-- Fix from above
      }
    },

    esbuild: {
      // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    },
    plugins: [
      react({
        babel: {
          plugins: [
            'babel-plugin-macros',
            [
              '@emotion/babel-plugin-jsx-pragmatic',
              {
                export: 'jsx',
                import: '__cssprop',
                module: '@emotion/react'
              }
            ],
            [
              '@babel/plugin-transform-react-jsx',
              { pragma: '__cssprop' },
              'twin.macro'
            ]
          ]
        }
      }),
      viteTsconfigPaths(),
      svgrPlugin({
        include: ['**/*.svg?react', '**/*.svg']
      })
    ]
  });
};

export default loadVite;
