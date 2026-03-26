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
}

const servicesData: Service[] = [
  {
    id: "cmd_arqueologia",
    name: "arqueologia_corporativa.exe",
    tags: "[BRANDING ALGORÍTMICO] [IDENTIDAD]",
    desc: `> INICIANDO ARQUEOLOGÍA CORPORATIVA...

Extraemos los valores no negociables y la cultura profunda de su empresa.

Convertimos su identidad institucional en parámetros algorítmicos. Su agente IA no solo dará respuestas correctas, pensará como los líderes de su organización, sin importar su industria.`
  },
  {
    id: "cmd_personalidad",
    name: "entrenamiento_personalidad.sh",
    tags: "[FINE-TUNING] [GUARDRAILS ÉTICOS]",
    desc: `> COMPILANDO PERSONALIDAD COMPUTACIONAL...

Configuramos cómo su IA modula el lenguaje según el interlocutor (Cliente B2B, Proveedor, Usuario final).

Establecemos guardrails éticos precisos y adaptamos el modelo a la 'aversión al riesgo' exacta de su negocio.`
  },
  {
    id: "cmd_memoria",
    name: "arquitectura_de_memoria.db",
    tags: "[MILVUS] [RAG AVANZADO]",
    desc: `> CONECTANDO BASE DE CONOCIMIENTO VECTORIAL...

Construimos un sistema que indexa todos sus manuales, procesos, historiales y políticas empresariales.

El algoritmo obtiene un contexto profundo sobre cómo opera su empresa, respondiendo en milisegundos con datos 100% propios.`
  },
  {
    id: "cmd_integracion",
    name: "integracion_segura_multisector.sys",
    tags: "[AIR-GAPPED] [COMPLIANCE]",
    desc: `> ESTABLECIENDO CONEXIONES NATIVAS...

Despliegue local y seguro. Conectamos la IA a sus ERPs y CRMs sin modificar su infraestructura legacy.

Cumplimiento por diseño (GDPR, SOC 2, HIPAA, MiFID II). Sus datos corporativos NUNCA viajan a la nube pública para entrenar modelos de terceros.`
  },
  {
    id: "cmd_dashboard",
    name: "dashboard_coherencia.bat",
    tags: "[TELEMETRÍA] [MONITOREO]",
    desc: `> ACTIVANDO RADAR DE COHERENCIA...

Monitoreo continuo en tiempo real que detecta si sus agentes de IA se desvían de su tono de marca.

Alertas automáticas de 'drift de identidad' para asegurar que la máquina siempre represente a su corporación impecablemente.`
  }
]

const bootLines = [
  "CARGANDO KERNEL MULTISECTORIAL... [OK]",
  "INICIALIZANDO RED NEURAL CORE... [OK]",
  "VERIFICANDO PROTOCOLOS DE SEGURIDAD (GDPR, HIPAA, SOC2)... [OK]",
  "AISLANDO ENTORNO AIR-GAPPED... [OK]",
  "DESENCRIPTANDO MEMORIA CORPORATIVA... [OK]",
  "ESTABLECIENDO CONEXIÓN SEGURA... [COMPLETADO]"
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
    <span className="inline-block border border-[var(--phosphor)] px-2 py-1 text-[11px] mr-2 mb-3 text-[var(--phosphor)] bg-[rgba(0,255,65,0.1)]">
      {children}
    </span>
  )
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
// ============================================

