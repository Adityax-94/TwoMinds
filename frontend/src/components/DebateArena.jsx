import ArgumentBubble from './ArgumentBubble'
import ScoreBar from './ScoreBar'

export default function DebateArena({ arguments_, scores, status, topic }) {
  const isLive = status === 'debating'

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
