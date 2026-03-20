export default function Header() {
  return (
    <header className="border-b border-white/5 mb-12">
      <div className="max-w-5xl mx-auto px-4 py-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-5xl tracking-widest text-white leading-none">
            TWOMINDS
          </h1>
          <p className="text-xs tracking-[0.3em] text-white/30 mt-1 uppercase font-mono">
            AI Debate Arena
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono text-white/20 tracking-widest">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LLAMA-3.3 · GROQ
          </span>
        </div>
      </div>
    </header>
  )
}
