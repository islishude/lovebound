import { useEffect, useRef, useState } from 'react'
import './App.css'
import { DestinationEditor } from './components/DestinationEditor'
import { Hero } from './components/Hero'
import { ResultCard } from './components/ResultCard'
import { WheelGame } from './components/WheelGame'
import {
  DEFAULT_DESTINATION_POOL,
  WHEEL_DESTINATION_COUNT,
} from './data/destinations'
import {
  loadDestinations,
  resetDestinationsStorage,
  saveDestinations,
} from './utils/storage'
import {
  arrangeWheelDestinations,
  pickNextWheelDestinations,
  promoteDestinationToWheel,
  reconcileWheelDestinationIds,
} from './utils/destinationPool'
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

function getInitialDestinationPool() {
  return cloneDestinations(loadDestinations(DEFAULT_DESTINATION_POOL))
}

function getDefaultCityDestinations(pool) {
  return pool.filter((destination) => destination.id.startsWith('city-'))
}

function arrangeWheelIds(pool, destinationIds) {
  const arrangedDestinations = arrangeWheelDestinations(
    destinationIds
      .map((destinationId) =>
        pool.find((destination) => destination.id === destinationId),
      )
      .filter(Boolean),
  )

  return arrangedDestinations.map((destination) => destination.id)
}

function mapWheelIdsFromPool(pool, currentIds = []) {
  const pickedDestinations = pickNextWheelDestinations(
    pool,
    WHEEL_DESTINATION_COUNT,
    currentIds,
  )

  return arrangeWheelDestinations(pickedDestinations).map(
    (destination) => destination.id,
  )
}

