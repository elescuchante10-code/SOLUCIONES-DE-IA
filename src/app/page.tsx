'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================
// TIPOS Y DATOS (MULTISECTORIAL)
// ============================================

interface Service {
  id: string
  name: string
  tags: string
  desc: string
  nodeStatus: string
  complianceMarco: string
  executableType: string
  integrityLevel: string
  hashAddress: string
  threatAssessment: string
  oscType: 'stable' | 'digital' | 'complex' | 'vocal' | 'dense' | 'square' | 'spiky' | 'noise'
  avatarAscii: string
}

const servicesData: Service[] = [
  {
    id: "cmd_gobernanza",
    name: "gobernanza_ia.pol",
    tags: "[ISO/IEC 42001] [EU AI ACT] [NIST RMF]",
    desc: `> CARGANDO FRAMEWORK DE GOBERNANZA REGULATORIA...

Sin un marco legal sólido, cada despliegue de IA es un pasivo jurídico y reputacional.

Estructuramos el marco de gobernanza ética de su organización bajo ISO/IEC 42001, EU AI Act y NIST AI RMF. Elaboramos políticas de uso aceptable, matrices de riesgo algorítmico, protocolos de auditoría y planes de remediación.

> RESULTADO: Su empresa lista para reguladores, auditores e inversores. Hoy.`,
    nodeStatus: "ACREDITADO (ISO 42001)",
    complianceMarco: "ISO/IEC 42001 + EU AI ACT + NIST",
    executableType: "GOVERNANCE_POLICY_ENGINE",
    integrityLevel: "99.9% ACCREDITED",
    hashAddress: "0x00A4F42D",
    threatAssessment: "★★★☆☆ [MITIGADO CON MARCO]",
    oscType: "stable",
    avatarAscii: `  ╔═══════════════════╗
  ║ [ISO/IEC 42001]   ║
  ║   GOVERNANCE      ║
  ║  ─────────────── ║
  ║  EU AI ACT  ✓     ║
  ║  NIST RMF   ✓     ║
  ╚═══════════════════╝`
  },
  {
    id: "cmd_agentes",
    name: "sistema_de_agentes.sys",
    tags: "[MULTI-AGENT] [LANGGRAPH] [AUTÓNOMO 24/7]",
    desc: `> DESPLEGANDO ARQUITECTURA MULTI-AGENTE...

Un solo modelo de IA es un asistente. Una red de agentes es un equipo completo.

Diseñamos sistemas donde múltiples agentes especializados se orquestan para ejecutar tareas complejas de forma autónoma: investigación, análisis, redacción, decisiones y acciones — todo sin intervención humana.

> RESULTADO: Procesos que tardaban días se ejecutan en minutos. 24 horas al día.`,
    nodeStatus: "ACTIVO (4 AGENTES)",
    complianceMarco: "LANGGRAPH / CREWAI / OPENAI",
    executableType: "MULTI_AGENT_ORCHESTRATOR",
    integrityLevel: "98.7% UPTIME",
    hashAddress: "0x00B5E831",
    threatAssessment: "★★☆☆☆ [CONTROLADO]",
    oscType: "complex",
    avatarAscii: `  [AGT-1]──►[AGT-2]
      │          │
      ▼          ▼
  [AGT-3]──►[AGT-4]
      └──►TASK DONE`
  },
  {
    id: "cmd_automatizacion",
    name: "automatizacion_inteligente.sh",
    tags: "[WORKFLOWS] [API-FIRST] [NO-CODE / PRO-CODE]",
    desc: `> MAPEANDO PROCESOS CANDIDATOS A AUTOMATIZACIÓN...

Cada tarea repetitiva que su equipo hace manualmente es dinero perdido y tiempo robado.

Conectamos sus sistemas (ERP, CRM, correo, WhatsApp, hojas de cálculo) y automatizamos los flujos de trabajo con IA. Desde notificaciones inteligentes hasta pipelines de datos complejos. Sin tocar su infraestructura actual.

> RESULTADO: Su equipo se enfoca en lo estratégico. La IA ejecuta el resto.`,
    nodeStatus: "EJECUTANDO WORKFLOWS",
    complianceMarco: "n8n / MAKE / API CUSTOM",
    executableType: "AUTOMATION_PIPELINE_SH",
    integrityLevel: "99.5% AUTOMATED",
    hashAddress: "0x00C7D912",
    threatAssessment: "★☆☆☆☆ [RIESGO MÍNIMO]",
    oscType: "digital",
    avatarAscii: `  [TRIGGER]
      │
  [PROCESO]──►[API]
      │          │
  [OUTPUT]   [CRM/ERP]
      └──►DONE ✓`
  },
  {
    id: "cmd_chatbot",
    name: "chatbot_corporativo.exe",
    tags: "[RAG] [MULTICANAL] [BRAND-ALIGNED]",
    desc: `> COMPILANDO IDENTIDAD CONVERSACIONAL CORPORATIVA...

Un chatbot genérico daña su marca. El nuestro la refuerza cada vez que responde.

Construimos chatbots entrenados con su información privada (manuales, catálogos, políticas) que responden con la voz y los valores de su empresa. Disponibles en web, WhatsApp y Slack. Sus datos nunca salen de su infraestructura.

> RESULTADO: Atención al cliente 24/7 con coherencia de marca y cero fuga de datos.`,
    nodeStatus: "RESPONDIENDO (RAG ACTIVO)",
    complianceMarco: "RAG PRIVADO + MILVUS + LOCAL",
    executableType: "CORPORATE_CHATBOT_EXE",
    integrityLevel: "99.8% BRAND-ALIGNED",
    hashAddress: "0x00D4A721",
    threatAssessment: "★★☆☆☆ [DATOS PROTEGIDOS]",
    oscType: "vocal",
    avatarAscii: `  USER: "precio enterprise?"
  ─────────────────────
  RAG: [0.982] KB HIT
  BOT: "Con gusto..."
  ─────────────────────
  MARCA_ALINEADA: 99.8%`
  },
  {
    id: "cmd_fine_tuning",
    name: "fine_tuning.py",
    tags: "[FINE-TUNING] [LORA] [GUARDRAILS ÉTICOS]",
    desc: `> INICIANDO PIPELINE DE FINE-TUNING CORPORATIVO...

Los modelos genéricos hablan de todo. El suyo hablará solo de su negocio.

Tomamos un modelo base (LLaMA, Mistral, Qwen) y lo entrenamos con los datos, terminología y cultura de su empresa usando LoRA/QLoRA. Integramos guardrails éticos que previenen respuestas fuera de política.

> RESULTADO: Un modelo de IA con el conocimiento y la personalidad de su organización.`,
    nodeStatus: "FINE-TUNING (LORA ACTIVO)",
    complianceMarco: "LORA / QLORA / GUARDRAILS",
    executableType: "FINE_TUNING_PIPELINE_PY",
    integrityLevel: "98.2% ALIGNED",
    hashAddress: "0x00E8F534",
    threatAssessment: "★★★☆☆ [MODERADO]",
    oscType: "dense",
    avatarAscii: `  BASE: llama-3-8b
  DATASET: 14k filas
  ──────────────────
  EPOCHS: 3 / LORA
  LOSS: 2.41 → 0.82
  MODEL: corp_ai_v1`
  },
  {
    id: "cmd_solucion_medida",
    name: "solucion_a_medida.build",
    tags: "[CUSTOM BUILD] [FULL-STACK AI] [END-TO-END]",
    desc: `> EVALUANDO ARQUITECTURA DE SOLUCIÓN PERSONALIZADA...

Su problema es único. Su solución de IA también debe serlo.

Diseñamos e implementamos arquitecturas de IA desde cero: levantamiento de requerimientos, diseño de datos, selección de modelos, desarrollo de APIs, integración con sistemas legacy y despliegue en producción. Sin vendor lock-in.

> RESULTADO: Una solución de IA que nadie más tiene, construida para escalar con usted.`,
    nodeStatus: "EN CONSTRUCCIÓN",
    complianceMarco: "CUSTOM / FULL-STACK / GDPR",
    executableType: "CUSTOM_AI_BUILD_SYSTEM",
    integrityLevel: "100% A MEDIDA",
    hashAddress: "0x00F1B043",
    threatAssessment: "★★☆☆☆ [ARQUITECTURA ROBUSTA]",
    oscType: "spiky",
    avatarAscii: `  DESIGN──►BUILD
    │          │
    ▼          ▼
  TEST──►DEPLOY
    │
  MONITOR: 99.9%`
  },
]

