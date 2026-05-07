import { useState, useEffect } from 'react'
import Header from './components/Header'
import TopicInput from './components/TopicInput'
import DebateArena from './components/DebateArena'
import Verdict from './components/Verdict'
import API_URL from './config'

export default function App() {
  const [topic, setTopic] = useState('')
  const [rounds, setRounds] = useState(3)
  const [status, setStatus] = useState('idle') // idle | loading | debating | done
  const [arguments_, setArguments] = useState([])
  const [scores, setScores] = useState([])
  const [verdict, setVerdict] = useState(null)
  const [presets, setPresets] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/presets`).then(r => r.json()).then(d => setPresets(d.topics)).catch(() => {})
  }, [])

  const startDebate = async () => {
    if (!topic.trim()) return
    setStatus('loading')
    setArguments([])
    setScores([])
    setVerdict(null)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/debate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, rounds }),
      })

      if (!res.ok) {
        throw new Error(`Debate request failed (${res.status})`)
      }

      const data = await res.json()

      if (data?.error) {
        setStatus('idle')
        setError(data.error)
        return
      }

      setArguments(data.arguments || [])
      setScores(data.scores || [])
      setVerdict(data.verdict || null)
      setStatus('done')
    } catch (e) {
      console.error(e)
      setStatus('idle')
      setError('Failed to start debate. Please check the server and try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pb-20">
        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 text-red-200/80 rounded-lg px-4 py-3 text-sm font-body">
            {error}
          </div>
        )}
        <TopicInput
          topic={topic}
          setTopic={setTopic}
          rounds={rounds}
          setRounds={setRounds}
          onStart={startDebate}
          status={status}
          presets={presets}
        />
        {(arguments_.length > 0 || status === 'loading') && (
          <DebateArena arguments_={arguments_} scores={scores} status={status} topic={topic} />
        )}
        {verdict && <Verdict verdict={verdict} />}
      </main>
    </div>
  )
}
