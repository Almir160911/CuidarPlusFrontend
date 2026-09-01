import type {
  CapacitorConfig,
} from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'br.com.cuidarplus.app',
  appName: 'CuidarPlus',
  webDir: 'dist',

  server: {
    androidScheme: 'https',

    // Necessário somente durante o piloto,
    // pois a API local utiliza HTTP.
    cleartext: true,
  },
}

export default config
