import type {
  CapacitorConfig,
} from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'br.com.cuidarplus.app',
  appName: 'CuidarPlus',
  webDir: 'dist',

  server: {
    androidScheme: 'http',
    cleartext: true,
  },
}

export default config