function App() {
  const [destinationPool, setDestinationPool] = useState(getInitialDestinationPool)
  const [wheelDestinationIds, setWheelDestinationIds] = useState(() =>
    {
      const initialPool = getInitialDestinationPool()
      const defaultCityPool = getDefaultCityDestinations(initialPool)

      return mapWheelIdsFromPool(
        defaultCityPool.length >= WHEEL_DESTINATION_COUNT
          ? defaultCityPool
          : initialPool,
      )
    },
  )
  const [isSpinning, setIsSpinning] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [selectedDestinationId, setSelectedDestinationId] = useState(null)
  const [confirmedDestinationId, setConfirmedDestinationId] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [statusMessage, setStatusMessage] = useState(
    '总库已经准备了 500+ 个国内目的地，先替你们抽出今晚这一盘。',
  )

  const wheelSectionRef = useRef(null)
  const settleTimerRef = useRef(null)
  const audioContextRef = useRef(null)
  const stopFrameRef = useRef(null)
  const spinStartedAtRef = useRef(0)
  const spinBaseRotationRef = useRef(0)

  useEffect(() => {
    saveDestinations(destinationPool)
  }, [destinationPool])

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

  const wheelDestinations = wheelDestinationIds
    .map((destinationId) =>
      destinationPool.find((destination) => destination.id === destinationId),
    )
    .filter(Boolean)

  const selectedDestination =
    destinationPool.find((destination) => destination.id === selectedDestinationId) ??
    null
  const confirmedDestination =
    destinationPool.find((destination) => destination.id === confirmedDestinationId) ??
    null

  function clearSelection() {
    setSelectedDestinationId(null)
    setConfirmedDestinationId(null)
  }

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

  function handleRotateWheelDestinations() {
    if (isSpinning || isStopping || destinationPool.length === 0) {
      return
    }

    setWheelDestinationIds(mapWheelIdsFromPool(destinationPool, wheelDestinationIds))
    clearSelection()
    setRotation(0)
    setStatusMessage(
      `这一盘已经换新，从总库 ${destinationPool.length} 个国内目的地里重新抽了 ${Math.min(
        WHEEL_DESTINATION_COUNT,
        destinationPool.length,
      )} 个。`,
    )
  }

  function handleSpin() {
    if (isStopping || wheelDestinations.length === 0) {
      return
    }

    if (isSpinning) {
      const liveRotation = getLiveRotation()
      const nextIndex = pickDestinationIndex(wheelDestinations.length)
      const result = wheelDestinations[nextIndex]
      const nextRotation = calculateWheelRotation({
        count: wheelDestinations.length,
        selectedIndex: nextIndex,
        previousRotation: liveRotation,
        spins: 3,
      })

      clearSettleTimer()
      clearStopFrame()
      setIsSpinning(false)
      setIsStopping(false)
      setRotation(liveRotation)
      setStatusMessage('这一盘开始减速了，看看它最后会把你们送去哪一站。')

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
    clearSelection()
    setStatusMessage('这一盘已经转起来了，想停的时候由你们亲手按下。')
  }

  function handleConfirmDestination() {
    if (!selectedDestination) {
      return
    }

    setConfirmedDestinationId(selectedDestination.id)
    setStatusMessage(
      `下一站先记成 ${selectedDestination.name}，这次就别只停留在“以后再说”。`,
    )
  }

  function handleAddDestination(destination) {
    const nextDestination = {
      ...destination,
      id: createDestinationId(),
    }
    const nextPool = [...destinationPool, nextDestination]

    setDestinationPool(nextPool)
    setWheelDestinationIds(
      arrangeWheelIds(
        nextPool,
        promoteDestinationToWheel(
          wheelDestinationIds,
          nextDestination.id,
          WHEEL_DESTINATION_COUNT,
        ),
      ),
    )
    clearSelection()
    setRotation(0)
    setStatusMessage(
      `${nextDestination.name} 已加入总库，并被直接塞进了当前这一盘。`,
    )
  }

  function handleUpdateDestination(updatedDestination) {
    const nextPool = destinationPool.map((destination) =>
      destination.id === updatedDestination.id
        ? { ...updatedDestination }
        : destination,
    )

    setDestinationPool(nextPool)
    setStatusMessage(`${updatedDestination.name} 已更新，当前这一盘的内容也同步刷新了。`)
  }

  function handleDeleteDestination(destinationId) {
    const removedDestination = destinationPool.find(
      (destination) => destination.id === destinationId,
    )
    const nextPool = destinationPool.filter(
      (destination) => destination.id !== destinationId,
    )

    setDestinationPool(nextPool)
    setWheelDestinationIds(
      arrangeWheelIds(
        nextPool,
        reconcileWheelDestinationIds(
          nextPool,
          wheelDestinationIds.filter((id) => id !== destinationId),
          WHEEL_DESTINATION_COUNT,
        ),
      ),
    )

    if (selectedDestinationId === destinationId) {
      setSelectedDestinationId(null)
    }

    if (confirmedDestinationId === destinationId) {
      setConfirmedDestinationId(null)
    }

    setStatusMessage(
      removedDestination
        ? `${removedDestination.name} 已从总库移除，转盘会自动补上新的候选。`
        : '这个地点已经从总库里移除。',
    )
  }

  function handleResetDestinations() {
    clearSettleTimer()
    clearStopFrame()
    resetDestinationsStorage()

    const nextPool = cloneDestinations(DEFAULT_DESTINATION_POOL)
    const defaultCityPool = getDefaultCityDestinations(nextPool)

    setDestinationPool(nextPool)
    setWheelDestinationIds(
      mapWheelIdsFromPool(
        defaultCityPool.length >= WHEEL_DESTINATION_COUNT
          ? defaultCityPool
          : nextPool,
      ),
    )
    clearSelection()
    setRotation(0)
    setIsSpinning(false)
    setIsStopping(false)
    setStatusMessage('500+ 国内目的地总库已恢复，转盘也换上了一整盘新候选。')
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" aria-hidden="true"></div>
      <div className="ambient ambient-two" aria-hidden="true"></div>
      <div className="ambient ambient-three" aria-hidden="true"></div>

      <div className="app-container">
        <Hero
          poolCount={destinationPool.length}
          wheelCount={wheelDestinations.length}
          onStart={handleScrollToWheel}
        />

        <main className="app-main">
          <section className="main-grid" ref={wheelSectionRef}>
            <WheelGame
              confirmedDestination={confirmedDestination}
              destinations={wheelDestinations}
              isSpinning={isSpinning}
              isStopping={isStopping}
              onRotateWheel={handleRotateWheelDestinations}
              onSpin={handleSpin}
              onToggleSound={() => setSoundEnabled((current) => !current)}
              poolCount={destinationPool.length}
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
                wheelDestinations.length > 0
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
            destinations={wheelDestinations}
            disabled={isSpinning || isStopping}
            onAddDestination={handleAddDestination}
            onDeleteDestination={handleDeleteDestination}
            onResetDestinations={handleResetDestinations}
            onUpdateDestination={handleUpdateDestination}
            poolCount={destinationPool.length}
            wheelCount={wheelDestinations.length}
          />
        </main>

        <footer className="footer-note">
          <p>
            当前总库已内置 500+ 个国内目的地。每次“换一盘”都会重新抽出一整盘候选。
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
