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
import { calculateWheelRotation, pickDestinationIndex } from './utils/wheel'

const SPIN_DURATION_MS = 5200

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
  const [selectedDestinationId, setSelectedDestinationId] = useState(null)
  const [confirmedDestinationId, setConfirmedDestinationId] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [statusMessage, setStatusMessage] = useState(
    '把下一次出走交给一点心动，今晚先让转盘替你们做第一步。',
  )

  const wheelSectionRef = useRef(null)
  const spinTimerRef = useRef(null)
  const audioContextRef = useRef(null)

  useEffect(() => {
    saveDestinations(destinations)
  }, [destinations])

  useEffect(() => {
    return () => {
      if (spinTimerRef.current) {
        window.clearTimeout(spinTimerRef.current)
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

  function clearSpinTimer() {
    if (spinTimerRef.current) {
      window.clearTimeout(spinTimerRef.current)
      spinTimerRef.current = null
    }
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
    if (isSpinning || destinations.length === 0) {
      return
    }

    clearSpinTimer()

    const nextIndex = pickDestinationIndex(destinations.length)
    const nextRotation = calculateWheelRotation({
      count: destinations.length,
      selectedIndex: nextIndex,
      previousRotation: rotation,
      spins: 7,
    })

    setIsSpinning(true)
    setSelectedDestinationId(null)
    setConfirmedDestinationId(null)
    setStatusMessage('转盘正在替你们酝酿下一次靠近，先别急着理性。')
    setRotation(nextRotation)

    spinTimerRef.current = window.setTimeout(() => {
      const result = destinations[nextIndex]

      setSelectedDestinationId(result.id)
      setIsSpinning(false)
      setStatusMessage(`${result.name} 落在指针下，像一封刚好送达的邀请。`)
      playResultSound()
      spinTimerRef.current = null
    }, SPIN_DURATION_MS)
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
    clearSpinTimer()
    resetDestinationsStorage()
    setDestinations(cloneDestinations(DEFAULT_DESTINATIONS))
    setSelectedDestinationId(null)
    setConfirmedDestinationId(null)
    setRotation(0)
    setIsSpinning(false)
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
              onSpin={handleSpin}
              onToggleSound={() => setSoundEnabled((current) => !current)}
              rotation={rotation}
              selectedDestination={selectedDestination}
              soundEnabled={soundEnabled}
              statusMessage={statusMessage}
            />
            <ResultCard
              canSpin={!isSpinning && destinations.length > 0}
              confirmedDestination={confirmedDestination}
              destination={selectedDestination}
              isSpinning={isSpinning}
              onConfirm={handleConfirmDestination}
              onSpin={handleSpin}
            />
          </section>

          <DestinationEditor
            destinations={destinations}
            disabled={isSpinning}
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
