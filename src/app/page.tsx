'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, type Variants } from 'framer-motion'
import Lenis from 'lenis'

// ============================================================
// NEURAL DATA-MESH — deterministic pseudo-random texture data
// (seeded, not Math.random, so SSR/client render identically)
// ============================================================

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

// Rounded to 2dp: sin() can differ in its last bits between the Node (SSR)
// and browser (client) engines, which otherwise causes a hydration mismatch.
function round2(n: number) {
  return Math.round(n * 100) / 100
}

const MESH_VIEWBOX = { w: 1600, h: 1000 }

const MESH_NODES = Array.from({ length: 46 }, (_, i) => ({
  x: round2(seededRandom(i * 3.1) * MESH_VIEWBOX.w),
  y: round2(seededRandom(i * 7.7 + 1) * MESH_VIEWBOX.h),
  accent: i % 7 === 0,
}))

const MESH_LINES = (() => {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (let i = 0; i < MESH_NODES.length; i++) {
    for (let j = i + 1; j < MESH_NODES.length; j++) {
      const a = MESH_NODES[i], b = MESH_NODES[j]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      if (d < 190) lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })
    }
  }
  return lines
})()

const CODE_COLUMNS = Array.from({ length: 9 }, (_, c) => {
  const left = round2(3 + c * 11 + seededRandom(c * 5.5) * 4)
  const text = Array.from({ length: 26 }, (_, i) => (seededRandom(c * 13 + i) > 0.5 ? '1' : '0')).join('\n')
  const delay = round2(seededRandom(c * 2.2) * -16)
  return { left, text, delay }
})

// ============================================================
// DATA
// ============================================================

interface Service {
  id: string; name: string; file: string; tags: string; desc: string
  nodeStatus: string; complianceMarco: string
  integrityLevel: string; hashAddress: string; threatAssessment: string
}

