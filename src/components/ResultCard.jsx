import { getPreferenceCategoryLabel } from '../data/preferences'

export function ResultCard({
  canSpin,
  confirmedDestination,
  destination,
  isSpinning,
  isStopping,
  onConfirm,
  onSpin,
}) {
  const isConfirmed = destination && confirmedDestination?.id === destination.id

  return (
    <aside className="result-panel panel" aria-labelledby="result-title">
      <div className="result-shell">
        <div className="result-header">
          <p className="eyebrow">Result Card</p>
          <h2 id="result-title">
            {destination ? destination.name : '等一次心动落点'}
          </h2>
          <p className="result-subtitle">
            {destination
              ? destination.tagline
              : '按下开始之后，这里会出现属于你们的旅行理由和今晚的小任务。'}
          </p>
        </div>

        {destination ? (
          <>
            <div className="pill-row">
              <span className="pill">{destination.mood}</span>
              <span className="pill category-pill">
                {getPreferenceCategoryLabel(destination.preferenceCategory)}
              </span>
              <span className="pill">适合两个人慢慢靠近</span>
            </div>

            <div className="result-copy">
              <div>
                <h3>为什么是这里</h3>
                <p>{destination.reason}</p>
              </div>

              <div className="task-card">
                <strong>今晚的小任务</strong>
                <p>{destination.coupleTask}</p>
              </div>
            </div>

            <div className="action-row">
              <button
                type="button"
                className="primary-button"
                onClick={onConfirm}
                disabled={isConfirmed}
              >
                {isConfirmed ? '已经记成下一站' : '就去这里'}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={onSpin}
                disabled={!canSpin || isStopping}
              >
                {isStopping ? '停靠中' : isSpinning ? '停在这里' : '再心动一次'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="placeholder-copy">
              抽中的城市不一定立刻出发，但它会先替你们把那句“之后有空再说”换成更具体的画面。
            </p>

            <div className="action-row">
              <button
                type="button"
                className="primary-button"
                onClick={onSpin}
                disabled={!canSpin || isStopping}
              >
                {isStopping ? '停靠中' : isSpinning ? '停在这里' : '替我们选一个'}
              </button>
            </div>
          </>
        )}

        {confirmedDestination && !isConfirmed && (
          <div className="confirmed-note">
            <p>
              当前已锁定的下一站是 <strong>{confirmedDestination.name}</strong>。
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
