import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      sourceMap: process.env.NODE_ENV !== 'production',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Pm2Stack',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
    },
    rollupOptions: {
      external: ['pm2'],
      output: {
        globals: {
          pm2: 'pm2',
        },
      },
    },
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: false,
  },
  test: {
    globals: true,
    environment: 'node',
  },
})