const bootLines = [
  "CARGANDO KERNEL DE IA CORPORATIVA v2.0... [OK]",
  "VERIFICANDO ESTÁNDARES ISO/IEC 42001 & EU AI ACT... [OK]",
  "INICIANDO MOTOR DE AGENTES AUTÓNOMOS... [OK]",
  "CONECTANDO PIPELINES DE AUTOMATIZACIÓN... [OK]",
  "CARGANDO BASE DE CONOCIMIENTO PRIVADA (AIR-GAPPED)... [OK]",
  "SISTEMAS LISTOS // MODO CORPORATIVO ACTIVO"
]

// ============================================
// HOOKS PERSONALIZADOS
// ============================================

function useTypewriter(text: string, speed: number = 40, startDelay: number = 0) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const start = useCallback(() => {
    setDisplayText('')
    setIsComplete(false)
    let i = 0
    
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (i < text.length) {
          setDisplayText(prev => prev + (text.charAt(i) === '\n' ? '\n' : text.charAt(i)))
          i++
        } else {
          setIsComplete(true)
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      }, speed)
    }, startDelay)
    
  }, [text, speed, startDelay])
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])
  
  return { displayText, isComplete, start }
}

// ============================================
// COMPONENTES DE UI
// ============================================

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border border-[var(--phosphor)] px-2 py-0.5 text-[10px] mr-1.5 mb-1.5 text-[var(--phosphor)] bg-[rgba(255,255,255,0.03)] font-bold tracking-wide">
      {children}
    </span>
  )
}

function RetroBox({ 
  title, 
  children, 
  className = '', 
  headerExtra = null 
}: { 
  title: string
  children: React.ReactNode
  className?: string
  headerExtra?: React.ReactNode
}) {
  return (
    <div className={`terminal-box retro-corner-box ${className}`}>
      {/* Esquinas retro brillantes */}
      <div className="retro-corner retro-corner-tl"></div>
      <div className="retro-corner retro-corner-tr"></div>
      <div className="retro-corner retro-corner-bl"></div>
      <div className="retro-corner retro-corner-br"></div>
      
      <div className="box-title">
        <span>{title}</span>
        {headerExtra}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function Oscilloscope({ type, theme }: { 
  type: 'stable' | 'digital' | 'complex' | 'vocal' | 'dense' | 'square' | 'spiky' | 'noise'
  theme: 'amber' | 'synthwave' | 'matrix'
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationId: number
    let offset = 0
    
    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Rejilla de Fondo CRT
      ctx.strokeStyle = theme === 'amber' ? 'rgba(255, 176, 0, 0.05)' : theme === 'synthwave' ? 'rgba(6, 182, 212, 0.08)' : 'rgba(0, 255, 65, 0.05)'
      ctx.lineWidth = 1
      const gridSize = 12
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
      
      // Línea de onda brillante
      ctx.strokeStyle = theme === 'amber' ? '#ffb000' : theme === 'synthwave' ? '#00f0ff' : '#00ff41'
      ctx.shadowColor = theme === 'amber' ? 'rgba(255, 176, 0, 0.4)' : theme === 'synthwave' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 255, 65, 0.4)'
      ctx.shadowBlur = 5
      ctx.lineWidth = 1.5
      ctx.beginPath()
      
      const width = canvas.width
      const height = canvas.height
      const midY = height / 2
      
      for (let x = 0; x < width; x++) {
        let y = midY
        
        switch (type) {
          case 'stable':
            y = midY + Math.sin((x + offset) * 0.05) * 16
            break
          case 'digital':
            y = midY + Math.sign(Math.sin((x + offset) * 0.06)) * 14
            break
          case 'complex':
            y = midY + Math.sin((x + offset) * 0.04) * 12 + Math.sin((x + offset * 1.6) * 0.09) * 6
            break
          case 'vocal':
            const mod = Math.sin(offset * 0.02) * 0.03 + 0.06
            y = midY + Math.sin((x + offset) * mod) * 15 * Math.sin(x * 0.015)
            break
          case 'dense':
            y = midY + Math.sin((x + offset) * 0.22) * 10 + Math.cos((x + offset) * 0.1) * 5
            break
          case 'square':
            y = midY + (Math.sin((x + offset) * 0.08) > 0 ? 14 : -14)
            break
          case 'spiky':
            const isAlert = Math.floor((x + offset) / 50) % 2 === 0
            y = midY + (isAlert ? Math.sin((x + offset) * 0.4) * 18 : (Math.random() - 0.5) * 2)
            break
          case 'noise':
          default:
            y = midY + (Math.random() - 0.5) * 6 + Math.sin((x + offset) * 0.02) * 3
            break
        }
        
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.stroke()
      
      offset += 2
      animationId = requestAnimationFrame(drawWave)
    }
    
    drawWave()
    
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [type, theme])
  
  return (
    <div className="relative border border-[var(--phosphor-dim)] bg-black/60 rounded p-1 mb-4 overflow-hidden select-none">
      <div className="absolute top-1 left-2 text-[8px] uppercase tracking-widest text-[var(--phosphor-dim)] flex items-center gap-1.5 font-bold">
        <span className="led-indicator led-green animate-pulse"></span>
        OSCILOSCOPIO DE COMPLIANCE / FREQ_ANALYSER
      </div>
      <canvas ref={canvasRef} width={450} height={60} className="w-full h-[60px] block" />
    </div>
  )
}

// ============================================
// SERVICE SIMULATION ANIMATIONS
// ============================================

const LEFT_SCRIPTS: Record<string, Array<{ text: string; cls: 'cmd' | 'ok' | 'warn' | 'data' | 'dim' }>> = {
  cmd_gobernanza: [
    { text: '$ audit_risk_registry --scope=all', cls: 'cmd' },
    { text: '> ESCANEANDO MODELOS EN USO...', cls: 'dim' },
    { text: '[!] gpt-4-turbo ......... NO_REGULADO', cls: 'warn' },
    { text: '[!] api_terceros ........ GDPR_RIESGO', cls: 'warn' },
    { text: '[OK] custom_local_model .. ACREDITADO', cls: 'ok' },
    { text: '> RIESGOS_DETECTADOS: 2', cls: 'data' },
    { text: '> GENERANDO POLÍTICA ISO/IEC 42001...', cls: 'dim' },
    { text: '> MARCO DE GOBERNANZA: LISTO', cls: 'ok' },
    { text: '> AUDITORIA: APROBADA', cls: 'ok' },
  ],
  cmd_agentes: [
    { text: '$ deploy_agent_network --agents=4', cls: 'cmd' },
    { text: '> INICIALIZANDO ORQUESTADOR...', cls: 'dim' },
    { text: 'AGT-1 [INVESTIGACIÓN] ....... ACTIVO', cls: 'ok' },
    { text: 'AGT-2 [ANÁLISIS] ............ ACTIVO', cls: 'ok' },
    { text: 'AGT-3 [REDACCIÓN] ........... ACTIVO', cls: 'ok' },
    { text: 'AGT-4 [EJECUCIÓN] ........... ACTIVO', cls: 'ok' },
    { text: 'TASK: "analizar_mercado_Q3"', cls: 'data' },
    { text: '> DELEGANDO A SUBAGENTES...', cls: 'dim' },
    { text: '> TAREA COMPLETADA EN: 2m 14s', cls: 'ok' },
  ],
  cmd_automatizacion: [
    { text: '$ map_workflows --source=erp,crm,mail', cls: 'cmd' },
    { text: '> DETECTANDO PROCESOS MANUALES...', cls: 'dim' },
    { text: '[MANUAL] aprobacion_facturas . 3h/dia', cls: 'warn' },
    { text: '[MANUAL] reporte_ventas ...... 2h/dia', cls: 'warn' },
    { text: '[MANUAL] onboarding_cliente .. 4h/dia', cls: 'warn' },
    { text: '> CONECTANDO APIS...', cls: 'dim' },
    { text: 'ERP ──► PIPELINE ──► CRM', cls: 'data' },
    { text: '> TIEMPO_AHORRADO: 9h/dia', cls: 'ok' },
    { text: '> WORKFLOWS ACTIVOS: 3', cls: 'ok' },
  ],
  cmd_chatbot: [
    { text: '$ init_chatbot --brand=corp --rag=on', cls: 'cmd' },
    { text: '> CARGANDO BASE DE CONOCIMIENTO...', cls: 'dim' },
    { text: 'manual_productos.pdf .......... [OK]', cls: 'ok' },
    { text: 'politica_precios.xlsx ......... [OK]', cls: 'ok' },
    { text: 'procesos_atencion.doc ......... [OK]', cls: 'ok' },
    { text: 'USER: "precio del plan enterprise?"', cls: 'data' },
    { text: 'RAG: [0.982] RECUPERANDO...', cls: 'dim' },
    { text: 'BOT: respondiendo con voz de marca', cls: 'ok' },
    { text: '> ALINEACION_MARCA: 99.8%', cls: 'ok' },
  ],
  cmd_fine_tuning: [
    { text: '$ finetune --model=llama-3 --data=corp', cls: 'cmd' },
    { text: '> PROCESANDO DATASET CORPORATIVO...', cls: 'dim' },
    { text: 'DATASET: 14,238 ejemplos cargados', cls: 'data' },
    { text: 'EPOCH 1/3: loss=2.41 ........... [RUN]', cls: 'dim' },
    { text: 'EPOCH 2/3: loss=1.18 ........... [RUN]', cls: 'dim' },
    { text: 'EPOCH 3/3: loss=0.82 ........... [OK]', cls: 'ok' },
    { text: '> APLICANDO GUARDRAILS ÉTICOS...', cls: 'dim' },
    { text: '> MODELO corp_ai_v1: LISTO', cls: 'ok' },
    { text: '> ALINEACION_CORPORATIVA: 98.2%', cls: 'ok' },
  ],
  cmd_solucion_medida: [
    { text: '$ architect_solution --scope=full', cls: 'cmd' },
    { text: '> LEVANTANDO REQUERIMIENTOS...', cls: 'dim' },
    { text: '[REQ-1] ingestor_datos ......... OK', cls: 'ok' },
    { text: '[REQ-2] modelo_inferencia ...... OK', cls: 'ok' },
    { text: '[REQ-3] api_gateway ............ OK', cls: 'ok' },
    { text: '[REQ-4] integracion_legacy ..... OK', cls: 'ok' },
    { text: '> DISEÑANDO ARQUITECTURA...', cls: 'dim' },
    { text: '> CRONOGRAMA: 6 semanas', cls: 'data' },
    { text: '> ARQUITECTURA: APROBADA', cls: 'ok' },
  ],
}

function ServiceLeftAnimation({ serviceId }: { serviceId: string }) {
  const [lines, setLines] = useState<Array<{ text: string; cls: string }>>([])

  useEffect(() => {
    const script = LEFT_SCRIPTS[serviceId] ?? []
    setLines([])
    let t: NodeJS.Timeout

    const tick = (idx: number) => {
      if (idx < script.length) {
        setLines(prev => [...prev, script[idx]])
        t = setTimeout(() => tick(idx + 1), 320)
      } else {
        t = setTimeout(() => {
          setLines([])
          t = setTimeout(() => tick(0), 200)
        }, 3000)
      }
    }
    t = setTimeout(() => tick(0), 200)
    return () => clearTimeout(t)
  }, [serviceId])

  const script = LEFT_SCRIPTS[serviceId] ?? []

  return (
    <RetroBox
      title="/SYS/INPUT_SIMULATOR"
      headerExtra={<span className="text-[9px] text-[var(--phosphor-dim)] animate-pulse font-bold">● LIVE</span>}
    >
      <div className="font-mono text-[10px] leading-relaxed space-y-0.5 min-h-[155px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.cls === 'cmd' ? 'text-[var(--accent)] font-bold' :
              line.cls === 'ok' ? 'text-[var(--phosphor)]' :
              line.cls === 'warn' ? 'text-[var(--alert)] font-bold' :
              line.cls === 'data' ? 'text-[var(--accent-dim)]' :
              'text-[var(--phosphor-dim)]'
            }
          >
            {line.text}
          </div>
        ))}
        {lines.length < script.length && (
          <span className="cursor-blink w-1 h-2.5 ml-0.5 inline-block"></span>
        )}
      </div>
    </RetroBox>
  )
}