const servicesData: Service[] = [
  {
    id: "cmd_gobernanza", name: "Gobernanza de IA", file: "Gobernanza_IA.sys",
    tags: "[ISO/IEC 42001] [EU AI ACT] [NIST RMF]",
    desc: `Sin un marco legal sólido, cada despliegue de IA es un pasivo jurídico y reputacional.\n\nEstructuramos el marco de gobernanza ética bajo ISO/IEC 42001, EU AI Act y NIST AI RMF. Elaboramos políticas de uso aceptable, matrices de riesgo algorítmico, protocolos de auditoría y planes de remediación.\n\nResultado: su empresa lista para reguladores, auditores e inversores. Hoy.`,
    nodeStatus: "Sistema Acreditado", complianceMarco: "ISO_42001",
    integrityLevel: "99.9% ACCREDITED",
    hashAddress: "0x00A4F42D", threatAssessment: "Mitigado con marco",
  },
  {
    id: "cmd_agentes", name: "Agentes Múltiples", file: "Agentes_Multiples.exe",
    tags: "[MULTI-AGENT] [LANGGRAPH] [AUTÓNOMO 24/7]",
    desc: `Un solo modelo de IA es un asistente. Una red de agentes es un equipo completo.\n\nDiseñamos sistemas donde múltiples agentes especializados se orquestan para ejecutar tareas complejas de forma autónoma: investigación, análisis, redacción, decisiones y acciones — todo sin intervención humana.\n\nResultado: procesos que tardaban días se ejecutan en minutos, 24 horas al día.`,
    nodeStatus: "Activo · 4 Agentes", complianceMarco: "LANGGRAPH_ORQ",
    integrityLevel: "98.7% UPTIME",
    hashAddress: "0x00B5E831", threatAssessment: "Controlado",
  },
  {
    id: "cmd_automatizacion", name: "Automatización Inteligente", file: "Automatizacion.sh",
    tags: "[WORKFLOWS] [API-FIRST] [NO-CODE / PRO-CODE]",
    desc: `Cada tarea repetitiva que su equipo hace manualmente es dinero perdido y tiempo robado.\n\nConectamos sus sistemas (ERP, CRM, correo, WhatsApp, hojas de cálculo) y automatizamos los flujos de trabajo con IA. Desde notificaciones inteligentes hasta pipelines de datos complejos, sin tocar su infraestructura actual.\n\nResultado: su equipo se enfoca en lo estratégico. La IA ejecuta el resto.`,
    nodeStatus: "Workflows Activos", complianceMarco: "N8N_PIPELINE",
    integrityLevel: "99.5% AUTOMATED",
    hashAddress: "0x00C7D912", threatAssessment: "Riesgo mínimo",
  },
  {
    id: "cmd_chatbot", name: "Chatbot Corporativo", file: "Chatbot_Corporativo.exe",
    tags: "[RAG] [MULTICANAL] [BRAND-ALIGNED]",
    desc: `Un chatbot genérico daña su marca. El nuestro la refuerza cada vez que responde.\n\nConstruimos chatbots entrenados con su información privada (manuales, catálogos, políticas) que responden con la voz y los valores de su empresa. Disponibles en web, WhatsApp y Slack. Sus datos nunca salen de su infraestructura.\n\nResultado: atención al cliente 24/7 con coherencia de marca y cero fuga de datos.`,
    nodeStatus: "RAG Activo", complianceMarco: "RAG_PRIVADO",
    integrityLevel: "99.8% BRAND-ALIGNED",
    hashAddress: "0x00D4A721", threatAssessment: "Datos protegidos",
  },
  {
    id: "cmd_fine_tuning", name: "Fine-Tuning / Branding de Algoritmo", file: "Fine_Tuning.py",
    tags: "[FINE-TUNING] [LORA] [GUARDRAILS ÉTICOS]",
    desc: `Los modelos genéricos hablan de todo. El suyo hablará solo de su negocio.\n\nTomamos un modelo base (LLaMA, Mistral, Qwen) y lo entrenamos con los datos, terminología y cultura de su empresa usando LoRA/QLoRA. Integramos guardrails éticos que previenen respuestas fuera de política.\n\nResultado: un modelo de IA con el conocimiento y la personalidad de su organización.`,
    nodeStatus: "LoRA Activo", complianceMarco: "LORA_QLORA",
    integrityLevel: "98.2% ALIGNED",
    hashAddress: "0x00E8F534", threatAssessment: "Moderado",
  },
  {
    id: "cmd_solucion_medida", name: "Solución a Medida", file: "Solucion_Medida.build",
    tags: "[CUSTOM BUILD] [FULL-STACK AI] [END-TO-END]",
    desc: `Su problema es único. Su solución de IA también debe serlo.\n\nDiseñamos e implementamos arquitecturas de IA desde cero: levantamiento de requerimientos, diseño de datos, selección de modelos, desarrollo de APIs, integración con sistemas legacy y despliegue en producción. Sin vendor lock-in.\n\nResultado: una solución de IA que nadie más tiene, construida para escalar con usted.`,
    nodeStatus: "En Construcción", complianceMarco: "CUSTOM_BUILD",
    integrityLevel: "100% A MEDIDA",
    hashAddress: "0x00F1B043", threatAssessment: "Arquitectura robusta",
  },
]

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

// ============================================================
// PRIMITIVES
// ============================================================

function AnimatedCounter({ target, trigger = true }: { target: number; trigger?: boolean }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let frame = 0; const total = 50
    const tick = () => { frame++; setVal(Math.round(target * Math.min(frame / total, 1))); if (frame < total) requestAnimationFrame(tick) }
    const t = setTimeout(() => requestAnimationFrame(tick), 200)
    return () => clearTimeout(t)
  }, [target, trigger])
  return <>{val}</>
}

function MagneticButton({
  href, children, className = '', primary = false, target, rel,
}: { href: string; children: React.ReactNode; className?: string; primary?: boolean; target?: string; rel?: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 150, damping: 14, mass: 0.15 })
  const sy = useSpring(my, { stiffness: 150, damping: 14, mass: 0.15 })

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.35)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.35)
  }
  const onMouseLeave = () => { mx.set(0); my.set(0) }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: sx, y: sy, ...(primary ? { background: 'linear-gradient(135deg, var(--primary-glow), var(--secondary-glow))' } : {}) }}
      className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold no-underline transition-colors ${
        primary
          ? 'text-black'
          : 'text-[var(--text-main)] border border-[var(--surface-border)] hover:border-white/30'
      } ${className}`}
    >
      {children}
    </motion.a>
  )
}

function SpotlightCard({
  children, className = '', as: Tag = 'div',
}: { children: React.ReactNode; className?: string; as?: 'div' | 'article' }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }
  const Comp = Tag as 'div'
  return (
    <Comp ref={ref} onMouseMove={onMove} className={`premium-card premium-card-spot ${className}`}>
      {children}
    </Comp>
  )
}

function NeuralMeshBackground() {
  return (
    <svg
      className="mesh-layer"
      viewBox={`0 0 ${MESH_VIEWBOX.w} ${MESH_VIEWBOX.h}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g className="mesh-lines">
        {MESH_LINES.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </g>
      <g className="mesh-nodes">
        {MESH_NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.accent ? 2.8 : 1.4} className={n.accent ? 'mesh-node-accent' : ''} />
        ))}
      </g>
    </svg>
  )
}

