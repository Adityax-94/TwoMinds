import { useState, useEffect } from 'react'
import ArgumentBubble from './ArgumentBubble'
import ScoreBar from './ScoreBar'

function DebateLoading() {
  const [step, setStep] = useState(0)
  const steps = [
    "INITIALIZING_ARENA...",
    "ALLOCATING_NEURAL_WEIGHTS // PRO",
    "ALLOCATING_NEURAL_WEIGHTS // CON",
    "ESTABLISHING_CONTEXT_VECTORS...",
    "SYNCING_MODELS...",
    "GENERATING_ARGUMENTS..."
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s))
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-16 fade-up w-full">
      <div className="relative w-48 h-32 mb-12 flex items-center justify-center">
        {/* Nodes */}
        <div className="absolute left-0 w-16 h-16 rounded-full bg-blue-500/5 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] flex items-center justify-center z-10">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        </div>
        <div className="absolute right-0 w-16 h-16 rounded-full bg-red-500/5 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)] flex items-center justify-center z-10" style={{ animationDelay: '0.5s' }}>
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        </div>
        
        {/* Connecting Data Stream */}
        <div className="absolute w-24 h-px bg-white/10 z-0">
          <div className="w-10 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent slide-right" />
        </div>
        
        {/* Rings */}
        <div className="absolute left-[-8px] w-20 h-20 rounded-full border border-white/5 border-t-blue-500/30 border-b-blue-500/30 animate-[spin_4s_linear_infinite]" />
        <div className="absolute right-[-8px] w-20 h-20 rounded-full border border-white/5 border-t-red-500/30 border-b-red-500/30 animate-[spin_4s_linear_infinite_reverse]" />
      </div>
      
      {/* Terminal text */}
      <div className="font-mono text-sm flex flex-col items-start w-full max-w-[340px] bg-black/40 border border-white/5 p-5 rounded-lg backdrop-blur-sm">
        {steps.map((text, i) => (
          <div 
            key={i} 
            className={`flex items-center transition-all duration-300 h-6 overflow-hidden
              ${i === step ? 'text-white' : i < step ? 'text-white/30' : 'opacity-0 h-0 hidden'}`}
          >
            <span className={`mr-3 text-xs ${i === step ? 'text-amber-500' : 'text-green-500/60'}`}>
              {i < step ? '[OK]' : '[..]'}
            </span>
            <span className="tracking-wider text-xs">{text}</span>
            {i === step && <span className="cursor ml-1" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DebateArena({ arguments_, scores, status, topic }) {
  const isLive = status === 'debating'
  const isLoading = status === 'loading' && arguments_.length === 0

  if (isLoading) {
    return <DebateLoading />
  }

  // Group by round
  const rounds = {}
  arguments_.forEach(arg => {
    if (!rounds[arg.round]) rounds[arg.round] = []
    rounds[arg.round].push(arg)
  })

  return (
    <div className="mb-12">
      {/* Live indicator */}
      {isLive && (
        <div className="flex items-center gap-2 mb-6 fade-up">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono text-red-400/70 tracking-widest uppercase">Live Debate</span>
        </div>
      )}

      {/* Scoreboard */}
      {scores.length > 0 && (
        <ScoreBar scores={scores} />
      )}

      {/* Rounds */}
      <div className="space-y-10">
        {Object.entries(rounds).map(([round, args]) => (
          <div key={round}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-mono text-white/20 tracking-[0.3em] uppercase">Round {round}</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="space-y-4">
              {args.map((arg, i) => (
                <ArgumentBubble key={i} arg={arg} />
              ))}
            </div>
            {/* Round score */}
            {scores.find(s => s.round === parseInt(round)) && (() => {
              const s = scores.find(s => s.round === parseInt(round))
              return (
                <div className="mt-4 bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-3 fade-up">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-amber-400/60 tracking-widest uppercase">Judge · Round {round}</span>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-blue-400">PRO {s.proponent}</span>
                      <span className="text-white/20">·</span>
                      <span className="text-red-400">CON {s.opponent}</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed font-body italic">{s.reasoning}</p>
                </div>
              )
            })()}
          </div>
        ))}
      </div>

      {/* Thinking indicator */}
      {isLive && (
        <div className="mt-6 flex items-center gap-3 fade-up thinking border border-white/5 rounded-lg px-4 py-3 w-fit">
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <span className="text-xs font-mono text-white/30 tracking-widest">Agent thinking...</span>
        </div>
      )}
    </div>
  )
}
