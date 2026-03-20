import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import TopicInput from './components/TopicInput'
import DebateArena from './components/DebateArena'
import Verdict from './components/Verdict'

export default function App() {
  const [topic, setTopic] = useState('')
  const [rounds, setRounds] = useState(3)
  const [status, setStatus] = useState('idle') // idle | loading | debating | done
  const [arguments_, setArguments] = useState([])
  const [scores, setScores] = useState([])
  const [verdict, setVerdict] = useState(null)
  const [presets, setPresets] = useState([])

  useEffect(() => {
    fetch('/presets').then(r => r.json()).then(d => setPresets(d.topics)).catch(() => {})
  }, [])

  const startDebate = async () => {
    if (!topic.trim()) return
    setStatus('loading')
    setArguments([])
    setScores([])
    setVerdict(null)

    try {
      const res = await fetch('/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, rounds }),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      setStatus('debating')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        const lines = text.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const raw = line.replace('data: ', '').trim()
          if (raw === '[DONE]') { setStatus('done'); break }
          try {
            const data = JSON.parse(raw)
            if (data.type === 'argument') {
              setArguments(prev => [...prev, data])
              if (data.score) setScores(prev => [...prev, data.score])
            } else if (data.type === 'verdict') {
              setVerdict(data)
              setStatus('done')
            }
          } catch {}
        }
      }
    } catch (e) {
      console.error(e)
      setStatus('idle')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pb-20">
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
