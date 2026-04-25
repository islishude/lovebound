import { getPreferenceCategoryLabel } from '../data/preferences'

function splitTagLabel(label) {
  const characters = [...label]
  const midpoint = Math.ceil(characters.length / 2)

  return [
    characters.slice(0, midpoint).join(''),
    characters.slice(midpoint).join(''),
  ].filter(Boolean)
}

function CandidateTag({ children, className = '' }) {
  return (
    <span className={`pill candidate-pill ${className}`} title={children}>
      {splitTagLabel(children).map((line, index) => (
        <span className="candidate-pill-line" key={`${line}-${index}`}>
          {line}
        </span>
      ))}
    </span>
  )
}

export function CandidatePanel({
  activePoolCount,
  destinations,
  poolCount,
  preferenceLabel,
}) {
  return (
    <section className="candidate-panel panel" aria-labelledby="candidate-title">
      <div className="candidate-copy">
        <p className="eyebrow">Tonight Candidates</p>
        <h2 id="candidate-title">今晚这一盘</h2>
        <p>
          当前偏好是「{preferenceLabel}」，从 {poolCount} 个国内目的地里匹配到{' '}
          {activePoolCount} 个候选，这一盘先展示 {destinations.length} 个。
        </p>
      </div>

      {destinations.length > 0 ? (
        <div className="candidate-list">
          {destinations.map((destination) => (
            <article className="candidate-item" key={destination.id}>
              <div className="candidate-top">
                <div className="destination-title">
                  <span
                    className="swatch"
                    style={{ backgroundColor: destination.color }}
                    aria-hidden="true"
                  ></span>
                  <div>
                    <h3>{destination.name}</h3>
                    <p className="destination-tagline">{destination.tagline}</p>
                  </div>
                </div>

                <div className="destination-pill-stack">
                  <CandidateTag>{destination.mood}</CandidateTag>
                  <CandidateTag className="category-pill">
                    {getPreferenceCategoryLabel(destination.preferenceCategory)}
                  </CandidateTag>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-list">
          当前偏好下没有候选，清空偏好或换一组偏好。
        </div>
      )}
    </section>
  )
}
