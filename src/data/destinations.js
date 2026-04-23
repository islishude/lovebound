/**
 * @typedef {Object} Destination
 * @property {string} id
 * @property {string} name
 * @property {string} tagline
 * @property {string} mood
 * @property {string} reason
 * @property {string} coupleTask
 * @property {string} color
 */

/**
 * @type {Destination[]}
 */
export const DEFAULT_DESTINATIONS = [
  {
    id: 'hangzhou',
    name: '杭州',
    tagline: '把西湖夜色当成一封慢慢展开的情书。',
    mood: '微醺散步',
    reason: '白天喝茶逛巷子，晚上沿湖散步，适合把平时没说完的话说慢一点。',
    coupleTask:
      '沿湖边并肩走十分钟不碰手机，只聊“我们以后想一起过什么样的周末”。',
    color: '#f3b3a4',
  },
  {
    id: 'xiamen',
    name: '厦门',
    tagline: '适合把海风、晚霞和偏爱都留在鼓浪屿边上。',
    mood: '海风慢恋',
    reason: '城市节奏温柔，海边、骑楼和夜色都自带暧昧滤镜，不用赶行程也很好看。',
    coupleTask:
      '找一处海边台阶坐下来，各自说出对方最让你心动的一个小习惯。',
    color: '#ffb08f',
  },
  {
    id: 'qingdao',
    name: '青岛',
    tagline: '海边有风，街道有坡，牵手走路会自然变慢。',
    mood: '海盐微甜',
    reason: '红瓦老街和海岸线并排存在，适合一边发呆一边乱逛，轻松又不无聊。',
    coupleTask:
      '买两瓶喜欢的饮料，在海边互相拍一张“装作第一次约会”的游客照。',
    color: '#8dc6d8',
  },
  {
    id: 'anaya',
    name: '阿那亚',
    tagline: '留白很多，所以很适合两个人把情绪放大一点。',
    mood: '海边留白',
    reason: '建筑、海风和夜里的安静都很克制，适合想认真陪彼此待着的时候去。',
    coupleTask:
      '找一段安静海岸坐着，看同一片海三分钟，然后轮流说一句“我想和你一起试试的生活”。',
    color: '#dcb799',
  },
  {
    id: 'dali',
    name: '大理',
    tagline: '风很大，云很低，适合把日常抛在身后。',
    mood: '山海逃离',
    reason: '可以环洱海，也可以在古城慢慢耗时间，既有松弛感，也有一点私奔感。',
    coupleTask:
      '各自选一首适合公路的歌做共享歌单开头，并约定下次一起听它出发。',
    color: '#9fcbad',
  },
  {
    id: 'chengdu',
    name: '成都',
    tagline: '嘴巴忙着吃，心情就更容易说真话。',
    mood: '热辣约会',
    reason: '白天闲逛公园喝茶，晚上吃到冒汗，再晚一点去夜色里散步，情绪很容易升温。',
    coupleTask:
      '在夜宵摊上轮流说出一件“想和你尝试但一直没说”的小事，谁先笑场谁买单。',
    color: '#f08b75',
  },
  {
    id: 'suzhou',
    name: '苏州',
    tagline: '安静到连并肩走路的声音都显得很亲密。',
    mood: '园林低语',
    reason: '园林、河道和老街都不喧闹，适合想把相处速度降下来、认真感受彼此的时候。',
    coupleTask:
      '找一座小桥停下，各自说一句“如果以后在同一个城市生活，我最期待和你做的日常”。',
    color: '#c1d9c1',
  },
  {
    id: 'changsha',
    name: '长沙',
    tagline: '夜生活够热闹，适合把“我们要不要更亲近”说得轻松一点。',
    mood: '夜色撒欢',
    reason: '吃喝密度高，夜里也很有活力，适合想找点玩乐感、不想太严肃地做决定。',
    coupleTask:
      '一起选一份路边小吃，边走边吃时轮流回答“如果这次真的成行，我最想和你拍哪种照片”。',
    color: '#ff9e7a',
  },
  {
    id: 'guilin',
    name: '桂林',
    tagline: '山水会把讲话的语气都自动放轻一点。',
    mood: '山水靠近',
    reason: '山、江和小城感组合得刚好，适合把行程留白，让相处本身成为重点。',
    coupleTask:
      '坐船或看山景时，轮流用一句话形容“和你待在一起像什么样的风景”。',
    color: '#9ac6aa',
  },
  {
    id: 'weihai',
    name: '威海',
    tagline: '比起热闹，它更擅长让两个人把心放松下来。',
    mood: '轻盐治愈',
    reason: '海边干净、节奏安静、拍照出片，但又不需要很累的安排，适合周末短逃。',
    coupleTask:
      '挑一个海边长椅坐下，互相写一句只给对方看的旅行明信片文案。',
    color: '#8fbfd0',
  },
  {
    id: 'macau',
    name: '澳门',
    tagline: '灯光和夜色都够浓，刚好给约会加一点戏。',
    mood: '夜色偏心',
    reason: '老街、夜景和酒店氛围很容易制造仪式感，适合想让约会更像一次正式出逃。',
    coupleTask:
      '找一条灯光好看的街，各自拍一张对方“最像恋爱电影主角”的照片。',
    color: '#d99ab1',
  },
  {
    id: 'hong-kong',
    name: '香港',
    tagline: '霓虹、海港和高楼之间，很容易想靠近一点。',
    mood: '城市心跳',
    reason: '白天逛街吃东西，晚上看海港夜景，节奏快但情绪浓，适合把约会感拉满。',
    coupleTask:
      '站在维港边各自说出一个“如果这趟只有一件必须实现的小事”，然后互相负责帮对方做到。',
    color: '#bf8bc8',
  },
]
