import type {
  HealthCompatibility,
  HealthPlatform,
  HealthProvider,
  HealthSyncRequest,
  HealthSyncResult,
  NativeHealthBridge,
} from '../types/health-integration'

interface CapacitorRuntime {
  getPlatform?: () => string
  isNativePlatform?: () => boolean
  Plugins?: {
    HealthIntegration?: NativeHealthBridge
  }
}

type HealthWindow = Window & {
  Capacitor?: CapacitorRuntime
}

function getCapacitorRuntime():
  CapacitorRuntime | undefined {
  return (window as HealthWindow).Capacitor
}

function getNativeBridge():
  NativeHealthBridge | null {
  return (
    getCapacitorRuntime()
      ?.Plugins
      ?.HealthIntegration ??
    null
  )
}

function detectPlatform(): HealthPlatform {
  const capacitorPlatform =
    getCapacitorRuntime()
      ?.getPlatform?.()
      ?.toLowerCase()

  if (capacitorPlatform === 'android') {
    return 'android'
  }

  if (capacitorPlatform === 'ios') {
    return 'ios'
  }

  const userAgent =
    navigator.userAgent.toLowerCase()

  if (userAgent.includes('android')) {
    return 'android'
  }

  if (
    userAgent.includes('iphone') ||
    userAgent.includes('ipad') ||
    userAgent.includes('ipod')
  ) {
    return 'ios'
  }

  return 'web'
}

function isNativeApplication(): boolean {
  return Boolean(
    getCapacitorRuntime()
      ?.isNativePlatform?.(),
  )
}

function getProvider(
  platform: HealthPlatform,
): HealthProvider {
  if (platform === 'android') {
    return 'health-connect'
  }

  if (platform === 'ios') {
    return 'health-kit'
  }

  return 'none'
}

function createBrowserCompatibility():
  HealthCompatibility {
  const platform = detectPlatform()
  const provider = getProvider(platform)

  if (platform === 'android') {
    return {
      platform,
      provider,
      nativeApplication: false,
      available: false,
      permissionStatus: 'unavailable',
      operatingSystem: 'Android',
      message:
        'O aparelho usa Android, mas o CuidarPlus está aberto no navegador. Instale a versão Android para acessar o Health Connect.',
    }
  }

  if (platform === 'ios') {
    return {
      platform,
      provider,
      nativeApplication: false,
      available: false,
      permissionStatus: 'unavailable',
      operatingSystem: 'iOS',
      message:
        'O aparelho usa iOS, mas o CuidarPlus está aberto no navegador. Instale a versão para iPhone para acessar o HealthKit.',
    }
  }

  return {
    platform: 'web',
    provider: 'none',
    nativeApplication: false,
    available: false,
    permissionStatus: 'unavailable',
    operatingSystem: null,
    message:
      'A gestão pode ser realizada pela web. A leitura de dados de saúde requer o CuidarPlus instalado em um celular Android ou iPhone.',
  }
}

export const healthIntegrationService = {
  detectPlatform,

  isNativeApplication,

  async getCompatibility():
    Promise<HealthCompatibility> {
    const bridge = getNativeBridge()

    if (!bridge) {
      return createBrowserCompatibility()
    }

    return bridge.getCompatibility()
  },

  async requestPermissions():
    Promise<HealthCompatibility> {
    const bridge = getNativeBridge()

    if (!bridge) {
      throw new Error(
        'As permissões de saúde somente podem ser solicitadas pelo CuidarPlus instalado no celular.',
      )
    }

    return bridge.requestPermissions()
  },

  async synchronize(
    request: HealthSyncRequest,
  ): Promise<HealthSyncResult> {
    const bridge = getNativeBridge()

    if (!bridge) {
      throw new Error(
        'A sincronização com dados reais requer o CuidarPlus instalado no celular.',
      )
    }

    return bridge.synchronize(request)
  },
}
