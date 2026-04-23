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

  const chunkSize = name.length <= 8 ? 4 : 3
  const chunks = []

  for (let index = 0; index < name.length; index += chunkSize) {
    chunks.push(name.slice(index, index + chunkSize))
  }

  return chunks.slice(0, 3)
}

export function WheelGame({
  confirmedDestination,
  destinations,
  isSpinning,
  isStopping,
  onRotateWheel,
  onSpin,
  onToggleSound,
  poolCount,
  rotation,
  selectedDestination,
  spinCycleMs,
  soundEnabled,
  statusMessage,
  stopDurationMs,
}) {
  const segmentAngle = destinations.length > 0 ? 360 / destinations.length : 0
  const wheelBackground = createWheelBackground(destinations)

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
                const labelLines = splitWheelLabel(destination.name)

                return (
                  <span
                    key={destination.id}
                    className="wheel-label"
                    style={{
                      '--label-angle': `${angle}deg`,
                      '--reverse-angle': `${-angle}deg`,
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
            <span className="chip">当前这一盘 {destinations.length} 个</span>
            <span className="chip">结果卡即时生成</span>
            <span className="chip">点击可整盘轮换</span>
          </div>

          <div className="status-banner" aria-live="polite">
            <strong>当前气氛：</strong>
            {statusMessage}
          </div>

          <div className="action-row">
            <button
              type="button"
              className="secondary-button"
              onClick={onRotateWheel}
              disabled={isSpinning || isStopping || poolCount === 0}
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
                指针停下之前，一切都只是你们还没来得及承认的偏爱。
              </p>
            </div>
          )}

          {confirmedDestination && (
            <div className="confirmed-note">
              <p>
                已经把 <strong>{confirmedDestination.name}</strong> 记成当前下一站。
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
