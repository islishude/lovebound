function createWheelBackground(destinations) {
  if (destinations.length === 0) {
    return ''
  }

  const segmentAngle = 360 / destinations.length
  const colorStops = destinations.map((destination, index) => {
    const start = segmentAngle * index
    const end = segmentAngle * (index + 1)

    return `${destination.color} ${start}deg ${end}deg`
  })

  return `conic-gradient(from -90deg, ${colorStops.join(', ')})`
}

function splitWheelLabel(name) {
  if (name.length <= 4) {
    return [name]
  }

  const midpoint = Math.ceil(name.length / 2)
  return [name.slice(0, midpoint), name.slice(midpoint)].filter(Boolean)
}

export function WheelGame({
  activePoolCount,
  confirmedDestination,
  destinations,
  isSpinning,
  isStopping,
  onClearPreferenceCategories,
  onRotateWheel,
  onSpin,
  onToggleSound,
  onTogglePreferenceCategory,
  poolCount,
  preferenceCategories,
  preferencesDisabled,
  rotation,
  selectedDestination,
  selectedPreferenceCategories,
  spinCycleMs,
  soundEnabled,
  statusMessage,
  stopDurationMs,
}) {
  const segmentAngle = destinations.length > 0 ? 360 / destinations.length : 0
  const wheelBackground = createWheelBackground(destinations)
  const selectedPreferenceCategorySet = new Set(selectedPreferenceCategories)

  return (
    <section className="wheel-panel panel" aria-labelledby="wheel-title">
      <div className="panel-head">
        <div className="panel-title">
          <p className="eyebrow">Main Game</p>
          <h2 id="wheel-title">把“以后去哪里”变成今晚的小游戏</h2>
          <p>指针落下的那一刻，先别讨论预算，先让心情赢一次。</p>
        </div>

        <button
          type="button"
          className={`sound-toggle ${soundEnabled ? 'is-active' : ''}`}
          onClick={onToggleSound}
        >
          {soundEnabled ? '音效已开' : '音效关闭'}
        </button>
      </div>

      <div className="wheel-layout">
        <div className="wheel-stage">
          <div className="wheel-pointer" aria-hidden="true"></div>

          <div
            className={`wheel-face ${isSpinning ? 'is-spinning' : ''} ${isStopping ? 'is-stopping' : ''}`}
            style={{
              '--rotation-offset': `${rotation}deg`,
              '--label-counter-rotation': `${-rotation}deg`,
              '--spin-cycle': `${spinCycleMs}ms`,
              '--stop-duration': `${stopDurationMs}ms`,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <div
              className={`wheel ${destinations.length === 0 ? 'is-empty' : ''}`}
              style={{
                background: wheelBackground,
              }}
            ></div>

            <div className="wheel-label-layer">
              {destinations.map((destination, index) => {
                const angle = segmentAngle * index + segmentAngle / 2
                const radians = (angle * Math.PI) / 180
                const labelLines = splitWheelLabel(destination.name)
                const labelRadius = destinations.length >= 12 ? 35 : 34

                return (
                  <span
                    key={destination.id}
                    className="wheel-label"
                    style={{
                      '--label-x': `${Math.sin(radians) * labelRadius}%`,
                      '--label-y': `${-Math.cos(radians) * labelRadius}%`,
                    }}
                    title={destination.name}
                  >
                    {labelLines.map((line, lineIndex) => (
                      <span
                        className="wheel-label-line"
                        key={`${destination.id}-${lineIndex}`}
                      >
                        {line}
                      </span>
                    ))}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="wheel-core">
            <button
              type="button"
              className="spin-button"
              onClick={onSpin}
              disabled={isStopping || destinations.length === 0}
            >
              <strong>{isStopping ? '停靠中' : isSpinning ? '停下' : '开始'}</strong>
              <span>
                {isStopping ? 'Almost There' : isSpinning ? 'Stop Here' : 'Spin Now'}
              </span>
            </button>
          </div>
        </div>

        <div className="wheel-meta">
          <div className="chip-row" aria-label="转盘状态">
            <span className="chip">总库 {poolCount} 个目的地</span>
            <span className="chip">匹配 {activePoolCount} 个</span>
            <span className="chip">当前这一盘 {destinations.length} 个</span>
          </div>

          <div className="preference-filter" aria-labelledby="preference-title">
            <div className="preference-filter-head">
              <strong id="preference-title">旅行偏好</strong>
              <span>
                {selectedPreferenceCategories.length === 0
                  ? '全部目的地'
                  : `${selectedPreferenceCategories.length} 个偏好已选`}
              </span>
            </div>

            <div className="preference-chip-row">
              <button
                type="button"
                className={`preference-chip ${
                  selectedPreferenceCategories.length === 0 ? 'is-active' : ''
                }`}
                onClick={onClearPreferenceCategories}
                disabled={preferencesDisabled}
                aria-pressed={selectedPreferenceCategories.length === 0}
              >
                全部
              </button>

              {preferenceCategories.map((category) => {
                const isActive = selectedPreferenceCategorySet.has(category.id)

                return (
                  <button
                    type="button"
                    className={`preference-chip ${isActive ? 'is-active' : ''}`}
                    onClick={() => onTogglePreferenceCategory(category.id)}
                    disabled={preferencesDisabled}
                    aria-pressed={isActive}
                    key={category.id}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="wheel-control-stack">
            <div className="status-banner" aria-live="polite">
              <strong>当前气氛：</strong>
              {statusMessage}
            </div>

            <div className="action-row">
              <button
                type="button"
                className="secondary-button"
                onClick={onRotateWheel}
                disabled={isSpinning || isStopping || activePoolCount === 0}
              >
                换一盘目的地
              </button>
            </div>

            {selectedDestination ? (
              <div className="wheel-hit">
                <strong>{selectedDestination.name}</strong>
                <p>{selectedDestination.tagline}</p>
              </div>
            ) : (
              <div className="helper-card">
                <p>
                  {activePoolCount === 0
                    ? '当前偏好下没有候选，清空偏好或换一组偏好。'
                    : '指针停下之前，一切都只是你们还没来得及承认的偏爱。'}
                </p>
              </div>
            )}

            {confirmedDestination && (
              <div className="confirmed-note">
                <p>
                  已经把 <strong>{confirmedDestination.name}</strong>{' '}
                  记成当前下一站。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
