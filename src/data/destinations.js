import chinaCities from '@province-city-china/city'

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

export const WHEEL_DESTINATION_COUNT = 12

const COLOR_PALETTE = [
  '#f3b3a4',
  '#ffb08f',
  '#8dc6d8',
  '#dcb799',
  '#9fcbad',
  '#f08b75',
  '#c1d9c1',
  '#ff9e7a',
  '#9ac6aa',
  '#8fbfd0',
  '#d99ab1',
  '#bf8bc8',
]

const CITY_SUFFIXES = [
  '蒙古族藏族自治州',
  '藏族羌族自治州',
  '哈尼族彝族自治州',
  '土家族苗族自治州',
  '苗族侗族自治州',
  '布依族苗族自治州',
  '傣族景颇族自治州',
  '朝鲜族自治州',
  '哈萨克自治州',
  '柯尔克孜自治州',
  '蒙古自治州',
  '回族自治州',
  '白族自治州',
  '彝族自治州',
  '傣族自治州',
  '藏族自治州',
  '自治州',
  '地区',
  '盟',
  '市',
]

const CATEGORY_PRESETS = {
  city: {
    moods: ['城市漫游', '夜色约会', '街巷散步', '周末小逃'],
    taglines: [
      '{name} 适合把路线走松一点，把相处留多一点。',
      '在 {name}，边走边聊往往比赶路更让人记得住。',
      '{name} 这种目的地，最适合把白天交给散步，把晚上交给夜色。',
    ],
    reasons: [
      '这里不需要高密度打卡，更适合两个人边走边吃、顺手拍照，把旅行过成一次认真约会。',
      '把 {name} 当作一趟慢节奏短逃，会比赶行程更舒服，也更容易留出属于彼此的时间。',
    ],
    tasks: [
      '一起临时拐进一条看起来顺眼的小路，轮流说出“这趟真来最想做的第一件小事”。',
      '给对方拍一张最像旅行搭子的照片，并替这张照片取一个只有你们懂的名字。',
    ],
  },
  water: {
    moods: ['湖海放空', '海风靠近', '岸边微醺', '轻盐治愈'],
    taglines: [
      '{name} 自带能把心跳和海风放在同一节奏里的气氛。',
      '{name} 最适合把聊天速度放慢，让风景替你们做背景音。',
      '{name} 这种水边目的地，很容易把普通散步变成一场约会。',
    ],
    reasons: [
      '靠近水的地方总会让人自然放松，适合两个人少一点安排，多一点并肩发呆的留白。',
      '把 {name} 留给晨光、晚风和岸边散步，通常就足够构成一趟很有记忆点的小旅行。',
    ],
    tasks: [
      '找一处能看见水面的地方坐两分钟，然后轮流说一句“如果真的来，我最想和你完成什么”。',
      '一起拍一张带风景和带彼此的合照，并约定下次来要复刻同一个机位。',
    ],
  },
  mountain: {
    moods: ['山野留白', '高处心动', '云线出走', '风景慢热'],
    taglines: [
      '{name} 适合把行程拉开一点，把情绪放大一点。',
      '{name} 会把旅行从“去哪里”变成“和谁一起看风景”。',
      '{name} 这种目的地，最适合认真并肩走一段路。',
    ],
    reasons: [
      '山线和高处视野自带仪式感，适合把日常抛远一点，把相处放近一点。',
      '把 {name} 当成一次短暂逃离，会比单纯打卡更有画面，也更适合两个人一起慢下来。',
    ],
    tasks: [
      '在观景点轮流说出一句“我希望以后还能和你一起去到的地方”。',
      '一起挑一段风景最好的路并肩走完，路上谁都不许先低头看手机。',
    ],
  },
  ancient: {
    moods: ['古城夜话', '人文约会', '旧巷慢逛', '灯火心事'],
    taglines: [
      '{name} 这种地方，越慢越能把约会感走出来。',
      '{name} 很适合把白天留给街巷，把晚上留给灯火和心事。',
      '{name} 自带一点旧时光质感，适合两个人慢慢靠近。',
    ],
    reasons: [
      '老街、古城和人文景点不需要太赶，更适合边走边聊，让旅行本身变成一场共同回忆。',
      '把 {name} 安排成一趟低强度约会，会比密集打卡更自然，也更容易留下属于你们的片段。',
    ],
    tasks: [
      '在一条最有氛围的街上互相拍一张“像电影剧照”的照片，再给它取一个片名。',
      '挑一盏你们都喜欢的灯或一段街景，轮流说出“如果以后再来，我想和你怎样重走这段路”。',
    ],
  },
  grassland: {
    moods: ['旷野并肩', '草原撒野', '远方呼吸', '风里自由'],
    taglines: [
      '{name} 适合把心事吹散，把靠近留在风里。',
      '{name} 这种开阔目的地，很容易让人重新想起“出走”的感觉。',
      '{name} 最适合两个人一起把视线放远一点。',
    ],
    reasons: [
      '开阔地貌能把人从城市节奏里拔出来，很适合把旅行过成一场真正放松的短逃。',
      '在 {name} 这种旷野感目的地，少一点计划反而更好，留白本身就是旅程的一部分。',
    ],
    tasks: [
      '一起站在风最大的地方拍一段短视频，录下此刻最想对彼此说的一句话。',
      '轮流说出一个“如果在这里待上一整天，我最想和你做什么”的答案。',
    ],
  },
  desert: {
    moods: ['大地留白', '落日电影感', '荒野出走', '风沙浪漫'],
    taglines: [
      '{name} 自带一种会让人想认真看落日的电影感。',
      '{name} 适合把白天交给路途，把傍晚交给并肩站着的那几分钟。',
      '{name} 这种目的地，很容易把一次普通出游变成带后劲的记忆。',
    ],
    reasons: [
      '大地肌理和落日场景会天然放大仪式感，适合两个人一起经历一点和日常完全不同的风景。',
      '把 {name} 放进旅行清单，不一定是为了赶景点，而是为了认真共享一段很有画面感的时间。',
    ],
    tasks: [
      '等到光线最好的那一刻，给彼此拍一张“只看背影也认得出来”的照片。',
      '一起选一个落日机位站定，轮流说一句“这趟如果成行，我最想记住的会是什么”。',
    ],
  },
}

