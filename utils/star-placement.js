// 紫微斗数安星诀算法
// 参考: https://ziwei.pro/learn/setup.html

// 天干地支对应
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行局对应
const WUXING_JU = {
  '木': 3, '金': 4, '水': 2, '火': 6, '土': 5
};

// 主星顺序
const MAJOR_STARS = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];

// 辅星
const AUXILIARY_STARS = ['左辅', '右弼', '文昌', '文曲', '天魁', '天钺', '禄存', '擎羊', '陀罗', '天马'];

// 杂曜
const MISCELLANEOUS_STARS = ['红鸾', '天喜', '龙池', '凤阁', '天官', '天福', '天虚', '天哭', '天伤', '天使', '天厨', '天才', '天寿'];

// 神煞
const SHENSHA_STARS = ['孤辰', '寡宿', '蜚廉', '破碎', '华盖', '咸池', '三台', '八座', '恩光', '天贵'];

// 四化星
const FOUR_TRANSFORMATIONS = ['化禄', '化权', '化科', '化忌'];

// 安星诀算法类
class StarPlacement {
  constructor(birthYear, birthMonth, birthDay, birthHour, gender, calendarType = 'lunar') {
    this.birthYear = birthYear;
    this.birthMonth = birthMonth;
    this.birthDay = birthDay;
    this.birthHour = birthHour;
    this.gender = gender;
    this.calendarType = calendarType;
    
    // 计算天干地支
    this.yearStem = this.getYearStem();
    this.yearBranch = this.getYearBranch();
    this.monthStem = this.getMonthStem();
    this.monthBranch = this.getMonthBranch();
    this.dayStem = this.getDayStem();
    this.dayBranch = this.getDayBranch();
    this.hourStem = this.getHourStem();
    this.hourBranch = this.getHourBranch();
    
    // 计算五行局
    this.wuxingJu = this.calculateWuxingJu();
    
    // 计算命宫身宫
    this.mingGong = this.calculateMingGong();
    this.shenGong = this.calculateShenGong();
    
    // 计算十二宫
    this.palaces = this.calculateTwelvePalaces();
  }

  // 获取年干
  getYearStem() {
    // 简化计算，实际应该根据具体年份计算
    const yearIndex = (this.birthYear - 1900) % 10;
    return HEAVENLY_STEMS[yearIndex];
  }

  // 获取年支
  getYearBranch() {
    const yearIndex = (this.birthYear - 1900) % 12;
    return EARTHLY_BRANCHES[yearIndex];
  }

  // 获取月干
  getMonthStem() {
    // 月干根据年干推算
    const yearStemIndex = HEAVENLY_STEMS.indexOf(this.yearStem);
    const monthIndex = (yearStemIndex * 2 + this.birthMonth - 1) % 10;
    return HEAVENLY_STEMS[monthIndex];
  }

  // 获取月支
  getMonthBranch() {
    const monthIndex = (this.birthMonth + 1) % 12;
    return EARTHLY_BRANCHES[monthIndex];
  }

  // 获取日干
  getDayStem() {
    // 简化计算，实际应该根据具体日期计算
    const dayIndex = (this.birthDay - 1) % 10;
    return HEAVENLY_STEMS[dayIndex];
  }

  // 获取日支
  getDayBranch() {
    const dayIndex = (this.birthDay - 1) % 12;
    return EARTHLY_BRANCHES[dayIndex];
  }

  // 获取时干
  getHourStem() {
    // 时干根据日干推算
    const dayStemIndex = HEAVENLY_STEMS.indexOf(this.dayStem);
    const hourIndex = (dayStemIndex * 2 + Math.floor(this.birthHour / 2)) % 10;
    return HEAVENLY_STEMS[hourIndex];
  }

  // 获取时支
  getHourBranch() {
    const hourIndex = Math.floor(this.birthHour / 2) % 12;
    return EARTHLY_BRANCHES[hourIndex];
  }

