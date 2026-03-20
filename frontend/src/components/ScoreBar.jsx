export default function ScoreBar({ scores }) {
  const proTotal = scores.reduce((acc, s) => acc + s.proponent, 0)
  const conTotal = scores.reduce((acc, s) => acc + s.opponent, 0)
  const total = proTotal + conTotal || 1
  const proPct = Math.round((proTotal / total) * 100)
  const conPct = 100 - proPct

  return (
    <div className="mb-8 bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 fade-up">
      <div className="flex justify-between text-xs font-mono mb-3">
        <span className="text-blue-400">PRO · {proTotal.toFixed(1)}</span>
        <span className="text-white/20 tracking-widest uppercase text-[10px]">Live Score</span>
        <span className="text-red-400">CON · {conTotal.toFixed(1)}</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
        <div
          className="bg-blue-500/60 rounded-full transition-all duration-700"
          style={{ width: `${proPct}%` }}
        />
        <div
          className="bg-red-500/60 rounded-full transition-all duration-700 ml-auto"
          style={{ width: `${conPct}%` }}
        />
      </div>
    </div>
  )
}