const SCENIC_SPOTS_BY_REGION = {
  北京: ['故宫', '颐和园', '八达岭长城', '天坛', '什刹海'],
  天津: ['五大道', '意式风情区', '天津之眼', '古文化街', '东疆亲海公园'],
  上海: ['外滩', '豫园', '上海迪士尼度假区', '武康路', '朱家角古镇'],
  重庆: ['洪崖洞', '磁器口古镇', '南山一棵树', '武隆喀斯特', '长江索道'],
  河北: ['山海关', '北戴河', '承德避暑山庄', '白石山', '金山岭长城'],
  山西: ['平遥古城', '云冈石窟', '五台山', '悬空寺', '壶口瀑布'],
  辽宁: ['沈阳故宫', '星海广场', '老虎滩海洋公园', '本溪水洞', '盘锦红海滩'],
  吉林: ['长白山', '雾凇岛', '净月潭', '长影世纪城', '伪满皇宫'],
  黑龙江: ['冰雪大世界', '中央大街', '镜泊湖', '雪乡', '五大连池'],
  江苏: ['拙政园', '周庄古镇', '鼋头渚', '夫子庙', '灵山大佛'],
  浙江: ['西湖', '乌镇', '普陀山', '神仙居', '雁荡山'],
  安徽: ['黄山', '宏村', '九华山', '天柱山', '徽州古城'],
  福建: ['鼓浪屿', '武夷山', '福建土楼', '平潭岛', '东山岛'],
  江西: ['庐山', '婺源', '滕王阁', '三清山', '望仙谷'],
  山东: ['泰山', '崂山', '蓬莱阁', '台儿庄古城', '三孔景区'],
  河南: ['龙门石窟', '少林寺', '老君山', '清明上河园', '云台山'],
  湖北: ['黄鹤楼', '东湖', '武当山', '恩施大峡谷', '神农架'],
  湖南: ['张家界国家森林公园', '凤凰古城', '岳麓山', '南岳衡山', '郴州小东江'],
  广东: ['广州塔', '长隆旅游度假区', '丹霞山', '巽寮湾', '南澳岛'],
  海南: ['亚龙湾', '蜈支洲岛', '天涯海角', '分界洲岛', '呀诺达雨林'],
  四川: ['九寨沟', '峨眉山', '稻城亚丁', '四姑娘山', '青城山'],
  贵州: ['黄果树瀑布', '西江千户苗寨', '荔波小七孔', '梵净山', '镇远古城'],
  云南: ['丽江古城', '玉龙雪山', '洱海', '香格里拉', '泸沽湖'],
  陕西: ['秦始皇兵马俑', '华山', '大雁塔', '华清宫', '法门寺'],
  甘肃: ['莫高窟', '鸣沙山月牙泉', '张掖七彩丹霞', '嘉峪关关城', '扎尕那'],
  青海: ['青海湖', '茶卡盐湖', '塔尔寺', '祁连草原', '翡翠湖'],
  台湾: ['日月潭', '阿里山', '垦丁', '太鲁阁', '九份'],
  内蒙古: ['呼伦贝尔大草原', '阿尔山', '响沙湾', '成吉思汗陵', '满洲里'],
  广西: ['桂林漓江', '阳朔西街', '涠洲岛', '龙脊梯田', '德天瀑布'],
  西藏: ['布达拉宫', '纳木错', '羊卓雍措', '雅鲁藏布大峡谷', '珠峰大本营'],
  宁夏: ['沙坡头', '沙湖', '镇北堡西部影城', '西夏王陵', '贺兰山岩画'],
  新疆: ['喀纳斯', '赛里木湖', '那拉提草原', '禾木', '天山天池'],
  香港: ['维多利亚港', '太平山顶', '香港迪士尼乐园', '南丫岛', '昂坪360'],
  澳门: ['大三巴牌坊', '官也街', '澳门塔', '路环', '威尼斯人'],
}

