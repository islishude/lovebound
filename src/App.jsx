import { useEffect, useRef, useState } from 'react'
import './App.css'
import { DestinationEditor } from './components/DestinationEditor'
import { Hero } from './components/Hero'
import { ResultCard } from './components/ResultCard'
import { WheelGame } from './components/WheelGame'
import { DEFAULT_DESTINATIONS } from './data/destinations'
import {
  loadDestinations,
  resetDestinationsStorage,
  saveDestinations,
} from './utils/storage'
import {
  MANUAL_SPIN_CYCLE_MS,
  MANUAL_SPIN_DEGREES_PER_SECOND,
  MANUAL_STOP_DURATION_MS,
  calculateWheelRotation,
  pickDestinationIndex,
} from './utils/wheel'

function cloneDestinations(destinations) {
  return destinations.map((destination) => ({ ...destination }))
}

function createDestinationId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `destination-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function createAudioContext() {
  if (typeof window === 'undefined') {
    return null
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  return AudioContextClass ? new AudioContextClass() : null
}

function playRomanceChime(audioContext) {
  if (!audioContext) {
    return
  }

  const now = audioContext.currentTime
  const notes = [
    { frequency: 523.25, duration: 0.18, delay: 0 },
    { frequency: 659.25, duration: 0.2, delay: 0.14 },
    { frequency: 783.99, duration: 0.26, delay: 0.3 },
  ]

  notes.forEach(({ frequency, duration, delay }) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency

    gainNode.gain.setValueAtTime(0.0001, now + delay)
    gainNode.gain.exponentialRampToValueAtTime(0.05, now + delay + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      now + delay + duration,
    )

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start(now + delay)
    oscillator.stop(now + delay + duration + 0.04)
  })
}

function App() {
  const [destinations, setDestinations] = useState(() =>
    cloneDestinations(loadDestinations(DEFAULT_DESTINATIONS)),
  )
  const [isSpinning, setIsSpinning] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [selectedDestinationId, setSelectedDestinationId] = useState(null)
  const [confirmedDestinationId, setConfirmedDestinationId] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [statusMessage, setStatusMessage] = useState(
    '把下一次出走交给一点心动，今晚先让转盘替你们做第一步。',
  )

  const wheelSectionRef = useRef(null)
  const settleTimerRef = useRef(null)
  const audioContextRef = useRef(null)
  const stopFrameRef = useRef(null)
  const spinStartedAtRef = useRef(0)
  const spinBaseRotationRef = useRef(0)

  useEffect(() => {
    saveDestinations(destinations)
  }, [destinations])

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current)
      }

      if (stopFrameRef.current) {
        window.cancelAnimationFrame(stopFrameRef.current)
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const selectedDestination =
    destinations.find((destination) => destination.id === selectedDestinationId) ??
    null
  const confirmedDestination =
    destinations.find((destination) => destination.id === confirmedDestinationId) ??
    null

  function clearSettleTimer() {
    if (settleTimerRef.current) {
      window.clearTimeout(settleTimerRef.current)
      settleTimerRef.current = null
    }
  }

  function clearStopFrame() {
    if (stopFrameRef.current) {
      window.cancelAnimationFrame(stopFrameRef.current)
      stopFrameRef.current = null
    }
  }

  function getLiveRotation() {
    if (!isSpinning) {
      return rotation
    }

    const elapsedMs = Date.now() - spinStartedAtRef.current
    return (
      spinBaseRotationRef.current +
      (elapsedMs / 1000) * MANUAL_SPIN_DEGREES_PER_SECOND
    )
  }

  function getAudioContext() {
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext()
    }

    return audioContextRef.current
  }

  function playResultSound() {
    if (!soundEnabled) {
      return
    }

    const audioContext = getAudioContext()
    if (!audioContext) {
      return
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    playRomanceChime(audioContext)
  }

  function handleScrollToWheel() {
    wheelSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function handleSpin() {
    if (isStopping || destinations.length === 0) {
      return
    }

    if (isSpinning) {
      const liveRotation = getLiveRotation()
      const nextIndex = pickDestinationIndex(destinations.length)
      const result = destinations[nextIndex]
      const nextRotation = calculateWheelRotation({
        count: destinations.length,
        selectedIndex: nextIndex,
        previousRotation: liveRotation,
        spins: 3,
      })

      clearSettleTimer()
      clearStopFrame()
      setIsSpinning(false)
      setIsStopping(false)
      setRotation(liveRotation)
      setStatusMessage('手已经按下了，看看它会不会刚好停在你们都想去的地方。')

      stopFrameRef.current = window.requestAnimationFrame(() => {
        stopFrameRef.current = window.requestAnimationFrame(() => {
          setIsStopping(true)
          setRotation(nextRotation)

          settleTimerRef.current = window.setTimeout(() => {
            setSelectedDestinationId(result.id)
            setIsStopping(false)
            setStatusMessage(`${result.name} 落在指针下，像一封刚好送达的邀请。`)
            playResultSound()
            settleTimerRef.current = null
          }, MANUAL_STOP_DURATION_MS)

          stopFrameRef.current = null
        })
      })

      return
    }

    clearSettleTimer()
    clearStopFrame()
    spinBaseRotationRef.current = rotation
    spinStartedAtRef.current = Date.now()
    setIsSpinning(true)
    setIsStopping(false)
    setSelectedDestinationId(null)
    setConfirmedDestinationId(null)
    setStatusMessage('转盘已经转起来了，想停的时候由你们亲手按下。')
  }

  function handleConfirmDestination() {
    if (!selectedDestination) {
      return
    }

    setConfirmedDestinationId(selectedDestination.id)
    setStatusMessage(
      `下一站先记成 ${selectedDestination.name}，剩下的留给你们慢慢兑现。`,
    )
  }

  function handleAddDestination(destination) {
    const nextDestination = {
      ...destination,
      id: createDestinationId(),
    }

    setDestinations((current) => [...current, nextDestination])
    setStatusMessage(`${nextDestination.name} 已加入转盘，今晚的想象又多了一格。`)
  }

  function handleUpdateDestination(updatedDestination) {
    setDestinations((current) =>
      current.map((destination) =>
        destination.id === updatedDestination.id
          ? { ...updatedDestination }
          : destination,
      ),
    )
    setStatusMessage(`${updatedDestination.name} 已更新，画面感更具体了。`)
  }

  function handleDeleteDestination(destinationId) {
    const removedDestination = destinations.find(
      (destination) => destination.id === destinationId,
    )

    setDestinations((current) =>
      current.filter((destination) => destination.id !== destinationId),
    )

    if (selectedDestinationId === destinationId) {
      setSelectedDestinationId(null)
    }

    if (confirmedDestinationId === destinationId) {
      setConfirmedDestinationId(null)
    }

    setStatusMessage(
      removedDestination
        ? `${removedDestination.name} 先从转盘退场，给别的心动留一点位置。`
        : '这个地点已经从转盘里移除。',
    )
  }

  function handleResetDestinations() {
    clearSettleTimer()
    clearStopFrame()
    resetDestinationsStorage()
    setDestinations(cloneDestinations(DEFAULT_DESTINATIONS))
    setSelectedDestinationId(null)
    setConfirmedDestinationId(null)
    setRotation(0)
    setIsSpinning(false)
    setIsStopping(false)
    setStatusMessage('默认心动地点已恢复，转盘重新满电。')
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" aria-hidden="true"></div>
      <div className="ambient ambient-two" aria-hidden="true"></div>
      <div className="ambient ambient-three" aria-hidden="true"></div>

      <div className="app-container">
        <Hero
          destinationCount={destinations.length}
          onStart={handleScrollToWheel}
        />

        <main className="app-main">
          <section className="main-grid" ref={wheelSectionRef}>
            <WheelGame
              confirmedDestination={confirmedDestination}
              destinations={destinations}
              isSpinning={isSpinning}
              isStopping={isStopping}
              onSpin={handleSpin}
              onToggleSound={() => setSoundEnabled((current) => !current)}
              rotation={rotation}
              selectedDestination={selectedDestination}
              spinCycleMs={MANUAL_SPIN_CYCLE_MS}
              soundEnabled={soundEnabled}
              statusMessage={statusMessage}
              stopDurationMs={MANUAL_STOP_DURATION_MS}
            />
            <ResultCard
              canSpin={
                ((!isSpinning && !isStopping) || isSpinning) &&
                destinations.length > 0
              }
              confirmedDestination={confirmedDestination}
              destination={selectedDestination}
              isSpinning={isSpinning}
              isStopping={isStopping}
              onConfirm={handleConfirmDestination}
              onSpin={handleSpin}
            />
          </section>

          <DestinationEditor
            destinations={destinations}
            disabled={isSpinning || isStopping}
            onAddDestination={handleAddDestination}
            onDeleteDestination={handleDeleteDestination}
            onResetDestinations={handleResetDestinations}
            onUpdateDestination={handleUpdateDestination}
          />
        </main>

        <footer className="footer-note">
          <p>旅行还没出发，气氛可以先到场。转盘结果只保存在当前浏览器里。</p>
        </footer>
      </div>
    </div>
  )
}

export default App
