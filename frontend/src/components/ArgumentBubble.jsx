export default function ArgumentBubble({ arg }) {
  const isPro = arg.agent === 'proponent'

  return (
    <div className={`fade-up flex ${isPro ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] ${isPro ? 'items-start' : 'items-end'} flex flex-col gap-1.5`}>
        {/* Label */}
        <div className={`flex items-center gap-2 ${isPro ? '' : 'flex-row-reverse'}`}>
          <span className={`text-[10px] font-mono tracking-[0.25em] uppercase
            ${isPro ? 'text-blue-400/70' : 'text-red-400/70'}`}>
            {isPro ? '▲ FOR' : '▼ AGAINST'}
          </span>
          <span className="text-[10px] font-mono text-white/15">{arg.model}</span>
        </div>

        {/* Bubble */}
        <div className={`rounded-2xl px-5 py-4 text-sm leading-relaxed font-body
          ${isPro
            ? 'bg-blue-500/10 border border-blue-500/20 text-blue-50/80 rounded-tl-sm'
            : 'bg-red-500/10 border border-red-500/20 text-red-50/80 rounded-tr-sm'
          }`}>
          {arg.content}
        </div>
      </div>
    </div>
  )
}