  // 计算五行局
  calculateWuxingJu() {
    // 根据安星诀：甲乙丙丁一到五，子丑午未一来数，寅卯申酉二上走，辰巳戌亥三为足
    const stemValue = Math.floor(HEAVENLY_STEMS.indexOf(this.yearStem) / 2) + 1;
    let branchValue = 1;
    
    if (['寅', '卯', '申', '酉'].includes(this.yearBranch)) {
      branchValue = 2;
    } else if (['辰', '巳', '戌', '亥'].includes(this.yearBranch)) {
      branchValue = 3;
    }
    
    const total = stemValue + branchValue;
    if (total > 5) {
      return total - 5;
    }
    return total;
  }

  // 计算命宫
  calculateMingGong() {
    // 寅起正月，顺数至生月，逆数生时为命宫
    let mingGongIndex = 2; // 寅宫起
    mingGongIndex = (mingGongIndex + this.birthMonth - 1) % 12;
    mingGongIndex = (mingGongIndex - Math.floor(this.birthHour / 2) + 12) % 12;
    return EARTHLY_BRANCHES[mingGongIndex];
  }

  // 计算身宫
  calculateShenGong() {
    // 寅起正月，顺数至生月，顺数生时为身宫
    let shenGongIndex = 2; // 寅宫起
    shenGongIndex = (shenGongIndex + this.birthMonth - 1) % 12;
    shenGongIndex = (shenGongIndex + Math.floor(this.birthHour / 2)) % 12;
    return EARTHLY_BRANCHES[shenGongIndex];
  }

  // 计算十二宫
  calculateTwelvePalaces() {
    const palaceNames = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '交友宫', '事业宫', '田宅宫', '福德宫', '父母宫'];
    const palaces = [];
    
    // 从命宫开始逆数
    let currentIndex = EARTHLY_BRANCHES.indexOf(this.mingGong);
    
    for (let i = 0; i < 12; i++) {
      const palaceIndex = (currentIndex - i + 12) % 12;
      palaces.push({
        name: palaceNames[i],
        branch: EARTHLY_BRANCHES[palaceIndex],
        index: palaceIndex
      });
    }
    
