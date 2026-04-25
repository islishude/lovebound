import { useEffect, useRef, useState } from 'react'
import './App.css'
import { CandidatePanel } from './components/CandidatePanel'
import { Hero } from './components/Hero'
import { ResultCard } from './components/ResultCard'
import { WheelGame } from './components/WheelGame'
import {
  DEFAULT_DESTINATION_POOL,
  WHEEL_DESTINATION_COUNT,
} from './data/destinations'
import {
  PREFERENCE_CATEGORIES,
  getPreferenceCategoryLabel,
} from './data/preferences'
import {
  arrangeWheelDestinations,
  filterDestinationsByPreference,
  pickNextWheelDestinations,
} from './utils/destinationPool'
import {
  MANUAL_SPIN_CYCLE_MS,
  MANUAL_SPIN_DEGREES_PER_SECOND,
  MANUAL_STOP_DURATION_MS,
  calculateWheelRotation,
  pickDestinationIndex,
} from './utils/wheel'

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

function getPreferenceLabel(selectedPreferenceCategories) {
  if (selectedPreferenceCategories.length === 0) {
    return '全部偏好'
  }

  return selectedPreferenceCategories.map(getPreferenceCategoryLabel).join('、')
}

function getPreferenceStatusMessage(selectedPreferenceCategories, poolCount) {
  const preferenceLabel = getPreferenceLabel(selectedPreferenceCategories)

  if (poolCount === 0) {
    return `当前偏好「${preferenceLabel}」下没有候选，清空偏好或换一组偏好。`
  }

  return `偏好已切到「${preferenceLabel}」，从 ${poolCount} 个匹配目的地里抽出今晚这一盘。`
}

function mapWheelIdsFromPool(pool, currentIds = [], options = {}) {
  const pickedDestinations = pickNextWheelDestinations(
    pool,
    WHEEL_DESTINATION_COUNT,
    currentIds,
    Math.random,
    options,
  )

  return arrangeWheelDestinations(pickedDestinations).map(
    (destination) => destination.id,
  )
}

function getDestinationNamesByIds(pool, destinationIds) {
  return destinationIds
    .map((destinationId) =>
      pool.find((destination) => destination.id === destinationId),
    )
    .filter(Boolean)
    .map((destination) => destination.name)
}

function pickWheelResultIndex(destinations, excludedDestinationId) {
  if (destinations.length === 0) {
    return -1
  }

  const availableIndexes = destinations
    .map((destination, index) => ({ destination, index }))
    .filter(({ destination }) => destination.id !== excludedDestinationId)
    .map(({ index }) => index)

  if (availableIndexes.length === 0) {
    return pickDestinationIndex(destinations.length)
  }

  return availableIndexes[pickDestinationIndex(availableIndexes.length)]
}

function App() {
  const destinationPool = DEFAULT_DESTINATION_POOL
  const [selectedPreferenceCategories, setSelectedPreferenceCategories] =
    useState([])
  const [wheelDestinationIds, setWheelDestinationIds] = useState(() =>
    mapWheelIdsFromPool(DEFAULT_DESTINATION_POOL),
  )
  const [isSpinning, setIsSpinning] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [selectedDestinationId, setSelectedDestinationId] = useState(null)
  const [confirmedDestinationId, setConfirmedDestinationId] = useState(null)
  const [lastResultId, setLastResultId] = useState(null)
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

  const activeDestinationPool = filterDestinationsByPreference(
    destinationPool,
    selectedPreferenceCategories,
  )

  const wheelDestinations = wheelDestinationIds
    .map((destinationId) =>
      activeDestinationPool.find(
        (destination) => destination.id === destinationId,
      ),
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

  function applyPreferenceSelection(nextSelectedPreferenceCategories) {
    if (isSpinning || isStopping) {
      return
    }

    clearSettleTimer()
    clearStopFrame()

    const nextPreferencePool = filterDestinationsByPreference(
      destinationPool,
      nextSelectedPreferenceCategories,
    )

    setSelectedPreferenceCategories(nextSelectedPreferenceCategories)
    setWheelDestinationIds(mapWheelIdsFromPool(nextPreferencePool))
    clearSelection()
    setLastResultId(null)
    setRotation(0)
    setStatusMessage(
      getPreferenceStatusMessage(
        nextSelectedPreferenceCategories,
        nextPreferencePool.length,
      ),
    )
  }

  function handleTogglePreferenceCategory(preferenceCategory) {
    const nextSelectedPreferenceCategories =
      selectedPreferenceCategories.includes(preferenceCategory)
        ? selectedPreferenceCategories.filter(
            (category) => category !== preferenceCategory,
          )
        : [...selectedPreferenceCategories, preferenceCategory]

    applyPreferenceSelection(nextSelectedPreferenceCategories)
  }

  function handleClearPreferenceCategories() {
    if (selectedPreferenceCategories.length === 0) {
      return
    }

    applyPreferenceSelection([])
  }

  function handleRotateWheelDestinations() {
    if (isSpinning || isStopping || activeDestinationPool.length === 0) {
      return
    }

    const excludedResultIds = [
      lastResultId,
      selectedDestinationId,
      confirmedDestinationId,
    ].filter(Boolean)

    setWheelDestinationIds(
      mapWheelIdsFromPool(activeDestinationPool, wheelDestinationIds, {
        excludeIds: excludedResultIds,
        excludeNames: getDestinationNamesByIds(
          activeDestinationPool,
          excludedResultIds,
        ),
      }),
    )
    clearSelection()
    setRotation(0)
    setStatusMessage(
      `这一盘已经换新，按「${getPreferenceLabel(
        selectedPreferenceCategories,
      )}」从 ${activeDestinationPool.length} 个匹配目的地里重新抽了 ${Math.min(
        WHEEL_DESTINATION_COUNT,
        activeDestinationPool.length,
      )} 个。`,
    )
  }

  function handleSpin() {
    if (isStopping || wheelDestinations.length === 0) {
      return
    }

    if (isSpinning) {
      const liveRotation = getLiveRotation()
      const nextIndex = pickWheelResultIndex(wheelDestinations, lastResultId)
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
            setLastResultId(result.id)
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
              activePoolCount={activeDestinationPool.length}
              confirmedDestination={confirmedDestination}
              destinations={wheelDestinations}
              isSpinning={isSpinning}
              isStopping={isStopping}
              onClearPreferenceCategories={handleClearPreferenceCategories}
              onRotateWheel={handleRotateWheelDestinations}
              onSpin={handleSpin}
              onToggleSound={() => setSoundEnabled((current) => !current)}
              onTogglePreferenceCategory={handleTogglePreferenceCategory}
              poolCount={destinationPool.length}
              preferenceCategories={PREFERENCE_CATEGORIES}
              preferencesDisabled={isSpinning || isStopping}
              rotation={rotation}
              selectedDestination={selectedDestination}
              selectedPreferenceCategories={selectedPreferenceCategories}
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

          <CandidatePanel
            destinations={wheelDestinations}
            activePoolCount={activeDestinationPool.length}
            poolCount={destinationPool.length}
            preferenceLabel={getPreferenceLabel(selectedPreferenceCategories)}
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
