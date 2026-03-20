export default function TopicInput({ topic, setTopic, rounds, setRounds, onStart, status, presets }) {
  const isLoading = status === 'loading' || status === 'debating'

  return (
    <div className="mb-12 fade-up">
      {/* VS banner */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
        <span className="font-display text-2xl tracking-widest text-red-500/70">VS</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      </div>

      {/* Topic input */}
      <div className="relative mb-4">
        <textarea
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Enter a debate topic..."
          rows={2}
          disabled={isLoading}
          className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-5 py-4 text-white
                     placeholder-white/20 font-body text-lg resize-none outline-none
                     focus:border-white/25 focus:bg-white/[0.05] transition-all duration-200
                     disabled:opacity-40"
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5">
          <span className="text-xs font-mono text-white/30 tracking-widest uppercase">Rounds</span>
          {[1, 2, 3].map(r => (
            <button
              key={r}
              onClick={() => setRounds(r)}
              disabled={isLoading}
              className={`w-8 h-8 rounded font-mono text-sm transition-all duration-150
                ${rounds === r
                  ? 'bg-white text-black font-bold'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/10'}`}
            >
              {r}
            </button>
          ))}
        </div>

        <button
          onClick={onStart}
          disabled={isLoading || !topic.trim()}
          className={`flex-1 py-3 rounded-lg font-display text-xl tracking-widest transition-all duration-200
            ${isLoading
              ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              : 'bg-white text-black hover:bg-white/90 active:scale-[0.99]'
            }`}
        >
          {status === 'loading' ? 'INITIALISING...' : status === 'debating' ? 'DEBATING...' : 'START DEBATE'}
        </button>
      </div>

      {/* Presets */}
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-mono text-white/20 tracking-widest self-center uppercase">Quick:</span>
          {presets.slice(0, 4).map((p, i) => (
            <button
              key={i}
              onClick={() => setTopic(p)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40
                         hover:border-white/25 hover:text-white/70 transition-all duration-150
                         font-body truncate max-w-[220px]"
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