    return palaces;
  }

  // 安紫微星
  placeZiwei() {
    // 六五四三二，酉午亥辰丑，局数除日数，商数宫前走；若见数无余，便要起虎口，日数小于局，还直宫中守
    const ju = this.wuxingJu;
    const day = this.birthDay;
    
    let ziweiIndex;
    if (day >= ju) {
      const quotient = Math.floor(day / ju);
      ziweiIndex = (quotient - 1 + 12) % 12;
    } else {
      ziweiIndex = day - 1;
    }
    
    // 根据五行局调整起始宫位
    const juStartIndex = [8, 6, 3, 2, 1]; // 酉午亥辰丑
    const startIndex = juStartIndex[ju - 1] || 0;
    ziweiIndex = (startIndex + ziweiIndex) % 12;
    
    return EARTHLY_BRANCHES[ziweiIndex];
  }

  // 安天府星
  placeTianfu(ziweiIndex) {
    // 天府南斗令，常对紫微宫，丑卯相更迭，未酉互为根
    // 往来午与戍，蹀躞子和辰，已亥交驰骋，同位在寅申
    const tianfuIndex = (ziweiIndex + 6) % 12; // 对宫
    return EARTHLY_BRANCHES[tianfuIndex];
  }

  // 安主星
  placeMajorStars() {
    const ziweiIndex = EARTHLY_BRANCHES.indexOf(this.placeZiwei());
    const tianfuIndex = EARTHLY_BRANCHES.indexOf(this.placeTianfu(ziweiIndex));
    
    const stars = {};
    
    // 紫微星系：紫微逆去天机星，隔一太阳武曲辰，连接天同空二宫，廉贞居处方是真
    let currentIndex = ziweiIndex;
    stars[EARTHLY_BRANCHES[currentIndex]] = ['紫微'];
    
    currentIndex = (currentIndex - 1 + 12) % 12;
    stars[EARTHLY_BRANCHES[currentIndex]] = ['天机'];
    
    currentIndex = (currentIndex - 2 + 12) % 12;
    stars[EARTHLY_BRANCHES[currentIndex]] = ['太阳'];
    
    currentIndex = (currentIndex - 1 + 12) % 12;
    stars[EARTHLY_BRANCHES[currentIndex]] = ['武曲'];
    
    currentIndex = (currentIndex - 2 + 12) % 12;
    stars[EARTHLY_BRANCHES[currentIndex]] = ['天同'];
    
    currentIndex = (currentIndex - 1 + 12) % 12;
    stars[EARTHLY_BRANCHES[currentIndex]] = ['廉贞'];
    
    // 天府星系：天府顺行有太阴，贪狼而后巨门临，随来天相天梁继，七杀空三是破军
    currentIndex = tianfuIndex;
    if (!stars[EARTHLY_BRANCHES[currentIndex]]) {
      stars[EARTHLY_BRANCHES[currentIndex]] = [];
    }
    stars[EARTHLY_BRANCHES[currentIndex]].push('天府');
    
    currentIndex = (currentIndex + 1) % 12;
    if (!stars[EARTHLY_BRANCHES[currentIndex]]) {
      stars[EARTHLY_BRANCHES[currentIndex]] = [];
    }
    stars[EARTHLY_BRANCHES[currentIndex]].push('太阴');
    
    currentIndex = (currentIndex + 1) % 12;
    if (!stars[EARTHLY_BRANCHES[currentIndex]]) {
      stars[EARTHLY_BRANCHES[currentIndex]] = [];
    }
    stars[EARTHLY_BRANCHES[currentIndex]].push('贪狼');
    
    currentIndex = (currentIndex + 1) % 12;
    if (!stars[EARTHLY_BRANCHES[currentIndex]]) {
      stars[EARTHLY_BRANCHES[currentIndex]] = [];
    }
    stars[EARTHLY_BRANCHES[currentIndex]].push('巨门');
    
    currentIndex = (currentIndex + 1) % 12;
    if (!stars[EARTHLY_BRANCHES[currentIndex]]) {
      stars[EARTHLY_BRANCHES[currentIndex]] = [];
    }
    stars[EARTHLY_BRANCHES[currentIndex]].push('天相');
    
    currentIndex = (currentIndex + 1) % 12;
    if (!stars[EARTHLY_BRANCHES[currentIndex]]) {
      stars[EARTHLY_BRANCHES[currentIndex]] = [];
    }
    stars[EARTHLY_BRANCHES[currentIndex]].push('天梁');
    
    currentIndex = (currentIndex + 2) % 12;
    if (!stars[EARTHLY_BRANCHES[currentIndex]]) {
      stars[EARTHLY_BRANCHES[currentIndex]] = [];
    }
    stars[EARTHLY_BRANCHES[currentIndex]].push('七杀');
    
    currentIndex = (currentIndex + 1) % 12;
    if (!stars[EARTHLY_BRANCHES[currentIndex]]) {
      stars[EARTHLY_BRANCHES[currentIndex]] = [];
    }
    stars[EARTHLY_BRANCHES[currentIndex]].push('破军');
    
    return stars;
  }

  // 安辅星
  placeAuxiliaryStars() {
    const stars = {};
    
    // 左辅右弼：根据生年地支
    const leftRightIndex = this.getLeftRightIndex();
    stars[EARTHLY_BRANCHES[leftRightIndex]] = ['左辅'];
    stars[EARTHLY_BRANCHES[(leftRightIndex + 6) % 12]] = ['右弼'];
    
    // 文昌文曲：根据生时
    const wenIndex = this.getWenIndex();
    stars[EARTHLY_BRANCHES[wenIndex]] = ['文昌'];
    stars[EARTHLY_BRANCHES[(wenIndex + 6) % 12]] = ['文曲'];
    
    // 天魁天钺：根据生年
    const kuiIndex = this.getKuiIndex();
    stars[EARTHLY_BRANCHES[kuiIndex]] = ['天魁'];
    stars[EARTHLY_BRANCHES[(kuiIndex + 6) % 12]] = ['天钺'];
    
    // 禄存：根据生年地支
    const luIndex = this.getLuIndex();
    stars[EARTHLY_BRANCHES[luIndex]] = ['禄存'];
    
    // 擎羊陀罗：禄存前后
    stars[EARTHLY_BRANCHES[(luIndex + 1) % 12]] = ['擎羊'];
    stars[EARTHLY_BRANCHES[(luIndex - 1 + 12) % 12]] = ['陀罗'];
    
    // 天马：根据生年地支
    const maIndex = this.getMaIndex();
    stars[EARTHLY_BRANCHES[maIndex]] = ['天马'];
    
    return stars;
  }

  // 获取左辅位置
  getLeftRightIndex() {
    const branchIndex = EARTHLY_BRANCHES.indexOf(this.yearBranch);
    const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return positions[branchIndex];
  }

  // 获取文昌位置
  getWenIndex() {
    const hourIndex = Math.floor(this.birthHour / 2);
    return hourIndex;
  }

  // 获取天魁位置
  getKuiIndex() {
    const yearStemIndex = HEAVENLY_STEMS.indexOf(this.yearStem);
    const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return positions[yearStemIndex % 12];
  }

  // 获取禄存位置
  getLuIndex() {
    const yearBranchIndex = EARTHLY_BRANCHES.indexOf(this.yearBranch);
    const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return positions[yearBranchIndex];
  }

  // 获取天马位置
  getMaIndex() {
    const yearBranchIndex = EARTHLY_BRANCHES.indexOf(this.yearBranch);
    const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return positions[yearBranchIndex];
  }

  // 安四化星
  placeFourTransformations() {
    const transformations = {};
    
    // 根据年干确定四化
    const yearStem = this.yearStem;
    let huaLu, huaQuan, huaKe, huaJi;
    
    if (['甲', '己'].includes(yearStem)) {
      huaLu = '廉贞'; huaQuan = '破军'; huaKe = '武曲'; huaJi = '贪狼';
    } else if (['乙', '庚'].includes(yearStem)) {
      huaLu = '天机'; huaQuan = '天梁'; huaKe = '紫微'; huaJi = '太阴';
    } else if (['丙', '辛'].includes(yearStem)) {
      huaLu = '天同'; huaQuan = '天机'; huaKe = '文昌'; huaJi = '文曲';
    } else if (['丁', '壬'].includes(yearStem)) {
      huaLu = '太阴'; huaQuan = '天同'; huaKe = '左辅'; huaJi = '右弼';
    } else if (['戊', '癸'].includes(yearStem)) {
      huaLu = '贪狼'; huaQuan = '太阴'; huaKe = '右弼'; huaJi = '左辅';
    }
    
    // 找到这些星所在的宫位，添加四化标记
    const majorStars = this.placeMajorStars();
    const auxiliaryStars = this.placeAuxiliaryStars();
    
    // 合并所有星曜
    const allStars = { ...majorStars, ...auxiliaryStars };
    
    for (const [branch, stars] of Object.entries(allStars)) {
      if (stars.includes(huaLu)) {
        if (!transformations[branch]) transformations[branch] = [];
        transformations[branch].push('化禄');
      }
      if (stars.includes(huaQuan)) {
        if (!transformations[branch]) transformations[branch] = [];
        transformations[branch].push('化权');
      }
      if (stars.includes(huaKe)) {
        if (!transformations[branch]) transformations[branch] = [];
        transformations[branch].push('化科');
      }
      if (stars.includes(huaJi)) {
        if (!transformations[branch]) transformations[branch] = [];
        transformations[branch].push('化忌');
      }
    }
    
    return transformations;
  }

  // 安杂曜和神煞
  placeMiscellaneousAndShensa() {
    const stars = {};
    
    // 红鸾天喜：根据生年地支
    const hongluanIndex = this.getHongluanIndex();
    stars[EARTHLY_BRANCHES[hongluanIndex]] = ['红鸾'];
    stars[EARTHLY_BRANCHES[(hongluanIndex + 6) % 12]] = ['天喜'];
    
    // 龙池凤阁：根据生月
    const longchiIndex = this.getLongchiIndex();
    stars[EARTHLY_BRANCHES[longchiIndex]] = ['龙池'];
    stars[EARTHLY_BRANCHES[(longchiIndex + 6) % 12]] = ['凤阁'];
    
    // 天官天福：根据生年
    const tianguanIndex = this.getTianguanIndex();
    stars[EARTHLY_BRANCHES[tianguanIndex]] = ['天官'];
    stars[EARTHLY_BRANCHES[(tianguanIndex + 6) % 12]] = ['天福'];
    
    // 天虚天哭：根据生年地支
    const tianxuIndex = this.getTianxuIndex();
    stars[EARTHLY_BRANCHES[tianxuIndex]] = ['天虚'];
    stars[EARTHLY_BRANCHES[(tianxuIndex + 6) % 12]] = ['天哭'];
    
    // 天伤天使：固定位置
    const tianshangIndex = this.getTianshangIndex();
    const tianshiIndex = this.getTianshiIndex();
    stars[EARTHLY_BRANCHES[tianshangIndex]] = ['天伤'];
    stars[EARTHLY_BRANCHES[tianshiIndex]] = ['天使'];
    
    // 天厨：根据生年天干
    const tianchuIndex = this.getTianchuIndex();
    stars[EARTHLY_BRANCHES[tianchuIndex]] = ['天厨'];
    
    // 天才天寿：根据生年地支
    const tiancaiIndex = this.getTiancaiIndex();
    const tianshouIndex = this.getTianshouIndex();
    stars[EARTHLY_BRANCHES[tiancaiIndex]] = ['天才'];
    stars[EARTHLY_BRANCHES[tianshouIndex]] = ['天寿'];
    
    // 孤辰寡宿：根据生年地支
    const guchenIndex = this.getGuchenIndex();
    stars[EARTHLY_BRANCHES[guchenIndex]] = ['孤辰'];
    stars[EARTHLY_BRANCHES[(guchenIndex + 6) % 12]] = ['寡宿'];
    
    // 蜚廉：根据生年地支
    const feilianIndex = this.getFeilianIndex();
    stars[EARTHLY_BRANCHES[feilianIndex]] = ['蜚廉'];
    
    // 破碎：根据生年地支
    const posuiIndex = this.getPosuiIndex();
    stars[EARTHLY_BRANCHES[posuiIndex]] = ['破碎'];
    
    // 华盖：根据生年地支
    const huagaiIndex = this.getHuagaiIndex();
    stars[EARTHLY_BRANCHES[huagaiIndex]] = ['华盖'];
    
    // 咸池：根据生年地支
    const xianchiIndex = this.getXianchiIndex();
    stars[EARTHLY_BRANCHES[xianchiIndex]] = ['咸池'];
    
    // 三台八座：根据生日
    const santaiIndex = this.getSantaiIndex();
    const bazuoIndex = this.getBazuoIndex();
    stars[EARTHLY_BRANCHES[santaiIndex]] = ['三台'];
    stars[EARTHLY_BRANCHES[bazuoIndex]] = ['八座'];
    
    // 恩光天贵：根据生日
    const enguangIndex = this.getEnguangIndex();
    const tianguiIndex = this.getTianguiIndex();
    stars[EARTHLY_BRANCHES[enguangIndex]] = ['恩光'];
    stars[EARTHLY_BRANCHES[tianguiIndex]] = ['天贵'];
    
    return stars;
  }

  // 获取红鸾位置
  getHongluanIndex() {
    const yearBranchIndex = EARTHLY_BRANCHES.indexOf(this.yearBranch);
    return yearBranchIndex;
  }

  // 获取龙池位置
  getLongchiIndex() {
    const monthIndex = this.birthMonth - 1;
    return monthIndex;
  }

  // 获取天官位置
  getTianguanIndex() {
    const yearStemIndex = HEAVENLY_STEMS.indexOf(this.yearStem);
    return yearStemIndex % 12;
  }

  // 获取天虚位置
  getTianxuIndex() {
    const yearBranchIndex = EARTHLY_BRANCHES.indexOf(this.yearBranch);
    return yearBranchIndex;
  }

  // 获取天伤位置（仆役宫）
  getTianshangIndex() {
    // 天伤在仆役宫，需要根据命宫计算
    const mingGongIndex = EARTHLY_BRANCHES.indexOf(this.mingGong);
    return (mingGongIndex + 7) % 12; // 仆役宫在命宫后7位
  }

  // 获取天使位置（疾厄宫）
  getTianshiIndex() {
    // 天使在疾厄宫，需要根据命宫计算
    const mingGongIndex = EARTHLY_BRANCHES.indexOf(this.mingGong);
    return (mingGongIndex + 5) % 12; // 疾厄宫在命宫后5位
  }

  // 获取天厨位置
  getTianchuIndex() {
    const yearStem = this.yearStem;
    const tianchuMap = {
      '甲': 5, '乙': 1, '丙': 0, '丁': 5, '戊': 1,
      '己': 8, '庚': 2, '辛': 1, '壬': 9, '癸': 11
    };
    return tianchuMap[yearStem] || 0;
  }

  // 获取天才位置
  getTiancaiIndex() {
    // 天才由命宫起子，顺行至本生年支安之
    const mingGongIndex = EARTHLY_BRANCHES.indexOf(this.mingGong);
    const yearBranchIndex = EARTHLY_BRANCHES.indexOf(this.yearBranch);
    return (mingGongIndex + yearBranchIndex) % 12;
  }

  // 获取天寿位置
  getTianshouIndex() {
    // 天寿由身宫起子，顺行至本生年支安之
    const shenGongIndex = EARTHLY_BRANCHES.indexOf(this.shenGong);
    const yearBranchIndex = EARTHLY_BRANCHES.indexOf(this.yearBranch);
    return (shenGongIndex + yearBranchIndex) % 12;
  }

  // 获取孤辰位置
  getGuchenIndex() {
    const yearBranch = this.yearBranch;
    if (['子', '丑', '寅'].includes(yearBranch)) {
      return 8; // 申宫
    } else if (['卯', '辰', '巳'].includes(yearBranch)) {
      return 5; // 巳宫
    } else if (['午', '未', '申'].includes(yearBranch)) {
      return 2; // 寅宫
    } else {
      return 11; // 亥宫
    }
  }

  // 获取蜚廉位置
  getFeilianIndex() {
    const yearBranch = this.yearBranch;
    if (['子', '丑', '寅'].includes(yearBranch)) {
      return 8; // 申宫
    } else if (['卯', '辰', '巳'].includes(yearBranch)) {
      return 5; // 巳宫
    } else if (['午', '未', '申'].includes(yearBranch)) {
      return 2; // 寅宫
    } else {
      return 11; // 亥宫
    }
  }

  // 获取破碎位置
  getPosuiIndex() {
    const yearBranch = this.yearBranch;
    if (['子', '午', '卯', '酉'].includes(yearBranch)) {
      return 5; // 巳宫
    } else if (['寅', '申', '巳', '亥'].includes(yearBranch)) {
      return 9; // 酉宫
    } else {
      return 1; // 丑宫
    }
  }

  // 获取华盖位置
  getHuagaiIndex() {
    const yearBranch = this.yearBranch;
    if (['子', '辰', '申'].includes(yearBranch)) {
      return 2; // 辰宫
    } else if (['丑', '巳', '酉'].includes(yearBranch)) {
      return 1; // 丑宫
    } else if (['寅', '午', '戌'].includes(yearBranch)) {
      return 10; // 戌宫
    } else {
      return 5; // 未宫
    }
  }

  // 获取咸池位置
  getXianchiIndex() {
    const yearBranch = this.yearBranch;
    if (['子', '辰', '申'].includes(yearBranch)) {
      return 9; // 酉宫
    } else if (['丑', '巳', '酉'].includes(yearBranch)) {
      return 6; // 午宫
    } else if (['寅', '午', '戌'].includes(yearBranch)) {
      return 3; // 卯宫
    } else {
      return 0; // 子宫
    }
  }

  // 获取三台位置
  getSantaiIndex() {
    // 由左辅之宫位起初一，顺行至生日安三台
    const leftFuIndex = this.getLeftRightIndex();
    const dayIndex = (this.birthDay - 1) % 12;
    return (leftFuIndex + dayIndex) % 12;
  }

  // 获取八座位置
  getBazuoIndex() {
    // 由右弼之宫位起初一，逆行至生日安八座
    const rightBiIndex = (this.getLeftRightIndex() + 6) % 12;
    const dayIndex = (this.birthDay - 1) % 12;
    return (rightBiIndex - dayIndex + 12) % 12;
  }

  // 获取恩光位置
  getEnguangIndex() {
    // 由文昌之宫位起初一，顺行至生日再退一步起恩光
    const wenchangIndex = this.getWenIndex();
    const dayIndex = (this.birthDay - 1) % 12;
    return (wenchangIndex + dayIndex - 1 + 12) % 12;
  }

  // 获取天贵位置
  getTianguiIndex() {
    // 由文曲之宫位起初一，顺行至生日再退一步起天贵
    const wenquIndex = (this.getWenIndex() + 6) % 12;
    const dayIndex = (this.birthDay - 1) % 12;
    return (wenquIndex + dayIndex - 1 + 12) % 12;
  }

  // 生成完整的排盘数据
  generateChart() {
    const majorStars = this.placeMajorStars();
    const auxiliaryStars = this.placeAuxiliaryStars();
    const fourTransformations = this.placeFourTransformations();
    const miscellaneousAndShensha = this.placeMiscellaneousAndShensa();
    
    const chartData = [];
    
    // 计算每宫宫干：命宫起年干，顺行十二宫，十天干循环
    const yearStemIndex = HEAVENLY_STEMS.indexOf(this.yearStem);
    const mingIndex = EARTHLY_BRANCHES.indexOf(this.mingGong);
    
    for (let i = 0; i < this.palaces.length; i++) {
      const palace = this.palaces[i];
      const branch = palace.branch;
      
      const stars = [];
      const starNames = [];
      
      // 添加主星
      if (majorStars[branch]) {
        stars.push(...majorStars[branch]);
        starNames.push(...majorStars[branch]);
      }
      
      // 添加辅星
      if (auxiliaryStars[branch]) {
        stars.push(...auxiliaryStars[branch]);
        starNames.push(...auxiliaryStars[branch]);
      }
      
      // 添加四化
      if (fourTransformations[branch]) {
        stars.push(...fourTransformations[branch]);
        starNames.push(...fourTransformations[branch]);
      }

      // 添加杂曜和神煞
      if (miscellaneousAndShensha[branch]) {
        stars.push(...miscellaneousAndShensha[branch]);
        starNames.push(...miscellaneousAndShensha[branch]);
      }
      
      // 计算当前宫相对命宫的顺行位移
      const branchIndex = EARTHLY_BRANCHES.indexOf(branch);
      const offset = (branchIndex - mingIndex + 12) % 12;
      // 十天干循环取值
      const heavenlyStem = (yearStemIndex >= 0) ? HEAVENLY_STEMS[(yearStemIndex + offset) % 10] : '';
      
      chartData.push({
        name: palace.name,
        branch: palace.branch,
        heavenlyStem: heavenlyStem,
        stars: stars.join(' '),
        starNames: starNames,
        index: palace.index
      });
    }
    
    return {
      palaces: chartData,
      mingGong: this.mingGong,
      shenGong: this.shenGong,
      wuxingJu: this.wuxingJu,
      yearStem: this.yearStem,
      yearBranch: this.yearBranch,
      monthStem: this.monthStem,
      monthBranch: this.monthBranch,
      dayStem: this.dayStem,
      dayBranch: this.dayBranch,
      hourStem: this.hourStem,
      hourBranch: this.hourBranch
    };
  }
}

module.exports = {
  StarPlacement,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  MAJOR_STARS,
  AUXILIARY_STARS,
  MISCELLANEOUS_STARS,
  SHENSHA_STARS,
  FOUR_TRANSFORMATIONS
}; 