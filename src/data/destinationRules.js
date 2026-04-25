export const COLOR_PALETTE = [
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

export const CITY_SUFFIXES = [
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

export const TARGET_COPY_OPTION_COUNT = 5

export const PREFERENCE_CATEGORY_BY_CITY_PRESET = {
  city: 'city',
  coastal: 'water',
  island: 'water',
  canalGarden: 'culture',
  historic: 'culture',
  food: 'food',
  mountainGateway: 'mountain',
  karst: 'mountain',
  grassland: 'grassland',
  plateau: 'plateau',
  desertOasis: 'desert',
  snowNorth: 'city',
  modern: 'city',
  craftCulture: 'culture',
  river: 'water',
}

export const PREFERENCE_CATEGORY_BY_SCENIC_CATEGORY = {
  water: 'water',
  mountain: 'mountain',
  ancient: 'culture',
  grassland: 'grassland',
  desert: 'desert',
}

export const DEFAULT_SCENIC_CATEGORY = 'mountain'

export const SCENIC_CATEGORY_RULES = [
  {
    category: 'grassland',
    pattern: /(草原|湿地|林海|森林|牧场|花海)/,
  },
  {
    category: 'desert',
    pattern: /(沙|丹霞|雅丹|戈壁)/,
  },
  {
    category: 'water',
    pattern: /(湖|海|湾|港|江|河|泉|溪|洲|池|潭|瀑|岛)/,
  },
  {
    category: 'ancient',
    pattern: /(古城|古镇|故宫|宫|寺|塔|楼|街|巷|牌坊|关城|关|园|影城)/,
  },
]

export const CITY_PRESET_RULES = [
  {
    preset: 'grassland',
    names: ['呼伦贝尔', '锡林郭勒', '兴安', '乌兰察布', '巴彦淖尔', '鄂尔多斯', '阿拉善', '伊犁', '塔城', '阿勒泰'],
    provinceCodes: ['15'],
  },
  {
    preset: 'plateau',
    names: ['拉萨', '日喀则', '山南', '林芝', '昌都', '那曲', '阿里', '西宁', '海东', '海北', '黄南', '海南', '果洛', '玉树', '海西', '阿坝', '甘孜', '迪庆'],
    provinceCodes: ['54', '63'],
  },
  {
    preset: 'desertOasis',
    names: ['兰州', '嘉峪关', '金昌', '武威', '张掖', '酒泉', '敦煌', '庆阳', '定西', '陇南', '临夏', '甘南', '银川', '石嘴山', '吴忠', '固原', '中卫', '乌鲁木齐', '吐鲁番', '哈密', '克拉玛依', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏', '喀什', '和田'],
    provinceCodes: ['62', '64', '65'],
  },
  {
    preset: 'island',
    names: ['海口', '三亚', '三沙', '儋州', '琼海', '万宁', '文昌', '东方'],
    provinceCodes: ['46'],
  },
  {
    preset: 'coastal',
    names: ['秦皇岛', '唐山', '沧州', '大连', '丹东', '营口', '锦州', '盘锦', '葫芦岛', '连云港', '南通', '盐城', '宁波', '舟山', '温州', '台州', '福州', '厦门', '泉州', '漳州', '宁德', '青岛', '烟台', '威海', '日照', '东营', '潍坊', '滨州', '广州', '深圳', '珠海', '汕头', '汕尾', '阳江', '湛江', '茂名', '潮州', '揭阳', '防城港', '北海', '钦州'],
  },
  {
    preset: 'canalGarden',
    names: ['苏州', '无锡', '常州', '镇江', '扬州', '泰州', '杭州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '丽水', '黄山', '宣城', '池州'],
  },
  {
    preset: 'historic',
    names: ['石家庄', '邯郸', '保定', '承德', '太原', '大同', '晋中', '临汾', '运城', '沈阳', '南京', '徐州', '淮安', '宿迁', '合肥', '亳州', '安庆', '济南', '济宁', '泰安', '郑州', '开封', '洛阳', '安阳', '南阳', '商丘', '西安', '宝鸡', '咸阳', '渭南', '汉中', '榆林'],
  },
  {
    preset: 'craftCulture',
    names: ['景德镇', '泉州', '潮州', '佛山', '莆田', '三明', '龙岩', '南平', '上饶', '吉安', '赣州', '抚州', '黄冈'],
  },
  {
    preset: 'food',
    names: ['成都', '自贡', '乐山', '宜宾', '泸州', '德阳', '绵阳', '南充', '达州', '重庆', '长沙', '株洲', '湘潭', '衡阳', '常德', '益阳', '娄底', '武汉', '襄阳', '宜昌', '荆州', '广州', '佛山', '东莞', '中山', '江门', '柳州', '南宁', '贵阳', '遵义'],
  },
  {
    preset: 'mountainGateway',
    names: ['张家口', '忻州', '长治', '晋城', '白山', '通化', '黄山', '六安', '南平', '萍乡', '九江', '宜春', '上饶', '洛阳', '焦作', '平顶山', '十堰', '宜昌', '恩施', '张家界', '怀化', '湘西', '韶关', '河源', '清远', '桂林', '贺州', '百色', '河池', '六盘水', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南', '丽江', '大理', '保山', '楚雄', '怒江'],
  },
  {
    preset: 'karst',
    names: ['桂林', '柳州', '贺州', '百色', '河池', '崇左', '贵阳', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南', '恩施'],
    provinceCodes: ['45', '52'],
  },
  {
    preset: 'river',
    names: ['武汉', '黄石', '鄂州', '黄冈', '咸宁', '岳阳', '九江', '南昌', '芜湖', '马鞍山', '铜陵', '安庆', '池州', '宜宾', '泸州', '宜昌', '荆州', '益阳', '常德'],
  },
  {
    preset: 'snowNorth',
    names: ['哈尔滨', '齐齐哈尔', '牡丹江', '佳木斯', '大庆', '伊春', '鸡西', '鹤岗', '双鸭山', '七台河', '黑河', '绥化', '大兴安岭', '长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边', '沈阳', '鞍山', '抚顺', '本溪', '辽阳', '铁岭', '朝阳'],
    provinceCodes: ['21', '22', '23'],
  },
  {
    preset: 'modern',
    names: ['深圳', '广州', '东莞', '佛山', '珠海', '中山', '惠州', '杭州', '宁波', '苏州', '无锡', '南京', '合肥', '郑州', '武汉', '长沙'],
  },
]
