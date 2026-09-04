import {
  BellRing,
  BookOpen,
  CalendarDays,
  FileHeart,
  HeartPulse,
  LockKeyhole,
  Pill,
  PlayCircle,
  Users,
  Watch,
} from 'lucide-react'

import { START_TUTORIAL_EVENT } from '../../components/onboarding/OnboardingTutorial'
import { PageHeader } from '../../components/ui/PageHeader'

const topics = [
  {
    title: 'Primeiros passos',
    icon: Users,
    items: [
      'Crie sua conta informando o nome da família ou organização.',
      'Cadastre a pessoa idosa e mantenha seus dados atualizados.',
      'Abra o prontuário da pessoa para acessar todos os registros de cuidado.',
    ],
  },
  {
    title: 'Perfis e acesso',
    icon: LockKeyhole,
    items: [
      'O administrador gerencia a organização, usuários e idosos.',
      'Familiares e cuidadores veem somente as pessoas autorizadas.',
      'Não compartilhe sua senha nem permita que outra pessoa use sua conta.',
    ],
  },
  {
    title: 'Medicamentos',
    icon: Pill,
    items: [
      'Cadastre o medicamento antes de definir os horários.',
      'Confirme a administração exclusivamente pela agenda diária.',
      'Informe o motivo sempre que uma dose não for administrada.',
    ],
  },
  {
    title: 'Agenda e consultas',
    icon: CalendarDays,
    items: [
      'Consulte os compromissos no calendário unificado.',
      'Registre consultas com data, horário e orientações relevantes.',
      'Confira sempre a pessoa selecionada antes de salvar um registro.',
    ],
  },
  {
    title: 'Cuidados e sinais vitais',
    icon: HeartPulse,
    items: [
      'Registre os cuidados no momento em que forem realizados.',
      'Revise pressão, glicemia e demais valores antes de confirmar.',
      'O Cuidar+ auxilia o acompanhamento, mas não substitui orientação médica.',
    ],
  },
  {
    title: 'Documentos e relatórios',
    icon: FileHeart,
    items: [
      'Envie somente documentos relacionados ao cuidado do idoso.',
      'Use arquivos permitidos, legíveis e com até 10 MB.',
      'Proteja relatórios baixados, pois podem conter dados pessoais e de saúde.',
    ],
  },
  {
    title: 'Alertas',
    icon: BellRing,
    items: [
      'Verifique regularmente os alertas pendentes.',
      'Analise o contexto do registro antes de tomar uma decisão.',
      'Em uma emergência, procure o serviço de saúde adequado.',
    ],
  },
  {
    title: 'Health Connect',
    icon: Watch,
    items: [
      'A integração está disponível no aplicativo Android compatível.',
      'Autorize somente os tipos de dados que deseja compartilhar.',
      'Confirme a origem e o horário das medições após a sincronização.',
    ],
  },
]

export function HelpPage() {
  function openTutorial() {
    window.dispatchEvent(new Event(START_TUTORIAL_EVENT))
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Central de ajuda"
        title="Manual do Cuidar+"
        description="Orientações rápidas para utilizar o sistema com segurança."
        actions={(
          <button
            type="button"
            onClick={openTutorial}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <PlayCircle size={19} />
            Rever tutorial
          </button>
        )}
      />

      <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm">
            <BookOpen size={24} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Antes de começar
            </h2>
            <p className="mt-2 leading-7 text-slate-600">
              Registre informações verdadeiras, confira a pessoa selecionada e mantenha os dados de saúde protegidos. Em caso de dúvida clínica ou emergência, procure um profissional ou serviço de saúde.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {topics.map((topic) => {
          const Icon = topic.icon

          return (
            <article
              key={topic.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-2.5 text-emerald-700">
                  <Icon size={21} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {topic.title}
                </h2>
              </div>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {topic.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </section>
    </div>
  )
}
