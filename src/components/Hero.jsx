export function Hero({ poolCount, wheelCount, onStart }) {
  return (
    <header className="hero-panel panel">
      <div className="hero-copy">
        <p className="eyebrow">Couple Trip Roulette</p>
        <h1>把下一次出走，交给一点认真又暧昧的随机。</h1>
        <p className="hero-text">
          当“以后去哪里”总被日程推迟，不如先把心动转出来。总库里已经备好 500+
          个国内目的地，每次只上盘一小轮，让选择保留惊喜，也不至于眼花。
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
          <strong>{poolCount}</strong>
          <span>个总库目的地，当前这一盘展示 {wheelCount} 个</span>
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
