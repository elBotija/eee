import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    tailwindcss(),
    legacy({
      targets: ['ios >= 9'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  base: '/eee/'
})
