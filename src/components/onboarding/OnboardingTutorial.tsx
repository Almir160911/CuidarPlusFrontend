import {
  BellRing,
  CalendarCheck,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  FileHeart,
  HeartPulse,
  HeartHandshake,
  Pill,
  Users,
  Watch,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from 'react'

import { authService } from '../../services/auth.service'

export const START_TUTORIAL_EVENT =
  'cuidarplus:start-tutorial'

interface TutorialStep {
  title: string
  description: string
  icon: ComponentType<{ size?: number }>
}

const adminSteps: TutorialStep[] = [
  {
    title: 'Bem-vindo ao Cuidar+',
    description:
      'Este guia apresenta o caminho principal para organizar e acompanhar os cuidados. Você poderá reabri-lo pela opção Ajuda.',
    icon: HeartPulse,
  },
  {
    title: 'Cadastre a pessoa assistida',
    description:
      'Em Pessoas assistidas, registre os dados de quem receberá os cuidados. Depois, abra o prontuário para completar o acompanhamento.',
    icon: Users,
  },
  {
    title: 'Monte a rede de cuidado',
    description:
      'Cadastre familiares e cuidadores, conceda somente os acessos necessários e consulte todos os participantes em Rede de cuidado.',
    icon: HeartHandshake,
  },
  {
    title: 'Organize os turnos',
    description:
      'Em Turnos de cuidado, escolha a pessoa assistida, o cuidador e o horário. Ao encerrar, registre resumo, ocorrências e pendências para a passagem de turno.',
    icon: CalendarClock,
  },
  {
    title: 'Organize medicamentos',
    description:
      'Cadastre medicamentos e horários. A confirmação de administrado ou não administrado é feita na agenda diária.',
    icon: Pill,
  },
  {
    title: 'Acompanhe a rotina',
    description:
      'Use a agenda para consultas, medicamentos e atividades. Registre cuidados e sinais vitais no prontuário da pessoa assistida.',
    icon: CalendarCheck,
  },
  {
    title: 'Conecte os dados de saúde',
    description:
      'No Android, acesse Integração de saúde para autorizar o Health Connect e importar medições compatíveis.',
    icon: Watch,
  },
  {
    title: 'Observe alertas e relatórios',
    description:
      'Consulte alertas importantes e gere relatórios para acompanhar a evolução e compartilhar informações do cuidado.',
    icon: BellRing,
  },
]

const linkedUserSteps: TutorialStep[] = [
  {
    title: 'Bem-vindo ao Cuidar+',
    description:
      'Você verá somente as pessoas e informações autorizadas para o seu perfil.',
    icon: HeartPulse,
  },
  {
    title: 'Conheça sua rede de cuidado',
    description:
      'Em Rede de cuidado, consulte familiares, cuidadores, vínculos autorizados e os próximos turnos. Seu perfil aparece identificado como Você.',
    icon: HeartHandshake,
  },
  {
    title: 'Acesse suas pessoas',
    description:
      'Em Minhas pessoas, escolha quem deseja acompanhar e abra o prontuário para consultar os cuidados disponíveis.',
    icon: Users,
  },
  {
    title: 'Acompanhe seus turnos',
    description:
      'Em Meus turnos, consulte os horários atribuídos a você. O cuidador designado pode iniciar o turno e registrar a passagem ao encerrar.',
    icon: CalendarClock,
  },
  {
    title: 'Consulte a agenda',
    description:
      'Use Agendamentos para acompanhar compromissos e atividades relacionados às pessoas compartilhadas com você.',
    icon: CalendarCheck,
  },
  {
    title: 'Consulte quando precisar',
    description:
      'A opção Ajuda reúne orientações sobre acesso, segurança, agenda e prontuário.',
    icon: FileHeart,
  },
]

function storageKey(): string {
  const user = authService.getUser()
  const identity =
    user?.id ?? user?.userId ?? user?.email ?? 'usuario'

  return `cuidarplus_tutorial_completed:${identity}`
}

function isAdministrator(): boolean {
  const role = authService.getUser()?.role?.toLowerCase()

  return role === 'systemadmin' || role === 'familyadmin'
}

export function OnboardingTutorial() {
  const steps = useMemo(
    () => isAdministrator() ? adminSteps : linkedUserSteps,
    [],
  )
  const [open, setOpen] = useState(
    () => localStorage.getItem(storageKey()) !== 'true',
  )
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    function startTutorial() {
      setCurrentStep(0)
      setOpen(true)
    }

    window.addEventListener(
      START_TUTORIAL_EVENT,
      startTutorial,
    )

    return () => {
      window.removeEventListener(
        START_TUTORIAL_EVENT,
        startTutorial,
      )
    }
  }, [])

  if (!open) {
    return null
  }

  const step = steps[currentStep]
  const Icon = step.icon
  const isLastStep = currentStep === steps.length - 1

  function finish() {
    localStorage.setItem(storageKey(), 'true')
    setOpen(false)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <section className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Icon size={28} />
          </div>

          <button
            type="button"
            onClick={finish}
            aria-label="Pular tutorial"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={21} />
          </button>
        </div>

        <p className="mt-6 text-sm font-semibold text-emerald-700">
          Etapa {currentStep + 1} de {steps.length}
        </p>

        <h2
          id="tutorial-title"
          className="mt-2 text-2xl font-bold text-slate-900"
        >
          {step.title}
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          {step.description}
        </p>

        <div className="mt-6 flex gap-2" aria-hidden="true">
          {steps.map((item, index) => (
            <span
              key={item.title}
              className={[
                'h-2 flex-1 rounded-full',
                index <= currentStep
                  ? 'bg-emerald-600'
                  : 'bg-slate-200',
              ].join(' ')}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={finish}
            className="px-2 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            Pular tutorial
          </button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep((value) => value - 1)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft size={18} />
                Voltar
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (isLastStep) {
                  finish()
                  return
                }

                setCurrentStep((value) => value + 1)
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              {isLastStep ? 'Começar' : 'Próximo'}
              {!isLastStep && <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
