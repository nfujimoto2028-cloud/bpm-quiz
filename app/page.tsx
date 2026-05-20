'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export default function Home() {
  const [bpm, setBpm] = useState(127.5)
  const [isPlaying, setIsPlaying] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [flash, setFlash] = useState(false)
  const [sliderMin, setSliderMin] = useState(120)
  const [sliderMax, setSliderMax] = useState(135)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const nextNoteTimeRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bpmRef = useRef(bpm)

  useEffect(() => {
    const min = Math.floor(Math.random() * (125 - 105 + 1)) + 105
    const max = Math.floor(Math.random() * (150 - 130 + 1)) + 130
    setSliderMin(min)
    setSliderMax(max)
    setBpm((min + max) / 2)
  }, [])

  useEffect(() => {
    bpmRef.current = bpm
  }, [bpm])

  const scheduleClick = useCallback((ctx: AudioContext, time: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = 1000
    gain.gain.setValueAtTime(0, time)
    gain.gain.linearRampToValueAtTime(0.7, time + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06)

    osc.start(time)
    osc.stop(time + 0.06)

    const delay = Math.max(0, (time - ctx.currentTime) * 1000)
    setTimeout(() => {
      setFlash(true)
      setTimeout(() => setFlash(false), 80)
    }, delay)
  }, [])

  const runScheduler = useCallback(() => {
    const ctx = audioCtxRef.current
    if (!ctx) return

    const interval = 60 / bpmRef.current
    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      scheduleClick(ctx, nextNoteTimeRef.current)
      nextNoteTimeRef.current += interval
    }
    timerRef.current = setTimeout(runScheduler, 25)
  }, [scheduleClick])

  const start = useCallback(async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') await ctx.resume()
    nextNoteTimeRef.current = ctx.currentTime + 0.05
    runScheduler()
    setIsPlaying(true)
  }, [runScheduler])

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsPlaying(false)
    setFlash(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleToggle = () => {
    if (isPlaying) stop()
    else start()
  }

  const handleOK = () => {
    stop()
    setRevealed(true)
    const diff = bpm - 128
    const absDiff = Math.abs(diff)
    const grade =
      absDiff < 0.05 ? '完璧！' :
      absDiff < 0.3  ? 'ほぼ完璧！' :
      absDiff < 1.0  ? '惜しい！' :
      absDiff < 2.0  ? 'もう少し！' :
      'まだまだ！'
    const diffStr = diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)
    const url = window.location.href
    const text = `BPM 128 を目指したら ${bpm.toFixed(2)} BPM でした！（目標との差：${diffStr}）${grade}\n${url}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(parseFloat(e.target.value))
    setRevealed(false)
  }

  const diff = bpm - 128
  const absDiff = Math.abs(diff)
  const grade =
    absDiff < 0.05 ? '完璧！' :
    absDiff < 0.3  ? 'ほぼ完璧！' :
    absDiff < 1.0  ? '惜しい！' :
    absDiff < 2.0  ? 'もう少し！' :
    'まだまだ！'
  const gradeColor =
    absDiff < 0.3 ? 'text-emerald-400' :
    absDiff < 1.0 ? 'text-yellow-400' :
    'text-red-400'

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-10 p-8 select-none">

      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">BPM 128 を目指せ！</h1>
        <p className="mt-3 text-zinc-500 text-sm">消音モードをオフにしてください</p>
      </div>

      <div
        className={`w-5 h-5 rounded-full transition-all duration-75 ${
          flash ? 'bg-emerald-400 scale-150' : 'bg-zinc-700 scale-100'
        }`}
      />

      <div className="w-full max-w-sm">
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={0.01}
          value={bpm}
          onChange={handleSlider}
          className="w-full cursor-pointer accent-emerald-400"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleToggle}
          className={`w-28 py-3 rounded-full font-semibold text-base transition-colors ${
            isPlaying
              ? 'bg-zinc-700 hover:bg-zinc-600'
              : 'bg-emerald-500 hover:bg-emerald-400'
          }`}
        >
          {isPlaying ? '■ 停止' : '▶ 再生'}
        </button>
        <button
          onClick={handleOK}
          className="w-28 py-3 rounded-full font-semibold text-base bg-blue-500 hover:bg-blue-400 transition-colors"
        >
          OK
        </button>
      </div>

      {revealed && (
        <div className="text-center">
          <p className="text-7xl font-bold tabular-nums font-mono">{bpm.toFixed(2)}</p>
          <p className="text-zinc-500 mt-1 text-sm tracking-widest">BPM</p>
          <p className={`text-2xl font-bold mt-4 ${gradeColor}`}>{grade}</p>
          <p className="text-zinc-500 text-sm mt-1">
            目標との差：{diff > 0 ? '+' : ''}{diff.toFixed(2)} BPM
          </p>
        </div>
      )}

    </main>
  )
}