// Right panel sub-components (Output/Result per service)

function RightGobernanza() {
  const [pct, setPct] = useState(0)
  const [certified, setCertified] = useState(false)

  useEffect(() => {
    let t: NodeJS.Timeout
    const grow = () => {
      setPct(p => {
        const next = Math.min(p + 2, 100)
        if (next < 100) t = setTimeout(grow, 50)
        else t = setTimeout(() => setCertified(true), 400)
        return next
      })
    }
    t = setTimeout(grow, 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-2.5 text-[10px]">
      <div className="text-[var(--phosphor-dim)]">&gt; GENERANDO CERTIFICADO ACREDITADO...</div>
      <div className="flex justify-between text-[9px]">
        <span className="text-[var(--phosphor-dim)]">ISO/IEC 42001 + EU AI ACT + NIST</span>
        <span className={pct === 100 ? 'text-[var(--phosphor)]' : 'text-[var(--accent)]'}>{pct}%</span>
      </div>
      <div className="retro-progress-container">
        <div className="retro-progress-bar" style={{ width: `${pct}%` }} />
      </div>
      {certified && (
        <div className="mt-2 border-2 border-[var(--phosphor)] bg-black/80 rounded p-2 text-center text-glow animate-pulse">
          <pre className="font-mono text-[9px] leading-normal inline-block text-left">{`╔═══════════════════╗
║  ISO/IEC 42001    ║
║    EU AI ACT      ║
║  ─────────────── ║
║   [*] ACREDITADO  ║
║  NIST AI RMF: OK  ║
╚═══════════════════╝`}</pre>
          <div className="text-[9px] mt-1 text-[var(--accent)]">FIRMA: 0x00A4F42D — VÁLIDO</div>
        </div>
      )}
    </div>
  )
}

const AGENT_TASKS = [
  { id: 'AGT-1', label: 'Investigar mercado Q3', time: '45s' },
  { id: 'AGT-2', label: 'Analizar 12 competidores', time: '1m 12s' },
  { id: 'AGT-3', label: 'Generar informe ejecutivo', time: '58s' },
  { id: 'AGT-4', label: 'Sincronizar con CRM', time: '12s' },
]

function RightAgentes() {
  const [done, setDone] = useState(0)

  useEffect(() => {
    let t: NodeJS.Timeout
    const next = (i: number) => {
      setDone(i)
      if (i < AGENT_TASKS.length) {
        t = setTimeout(() => next(i + 1), 900)
      } else {
        t = setTimeout(() => { setDone(0); t = setTimeout(() => next(0), 400) }, 3000)
      }
    }
    t = setTimeout(() => next(0), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-2 text-[10px]">
      <div className="text-[var(--phosphor-dim)]">&gt; RED DE AGENTES — PROGRESO:</div>
      <div className="space-y-1.5 min-h-[90px]">
        {AGENT_TASKS.map((agent, i) => (
          <div key={i} className="flex items-center gap-2 text-[9px]">
            <span className="text-[var(--accent)] font-bold w-[42px]">{agent.id}</span>
            <span className={`flex-1 ${i < done ? 'text-[var(--phosphor)]' : i === done ? 'text-[var(--accent)] animate-pulse' : 'text-[var(--phosphor-dim)]'}`}>{agent.label}</span>
            <span className={`font-bold text-right ${i < done ? 'text-[var(--phosphor)]' : i === done ? 'text-[var(--accent)]' : 'text-[var(--phosphor-dim)]'}`}>
              {i < done ? `[OK] ${agent.time}` : i === done ? '[RUN]' : '[WAIT]'}
            </span>
          </div>
        ))}
      </div>
      {done >= AGENT_TASKS.length && (
        <div className="border-t border-dashed border-[var(--phosphor-dim)] pt-1.5 text-[9px] space-y-0.5">
          <div className="flex justify-between">
            <span className="text-[var(--phosphor-dim)]">TIEMPO TOTAL:</span>
            <span className="text-[var(--phosphor)] font-bold">3m 07s</span>
          </div>
          <div className="text-center text-[var(--accent)] font-bold animate-pulse">
            SIN INTERVENCIÓN HUMANA
          </div>
        </div>
      )}
    </div>
  )
}

function RightAutomatizacion() {
  const [hours, setHours] = useState(0)
  const [flows, setFlows] = useState(0)

  useEffect(() => {
    let t: NodeJS.Timeout
    const growH = (h: number) => {
      setHours(h)
      if (h < 9) t = setTimeout(() => growH(h + 1), 220)
    }
    t = setTimeout(() => growH(0), 600)
    const fi = setInterval(() => setFlows(p => Math.min(p + 1, 3)), 900)
    return () => { clearTimeout(t); clearInterval(fi) }
  }, [])

  return (
    <div className="space-y-3 text-[10px]">
      <div className="text-[var(--phosphor-dim)]">&gt; IMPACTO DE AUTOMATIZACIÓN:</div>
      <div className="bg-black/60 border border-[var(--phosphor-dim)] rounded p-3 space-y-2.5">
        <div>
          <div className="flex justify-between text-[9px] mb-1">
            <span className="text-[var(--phosphor-dim)]">HORAS AHORRADAS / DÍA:</span>
            <span className="text-[var(--phosphor)] font-bold text-[13px]">{hours}h</span>
          </div>
          <div className="retro-progress-container">
            <div className="retro-progress-bar" style={{ width: `${(hours / 9) * 100}%` }} />
          </div>
        </div>
        <div className="flex justify-between text-[9px]">
          <span className="text-[var(--phosphor-dim)]">WORKFLOWS ACTIVOS:</span>
          <span className="text-[var(--accent)] font-bold text-[13px]">{flows}</span>
        </div>
        <div className="flex justify-between text-[9px]">
          <span className="text-[var(--phosphor-dim)]">ERRORES HUMANOS:</span>
          <span className="text-[var(--phosphor)] font-bold">0</span>
        </div>
      </div>
      {hours === 9 && (
        <div className="text-center text-[9px] font-bold animate-pulse text-[var(--phosphor)]">
          = 45h / SEMANA RECUPERADAS PARA SU EQUIPO
        </div>
      )}
    </div>
  )
}

const CHAT_FLOW = [
  { role: 'USER', msg: '"precio del plan enterprise?"' },
  { role: 'SYS', msg: 'RAG: buscando en KB... [cos:0.981]' },
  { role: 'BOT', msg: 'El Plan Enterprise incluye...' },
  { role: 'SYS', msg: 'MARCA_ALINEADA: 99.8% OK' },
  { role: 'USER', msg: '"hay descuento por volumen?"' },
  { role: 'SYS', msg: 'RAG: recuperando política [0.962]' },
  { role: 'BOT', msg: 'Sí, para más de 50 usuarios...' },
]

function RightChatbot() {
  const [msgs, setMsgs] = useState(0)

  useEffect(() => {
    let t: NodeJS.Timeout
    const show = (i: number) => {
      setMsgs(i)
      if (i < CHAT_FLOW.length) {
        t = setTimeout(() => show(i + 1), i % 2 === 0 ? 700 : 500)
      } else {
        t = setTimeout(() => { setMsgs(0); t = setTimeout(() => show(0), 400) }, 2500)
      }
    }
    t = setTimeout(() => show(0), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-2 text-[10px]">
      <div className="text-[var(--phosphor-dim)]">&gt; CHATBOT CORPORATIVO — EN VIVO:</div>
      <div className="space-y-1 min-h-[115px] font-mono text-[9px]">
        {CHAT_FLOW.slice(0, msgs).map((m, i) => (
          <div key={i} className={
            m.role === 'USER' ? 'text-[var(--accent)]' :
            m.role === 'SYS' ? 'text-[var(--phosphor-dim)] italic' :
            'text-[var(--phosphor)] font-bold'
          }>
            <span className="font-bold mr-1 not-italic">{m.role}:</span>{m.msg}
          </div>
        ))}
        {msgs < CHAT_FLOW.length && <span className="cursor-blink w-1 h-2.5 inline-block ml-0.5"></span>}
      </div>
    </div>
  )
}

const FT_EPOCHS = [
  { label: 'EPOCH 1/3', loss: '2.41', color: 'var(--alert)' },
  { label: 'EPOCH 2/3', loss: '1.18', color: 'var(--accent)' },
  { label: 'EPOCH 3/3', loss: '0.82', color: 'var(--phosphor)' },
]

function RightFineTuning() {
  const [done, setDone] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let t: NodeJS.Timeout
    const run = (i: number) => {
      setDone(i)
      if (i < FT_EPOCHS.length) {
        t = setTimeout(() => run(i + 1), 1000)
      } else {
        t = setTimeout(() => setReady(true), 500)
        t = setTimeout(() => { setDone(0); setReady(false); t = setTimeout(() => run(0), 400) }, 4000)
      }
    }
    t = setTimeout(() => run(0), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-2.5 text-[10px]">
      <div className="text-[var(--phosphor-dim)]">&gt; FINE-TUNING CORPORATIVO — PROGRESO:</div>
      <div className="space-y-1.5">
        {FT_EPOCHS.map((ep, i) => (
          <div key={i} className={`flex gap-2 items-center text-[9px] transition-opacity ${i < done ? 'opacity-100' : 'opacity-25'}`}>
            <span className="text-[var(--phosphor-dim)] w-[60px] shrink-0">{ep.label}:</span>
            <div className="flex-1 retro-progress-container" style={{ height: '10px' }}>
              <div className="h-full" style={{ width: i < done ? '100%' : '0%', backgroundColor: ep.color, transition: 'width 0.9s ease' }} />
            </div>
            <span className="font-bold w-[28px] text-right" style={{ color: i < done ? ep.color : 'var(--phosphor-dim)' }}>
              {ep.loss}
            </span>
          </div>
        ))}
      </div>
      {ready && (
        <div className="text-center text-[var(--phosphor)] font-bold text-[10px] animate-pulse border border-[var(--phosphor-dim)] p-1 mt-1">
          MODELO corp_ai_v1 LISTO — 98.2% ALINEADO
        </div>
      )}
    </div>
  )
}

const DEPLOY_STEPS = [
  'Arquitectura de datos: disenada',
  'Modelo de inferencia: seleccionado',
  'API Gateway: configurado',
  'Tests de integracion: PASS (47/47)',
  'Deploy en produccion: GO LIVE',
]

function RightSolucionMedida() {
  const [done, setDone] = useState(0)

  useEffect(() => {
    let t: NodeJS.Timeout
    const next = (i: number) => {
      setDone(i)
      if (i < DEPLOY_STEPS.length) {
        t = setTimeout(() => next(i + 1), 700)
      } else {
        t = setTimeout(() => { setDone(0); t = setTimeout(() => next(0), 400) }, 3000)
      }
    }
    t = setTimeout(() => next(0), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-2.5 text-[10px]">
      <div className="text-[var(--phosphor-dim)]">&gt; CHECKLIST DE DESPLIEGUE:</div>
      <div className="space-y-1.5 min-h-[95px]">
        {DEPLOY_STEPS.map((step, i) => (
          <div key={i} className={`flex gap-2 items-center text-[9px] ${i >= done ? 'opacity-25' : ''}`}>
            <span className={`font-bold shrink-0 ${i < done ? 'text-[var(--phosphor)]' : 'text-[var(--phosphor-dim)]'}`}>
              {i < done ? '[OK]' : '[  ]'}
            </span>
            <span className={i < done ? 'text-[var(--phosphor)]' : 'text-[var(--phosphor-dim)]'}>{step}</span>
          </div>
        ))}
      </div>
      {done >= DEPLOY_STEPS.length && (
        <div className="text-center text-[var(--phosphor)] font-bold text-[10px] animate-pulse border border-[var(--phosphor)] p-1">
          SISTEMA EN PRODUCCION // GO LIVE
        </div>
      )}
    </div>
  )
}

function ServiceRightAnimation({ serviceId }: { serviceId: string }) {
  const map: Record<string, React.ReactNode> = {
    cmd_gobernanza: <RightGobernanza />,
    cmd_agentes: <RightAgentes />,
    cmd_automatizacion: <RightAutomatizacion />,
    cmd_chatbot: <RightChatbot />,
    cmd_fine_tuning: <RightFineTuning />,
    cmd_solucion_medida: <RightSolucionMedida />,
  }
  return <>{map[serviceId] ?? null}</>
}

function ASCIILogo() {
  return (
    <pre className="ascii-art text-glow mb-10 text-[10px] leading-tight overflow-x-auto">
{`  _____  ____  _      _    _  _____ _____ ____  _   _ ______  _____    _____  ______   _____          
 / ____|/ __ \\| |    | |  | |/ ____|_   _/ __ \\| \\ | |  ____|/ ____|  |  __ \\|  ____| |_   _|   /\\    
| (___ | |  | | |    | |  | | |      | || |  | |  \\| | |__  | (___    | |  | | |__      | |    /  \\   
 \\___ \\| |  | | |    | |  | | |      | || |  | | . \` |  __|  \\___ \\   | |  | |  __|     | |   / /\\ \\  
 ____) | |__| | |____| |__| | |____ _| || |__| | |\\  | |____ ____) |  | |__| | |____   _| |_ / ____ \\ 
|_____/ \\____/|______|\\____/ \\_____|_____\\____/|_| \\_|______|_____/   |_____/|______| |_____/_/    \\_\\`}
    </pre>
  )
}

// ============================================
// SCREEN 1: EL DESPERTAR

function Screen1({ onEnter, isTransitioning }: { 
  onEnter: () => void
  isTransitioning: boolean 
}) {
  const introText = `> INICIALIZANDO TERMINAL DE IA CORPORATIVA...

> SU EMPRESA HACE MANUALMENTE LO QUE LA IA PUEDE HACER EN SEGUNDOS.
> ESTO SE ACABA HOY.`
  
  // Aumentamos el delay a 150 para que el texto sea un poco más lento
  const { displayText, isComplete, start } = useTypewriter(introText, 80)
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      start()
    }, 1000)
    return () => clearTimeout(timeout)
  }, [start])
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' && isComplete && !isTransitioning) {
        onEnter()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isComplete, onEnter, isTransitioning])
  
  return (
    <div 
      className="fixed inset-0 flex flex-col justify-center items-center text-center px-4 z-20 cursor-pointer"
      onClick={() => { if (isComplete && !isTransitioning) onEnter() }}
    >
      <div className="text-xl sm:text-2xl whitespace-pre-wrap text-left max-w-[700px] font-bold mb-10 pointer-events-none leading-relaxed text-glow">
        {displayText}
        {!isComplete && <span className="cursor-blink ml-1"></span>}
      </div>
      {isComplete && (
        <div className="text-[var(--phosphor-dim)] text-sm animate-pulse pointer-events-none">
          [ OPRIME ENTER O TOCA LA PANTALLA PARA EMPEZAR ]
        </div>
      )}
    </div>
  )
}

// ============================================
// SCREEN 1.5: BOOT SEQUENCE
// ============================================

function ScreenBoot({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setLines(prev => [...prev, bootLines[i]])
        i++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        setTimeout(() => {
          onComplete()
        }, 1500)
      }
    }, 600) // Cambiado de 400 a 600
    
    return () => clearInterval(interval)
  }, [onComplete])
  
  return (
    <div className="fixed inset-0 flex flex-col justify-center px-4 z-20 pt-12">
      <div className="max-w-[900px] mx-auto w-full">
        <div className="whitespace-pre-wrap text-[var(--phosphor-dim)] leading-loose">
          {lines.map((line, index) => (
            <div key={index} className="mb-2">{line}</div>
          ))}
          {!isComplete && <span className="cursor-blink"></span>}
        </div>
      </div>
    </div>
  )
}

