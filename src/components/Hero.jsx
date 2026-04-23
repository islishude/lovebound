export function Hero({ destinationCount, onStart }) {
  return (
    <header className="hero-panel panel">
      <div className="hero-copy">
        <p className="eyebrow">Couple Trip Roulette</p>
        <h1>把下一次出走，交给一点认真又暧昧的随机。</h1>
        <p className="hero-text">
          当“以后去哪里”总被日程推迟，不如先把心动转出来。今晚先抽一座城市，再给彼此一条像约定一样的小任务。
        </p>

        <div className="hero-actions">
          <button type="button" className="primary-button" onClick={onStart}>
            现在开转
          </button>
          <span className="hero-note">
            不需要登录，不逼你们立刻订票，只负责把气氛先推到位。
          </span>
        </div>
      </div>

      <div className="hero-aside">
        <div className="hero-card">
          <p className="eyebrow">今晚库存</p>
          <strong>{destinationCount}</strong>
          <span>个可转的心动目的地</span>
        </div>

        <ul className="hero-tag-list" aria-label="玩法亮点">
          <li className="hero-tag">
            <strong>轻暧昧</strong>
            文案有点撩，但不过界。
          </li>
          <li className="hero-tag">
            <strong>可自定义</strong>
            把你们真正会去的地方加进来。
          </li>
          <li className="hero-tag">
            <strong>本地保存</strong>
            刷新页面也不会把地点弄丢。
          </li>
          <li className="hero-tag">
            <strong>手机友好</strong>
            躺着也能把下一站转出来。
          </li>
        </ul>
      </div>
    </header>
  )
}