function hashString(value) {
  return [...value].reduce((hash, char) => hash + char.charCodeAt(0), 0)
}

function pickBySeed(items, seed) {
  return items[seed % items.length]
}

function fillTemplate(template, name) {
  return template.replaceAll('{name}', name)
}

function shortenCityName(name) {
  let nextName = name

  for (const suffix of CITY_SUFFIXES) {
    if (nextName.endsWith(suffix)) {
      nextName = nextName.slice(0, -suffix.length)
      break
    }
  }

  return nextName
}

function detectScenicCategory(name) {
  if (/(草原|湿地|林海|森林|牧场|花海)/.test(name)) {
    return 'grassland'
  }

  if (/(沙|丹霞|雅丹|戈壁)/.test(name)) {
    return 'desert'
  }

  if (/(湖|海|湾|港|江|河|泉|溪|洲|池|潭|瀑|岛)/.test(name)) {
    return 'water'
  }

  if (/(古城|古镇|故宫|宫|寺|塔|楼|街|巷|牌坊|关城|关|园|影城)/.test(name)) {
    return 'ancient'
  }

  return 'mountain'
}

function createDestination({ id, name, source }) {
  const seed = hashString(id)
  const destinationName = source === 'city' ? shortenCityName(name) : name
  const category = source === 'city' ? 'city' : detectScenicCategory(name)
  const preset = CATEGORY_PRESETS[category]

  return {
    id,
    name: destinationName,
    tagline: fillTemplate(pickBySeed(preset.taglines, seed + 1), destinationName),
    mood: pickBySeed(preset.moods, seed + 2),
    reason: fillTemplate(pickBySeed(preset.reasons, seed + 3), destinationName),
    coupleTask: fillTemplate(pickBySeed(preset.tasks, seed + 4), destinationName),
    color: pickBySeed(COLOR_PALETTE, seed + 5),
  }
}

const cityDestinations = chinaCities
  .filter((city) => !/行政区划/.test(city.name))
  .map((city) =>
    createDestination({
      id: `city-${city.code}`,
      name: city.name,
      source: 'city',
    }),
  )

const scenicDestinations = Object.entries(SCENIC_SPOTS_BY_REGION).flatMap(
  ([region, spots], regionIndex) =>
    spots.map((spot, spotIndex) =>
      createDestination({
        id: `spot-${regionIndex}-${spotIndex}-${hashString(`${region}-${spot}`)}`,
        name: spot,
        source: 'spot',
      }),
    ),
)

/**
 * @type {Destination[]}
 */
export const DEFAULT_DESTINATION_POOL = [...cityDestinations, ...scenicDestinations]

export const DEFAULT_DESTINATIONS = DEFAULT_DESTINATION_POOL