function CodeStreamLayer() {
  return (
    <div className="code-rain" aria-hidden="true">
      {CODE_COLUMNS.map((col, i) => (
        <span key={i} className="code-col" style={{ left: `${col.left}%`, animationDelay: `${col.delay}s` }}>
          {col.text}
        </span>
      ))}
    </div>
  )
}

function MeshGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current; if (!el) return
      el.style.setProperty('--page-mx', `${(e.clientX / window.innerWidth) * 100}%`)
      el.style.setProperty('--page-my', `${(e.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return <div ref={ref} className="mesh-glow" />
}

function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { stiffness: 300, damping: 30, mass: 0.5 })
  const ringY = useSpring(dotY, { stiffness: 300, damping: 30, mass: 0.5 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    const onMove = (e: MouseEvent) => { dotX.set(e.clientX); dotY.set(e.clientY) }
    const onOver = (e: MouseEvent) => setHovering(!!(e.target as HTMLElement).closest('a, button'))
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [dotX, dotY])

  if (!enabled) return null

  return (
    <>
      <motion.div className="cursor-dot" style={{ left: dotX, top: dotY }} />
      <motion.div className={`cursor-ring ${hovering ? 'cursor-ring-hover' : ''}`} style={{ left: ringX, top: ringY }} />
    </>
  )
}

function TagPills({ tags }: { tags: string }) {
  const items = tags.match(/\[[^\]]+\]/g) ?? []
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className="tag-pill">{t.replace(/[[\]]/g, '')}</span>
      ))}
    </div>
  )
}

// ============================================================
// NAVBAR
// ============================================================

const NAV_LINKS = [
  { href: '#problema', label: 'El Problema' },
  { href: '#metodologia', label: 'Metodología' },
  { href: '#infra', label: 'Infraestructura' },
  { href: '#arquitectura', label: 'Arquitectura' },
  { href: '#servicios', label: 'Servicios' },
]

function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 transition-all duration-300"
      style={{
        height: scrolled ? '64px' : '84px',
        background: scrolled ? 'rgba(5,5,5,0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--surface-border)' : '1px solid transparent',
      }}
    >
      <a href="#hero" className="flex items-center gap-3 no-underline">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary-glow), var(--secondary-glow))' }}>
          <span className="text-black font-bold text-xs">S</span>
        </div>
        <span className="font-bold text-[var(--text-main)] text-sm tracking-wide">SOLUCIONES DE IA</span>
      </a>
      <div className="hidden lg:flex items-center gap-8">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] no-underline transition-colors">{l.label}</a>
        ))}
      </div>
      <MagneticButton href="mailto:ssolucionesdeia@gmail.com" primary className="!px-5 !py-2.5 text-xs">
        Iniciar Auditoría
      </MagneticButton>
    </nav>
  )
}

// ============================================================
// HERO
// ============================================================

function HeroSection() {
  return (
    <section id="hero" className="relative z-10 min-h-screen flex items-center px-6 md:px-10 pt-28">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
        <motion.div initial="hidden" animate="visible" variants={staggerParent} className="space-y-8">
          <motion.div variants={fadeUp} className="glass-pill">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary-glow)] animate-pulse" />
            Marco NIST &amp; ISO 42001 Integrados
          </motion.div>
          <motion.h1 variants={fadeUp} className="font-bold tracking-tighter leading-none text-[clamp(3rem,8vw,7rem)]">
            <span className="block title-gradient">Sastrería</span>
            <span className="block text-accent-gradient">Algorítmica.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[var(--text-muted)] text-lg max-w-2xl leading-relaxed">
            Construimos la inteligencia de su compañía desde cero — sin dependencias externas, sin fuga de datos. Memoria, identidad y gobernanza de IA ejecutándose en infraestructura local de élite (RTX 5090).
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <MagneticButton href="mailto:ssolucionesdeia@gmail.com" primary>Agendar Diagnóstico →</MagneticButton>
            <MagneticButton href="#infra">Ver Arquitectura</MagneticButton>
          </motion.div>
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 max-w-md">
            {[{ v: 6, l: 'Servicios' }, { v: 3, l: 'Marcos Reg.' }, { v: 0, l: 'Bytes Fuera' }].map((s) => (
              <div key={s.l}>
                <div className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-tight text-[var(--text-main)] leading-none"><AnimatedCounter target={s.v} /></div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="modern-console p-6">
            <div className="flex items-center gap-2 mb-4 text-[11px] text-[var(--text-muted)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-2">branding_algoritmo.py</span>
            </div>
            <div className="space-y-1.5 text-[13px]">
              {[
                { t: '$ init_brand_algorithm --client=corp', c: 'text-[var(--primary-glow)]' },
                { t: '> brand_voice ............ EXTRAÍDO', c: 'text-[var(--text-muted)]' },
                { t: '> cultura_org ............ MAPEADA', c: 'text-[var(--text-muted)]' },
                { t: '> fine_tuning: EPOCH 3/3 loss 0.82', c: 'text-[var(--secondary-glow)]' },
                { t: '> BRANDING_ALGORITMO: COMPLETADO', c: 'text-[var(--text-main)] font-bold' },
                { t: '  MARCA_ALINEADA ██████████ 99.8%', c: 'text-[var(--tertiary-glow)]' },
              ].map((l, i) => <div key={i} className={l.c}>{l.t}</div>)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="glass-pill">RTX 5090 · 32 GB VRAM</span>
            <span className="glass-pill">192 GB RAM</span>
            <span className="glass-pill">LLaMA · Mistral · Qwen</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// BRAND ENTITY — image showcase
// ============================================================

function BrandEntitySection() {
  return (
    <section className="relative z-10 py-24 px-6 md:px-10 max-w-7xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="text-center mb-12 max-w-2xl mx-auto">
        <span className="sec-label">Percepción Algorítmica</span>
        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-tight tracking-tighter mb-4">Múltiples señales. <span className="text-accent-gradient">Una sola identidad.</span></h2>
        <p className="text-[var(--text-muted)] text-lg leading-relaxed">Cada punto de contacto con su empresa — voz, datos, decisiones — se funde en una entidad algorítmica coherente, entrenada para pensar y responder como usted.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-[60vh] md:h-[70vh] rounded-[28px] overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
        }}
      >
        <img
          src="/images/entidad-algoritmica.png"
          alt="Entidad algorítmica — representación visual del Branding de Algoritmo"
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 30%' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,5,10,0.05) 0%, rgba(7,5,10,0.55) 75%, rgba(7,5,10,0.92) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(202,31,61,0.22), transparent 50%, rgba(255,190,0,0.16))', mixBlendMode: 'color' }} />
      </motion.div>
    </section>
  )
}

// ============================================================
// PROBLEM SECTION
// ============================================================

function ProblemSection() {
  const problems = ['Responde fuera del tono de su marca', 'Expone datos sensibles a servidores externos', 'Sin memoria corporativa entre sesiones', 'Inventa información (alucinaciones críticas)', 'Ignora políticas internas y procesos propios', 'Diluye y estandariza su identidad corporativa']
  const solutions = ['Voz corporativa exacta, calibrada a su marca', 'Datos procesados en su infraestructura privada', 'Memoria de marca persistente y contextual', 'Grounded en su base de conocimiento real', 'Guardrails que respetan sus políticas internas', 'Coherencia de identidad en cada respuesta']
  return (
    <section id="problema" className="relative z-10 py-24 px-6 md:px-10 max-w-7xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="mb-14 max-w-2xl">
        <span className="sec-label">El problema que destruye su marca</span>
        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold mb-4 leading-tight tracking-tighter">La IA genérica no conoce <span className="text-accent-gradient">su empresa</span></h2>
        <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-2xl">Adoptar un modelo de IA sin personalizarlo es como contratar a alguien que nunca leyó el manual, no conoce sus clientes y habla sin filtro corporativo.</p>
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={staggerParent} className="grid md:grid-cols-2 gap-6">
        <motion.div variants={fadeUp}>
          <SpotlightCard className="p-7 h-full">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Sin Branding de Algoritmo</span>
            </div>
            <div className="space-y-3">
              {problems.map((p) => (
                <div key={p} className="flex items-start gap-3 text-sm text-[var(--text-muted)]"><span className="text-red-400 font-bold">✕</span>{p}</div>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>
        <motion.div variants={fadeUp}>
          <SpotlightCard className="p-7 h-full">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--success)]">Con Branding de Algoritmo™</span>
            </div>
            <div className="space-y-3">
              {solutions.map((s) => (
                <div key={s} className="flex items-start gap-3 text-sm text-[var(--text-main)]"><span className="text-[var(--success)] font-bold">✓</span>{s}</div>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ============================================================
// METHODOLOGY SECTION
// ============================================================

function MethodologySection() {
  const steps = [
    { num: '01', title: 'Diagnóstico de Ecosistema', desc: 'Auditamos su identidad corporativa, procesos internos, base de conocimiento y flujos de datos. Identificamos qué debe saber la IA, cómo debe hablar y qué nunca debe decir.' },
    { num: '02', title: 'Composición Algorítmica', desc: 'Diseñamos la arquitectura del modelo: selección del modelo base, estrategia de datos, topología de guardrails éticos y política de respuestas, antes de escribir una sola línea de código.' },
    { num: '03', title: 'Entrenamiento Privado', desc: 'Fine-tuning con sus datos reales usando LoRA/QLoRA en nuestra infraestructura de élite (RTX 5090). Los datos nunca abandonan el entorno de confianza.' },
    { num: '04', title: 'Despliegue y Monitoreo', desc: 'Integración en sus sistemas (web, WhatsApp, ERP, CRM), monitoreo de coherencia y ajuste continuo. Evoluciona con su empresa, nunca se congela.' },
  ]
  return (
    <section id="metodologia" className="relative z-10 py-24 px-6 md:px-10 max-w-7xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="mb-14 max-w-2xl">
        <span className="sec-label">Metodología Propietaria</span>
        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-tight tracking-tighter">Sastrería <span className="text-accent-gradient">Algorítmica</span></h2>
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={staggerParent} className="grid md:grid-cols-2 gap-6">
        {steps.map((step) => (
          <motion.div key={step.num} variants={fadeUp}>
            <SpotlightCard className="p-7 h-full">
              <div className="font-[family-name:var(--font-space-grotesk)] text-5xl font-bold tracking-tight text-white/10 mb-3">{step.num}</div>
              <h3 className="font-bold text-[var(--text-main)] text-xl mb-2 tracking-tight">{step.title}</h3>
              <p className="text-[var(--text-muted)] text-base leading-relaxed">{step.desc}</p>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ============================================================
// INFRASTRUCTURE — BENTO GRID
// ============================================================

function InfrastructureSection() {
  return (
    <section id="infra" className="py-24 px-6 md:px-10 max-w-7xl mx-auto z-10 relative">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="mb-16 max-w-2xl">
        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold mb-4 leading-tight tracking-tighter">Poder de <span className="text-accent-gradient">Cómputo Local</span></h2>
        <p className="text-gray-400 text-lg leading-relaxed">Ejecutamos despliegues Local-First para garantizar soberanía de datos total en entornos legales y corporativos regulados.</p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={staggerParent}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px] md:auto-rows-[300px]"
      >
        {/* GPU */}
        <motion.div variants={fadeUp} className="md:col-span-2">
          <SpotlightCard className="p-8 h-full flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--secondary-glow)] mb-3">Aceleración IA · VRAM Masiva</div>
              <div className="flex items-end gap-3 mb-2">
                <div className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-tight">RTX 5090</div>
                <span className="tag-pill">Flagship 2025</span>
              </div>
              <p className="text-[var(--text-muted)] text-sm">Optimizada para modelos fundacionales de gran escala. Entrenamiento e inferencia a máxima velocidad.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[{ v: '32 GB', l: 'VRAM' }, { v: '~3,352', l: 'GB/s' }, { v: '~92 TFLOPS', l: 'FP16' }, { v: 'Local', l: 'Inferencia' }].map((s) => (
                <div key={s.l} className="rounded-lg p-3 bg-white/5 border border-white/5">
                  <div className="font-bold text-[var(--secondary-glow)]">{s.v}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{s.l}</div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>

        {/* RAM */}
        <motion.div variants={fadeUp}>
          <SpotlightCard className="p-8 h-full flex flex-col justify-between">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-glow)] mb-3">Memoria RAM</div>
            <div className="flex items-baseline gap-2">
              <div className="font-[family-name:var(--font-space-grotesk)] font-bold tracking-tighter text-[clamp(40px,6vw,64px)] leading-none"><AnimatedCounter target={192} /></div>
              <div className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--primary-glow)]">GB</div>
            </div>
            <div className="text-[var(--text-muted)] text-sm">DDR5 Ultra-Rápida — modelos de 70B+ en RAM completa.</div>
          </SpotlightCard>
        </motion.div>

        {/* CPU */}
        <motion.div variants={fadeUp}>
          <SpotlightCard className="p-8 h-full flex flex-col justify-between">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--secondary-glow)] mb-3">Procesamiento</div>
            <div className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold leading-tight tracking-tight">Ryzen 9<br />9950X</div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Núcleos / Hilos</span><span className="font-bold">16 / 32</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Boost</span><span className="font-bold">5.7 GHz</span></div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Storage */}
        <motion.div variants={fadeUp} className="md:col-span-2">
          <SpotlightCard className="p-8 h-full flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-glow)] mb-3">Almacenamiento NVMe</div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-tight">7</div>
                <div className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--primary-glow)]">TB</div>
              </div>
              <p className="text-[var(--text-muted)] text-sm">PCIe Gen 5 — velocidad extrema, redundancia y cifrado total.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[{ v: '~14 GB/s', l: 'Lectura' }, { v: 'Air-Gapped', l: 'Privacidad' }, { v: 'RAID', l: 'Redundancia' }, { v: 'AES-256', l: 'Cifrado' }].map((s) => (
                <div key={s.l} className="rounded-lg p-3 bg-white/5 border border-white/5">
                  <div className="font-bold text-sm">{s.v}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{s.l}</div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-8">
        <SpotlightCard className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--secondary-glow)] mb-1">Certificación de Soberanía</div>
            <p className="font-bold">Sus datos nunca abandonan su entorno de confianza.</p>
            <p className="text-[var(--text-muted)] text-sm">Procesamiento 100% local · Sin API calls externas · Auditoría completa disponible</p>
          </div>
          <MagneticButton href="mailto:ssolucionesdeia@gmail.com" primary className="shrink-0">Solicitar Demostración</MagneticButton>
        </SpotlightCard>
      </motion.div>
    </section>
  )
}

// ============================================================
// ARCHITECTURE PLANS
// ============================================================

function ArchitecturePlansSection() {
  const tiers = [
    {
      id: 'local', badge: 'Soberanía Total', title: 'Despliegue Local-First', tagline: 'Cero fuga · Cero compromiso', accent: 'var(--primary-glow)', featured: false,
      desc: 'Para datos altamente sensibles (legal, financiero, salud). Ejecutamos la IA directamente en servidores físicos dedicados dentro de su infraestructura.',
      features: ['On-premise exclusivo', 'Air-gapped garantizado', 'Sin ninguna llamada externa', 'Auditoría forense disponible'], client: 'Sectores regulados',
    },
    {
      id: 'hybrid', badge: 'Recomendado', title: 'Escalabilidad Híbrida', tagline: 'Cloud-Local Sync · Equilibrio óptimo', accent: 'var(--secondary-glow)', featured: true,
      desc: 'La opción más equilibrada para la mayoría de empresas. Procesamiento crítico on-premise, cargas generales y escalado de tráfico en Cloud seguro.',
      features: ['Procesamiento crítico: local', 'Cargas generales: Cloud seguro', 'Auto-scaling elástico', 'Balance costo-rendimiento óptimo'], client: 'La mayoría de clientes',
    },
    {
      id: 'cloud', badge: 'Alto Volumen', title: 'Orquestación Multi-Agente', tagline: 'Vertex AI · GCP · Elasticidad total', accent: 'var(--tertiary-glow)', featured: false,
      desc: 'Para operaciones de alto volumen que requieren elasticidad máxima. Arquitectura multi-agente en entornos Cloud enterprise con orquestación avanzada.',
      features: ['Vertex AI + Google Cloud', 'Arquitectura multi-agente', 'Elasticidad automática', 'Logging y observabilidad'], client: 'Operaciones masivas',
    },
  ]
  return (
    <section id="arquitectura" className="relative z-10 py-24 px-6 md:px-10 max-w-7xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="text-center mb-14 max-w-2xl mx-auto">
        <span className="sec-label">Planes de Arquitectura de Soluciones</span>
        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-tight tracking-tighter mb-4">Escalabilidad <span className="text-accent-gradient">Inteligentemente Híbrida</span></h2>
        <p className="text-[var(--text-muted)] text-lg leading-relaxed">Mantener todo 100% local no siempre es costo-eficiente. Elegimos la arquitectura exacta que maximiza su ROI sin comprometer la seguridad.</p>
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={staggerParent} className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <motion.div key={tier.id} variants={fadeUp}>
            <SpotlightCard className={`p-7 h-full flex flex-col gap-5 ${tier.featured ? 'md:-translate-y-3' : ''}`}>
              <span className="tag-pill self-start" style={{ borderColor: tier.accent, color: tier.accent }}>{tier.badge}</span>
              <div>
                <h3 className="font-bold text-2xl mb-1 tracking-tight">{tier.title}</h3>
                <div className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: tier.accent }}>{tier.tagline}</div>
                <p className="text-[var(--text-muted)] text-base leading-relaxed">{tier.desc}</p>
              </div>
              <div className="space-y-2 flex-1">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: tier.accent, boxShadow: `0 0 6px ${tier.accent}` }} />
                    {f}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-3">{tier.client}</div>
                <MagneticButton href="mailto:ssolucionesdeia@gmail.com" primary={tier.featured} className="w-full justify-center">
                  {tier.featured ? 'Consultar Ahora →' : 'Consultar'}
                </MagneticButton>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ============================================================
// SERVICES CONSOLE
// ============================================================

function ServicesConsole() {
  const [activeId, setActiveId] = useState(servicesData[0].id)
  const active = servicesData.find((s) => s.id === activeId) ?? servicesData[0]

  return (
    <section id="servicios" className="relative z-10 py-24 px-6 md:px-10 max-w-7xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="text-center mb-14 max-w-xl mx-auto">
        <span className="sec-label">Catálogo Completo de Servicios</span>
        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-tight tracking-tighter">Consola de <span className="text-accent-gradient">Soluciones</span></h2>
        <p className="text-[var(--text-muted)] text-lg leading-relaxed mt-3">Explore cada módulo de nuestra oferta técnica.</p>
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}>
        <div className="modern-console flex flex-col lg:flex-row overflow-hidden min-h-[560px]">
          {/* Sidebar */}
          <div className="lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 p-4 flex flex-col">
            <div className="text-[10px] uppercase tracking-[3px] text-[var(--text-muted)] mb-3 px-2">/SYS/MODULES</div>
            <div className="space-y-1.5 flex-1">
              {servicesData.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={`console-tab ${activeId === s.id ? 'active' : ''}`}
                >
                  <span className="console-tab-index">{String(i + 1).padStart(2, '0')}.</span>
                  <span className="truncate">{s.file}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 mt-3 px-2 space-y-1.5 text-[11px]">
              <a href="mailto:ssolucionesdeia@gmail.com" className="block truncate text-[var(--text-muted)] hover:text-[var(--text-main)] no-underline">✉ ssolucionesdeia@gmail.com</a>
              <a href="https://wa.me/573108688648" target="_blank" rel="noopener noreferrer" className="block text-[var(--text-muted)] hover:text-[var(--text-main)] no-underline">📱 +57 3108688648</a>
            </div>
          </div>

          {/* Main display */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-3xl font-bold mb-2 tracking-tight">{active.name}</h3>
                    <TagPills tags={active.tags} />
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[var(--success)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                    {active.nodeStatus}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="console-output-card text-[13px] text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'var(--font-inter)' }}>
                    <span className="text-[10px] uppercase tracking-[2px] text-[var(--secondary-glow)] mb-1">STDOUT_DESCRIPTION</span>
                    {active.desc}
                  </div>
                  <div className="console-output-card">
                    <span className="text-[10px] uppercase tracking-[2px] text-[var(--primary-glow)] mb-1">/SYS/STATUS</span>
                    <div className="text-[var(--secondary-glow)]">$ init_audit --framework=&quot;{active.complianceMarco}&quot;</div>
                    <div>&gt; hash_addr: <span className="text-[var(--text-main)]">{active.hashAddress}</span></div>
                    <div>&gt; integridad: <span className="text-[var(--text-main)]">{active.integrityLevel}</span></div>
                    <div>&gt; riesgo: <span className="text-[var(--text-main)]">{active.threatAssessment}</span></div>
                    <div className="text-[var(--success)]">&gt; estado: {active.nodeStatus}</div>
                    <div className="pt-3 mt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2">
                      <a href="mailto:ssolucionesdeia@gmail.com" className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold no-underline text-black" style={{ background: 'linear-gradient(135deg, var(--primary-glow), var(--secondary-glow))' }}>Iniciar Consulta</a>
                      <a href="https://wa.me/573108688648" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold no-underline border border-white/15 text-[var(--text-main)]">WhatsApp</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ============================================================
// CONTACT + FOOTER
// ============================================================

function ContactSection() {
  return (
    <section id="contacto" className="relative z-10 py-24 px-6 md:px-10 max-w-5xl mx-auto text-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
        <span className="sec-label">¿Listo para comenzar?</span>
        <h2 className="text-[clamp(3rem,8vw,7rem)] font-bold leading-none tracking-tighter mb-4">Construyamos la IA<br /><span className="text-accent-gradient">de su empresa</span></h2>
        <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-2xl mx-auto mb-10">Diagnóstico gratuito de su ecosistema de IA. Identifiquemos juntos qué necesita y cómo implementarlo con soberanía total.</p>
        <div className="flex flex-wrap gap-4 justify-center mb-14">
          <MagneticButton href="mailto:ssolucionesdeia@gmail.com" primary className="!px-8 !py-4 !text-base">Iniciar Diagnóstico Gratuito →</MagneticButton>
          <MagneticButton href="https://wa.me/573108688648" target="_blank" rel="noopener noreferrer" className="!px-8 !py-4 !text-base">WhatsApp Directo</MagneticButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: '✉', label: 'Email', val: 'ssolucionesdeia@gmail.com', href: 'mailto:ssolucionesdeia@gmail.com' },
            { icon: '📱', label: 'WhatsApp', val: '+57 310 868 8648', href: 'https://wa.me/573108688648' },
            { icon: '🔗', label: 'LinkedIn', val: '@corvattaconsultor', href: 'https://www.linkedin.com/in/corvattaconsultor' },
          ].map((c) => (
            <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="no-underline">
              <SpotlightCard className="p-5 text-left h-full">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--secondary-glow)] mb-1">{c.label}</div>
                <div className="text-[var(--text-muted)] text-sm">{c.val}</div>
              </SpotlightCard>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 py-10 px-6 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto text-sm text-gray-500">
      <p>© 2026 Soluciones de IA. Branding de Algoritmo™.</p>
      <div className="flex gap-6">
        {[{ href: 'https://www.tiktok.com/@soluciones.de.ia', l: 'TikTok' }, { href: 'https://instagram.com/SOLUCIONES_DEIA', l: 'Instagram' }, { href: 'https://www.linkedin.com/in/corvattaconsultor', l: 'LinkedIn' }].map((s) => (
          <a key={s.l} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-main)] no-underline transition-colors">{s.l}</a>
        ))}
      </div>
    </footer>
  )
}

// ============================================================
// MAIN
// ============================================================

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 3) })
    let frame: number
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    return () => { lenis.destroy(); cancelAnimationFrame(frame) }
  }, [])

  return (
    <main className="relative">
      <CustomCursor />
      <div className="ambient-background">
        <NeuralMeshBackground />
        <CodeStreamLayer />
        <div className="ambient-blob blob-1" />
        <div className="ambient-blob blob-2" />
        <div className="ambient-blob blob-3" />
      </div>
      <MeshGlow />

      <NavBar />

      <HeroSection />
      <BrandEntitySection />
      <ProblemSection />
      <MethodologySection />
      <InfrastructureSection />
      <ArchitecturePlansSection />
      <ServicesConsole />
      <ContactSection />
      <Footer />
    </main>
  )
}