// ============================================
// SCREEN 2: EL DIÁLOGO
// ============================================

function Screen2({ 
  onServiceSelect, 
  onEscape,
  isTransitioning 
}: { 
  onServiceSelect: (service: Service) => void 
  onEscape: () => void
  isTransitioning: boolean
}) {
  const dialogueText = `> CONEXIÓN ESTABLECIDA // MODO CORPORATIVO ACTIVO.
> DIAGNÓSTICO: SU EMPRESA NECESITA MÁS QUE UN CHATBOT GENÉRICO.

Somos SOLUCIONES DE IA. Construimos la inteligencia artificial de su empresa, de principio a fin.

Gobernanza acreditada (ISO 42001, EU AI Act) + implementación técnica real:
agentes autónomos, automatizaciones, chatbots RAG, fine-tuning y arquitecturas a medida.
Sus datos no salen de su infraestructura. Su marca no se diluye en modelos genéricos.

> SELECCIONE EL SERVICIO QUE SU EMPRESA NECESITA:`
  
  const { displayText, isComplete, start } = useTypewriter(dialogueText, 45)
  const [showServices, setShowServices] = useState(false)
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [showInstruction, setShowInstruction] = useState(false)
  const timersRef = useRef<NodeJS.Timeout[]>([])
  
  useEffect(() => {
    start()
  }, [start])
  
  useEffect(() => {
    if (isComplete) {
      setShowServices(true)
      servicesData.forEach((_, index) => {
        const timer = setTimeout(() => {
          setVisibleItems(prev => [...prev, index])
        }, 350 * (index + 1))
        timersRef.current.push(timer)
      })
      
      const intTimer = setTimeout(() => {
        setShowInstruction(true)
      }, 350 * servicesData.length + 500)
      timersRef.current.push(intTimer)
    }

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [isComplete])
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && showInstruction && !isTransitioning) {
        onEscape()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showInstruction, onEscape, isTransitioning])
  
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center px-4 z-20 overflow-y-auto">
      <div className="max-w-[900px] w-full pt-12 pb-8">
        <div className="whitespace-pre-wrap mb-8 text-base leading-relaxed text-glow">
          {displayText}
          {!isComplete && <span className="cursor-blink ml-1"></span>}
        </div>
        
        {showServices && (
          <ul className="space-y-4 mb-10 border-l-2 border-[var(--phosphor-dim)] pl-5">
            {servicesData.map((service, index) => (
              <li 
                key={service.id}
                className={`transition-all duration-[600ms] ${
                  visibleItems.includes(index) 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.1, 0.8, 0.2, 1)' }}
              >
                <button
                  className="service-btn text-base py-1"
                  onClick={() => onServiceSelect(service)}
                >
                  {service.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {showInstruction && (
          <div 
            className="text-[var(--phosphor)] text-sm animate-pulse mt-8 cursor-pointer inline-block"
            onClick={() => { if (!isTransitioning) onEscape() }}
          >
            [ SELECCIONA TU SERVICIO O TOCA AQUÍ / PRESIONA 'ESC' PARA OMITIR ]
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SERVICE DASHBOARD — panel de contenido por servicio
// ============================================

function ServiceDashboard({
  service,
  theme,
  outputText,
  isTyping,
  terminalLogs,
}: {
  service: Service
  theme: 'amber' | 'synthwave' | 'matrix'
  outputText: string
  isTyping: boolean
  terminalLogs: string[]
}) {
  return (
    <div className="p-4 lg:p-5 space-y-4">

      {/* Service header bar */}
      <div className="flex items-start justify-between pb-3 border-b border-[var(--phosphor-dim)]">
        <div>
          <div className="text-[8px] tracking-[3px] text-[var(--phosphor-dim)] mb-0.5 font-bold uppercase">MÓDULO ACTIVO</div>
          <div className="font-bold text-[14px] text-glow tracking-wide">{service.name}</div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end mb-0.5">
            <span className="led-indicator led-green animate-pulse"></span>
            <span className="text-[10px] text-[var(--phosphor)] font-bold">{service.nodeStatus}</span>
          </div>
          <div className="text-[8px] text-[var(--phosphor-dim)]">{service.complianceMarco}</div>
        </div>
      </div>

      {/* ROW 1: tres paneles visuales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Panel A: Avatar + osciloscopio */}
        <RetroBox title="/SYS/SIGNAL">
          <pre className="font-mono text-[10px] leading-normal text-glow mb-3 opacity-70"
            style={{ color: 'var(--accent)' }}>
            {service.avatarAscii}
          </pre>
          <Oscilloscope type={service.oscType} theme={theme} />
        </RetroBox>

        {/* Panel B: Simulador de entrada */}
        <ServiceLeftAnimation serviceId={service.id} />

        {/* Panel C: Resultado de salida */}
        <RetroBox
          title="/SYS/OUTPUT_RESULT"
          headerExtra={<span className="text-[9px] text-[var(--phosphor-dim)]">SECURE</span>}
        >
          <ServiceRightAnimation serviceId={service.id} />
        </RetroBox>

      </div>

      {/* ROW 2: Descripción typewriter */}
      <RetroBox
        title="/DEV/STDOUT — DESCRIPCIÓN DEL SERVICIO"
        headerExtra={
          <span className={`text-[9px] font-bold animate-pulse ${isTyping ? 'text-[var(--accent)]' : 'text-[var(--phosphor-dim)]'}`}>
            {isTyping ? 'PROCESANDO...' : 'LISTO'}
          </span>
        }
      >
        <div className="flex flex-wrap mb-3">
          {service.tags.split(' ').map((tag, i) => <Tag key={i}>{tag}</Tag>)}
        </div>
        <div className="whitespace-pre-wrap text-[13px] leading-relaxed">
          {outputText}
          {isTyping && <span className="cursor-blink ml-1"></span>}
        </div>
      </RetroBox>

      {/* ROW 3: Logs + Specs + CTA */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* Init logs */}
        <RetroBox title="/SYS/INIT_LOG" className="md:col-span-5">
          <div className="font-mono text-[10px] space-y-1 text-[var(--phosphor-dim)] min-h-[90px]">
            {terminalLogs.map((log, i) => (
              <div key={i} className={
                log?.startsWith('$') ? 'text-[var(--phosphor)] font-bold' :
                log?.includes('[OK]') ? 'text-[var(--accent)] font-bold' : ''
              }>{log}</div>
            ))}
            {terminalLogs.length < 8 && (
              <span className="cursor-blink w-1 h-3 inline-block ml-0.5"></span>
            )}
          </div>
        </RetroBox>

        {/* Especificaciones técnicas */}
        <RetroBox title="/SYS/SPECIFICATIONS" className="md:col-span-4">
          <div className="text-[10px] space-y-2">
            {([
              { l: 'HASH',       v: service.hashAddress,     c: 'var(--accent)'   },
              { l: 'INTEGRIDAD', v: service.integrityLevel,  c: 'var(--phosphor)' },
              { l: 'RIESGO',     v: service.threatAssessment, c: 'var(--alert)'    },
              { l: 'MARCO',      v: service.complianceMarco,  c: 'var(--phosphor)' },
            ] as const).map(item => (
              <div key={item.l} className="flex justify-between items-start gap-2">
                <span className="text-[var(--phosphor-dim)] shrink-0 font-bold">{item.l}:</span>
                <span className="font-bold text-right text-[9px]" style={{ color: item.c }}>{item.v}</span>
              </div>
            ))}
          </div>
        </RetroBox>

        {/* CTA */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <a
            href="mailto:ssolucionesdeia@gmail.com"
            className="flex-1 flex items-center justify-center text-center bg-[rgba(255,176,0,0.12)] hover:bg-[rgba(255,176,0,0.28)] border border-[var(--phosphor)] text-[var(--phosphor)] text-[10px] font-bold tracking-widest transition-all py-3 no-underline"
          >
            [ INICIAR CONSULTA ]
          </a>
          <a
            href="https://wa.me/573108688648"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center text-center border border-[var(--phosphor-dim)] text-[var(--phosphor-dim)] hover:text-[var(--phosphor)] hover:border-[var(--phosphor)] text-[10px] font-bold tracking-widest transition-all py-3 no-underline"
          >
            [ WHATSAPP ]
          </a>
        </div>

      </div>
    </div>
  )
}

// ============================================
// SCREEN 3: DASHBOARD PRINCIPAL (TABS VERTICALES)
// ============================================

function Screen3({
  preselectedService,
  theme,
  setTheme,
}: {
  preselectedService: Service | null
  theme: 'amber' | 'synthwave' | 'matrix'
  setTheme: (t: 'amber' | 'synthwave' | 'matrix') => void
}) {
  const initialService = useRef(preselectedService ?? servicesData[0])
  const [activeService, setActiveService] = useState<Service>(initialService.current)
  const [outputText, setOutputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const playService = (service: Service) => {
    setActiveService(service)
    if (intervalRef.current) clearInterval(intervalRef.current)
    setOutputText('')
    setIsTyping(true)
    const text = service.desc
    let i = 0
    intervalRef.current = setInterval(() => {
      if (i < text.length) {
        setOutputText(prev => prev + text.charAt(i))
        i++
      } else {
        setIsTyping(false)
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 20)
  }

  useEffect(() => {
    playService(initialService.current)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTerminalLogs([])
    const lines = [
      `$ cd /sys/modules/governance`,
      `$ ./init_module --module=${activeService.name} --verify`,
      `> BUSCANDO NODO ADDR: ${activeService.hashAddress}... [OK]`,
      `> VERIFICANDO INTEGRIDAD: ${activeService.integrityLevel}... [OK]`,
      `> EVALUANDO MARCO ÉTICO: ${activeService.complianceMarco}`,
      `> ESTADO DEL NODO: ${activeService.nodeStatus}`,
      `> EVALUACIÓN DE AMENAZAS: ${activeService.threatAssessment}`,
      `> CARGA DE COMPLIANCE COMPLETADA.`
    ]
    let timer: NodeJS.Timeout
    let currentLine = 0
    const printLine = () => {
      if (currentLine < lines.length) {
        setTerminalLogs(prev => [...prev, lines[currentLine]])
        currentLine++
        timer = setTimeout(printLine, 180)
      }
    }
    printLine()
    return () => clearTimeout(timer)
  }, [activeService])

  return (
    <div className="min-h-screen relative z-10">

      {/* TOP HEADER */}
      <div className="border-b border-dashed border-[var(--phosphor-dim)] px-4 md:px-8 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] gap-3 bg-black/50 backdrop-blur-sm">
        <div>
          <span className="text-[var(--phosphor-dim)]">SYS_ADMIN: </span>
          <span className="font-bold">SOLUCIONES DE IA</span>
          <span className="mx-2 text-[var(--phosphor-dim)]">//</span>
          <span className="text-[var(--alert)] animate-pulse text-[10px]">● CONECTADO AL NÚCLEO</span>
        </div>
        <div className="flex gap-2 items-center bg-[rgba(0,0,0,0.3)] border border-[var(--phosphor-dim)] p-1.5 rounded backdrop-blur">
          <span className="text-[var(--phosphor-dim)] mr-1 text-[10px] uppercase font-bold tracking-wider">TEMA:</span>
          {(['amber', 'synthwave', 'matrix'] as const).map(t => (
            <button key={t} onClick={() => setTheme(t)} className={`theme-selector-btn ${theme === t ? 'active' : ''}`}>
              {t === 'amber' ? 'ÁMBAR' : t === 'synthwave' ? 'SYNTHWAVE' : 'MATRIX'}
            </button>
          ))}
        </div>
        <div className="text-[10px]">
          <a href="mailto:ssolucionesdeia@gmail.com" className="terminal-link">ssolucionesdeia@gmail.com</a>
          <span className="mx-1 text-[var(--phosphor-dim)]">|</span>
          <a href="https://wa.me/573108688648" target="_blank" rel="noopener noreferrer" className="terminal-link">+57 3108688648</a>
        </div>
      </div>

      {/* ASCII LOGO + HERO */}
      <div className="px-4 md:px-8 pt-6 pb-4">
        <ASCIILogo />
        <div className="mb-6 border border-[var(--phosphor-dim)] grid grid-cols-1 lg:grid-cols-[1fr_auto] bg-black/30 backdrop-blur-sm">
          <div className="p-5 border-b lg:border-b-0 lg:border-r border-[var(--phosphor-dim)]">
            <div className="text-[9px] tracking-[4px] text-[var(--phosphor-dim)] mb-2 font-bold">SISTEMA ACTIVO // NODO CORPORATIVO v2.0</div>
            <p className="font-bold text-xl lg:text-2xl text-glow tracking-wide leading-tight">
              IA CORPORATIVA: <span className="text-[var(--accent)]">LEGAL,</span> TÉCNICA Y A MEDIDA.
            </p>
            <p className="text-[var(--phosphor-dim)] text-[11px] mt-2 border-l-2 border-[var(--phosphor-dim)] pl-3 max-w-xl">
              <span className="text-[var(--phosphor)]">Marco regulatorio acreditado</span>{' '}+{' '}
              <span className="text-[var(--phosphor)]">implementación técnica real</span>. Sus datos. Su marca. Su IA.
            </p>
          </div>
          <div className="flex flex-row lg:flex-col divide-x lg:divide-x-0 lg:divide-y divide-[var(--phosphor-dim)]">
            {([
              { num: '6', label: 'SERVICIOS',   sub: 'Gobernanza → Custom Build' },
              { num: '3', label: 'MARCOS REG.',  sub: 'ISO · EU AI Act · NIST'   },
              { num: '0', label: 'BYTES FUERA',  sub: 'Infraestructura privada'  },
            ] as const).map(s => (
              <div key={s.num} className="flex items-center gap-3 px-5 py-3 flex-1 lg:flex-initial">
                <span className="text-3xl lg:text-4xl font-bold text-glow shrink-0">{s.num}</span>
                <div>
                  <div className="text-[9px] font-bold tracking-widest text-[var(--phosphor)] uppercase">{s.label}</div>
                  <div className="text-[8px] text-[var(--phosphor-dim)]">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD: sidebar de tabs + contenido */}
      <div className="px-4 md:px-8 pb-8">
        <div className="terminal-box retro-corner-box overflow-hidden flex flex-col lg:flex-row min-h-[700px]" style={{ padding: 0 }}>
          <div className="retro-corner retro-corner-tl"></div>
          <div className="retro-corner retro-corner-tr"></div>
          <div className="retro-corner retro-corner-bl"></div>
          <div className="retro-corner retro-corner-br"></div>

          {/* SIDEBAR: pestañas verticales */}
          <div className="lg:w-60 xl:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--phosphor-dim)] flex flex-col">

            <div className="px-4 py-3 border-b border-[var(--phosphor-dim)] bg-black/40 flex justify-between items-center">
              <span className="font-bold text-[11px] tracking-wider">/BIN/SERVICES.SH</span>
              <span className="text-[9px] text-[var(--phosphor-dim)]">{servicesData.length} MÓD.</span>
            </div>

            <div className="p-2 flex-1 overflow-y-auto">
              {servicesData.map((service, index) => (
                <button
                  key={service.id}
                  className={`w-full text-left py-2.5 px-3 transition-all duration-200 flex items-start gap-2 mb-0.5 font-mono text-[11px] ${
                    activeService.id === service.id
                      ? 'bg-[rgba(255,215,0,0.07)] text-[var(--accent)] border-l-[3px] border-[var(--accent)]'
                      : 'text-[var(--phosphor-dim)] hover:text-[var(--phosphor)] hover:bg-[rgba(255,255,255,0.02)] border-l-[3px] border-transparent'
                  }`}
                  onClick={() => playService(service)}
                >
                  <span className={`text-[9px] font-bold mt-0.5 shrink-0 w-5 ${activeService.id === service.id ? 'text-[var(--accent)]' : 'text-[var(--phosphor-dim)]'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{service.name}</div>
                    {activeService.id === service.id && (
                      <div className="text-[8px] text-[var(--phosphor-dim)] mt-0.5 truncate">{service.nodeStatus}</div>
                    )}
                  </div>
                  {activeService.id === service.id && (
                    <span className="ml-auto text-[10px] shrink-0">►</span>
                  )}
                </button>
              ))}
            </div>

            {/* Footer de contacto */}
            <div className="border-t border-[var(--phosphor-dim)] p-3 space-y-1.5 text-[9px]">
              <div className="text-[8px] tracking-widest font-bold text-[var(--phosphor-dim)] mb-1.5">CONTACTO DIRECTO:</div>
              <a href="mailto:ssolucionesdeia@gmail.com" className="terminal-link block truncate">✉ ssolucionesdeia@gmail.com</a>
              <a href="https://wa.me/573108688648" target="_blank" rel="noopener noreferrer" className="terminal-link block">📱 +57 3108688648</a>
              <div className="flex gap-3 pt-1 flex-wrap">
                <a href="https://www.tiktok.com/@soluciones.de.ia" target="_blank" rel="noopener noreferrer" className="terminal-link text-[8px]">TIKTOK</a>
                <a href="https://instagram.com/SOLUCIONES_DEIA" target="_blank" rel="noopener noreferrer" className="terminal-link text-[8px]">INSTAGRAM</a>
                <a href="https://www.linkedin.com/in/corvattaconsultor?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="terminal-link text-[8px]">LINKEDIN</a>
              </div>
            </div>

          </div>

          {/* CONTENIDO DEL DASHBOARD */}
          <div className="flex-1 overflow-y-auto">
            <ServiceDashboard
              key={activeService.id}
              service={activeService}
              theme={theme}
              outputText={outputText}
              isTyping={isTyping}
              terminalLogs={terminalLogs}
            />
          </div>

        </div>
      </div>

      {/* ARCADE GAME */}
      <div className="px-4 md:px-8 pb-8">
        <ArcadeGame theme={theme} />
      </div>

    </div>
  )
}

// ============================================
// ARCADE GAME
// ============================================

function ArcadeGame({ theme }: { theme: 'amber' | 'synthwave' | 'matrix' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameResult, setGameResult] = useState<'won' | 'lost' | null>(null)
  
  const gameRef = useRef<{
    player: { x: number; y: number; w: number; h: number; speed: number; dx: number }
    bullets: Array<{ x: number; y: number; w: number; h: number; speed: number }>
    enemies: Array<{ x: number; y: number; w: number; h: number; speed: number; dir: number }>
    score: number
    gameActive: boolean
    playerSpeed: number
  } | null>(null)
  
  const animationFrameId = useRef<number | null>(null)
  
  useEffect(() => {
    if (gameResult !== null) return // Stop game loop logic entirely if game is over

    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    gameRef.current = {
      player: { x: 280, y: 220, w: 20, h: 20, speed: 5, dx: 0 },
      bullets: [],
      enemies: [],
      score: 0,
      gameActive: true,
      playerSpeed: 5
    }
    
    const game = gameRef.current
    
    const createEnemies = () => {
      game.enemies = []
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
          game.enemies.push({
            x: 50 + col * 50,
            y: 30 + row * 40,
            w: 20,
            h: 15,
            speed: 1,
            dir: 1
          })
        }
      }
    }
    createEnemies()
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!game.gameActive) return
      
      if (e.code === 'ArrowLeft') game.player.dx = -game.player.speed
      if (e.code === 'ArrowRight') game.player.dx = game.player.speed
      if (e.code === 'Space') {
        game.bullets.push({
          x: game.player.x + game.player.w / 2 - 2,
          y: game.player.y,
          w: 4,
          h: 10,
          speed: 7
        })
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        game.player.dx = 0
      }
    }
    
    const preventScroll = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    window.addEventListener('keydown', preventScroll, { passive: false })
    
    const update = () => {
      if (!game.gameActive) return
      
      game.player.x += game.player.dx
      if (game.player.x < 0) game.player.x = 0
      if (game.player.x + game.player.w > canvas.width) {
        game.player.x = canvas.width - game.player.w
      }
      
      game.bullets = game.bullets.filter(b => {
        b.y -= b.speed
        return b.y > 0
      })
      
      let hitWall = false
      game.enemies.forEach(e => {
        e.x += e.speed * e.dir
        if (e.x <= 0 || e.x + e.w >= canvas.width) hitWall = true
      })
      
      if (hitWall) {
        game.enemies.forEach(e => {
          e.dir *= -1
          e.y += 10
          // Loss state: an alien reached the bottom
          if (e.y + e.h >= game.player.y) {
            game.gameActive = false
            setGameResult('lost')
          }
        })
      }
      
      game.bullets.forEach((b, bIndex) => {
        game.enemies.forEach((e, eIndex) => {
          if (
            b.x < e.x + e.w &&
            b.x + b.w > e.x &&
            b.y < e.y + e.h &&
            b.y + b.h > e.y
          ) {
            game.enemies.splice(eIndex, 1)
            game.bullets.splice(bIndex, 1)
            game.score += 10
          }
        })
      })
      
      // ALIEN ELIMINATION (Win State)
      if (game.enemies.length === 0 && game.gameActive) {
        game.gameActive = false
        setGameResult('won')
      }
    }
    
    const draw = () => {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      if (!game.gameActive) {
        return
      }
      
      // Adaptar colores al tema dinámicamente
      ctx.fillStyle = theme === 'amber' ? '#ffb000' : theme === 'synthwave' ? '#ec4899' : '#00ff41'
      ctx.beginPath()
      ctx.moveTo(game.player.x + game.player.w / 2, game.player.y)
      ctx.lineTo(game.player.x + game.player.w, game.player.y + game.player.h)
      ctx.lineTo(game.player.x, game.player.y + game.player.h)
      ctx.fill()
      
      ctx.fillStyle = theme === 'amber' ? '#ffd700' : theme === 'synthwave' ? '#06b6d4' : '#fff'
      game.bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, b.w, b.h)
      })
      
      ctx.fillStyle = theme === 'amber' ? '#ff3366' : theme === 'synthwave' ? '#8b5cf6' : '#ff003c'
      game.enemies.forEach(e => {
        ctx.fillRect(e.x, e.y, e.w, e.h)
      })
      
      ctx.fillStyle = theme === 'amber' ? '#ffb000' : theme === 'synthwave' ? '#06b6d4' : '#00C832'
      ctx.font = '12px Courier New'
      ctx.textAlign = 'left'
      ctx.fillText('SCORE: ' + game.score, 10, 20)
    }
    
    const gameLoop = () => {
      update()
      draw()
      if (game.gameActive) {
        animationFrameId.current = requestAnimationFrame(gameLoop)
      }
    }
    
    gameLoop()
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('keydown', preventScroll)
    }
  }, [gameResult])

  const handlePointerDownLeft = () => { if (gameRef.current) gameRef.current.player.dx = -gameRef.current.player.speed }
  const handlePointerDownRight = () => { if (gameRef.current) gameRef.current.player.dx = gameRef.current.player.speed }
  const handlePointerUp = () => { if (gameRef.current) gameRef.current.player.dx = 0 }
  const handlePointerShoot = () => {
    if (gameRef.current && gameRef.current.gameActive) {
      gameRef.current.bullets.push({
        x: gameRef.current.player.x + gameRef.current.player.w / 2 - 2,
        y: gameRef.current.player.y,
        w: 4, h: 10, speed: 7
      })
    }
  }
  
  return (
    <div className="terminal-box text-center mt-12 overflow-hidden flex flex-col items-center">
      <div className="box-title w-full text-left">/GAMES/DEFENDER_DATOS.EXE</div>
      
      {gameResult === null ? (
        <>
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={250}
            className="border-2 border-[var(--phosphor-dim)] bg-black mx-auto mt-4 max-w-full touch-none"
            style={{ boxShadow: '0 0 15px rgba(0,255,65,0.15)' }}
          />
          <p className="text-xs text-[var(--phosphor-dim)] mt-4 px-2 hidden md:block">
            [FLECHAS] MOVER NAVE | [ESPACIO] DISPARAR LÁSER
          </p>

          <div className="flex justify-between w-full max-w-[600px] mt-4 md:hidden gap-2">
            <button 
              className="flex-1 bg-[rgba(0,255,65,0.1)] border border-[var(--phosphor-dim)] text-[var(--phosphor)] py-3 active:bg-[var(--phosphor)] active:text-black font-bold transition-colors select-none"
              onPointerDown={handlePointerDownLeft}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onContextMenu={(e) => e.preventDefault()}
            >
              ◄ IZQ
            </button>
            <button 
              className="flex-1 bg-[rgba(0,255,65,0.1)] border border-[var(--phosphor-dim)] text-[var(--phosphor)] py-3 active:bg-[var(--phosphor)] active:text-black font-bold transition-colors select-none"
              onPointerDown={handlePointerShoot}
              onContextMenu={(e) => e.preventDefault()}
            >
              ██ DISPARAR
            </button>
            <button 
              className="flex-1 bg-[rgba(0,255,65,0.1)] border border-[var(--phosphor-dim)] text-[var(--phosphor)] py-3 active:bg-[var(--phosphor)] active:text-black font-bold transition-colors select-none"
              onPointerDown={handlePointerDownRight}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onContextMenu={(e) => e.preventDefault()}
            >
              DER ►
            </button>
          </div>
        </>
      ) : (
        <div className={`mt-6 p-6 border text-left w-full max-w-[600px] shadow-[0_0_15px_rgba(0,255,65,0.15)] ${
          gameResult === 'won' ? 'border-[var(--phosphor)] bg-[rgba(0,255,65,0.05)]' : 'border-[var(--alert)] bg-[rgba(255,0,60,0.05)] shadow-[0_0_15px_rgba(255,0,60,0.2)]'
        }`}>
          <h3 className={`font-bold mb-4 text-center sm:text-left text-lg ${
            gameResult === 'won' ? 'text-[var(--phosphor)]' : 'text-[var(--alert)]'
          }`}>
            {gameResult === 'won' 
              ? '> DEFENSA EXITOSA // IDENTIDAD CORPORATIVA PROTEGIDA' 
              : '> SISTEMA BLOQUEADO // MÁXIMO DE INTENTOS ALCANZADO'}
          </h3>
          
          <p className="text-sm mb-6 text-center sm:text-left text-[var(--phosphor)] leading-relaxed">
            {gameResult === 'won' 
              ? 'Ha comprobado el valor de proteger el núcleo de su empresa. Sin embargo, en el mundo real, mantener la coherencia exige algoritmos diseñados a medida, no naves.'
              : 'Ha intentado defender sus datos corporativos manualmente sin IA especializada. GAME OVER.'
            }
            <br /><br />
            No deje sus procesos a merced de modelos estándar y automatice su empresa con una verdadera Arquitectura de IA. Solicite una demostración o construya ya el Branding de su Algoritmo:
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:ssolucionesdeia@gmail.com" 
              className="terminal-link border border-[var(--phosphor)] px-4 py-3 flex-1 text-center hover:bg-[var(--phosphor)] hover:text-black no-underline transition-colors block"
            >
              {`> INICIAR_CONSULTA.sh`}
            </a>
            <a 
              href="https://wa.me/573108688648" 
              target="_blank" 
              rel="noopener noreferrer"
              className="terminal-link border border-[var(--phosphor)] px-4 py-3 flex-1 text-center hover:bg-[var(--phosphor)] hover:text-black no-underline transition-colors block"
            >
              {`> ENLACE_WHATSAPP.exe`}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState(1)
  const [preselectedService, setPreselectedService] = useState<Service | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [theme, setTheme] = useState<'amber' | 'synthwave' | 'matrix'>('amber')
  
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('theme-amber', 'theme-synthwave', 'theme-matrix')
    root.classList.add(`theme-${theme}`)
  }, [theme])
  
  const handleEnter = () => {
    setIsTransitioning(true)
    setCurrentScreen(1.5)
  }
  
  const handleBootComplete = () => {
    setCurrentScreen(2)
    setIsTransitioning(false)
  }
  
  const handleServiceSelect = (service: Service) => {
    setIsTransitioning(true)
    setPreselectedService(service)
    setCurrentScreen(3)
    setTimeout(() => setIsTransitioning(false), 500)
  }
  
  const handleEscape = () => {
    setIsTransitioning(true)
    setPreselectedService(null)
    setCurrentScreen(3)
    setTimeout(() => setIsTransitioning(false), 500)
  }
  
  return (
    <main className="min-h-screen bg-black text-[var(--phosphor)] relative font-mono crt-container">
      {/* Fondo de rejilla 3D animada retro — dos capas para profundidad */}
      <div className="grid-container">
        <div className="retro-grid" />
        <div className="retro-grid-deep" />
      </div>
      {/* Scanlines analógicas */}
      <div className="scanlines" />

      {/* Efecto de pantalla CRT y parpadeo de fósforo */}
      <div className="crt-screen crt-flicker min-h-screen">
        {/* Selector de temas flotante para pantallas 1 y 2 */}
        {currentScreen < 3 && (
          <div className="fixed top-3 right-4 z-50 flex gap-2 items-center bg-[rgba(0,0,0,0.4)] border border-[var(--phosphor-dim)] p-1.5 rounded backdrop-blur">
            <span className="text-[var(--phosphor-dim)] mr-1 text-[9px] uppercase font-bold tracking-wider hidden sm:inline">TEMA:</span>
            <button 
              onClick={() => setTheme('amber')}
              className={`theme-selector-btn ${theme === 'amber' ? 'active' : ''}`}
            >
              ÁMBAR
            </button>
            <button 
              onClick={() => setTheme('synthwave')}
              className={`theme-selector-btn ${theme === 'synthwave' ? 'active' : ''}`}
            >
              SYNTHWAVE
            </button>
            <button 
              onClick={() => setTheme('matrix')}
              className={`theme-selector-btn ${theme === 'matrix' ? 'active' : ''}`}
            >
              MATRIX
            </button>
          </div>
        )}
        
        {currentScreen === 1 && (
          <Screen1 onEnter={handleEnter} isTransitioning={isTransitioning} />
        )}
        
        {currentScreen === 1.5 && (
          <ScreenBoot onComplete={handleBootComplete} />
        )}
        
        {currentScreen === 2 && (
          <Screen2 
            onServiceSelect={handleServiceSelect}
            onEscape={handleEscape}
            isTransitioning={isTransitioning}
          />
        )}
        
        {currentScreen === 3 && (
          <Screen3 
            preselectedService={preselectedService} 
            theme={theme}
            setTheme={setTheme}
          />
        )}
      </div>
    </main>
  )
}