function Screen1({ onEnter, isTransitioning }: { 
  onEnter: () => void
  isTransitioning: boolean 
}) {
  const introText = `> DESPIERTA...

> "SOLUCIONES DE IA" TE ESTÁ BUSCANDO.`
  
  // Aumentamos el delay a 150 para que el texto sea un poco más lento
  const { displayText, isComplete, start } = useTypewriter(introText, 150)
  
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
      <div className="text-xl sm:text-2xl whitespace-pre-wrap text-left max-w-[700px] font-bold mb-10 pointer-events-none leading-relaxed">
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
  const dialogueText = `> CONEXIÓN ESTABLECIDA.
> ANALIZANDO INFRAESTRUCTURA DEL CLIENTE...

Somos SOLUCIONES DE IA. Arquitectos de sistemas neuronales.
Tu empresa no necesita otro chatbot genérico descargado de la nube.
Tu empresa necesita Branding de Algoritmos.

> SERVICIOS DETECTADOS EN EL NODO:`
  
  // Aumentado el ms por letra de 60 a 85
  const { displayText, isComplete, start } = useTypewriter(dialogueText, 85)
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
        }, 1100 * (index + 1)) // Más espacio de tiempo de aparición
        timersRef.current.push(timer)
      })
      
      const intTimer = setTimeout(() => {
        setShowInstruction(true)
      }, 1100 * servicesData.length + 1500)
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
        <div className="whitespace-pre-wrap mb-8 text-base leading-relaxed">
          {displayText}
          {!isComplete && <span className="cursor-blink ml-1"></span>}
        </div>
        
        {showServices && (
          <ul className="space-y-6 mb-10 border-l-2 border-[var(--phosphor-dim)] pl-5">
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
// SCREEN 3: DASHBOARD PRINCIPAL
// ============================================

function Screen3({ preselectedService }: { preselectedService: Service | null }) {
  const [activeService, setActiveService] = useState<Service | null>(null)
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const outputRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timersRef = useRef<NodeJS.Timeout[]>([])
  
  const [outputText, setOutputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const defaultOutput = `> ESPERANDO INPUT DEL USUARIO...
> SELECCIONE UN MÓDULO DESDE EL PANEL DERECHO PARA DESPLEGAR LA ARQUITECTURA.`
  
  useEffect(() => {
    servicesData.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, index])
      }, 400 * (index + 1))
      timersRef.current.push(timer)
    })

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])
  
  useEffect(() => {
    if (preselectedService) {
      const initTimer = setTimeout(() => {
        playService(preselectedService)
      }, 800)
      return () => clearTimeout(initTimer)
    }
  }, [preselectedService])
  
  const playService = (service: Service) => {
    setActiveService(service)
    
    if (intervalRef.current) clearInterval(intervalRef.current)
    
    setOutputText('')
    setIsTyping(true)
    
    const text = service.desc
    let i = 0
    
    intervalRef.current = setInterval(() => {
      if (i < text.length) {
        setOutputText(prev => prev + (text.charAt(i) === '\n' ? '\n' : text.charAt(i)))
        i++
      } else {
        setIsTyping(false)
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 45) // Cambiado de 30 a 45
  }
  
  return (
    <div className="min-h-screen relative z-10 py-6 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="border-b border-dashed border-[var(--phosphor-dim)] pb-4 mb-8 flex flex-col sm:flex-row justify-between text-[11px] sm:text-xs gap-4">
          <div>
            <span className="text-[var(--phosphor-dim)]">SYS_ADMIN: </span>
            <span>SOLUCIONES DE IA</span>
            <br />
            <span className="text-[var(--phosphor-dim)]">ESTADO: </span>
            <span className="text-[var(--alert)] animate-pulse">CONECTADO AL NÚCLEO</span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[var(--phosphor-dim)]">TCP/IP SECURE COMM:</span>
            <br className="hidden sm:block" />
            <span className="text-[var(--phosphor-dim)]">MAIL: </span>
            <a href="mailto:ssolucionesdeia@gmail.com" className="terminal-link">
              ssolucionesdeia@gmail.com
            </a>
            <span className="text-[var(--phosphor-dim)] mx-1">|</span>
            <span className="text-[var(--phosphor-dim)]">TEL: </span>
            <a href="https://wa.me/573108688648" target="_blank" rel="noopener noreferrer" className="terminal-link">
              +57 3108688648
            </a>
            <br />
            <span className="text-[var(--phosphor-dim)]">REDES: </span>
            <a href="https://www.tiktok.com/@soluciones.de.ia" target="_blank" rel="noopener noreferrer" className="terminal-link">
              TIKTOK
            </a>
            <span className="text-[var(--phosphor-dim)] mx-1">|</span>
            <a href="https://instagram.com/SOLUCIONES_DEIA" target="_blank" rel="noopener noreferrer" className="terminal-link">
              INSTAGRAM
            </a>
            <span className="text-[var(--phosphor-dim)] mx-1">|</span>
            <a href="https://www.linkedin.com/in/corvattaconsultor?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="terminal-link">
              LINKEDIN
            </a>
          </div>
        </div>
        
        <ASCIILogo />
        
        <div className="mb-10 border-l-4 border-[var(--phosphor)] pl-5">
          <p className="font-bold text-lg mb-2">SU EMPRESA TIENE UNA VOZ. LA IA GENÉRICA LA BORRA.</p>
          <p className="text-[var(--phosphor-dim)] text-[13px] leading-relaxed">
            Arquitectura de Inteligencia Artificial Multisectorial. No configuramos chatbots estandarizados 
            ni plantillas. Diseñamos la personalidad computacional de su organización mediante el Branding 
            de Algoritmos, asegurando que su IA opere con la memoria institucional y filosofía de su empresa.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="terminal-box min-h-[300px]">
            <div className="box-title">/DEV/STDOUT - EJECUCIÓN DE PROTOCOLO</div>
            <div ref={outputRef} className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed">
              {activeService && (
                <div className="mb-3">
                  {activeService.tags.split(' ').map((tag, i) => (
                    <Tag key={i}>{tag}</Tag>
                  ))}
                </div>
              )}
              {activeService ? outputText : defaultOutput}
              {isTyping && activeService && <span className="cursor-blink ml-1"></span>}
            </div>
          </div>
          
          <div className="terminal-box">
            <div className="box-title">/BIN/SERVICES.SH</div>
            <p className="text-[var(--phosphor-dim)] text-[11px] mb-5 mt-2">
              MÓDULOS DE ARQUITECTURA IA:
            </p>
            <ul className="space-y-6">
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
                    className={`service-btn text-[14px] ${
                      activeService?.id === service.id ? 'active' : ''
                    }`}
                    onClick={() => playService(service)}
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <ArcadeGame />
      </div>
    </div>
  )
}

// ============================================
// ARCADE GAME
// ============================================

function ArcadeGame() {
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
      
      ctx.fillStyle = '#00ff41'
      ctx.beginPath()
      ctx.moveTo(game.player.x + game.player.w / 2, game.player.y)
      ctx.lineTo(game.player.x + game.player.w, game.player.y + game.player.h)
      ctx.lineTo(game.player.x, game.player.y + game.player.h)
      ctx.fill()
      
      ctx.fillStyle = '#fff'
      game.bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, b.w, b.h)
      })
      
      ctx.fillStyle = '#ff003c'
      game.enemies.forEach(e => {
        ctx.fillRect(e.x, e.y, e.w, e.h)
      })
      
      ctx.fillStyle = '#00C832'
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
    <main className="min-h-screen bg-black text-[var(--phosphor)] relative font-mono">
      <div className="fixed inset-0 pointer-events-none z-[100]" 
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.20) 50%)',
          backgroundSize: '100% 4px'
        }}
      />
      
      <div className="fixed inset-0 pointer-events-none z-[99]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)'
        }}
      />
      
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
        <Screen3 preselectedService={preselectedService} />
      )}
    </main>
  )
}
