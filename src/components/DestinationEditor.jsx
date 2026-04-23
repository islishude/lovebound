import { useState } from 'react'

const EMPTY_DESTINATION = {
  name: '',
  tagline: '',
  mood: '',
  reason: '',
  coupleTask: '',
  color: '#f1a58d',
}

function createDraft(destination = EMPTY_DESTINATION) {
  return { ...EMPTY_DESTINATION, ...destination }
}

function normalizeDraft(draft) {
  return {
    ...draft,
    name: draft.name.trim(),
    tagline: draft.tagline.trim(),
    mood: draft.mood.trim(),
    reason: draft.reason.trim(),
    coupleTask: draft.coupleTask.trim(),
  }
}

export function DestinationEditor({
  destinations,
  disabled,
  onAddDestination,
  onDeleteDestination,
  onResetDestinations,
  onUpdateDestination,
  poolCount,
  wheelCount,
}) {
  const [draft, setDraft] = useState(createDraft())
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  function handleChange(field, value) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function resetForm() {
    setDraft(createDraft())
    setEditingId(null)
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (disabled) {
      return
    }

    const nextDraft = normalizeDraft(draft)

    if (
      !nextDraft.name ||
      !nextDraft.tagline ||
      !nextDraft.mood ||
      !nextDraft.reason ||
      !nextDraft.coupleTask
    ) {
      setError('地点名、氛围、理由和任务都先填完整，结果卡才会有画面。')
      return
    }

    if (editingId) {
      onUpdateDestination({
        id: editingId,
        ...nextDraft,
      })
    } else {
      onAddDestination(nextDraft)
    }

    resetForm()
  }

  function handleStartEdit(destination) {
    setDraft(createDraft(destination))
    setEditingId(destination.id)
    setError('')
  }

  return (
    <section className="editor-panel panel" aria-labelledby="editor-title">
      <div className="editor-copy">
        <p className="eyebrow">Destination Editor</p>
        <h2 id="editor-title">把你们真正会考虑的地点塞进转盘里</h2>
        <p>
          总库里现在有 {poolCount} 个国内目的地，当前转盘只展示其中 {wheelCount}{' '}
          个。这里展示的是“当前这一盘”，你可以继续往总库里加自己的私藏地点。
        </p>
      </div>

      <div className="editor-layout">
        <div className="form-card">
          <form className="editor-form" onSubmit={handleSubmit}>
            <div className="field-grid">
              <label className="field">
                <span>地点名</span>
                <input
                  type="text"
                  placeholder="例如：厦门"
                  value={draft.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  disabled={disabled}
                />
              </label>

              <label className="field">
                <span>心情标签</span>
                <input
                  type="text"
                  placeholder="例如：海风慢恋"
                  value={draft.mood}
                  onChange={(event) => handleChange('mood', event.target.value)}
                  disabled={disabled}
                />
              </label>

              <label className="field field-wide">
                <span>一句话氛围</span>
                <input
                  type="text"
                  placeholder="例如：适合把晚风和心事都留在海边。"
                  value={draft.tagline}
                  onChange={(event) => handleChange('tagline', event.target.value)}
                  disabled={disabled}
                />
              </label>

              <label className="field field-wide">
                <span>为什么值得去</span>
                <textarea
                  placeholder="写一点让人想立刻出发的理由。"
                  value={draft.reason}
                  onChange={(event) => handleChange('reason', event.target.value)}
                  disabled={disabled}
                />
              </label>

              <label className="field field-wide">
                <span>情侣任务</span>
                <textarea
                  placeholder="给结果页留一个轻暧昧的小任务。"
                  value={draft.coupleTask}
                  onChange={(event) =>
                    handleChange('coupleTask', event.target.value)
                  }
                  disabled={disabled}
                />
              </label>

              <label className="field">
                <span>扇区颜色</span>
                <input
                  type="color"
                  value={draft.color}
                  onChange={(event) => handleChange('color', event.target.value)}
                  disabled={disabled}
                />
              </label>
            </div>

            {error && <p className="form-error">{error}</p>}
            <p className="form-note">
              {disabled
                ? '转盘转动时先锁住编辑，等结果出来再改。'
                : '写得越具体，抽中的那一刻越像真的要出发。'}
            </p>

            <div className="action-row">
              <button type="submit" className="primary-button" disabled={disabled}>
                {editingId ? '保存修改' : '加入总库'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="ghost-button"
                  onClick={resetForm}
                  disabled={disabled}
                >
                  取消编辑
                </button>
              )}

              <button
                type="button"
                className="secondary-button"
                onClick={onResetDestinations}
                disabled={disabled}
              >
                恢复默认总库
              </button>
            </div>
          </form>
        </div>

        <div className="list-card">
          {destinations.length > 0 ? (
            <div className="destination-list">
              {destinations.map((destination) => (
                <article className="destination-item" key={destination.id}>
                  <div className="destination-top">
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

                    <span className="pill">{destination.mood}</span>
                  </div>

                  <div className="destination-copy">
                    <p>
                      <strong>理由：</strong>
                      {destination.reason}
                    </p>
                    <p>
                      <strong>任务：</strong>
                      {destination.coupleTask}
                    </p>
                  </div>

                  <div className="destination-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => handleStartEdit(destination)}
                      disabled={disabled}
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => onDeleteDestination(destination.id)}
                      disabled={disabled}
                    >
                      删除
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-list">
              转盘现在是空的。先加几个真正想去的地方，再让随机把气氛点着。
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
