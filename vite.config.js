import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['ios >= 9'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime', 'whatwg-fetch']
    })
  ],
  base: '/eee/'
})
