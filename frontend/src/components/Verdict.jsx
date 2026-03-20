export default function Verdict({ verdict }) {
  const isPro = verdict.winner === 'proponent'
  const isTie = verdict.winner === 'tie'

  const winnerLabel = isTie ? 'TIE' : isPro ? 'FOR WINS' : 'AGAINST WINS'
  const winnerColor = isTie ? 'text-amber-400' : isPro ? 'text-blue-400' : 'text-red-400'
  const borderColor = isTie ? 'border-amber-500/20' : isPro ? 'border-blue-500/20' : 'border-red-500/20'
  const bgColor = isTie ? 'bg-amber-500/5' : isPro ? 'bg-blue-500/5' : 'bg-red-500/5'

  return (
    <div className={`fade-up rounded-2xl border ${borderColor} ${bgColor} p-8 mb-8`}>
      {/* Winner */}
      <div className="text-center mb-6">
        <p className="text-xs font-mono text-white/20 tracking-[0.4em] uppercase mb-2">Final Verdict</p>
        <h2 className={`font-display text-5xl tracking-widest ${winnerColor}`}>
          {winnerLabel}
        </h2>
      </div>

      {/* Score pills */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="text-center">
          <p className="text-2xl font-mono font-bold text-blue-400">{verdict.scores.proponent}</p>
          <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase mt-1">For</p>
        </div>
        <div className="w-px bg-white/10 self-stretch" />
        <div className="text-center">
          <p className="text-2xl font-mono font-bold text-red-400">{verdict.scores.opponent}</p>
          <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase mt-1">Against</p>
        </div>
      </div>

      {/* Verdict text */}
      <div className="border-t border-white/5 pt-5">
        <p className="text-xs font-mono text-white/25 tracking-widest uppercase mb-3">Judge's Statement</p>
        <p className="text-sm text-white/60 leading-relaxed font-body">{verdict.verdict}</p>
      </div>
    </div>
  )
}
