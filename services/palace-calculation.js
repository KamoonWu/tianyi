/**
 * 紫微斗数宫位计算服务
 * 根据用户的八字进行紫微斗数排盘，计算命宫身宫位置和十二宫排列
 */

// 地支顺序（十二地支）
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 十二宫名称（固定顺序）- 紫微斗数标准顺序
const PALACE_NAMES = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'];

// 时辰对应表
const HOUR_TO_BRANCH_MAP = {
  23: '子', 0: '子', 1: '子',
  2: '丑', 3: '丑',
  4: '寅', 5: '寅',
  6: '卯', 7: '卯', 
  8: '辰', 9: '辰',
  10: '巳', 11: '巳',
  12: '午', 13: '午',
  14: '未', 15: '未',
  16: '申', 17: '申',
  18: '酉', 19: '酉',
  20: '戌', 21: '戌',
  22: '亥'
};

// 天干顺序
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/**
 * 根据小时数获取时辰地支
 * @param {number} hour - 小时数(0-23)
 * @returns {string} - 时辰地支
 */
function getHourBranch(hour) {
  const normalizedHour = ((hour % 24) + 24) % 24;
  return HOUR_TO_BRANCH_MAP[normalizedHour] || '子';
}

/**
 * 计算命宫地支位置
 * 安命宫口诀：寅起正月，顺数至生月。从生月宫位起子时，逆数至生时。
 * @param {number} lunarMonth - 农历月份(1-12)
 * @param {string} birthHourBranch - 出生时辰地支
 * @returns {string} - 命宫地支
 */
function calculateMingGongBranch(lunarMonth, birthHourBranch) {
  console.log(`🔮 开始计算命宫：农历${lunarMonth}月，${birthHourBranch}时`);
  
  // 步骤1：寅起正月，顺数至生月
  // 寅对应正月（索引2），计算月支索引
  const monthBranchIndex = (2 + lunarMonth - 1) % 12; // 从寅宫开始，正月=寅
  const monthBranch = EARTHLY_BRANCHES[monthBranchIndex];
  console.log(`📅 农历${lunarMonth}月对应地支：${monthBranch}（索引${monthBranchIndex}）`);
  
  // 步骤2：从生月宫位起子时，逆数至生时
  // 时辰顺序：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥
  const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const hourPosition = hourOrder.indexOf(birthHourBranch);
  
  if (hourPosition === -1) {
    console.error('❌ 无效的出生时辰地支:', birthHourBranch);
    return '寅'; // 默认返回寅
  }
  
  // 从月支位置逆时针走hourPosition步
  // 逆时针方向，所以是减法
  let mingGongIndex = (monthBranchIndex - hourPosition + 12) % 12;
  
  const mingGongBranch = EARTHLY_BRANCHES[mingGongIndex];
  console.log(`🎯 命宫计算：月支${monthBranch}(${monthBranchIndex}) - ${birthHourBranch}时位置${hourPosition} = ${mingGongBranch}宫（索引${mingGongIndex}）`);
  
  return mingGongBranch;
}

/**
 * 计算身宫地支位置
 * 安身宫口诀：寅起正月，顺数至生月。从生月宫位起子时，顺数至生时。
 * @param {number} lunarMonth - 农历月份(1-12)
 * @param {string} birthHourBranch - 出生时辰地支
 * @returns {string} - 身宫地支
 */
function calculateShenGongBranch(lunarMonth, birthHourBranch) {
  console.log(`🔮 开始计算身宫：农历${lunarMonth}月，${birthHourBranch}时`);
  
  // 步骤1：寅起正月，顺数至生月（与命宫相同）
  const monthBranchIndex = (2 + lunarMonth - 1) % 12; // 从寅宫开始，正月=寅
  const monthBranch = EARTHLY_BRANCHES[monthBranchIndex];
  console.log(`📅 农历${lunarMonth}月对应地支：${monthBranch}（索引${monthBranchIndex}）`);
  
  // 步骤2：从生月宫位起子时，顺数至生时
  // 时辰顺序：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥
  const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const hourPosition = hourOrder.indexOf(birthHourBranch);
  
  if (hourPosition === -1) {
    console.error('❌ 无效的出生时辰地支:', birthHourBranch);
    return '寅'; // 默认返回寅
  }
  
  // 从月支位置顺时针走hourPosition步
  // 顺时针方向，所以是加法
  let shenGongIndex = (monthBranchIndex + hourPosition) % 12;
  
  const shenGongBranch = EARTHLY_BRANCHES[shenGongIndex];
  console.log(`🎯 身宫计算：月支${monthBranch}(${monthBranchIndex}) + ${birthHourBranch}时位置${hourPosition} = ${shenGongBranch}宫（索引${shenGongIndex}）`);
  
  return shenGongBranch;
}

/**
 * 计算十二宫排列
 * 从命宫开始，逆时针依次排列十二宫，但地支位置固定
 * @param {string} mingGongBranch - 命宫地支
 * @returns {Array} - 十二宫排列数组
 */
function calculateTwelvePalaces(mingGongBranch) {
  console.log(`🏯 开始计算十二宫排列，命宫在${mingGongBranch}宫`);
  
  const mingGongIndex = EARTHLY_BRANCHES.indexOf(mingGongBranch);
  if (mingGongIndex === -1) {
    console.error('❌ 无效的命宫地支:', mingGongBranch);
    return [];
  }
  
  // 固定地支顺序：按照紫微斗数标准布局
  // 从左上角开始，顺时针排列：巳、午、未、申、酉、戌、亥、子、丑、寅、卯、辰
  const fixedBranches = ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'];
  
  // 找到命宫地支在fixedBranches中的位置
  const mingGongFixedIndex = fixedBranches.indexOf(mingGongBranch);
  if (mingGongFixedIndex === -1) {
    console.error(`❌ 命宫地支 ${mingGongBranch} 不在固定地支顺序中`);
    return [];
  }
  
  const palaces = [];
  
  // 从命宫开始，逆时针依次排列十二宫
  for (let i = 0; i < 12; i++) {
    // 宫位名称按照固定顺序，从命宫开始
    const palaceName = PALACE_NAMES[i];
    
    // 地支位置固定，不随命宫变化
    // 逆时针方向，所以是减法，而不是加法
    const branch = fixedBranches[(mingGongFixedIndex - i + 12) % 12];
    
    // 计算地支在EARTHLY_BRANCHES中的索引，用于后续天干计算
    const branchIndex = EARTHLY_BRANCHES.indexOf(branch);
    
    palaces.push({
      name: palaceName,
      branch: branch,
      index: i, // 宫位序号（0-11）
      branchIndex: branchIndex, // 地支索引（0-11）
      stars: [], // 星曜列表（暂时为空，后续添加星曜计算）
      gods: [], // 神煞列表（暂时为空）
      heavenlyStem: '', // 天干（暂时为空，后续添加天干计算）
      minorLimit: '', // 小限信息
      ageRange: '', // 年龄区间
      fourHua: [] // 四化星信息
    });
    
    console.log(`📍 第${i + 1}宫：${palaceName} - ${branch}宫（地支索引${branchIndex}）`);
  }
  
  return palaces;
}

/**
 * 计算十二宫天干（五虎遁）
 * 口诀：甲己之年丙作首，乙庚之年戊为头。丙辛必定寻庚起，丁壬壬位顺行流。若问戊癸何方发，甲寅之上好追求。
 * @param {string} yearStem - 出生年天干
 * @param {Array} palaces - 十二宫数组
 * @returns {Array} - 添加天干后的十二宫数组
 */
function calculateHeavenlyStems(yearStem, palaces) {
  console.log(`🔢 开始计算十二宫天干，年干：${yearStem}`);
  
  // 根据年干确定寅宫天干
  let yinStem = '';
  
  switch(yearStem) {
    case '甲':
    case '己':
      yinStem = '丙'; // 甲己之年丙作首
      break;
    case '乙':
    case '庚':
      yinStem = '戊'; // 乙庚之年戊为头
      break;
    case '丙':
    case '辛':
      yinStem = '庚'; // 丙辛必定寻庚起
      break;
    case '丁':
    case '壬':
      yinStem = '壬'; // 丁壬壬位顺行流
      break;
    case '戊':
    case '癸':
      yinStem = '甲'; // 若问戊癸何方发，甲寅之上好追求
      break;
    default:
      yinStem = '丙'; // 默认值
  }
  
  console.log(`🔍 五虎遁：${yearStem}年 → 寅宫天干为${yinStem}`);
  
  // 找到寅宫在十二宫中的位置
  const yinIndex = palaces.findIndex(palace => palace.branch === '寅');
  
  if (yinIndex === -1) {
    console.error('❌ 未找到寅宫，无法计算十二宫天干');
    return palaces;
  }
  
  // 从寅宫开始，按照天干顺序依次给各宫位配上天干
  const yinStemIndex = HEAVENLY_STEMS.indexOf(yinStem);
  
  if (yinStemIndex === -1) {
    console.error('❌ 无效的寅宫天干:', yinStem);
    return palaces;
  }
  
  // 为每个宫位计算天干 - 顺时针方向
  const branchOrder = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  
  palaces.forEach(palace => {
    // 找到当前宫位的地支在标准顺序中的位置
    const branchIndex = branchOrder.indexOf(palace.branch);
    if (branchIndex === -1) {
      console.error(`❌ 未找到地支 ${palace.branch} 在标准顺序中的位置`);
      return;
    }
    
    // 计算相对于寅宫的偏移量（顺时针方向）
    const offset = (branchIndex - 0 + 12) % 12; // 0是寅在branchOrder中的索引
    
    // 计算天干索引（顺时针方向）
    const stemIndex = (yinStemIndex + offset) % 10;
    palace.heavenlyStem = HEAVENLY_STEMS[stemIndex];
    
    console.log(`📍 ${palace.name} - ${palace.heavenlyStem}${palace.branch}`);
  });
  
  return palaces;
}

/**
 * 根据前端布局需求，将十二宫转换为4x4网格布局
 * @param {Array} palaces - 十二宫数组
 * @returns {Array} - 16个位置的布局数组（包含空位）
 */
function convertToGridLayout(palaces) {
  // 4x4网格布局映射（与前端组件一致）- 紫微斗数标准布局
  // 顶行：巳 | 午 | 未 | 申
  // 中行：辰 | [中宫区域] | 酉
  // 中行：卯 | [中宫区域] | 戌  
  // 底行：寅 | 丑 | 子 | 亥
  
  // 创建一个16位置的数组，用于存放布局数据
  const layoutData = new Array(16);
  
  // 中宫位置
  layoutData[5] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 5 };
  layoutData[6] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 6 };
  layoutData[9] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 9 };
  layoutData[10] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 10 };
  
  // 固定的地支到网格位置的映射
  // 按照紫微斗数标准布局
  const branchToGridIndex = {
    '巳': 0,
    '午': 1,
    '未': 2,
    '申': 3,
    '酉': 7,
    '戌': 11,
    '亥': 15,
    '子': 14,
    '丑': 13,
    '寅': 12,
    '卯': 8,
    '辰': 4
  };
  
  // 处理每个宫位数据
  palaces.forEach(palace => {
    // 获取宫位地支对应的网格位置
    const gridIndex = branchToGridIndex[palace.branch];
    
    if (gridIndex !== undefined) {
      // 将宫位数据放入对应的网格位置
      layoutData[gridIndex] = {
        ...palace,
        displayName: palace.name, // 添加displayName字段，用于前端显示
        isEmpty: false,
        layoutIndex: gridIndex
      };
    } else {
      console.error(`❌ 未找到地支 ${palace.branch} 对应的网格位置`);
    }
  });
  
  return layoutData;
}

/**
 * 主函数：根据用户信息计算完整的宫位布局
 * @param {Object} profile - 用户档案信息
 * @returns {Object} - 包含宫位布局和基本信息的结果
 */
function calculatePalaceLayout(profile) {
  console.log('🚀 开始计算宫位布局：', profile);
  
  try {
    // 1. 解析出生时间
    const birthDate = new Date(profile.date);
    const [hour, minute] = (profile.time || '00:00').split(':').map(num => parseInt(num));
    
    // 2. 获取农历信息（优先使用提供的农历数据）
    const lunarYear = profile.lunarYear || (birthDate.getFullYear() - 1);
    const lunarMonth = profile.lunarMonth || birthDate.getMonth() + 1; 
    const lunarDay = profile.lunarDay || birthDate.getDate();
    
    // 3. 获取出生时辰地支
    const birthHourBranch = profile.hourBranch || getHourBranch(hour);
    const hourName = profile.hourName || `${birthHourBranch}时`;
    
    // 4. 获取年干支信息
    const yearStem = profile.yearStem || '甲'; 
    const yearBranch = profile.yearBranch || '子';
    
    // 5. 获取真太阳时
    const trueSolarTime = profile.trueSolarTime ? `${hour}:${minute < 10 ? '0' + minute : minute}` : null;
    
    console.log(`📊 用户信息：${profile.name}，${profile.date} ${profile.time}`);
    console.log(`🗓️ 农历：${yearStem}${yearBranch}年${lunarMonth}月${lunarDay}日，${birthHourBranch}时`);
    if (trueSolarTime) {
      console.log(`🕒 真太阳时：${trueSolarTime}`);
    }
    
    // 6. 计算命宫和身宫
    const mingGongBranch = calculateMingGongBranch(lunarMonth, birthHourBranch);
    const shenGongBranch = calculateShenGongBranch(lunarMonth, birthHourBranch);
    
    // 7. 计算十二宫排列
    const palaces = calculateTwelvePalaces(mingGongBranch);
    
    // 8. 计算十二宫天干
    const palacesWithStems = calculateHeavenlyStems(yearStem, palaces);
    
    // 9. 计算五行局
    const fiveElements = calculateFiveElementsPattern(yearStem, mingGongBranch);
    
    // 10. 安紫微星
    const ziWeiBranch = placeZiWeiStar(lunarDay, fiveElements);
    
    // 11. 安十四主星
    const palacesWithStars = placeMainStars(ziWeiBranch, palacesWithStems);
    
    // 12. 安辅星
    const palacesWithAuxStars = placeAuxiliaryStars(lunarMonth, birthHourBranch, yearStem, yearBranch, palacesWithStars);
    
    // 13. 安四化星
    const palacesWithFourHua = placeFourTransformationStars(yearStem, palacesWithAuxStars);
    
    // 14. 转换为前端布局格式
    const gridLayout = convertToGridLayout(palacesWithFourHua);
    
    // 15. 标记命宫和身宫
    // 找到身宫对应的宫位名称
    let shenGongName = '';
    for (let i = 0; i < palacesWithFourHua.length; i++) {
      if (palacesWithFourHua[i].branch === shenGongBranch) {
        shenGongName = palacesWithFourHua[i].name;
        palacesWithFourHua[i].isShenGong = true;
        break;
      }
    }
    
    // 找到命宫和身宫对象
    const mingGong = palacesWithFourHua.find(p => p.branch === mingGongBranch);
    const shenGong = palacesWithFourHua.find(p => p.branch === shenGongBranch);
    
    console.log('✅ 宫位布局计算完成');
    
    // 返回结果
    return {
      success: true,
      palaces: gridLayout, // 网格布局数据
      originalPalaces: palacesWithFourHua, // 原始十二宫数据
      mingGong: mingGong || { branch: mingGongBranch, name: '命宫', stem: yearStem },
      shenGong: shenGong || { branch: shenGongBranch, name: shenGongName },
      fiveElements,
      ziWeiBranch,
      calculation: {
        lunarYear,
        lunarMonth,
        lunarDay,
        birthHourBranch,
        hourName,
        yearStem,
        yearBranch,
        trueSolarTime,
        timestamp: Date.now()
      }
    };
    
  } catch (error) {
    console.error('❌ 宫位布局计算失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 为宫位生成测试星曜数据
 * @param {string} palaceName - 宫位名称
 * @param {number} branchIndex - 地支索引
 * @returns {Array} - 测试星曜数组
 */
function generateTestStarsForPalace(palaceName, branchIndex) {
  // 主星列表
  const mainStars = ['天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];
  
  // 辅星列表
  const auxStars = ['右弼', '文昌', '文曲', '天魁', '天钺', '禄存', '地空', '地劫', '火星', '铃星'];
  
  // 根据地支索引选择星曜（简化算法）
  const testStars = [];
  
  // 每个宫位随机1-2颗主星
  const mainCount = (branchIndex % 2) + 1;
  for (let i = 0; i < mainCount; i++) {
    const starIndex = (branchIndex * 2 + i) % mainStars.length;
    const brightness = ['庙', '旺', '得', '利', '平', '不'][(branchIndex + i) % 6];
    testStars.push({
      name: mainStars[starIndex],
      brightness: brightness,
      type: 'main'
    });
  }
  
  // 部分宫位添加辅星
  if (branchIndex % 3 === 0) {
    const auxIndex = branchIndex % auxStars.length;
    testStars.push({
      name: auxStars[auxIndex],
      brightness: '平',
      type: 'auxiliary'
    });
  }
  
  return testStars;
}

/**
 * 生成空白宫位布局
 * @returns {Array} - 空白宫位布局数组
 */
function generateEmptyPalaceLayout() {
  // 创建一个16位置的数组，用于存放空布局数据
  const layoutData = new Array(16);
  
  // 中宫位置
  layoutData[5] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 5 };
  layoutData[6] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 6 };
  layoutData[9] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 9 };
  layoutData[10] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 10 };
  
  // 紫微斗数宫位在4x4网格中的位置映射
  const gridPositions = {
    '命宫': 0,
    '父母宫': 1,
    '福德宫': 2,
    '田宅宫': 3,
    '兄弟宫': 4,
    '官禄宫': 7,
    '夫妻宫': 8,
    '交友宫': 11,
    '子女宫': 12,
    '财帛宫': 13,
    '疾厄宫': 14,
    '迁移宫': 15
  };
  
  // 填充宫位
  Object.entries(gridPositions).forEach(([palaceName, index]) => {
    layoutData[index] = { 
      name: '—', 
      branch: '—',
      stars: [], 
      gods: [],
      heavenlyStem: '',
      displayName: palaceName, // 保留宫位名称作为displayName
      isEmpty: true,
      layoutIndex: index
    };
  });
  
  return layoutData;
}

/**
 * 计算五行局
 * 根据命宫天干地支确定五行局
 * @param {string} mingGongStem - 命宫天干
 * @param {string} mingGongBranch - 命宫地支
 * @returns {Object} - 五行局信息
 */
function calculateFiveElementsPattern(mingGongStem, mingGongBranch) {
  console.log(`🔮 开始计算五行局，命宫：${mingGongStem}${mingGongBranch}`);
  
  // 简化版五行局计算（实际应该使用六十纳音表）
  const stemElement = getStemElement(mingGongStem);
  const branchElement = getBranchElement(mingGongBranch);
  
  // 根据天干地支五行组合确定五行局
  let pattern = '';
  let number = 0;
  
  // 简化版五行局判断
  if (stemElement === '水' || branchElement === '水') {
    pattern = '水二局';
    number = 2;
  } else if (stemElement === '木' || branchElement === '木') {
    pattern = '木三局';
    number = 3;
  } else if (stemElement === '金' || branchElement === '金') {
    pattern = '金四局';
    number = 4;
  } else if (stemElement === '土' || branchElement === '土') {
    pattern = '土五局';
    number = 5;
  } else {
    pattern = '火六局';
    number = 6;
  }
  
  console.log(`🔍 五行局：${pattern}（${number}）`);
  
  return {
    name: pattern,
    number: number,
    element: pattern.charAt(0)
  };
}

/**
 * 获取天干五行属性
 * @param {string} stem - 天干
 * @returns {string} - 五行属性
 */
function getStemElement(stem) {
  const stemElements = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };
  
  return stemElements[stem] || '木';
}

/**
 * 获取地支五行属性
 * @param {string} branch - 地支
 * @returns {string} - 五行属性
 */
function getBranchElement(branch) {
  const branchElements = {
    '寅': '木', '卯': '木',
    '巳': '火', '午': '火',
    '辰': '土', '丑': '土', '未': '土', '戌': '土',
    '申': '金', '酉': '金',
    '亥': '水', '子': '水'
  };
  
  return branchElements[branch] || '木';
}

/**
 * 安紫微星
 * 根据农历日期和五行局确定紫微星位置
 * @param {number} lunarDay - 农历日期
 * @param {Object} fiveElements - 五行局信息
 * @returns {string} - 紫微星所在地支
 */
function placeZiWeiStar(lunarDay, fiveElements) {
  console.log(`🌟 开始安紫微星，农历日期：${lunarDay}，五行局：${fiveElements.name}`);
  
  // 计算紫微星落宫位置
  const patternNumber = fiveElements.number;
  let remainder = lunarDay % patternNumber;
  
  if (remainder === 0) {
    remainder = patternNumber;
  }
  
  // 根据余数确定紫微星落宫
  let ziWeiBranch = '';
  
  // 紫微星安星口诀
  switch(patternNumber) {
    case 2: // 水二局
      if (remainder === 1) ziWeiBranch = '寅';
      else ziWeiBranch = '申';
      break;
    case 3: // 木三局
      if (remainder === 1) ziWeiBranch = '寅';
      else if (remainder === 2) ziWeiBranch = '午';
      else ziWeiBranch = '戌';
      break;
    case 4: // 金四局
      if (remainder === 1) ziWeiBranch = '巳';
      else if (remainder === 2) ziWeiBranch = '申';
      else if (remainder === 3) ziWeiBranch = '亥';
      else ziWeiBranch = '寅';
      break;
    case 5: // 土五局
      if (remainder === 1) ziWeiBranch = '巳';
      else if (remainder === 2) ziWeiBranch = '酉';
      else if (remainder === 3) ziWeiBranch = '丑';
      else if (remainder === 4) ziWeiBranch = '巳';
      else ziWeiBranch = '酉';
      break;
    case 6: // 火六局
      if (remainder === 1) ziWeiBranch = '寅';
      else if (remainder === 2) ziWeiBranch = '午';
      else if (remainder === 3) ziWeiBranch = '戌';
      else if (remainder === 4) ziWeiBranch = '寅';
      else if (remainder === 5) ziWeiBranch = '午';
      else ziWeiBranch = '戌';
      break;
    default:
      ziWeiBranch = '寅'; // 默认值
  }
  
  console.log(`🔍 紫微星落宫：${ziWeiBranch}宫，计算过程：${lunarDay} % ${patternNumber} = ${remainder}`);
  
  return ziWeiBranch;
}

/**
 * 安十四主星
 * 根据紫微星位置安排其余十三颗主星
 * @param {string} ziWeiBranch - 紫微星所在地支
 * @param {Array} palaces - 十二宫数组
 * @returns {Array} - 添加主星后的十二宫数组
 */
function placeMainStars(ziWeiBranch, palaces) {
  console.log(`🌠 开始安十四主星，紫微星在${ziWeiBranch}宫`);
  
  // 找到紫微星所在宫位索引
  const ziWeiIndex = EARTHLY_BRANCHES.indexOf(ziWeiBranch);
  
  if (ziWeiIndex === -1) {
    console.error('❌ 无效的紫微星地支:', ziWeiBranch);
    return palaces;
  }
  
  // 创建主星位置映射
  const mainStarsPositions = {};
  
  // 1. 安紫微星
  mainStarsPositions['紫微'] = ziWeiBranch;
  
  // 2. 安天机星（紫微顺行一位）
  const tianJiIndex = (ziWeiIndex + 1) % 12;
  mainStarsPositions['天机'] = EARTHLY_BRANCHES[tianJiIndex];
  
  // 3. 安太阳星（紫微顺行三位）
  const taiYangIndex = (ziWeiIndex + 3) % 12;
  mainStarsPositions['太阳'] = EARTHLY_BRANCHES[taiYangIndex];
  
  // 4. 安武曲星（紫微顺行四位）
  const wuQuIndex = (ziWeiIndex + 4) % 12;
  mainStarsPositions['武曲'] = EARTHLY_BRANCHES[wuQuIndex];
  
  // 5. 安天同星（紫微顺行五位）
  const tianTongIndex = (ziWeiIndex + 5) % 12;
  mainStarsPositions['天同'] = EARTHLY_BRANCHES[tianTongIndex];
  
  // 6. 安廉贞星（紫微顺行六位）
  const lianZhenIndex = (ziWeiIndex + 6) % 12;
  mainStarsPositions['廉贞'] = EARTHLY_BRANCHES[lianZhenIndex];
  
  // 7. 安天府星（紫微对宫，即相隔六位）
  const tianFuIndex = (ziWeiIndex + 6) % 12;
  mainStarsPositions['天府'] = EARTHLY_BRANCHES[tianFuIndex];
  
  // 8-14. 安其余七颗主星（天府系列，逆行安星）
  // 天府系七星：天府、太阴、贪狼、巨门、天相、天梁、七杀、破军
  const tianFuStars = ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];
  
  for (let i = 1; i < tianFuStars.length; i++) {
    const starIndex = (tianFuIndex - i + 12) % 12;
    mainStarsPositions[tianFuStars[i]] = EARTHLY_BRANCHES[starIndex];
  }
  
  // 将主星添加到宫位数据中
  palaces.forEach(palace => {
    const branch = palace.branch;
    
    // 查找落在该宫位的主星
    const starsInPalace = Object.entries(mainStarsPositions)
      .filter(([_, starBranch]) => starBranch === branch)
      .map(([starName, _]) => {
        // 确定星曜亮度（简化版）
        let brightness = '平';
        if (['寅', '卯'].includes(branch)) {
          brightness = '旺'; // 木星旺于寅卯
        } else if (['巳', '午'].includes(branch)) {
          brightness = '旺'; // 火星旺于巳午
        } else if (['申', '酉'].includes(branch)) {
          brightness = '旺'; // 金星旺于申酉
        } else if (['亥', '子'].includes(branch)) {
          brightness = '旺'; // 水星旺于亥子
        }
        
        return {
          name: starName,
          type: 'main',
          brightness: brightness
        };
      });
    
    // 将主星添加到宫位星曜列表中
    if (starsInPalace.length > 0) {
      palace.stars = [...palace.stars, ...starsInPalace];
      console.log(`📍 ${branch}宫添加主星：${starsInPalace.map(s => s.name).join(', ')}`);
    }
  });
  
  return palaces;
}

/**
 * 安辅星
 * 根据出生年月时安放辅星
 * @param {number} lunarMonth - 农历月份
 * @param {string} birthHourBranch - 出生时辰地支
 * @param {string} yearStem - 年干
 * @param {string} yearBranch - 年支
 * @param {Array} palaces - 十二宫数组
 * @returns {Array} - 添加辅星后的十二宫数组
 */
function placeAuxiliaryStars(lunarMonth, birthHourBranch, yearStem, yearBranch, palaces) {
  console.log(`🌟 开始安辅星，农历${lunarMonth}月，${birthHourBranch}时，${yearStem}${yearBranch}年`);
  
  // 创建辅星位置映射
  const auxStarsPositions = {};
  
  // 1. 安左辅、右弼（以寅宫为起点，顺数至生月）
  const leftRightIndex = (2 + lunarMonth - 1) % 12; // 寅宫索引为2
  auxStarsPositions['左辅'] = EARTHLY_BRANCHES[leftRightIndex];
  auxStarsPositions['右弼'] = EARTHLY_BRANCHES[(leftRightIndex + 6) % 12]; // 对宫
  
  // 2. 安文昌、文曲（以卯宫为起点，顺数至生时）
  const wenChangIndex = (3 + EARTHLY_BRANCHES.indexOf(birthHourBranch)) % 12; // 卯宫索引为3
  auxStarsPositions['文昌'] = EARTHLY_BRANCHES[wenChangIndex];
  auxStarsPositions['文曲'] = EARTHLY_BRANCHES[(wenChangIndex + 6) % 12]; // 对宫
  
  // 3. 安禄存、擎羊、陀罗（根据年干）
  const luCunIndex = getLuCunIndex(yearStem);
  auxStarsPositions['禄存'] = EARTHLY_BRANCHES[luCunIndex];
  auxStarsPositions['擎羊'] = EARTHLY_BRANCHES[(luCunIndex + 1) % 12]; // 禄存顺一位
  auxStarsPositions['陀罗'] = EARTHLY_BRANCHES[(luCunIndex + 11) % 12]; // 禄存逆一位
  
  // 4. 安地空、地劫（根据年支）
  const diKongIndex = getDiKongIndex(yearBranch);
  auxStarsPositions['地空'] = EARTHLY_BRANCHES[diKongIndex];
  auxStarsPositions['地劫'] = EARTHLY_BRANCHES[(diKongIndex + 6) % 12]; // 对宫
  
  // 5. 安火星、铃星（根据月份）
  const fireStarIndex = getFireStarIndex(lunarMonth);
  auxStarsPositions['火星'] = EARTHLY_BRANCHES[fireStarIndex];
  
  const bellStarIndex = getBellStarIndex(lunarMonth);
  auxStarsPositions['铃星'] = EARTHLY_BRANCHES[bellStarIndex];
  
  // 将辅星添加到宫位数据中
  palaces.forEach(palace => {
    const branch = palace.branch;
    
    // 查找落在该宫位的辅星
    const auxStarsInPalace = Object.entries(auxStarsPositions)
      .filter(([_, starBranch]) => starBranch === branch)
      .map(([starName, _]) => {
        return {
          name: starName,
          type: 'auxiliary',
          brightness: '平' // 简化处理
        };
      });
    
    // 将辅星添加到宫位星曜列表中
    if (auxStarsInPalace.length > 0) {
      palace.stars = [...palace.stars, ...auxStarsInPalace];
      console.log(`📍 ${branch}宫添加辅星：${auxStarsInPalace.map(s => s.name).join(', ')}`);
    }
  });
  
  return palaces;
}

/**
 * 获取禄存星位置
 * @param {string} yearStem - 年干
 * @returns {number} - 禄存星所在地支索引
 */
function getLuCunIndex(yearStem) {
  const luCunMap = {
    '甲': 2, // 寅
    '乙': 3, // 卯
    '丙': 5, // 巳
    '丁': 6, // 午
    '戊': 5, // 巳
    '己': 6, // 午
    '庚': 8, // 申
    '辛': 9, // 酉
    '壬': 0, // 子
    '癸': 1  // 丑
  };
  
  return luCunMap[yearStem] || 2;
}

/**
 * 获取地空星位置
 * @param {string} yearBranch - 年支
 * @returns {number} - 地空星所在地支索引
 */
function getDiKongIndex(yearBranch) {
  // 简化版地空计算
  const diKongMap = {
    '子': 10, // 戌
    '丑': 11, // 亥
    '寅': 0,  // 子
    '卯': 1,  // 丑
    '辰': 2,  // 寅
    '巳': 3,  // 卯
    '午': 4,  // 辰
    '未': 5,  // 巳
    '申': 6,  // 午
    '酉': 7,  // 未
    '戌': 8,  // 申
    '亥': 9   // 酉
  };
  
  return diKongMap[yearBranch] || 0;
}

/**
 * 获取火星位置
 * @param {number} lunarMonth - 农历月份
 * @returns {number} - 火星所在地支索引
 */
function getFireStarIndex(lunarMonth) {
  // 简化版火星计算
  const fireStarMap = {
    1: 2,  // 寅
    2: 3,  // 卯
    3: 4,  // 辰
    4: 5,  // 巳
    5: 6,  // 午
    6: 7,  // 未
    7: 8,  // 申
    8: 9,  // 酉
    9: 10, // 戌
    10: 11, // 亥
    11: 0,  // 子
    12: 1   // 丑
  };
  
  return fireStarMap[lunarMonth] || 2;
}

/**
 * 获取铃星位置
 * @param {number} lunarMonth - 农历月份
 * @returns {number} - 铃星所在地支索引
 */
function getBellStarIndex(lunarMonth) {
  // 简化版铃星计算
  const bellStarMap = {
    1: 8,  // 申
    2: 7,  // 未
    3: 6,  // 午
    4: 5,  // 巳
    5: 4,  // 辰
    6: 3,  // 卯
    7: 2,  // 寅
    8: 1,  // 丑
    9: 0,  // 子
    10: 11, // 亥
    11: 10, // 戌
    12: 9   // 酉
  };
  
  return bellStarMap[lunarMonth] || 8;
}

/**
 * 安四化星
 * 根据年干确定四化星
 * @param {string} yearStem - 年干
 * @param {Array} palaces - 十二宫数组
 * @returns {Array} - 添加四化星后的十二宫数组
 */
function placeFourTransformationStars(yearStem, palaces) {
  console.log(`🌈 开始安四化星，年干：${yearStem}`);
  
  // 四化星映射（简化版）
  const fourTransformationsMap = {
    '甲': { '禄': '廉贞', '权': '破军', '科': '武曲', '忌': '太阳' },
    '乙': { '禄': '天机', '权': '天梁', '科': '紫微', '忌': '太阴' },
    '丙': { '禄': '天同', '权': '天机', '科': '文昌', '忌': '廉贞' },
    '丁': { '禄': '太阴', '权': '天同', '科': '天机', '忌': '巨门' },
    '戊': { '禄': '贪狼', '权': '太阴', '科': '右弼', '忌': '天机' },
    '己': { '禄': '武曲', '权': '贪狼', '科': '天梁', '忌': '文曲' },
    '庚': { '禄': '太阳', '权': '武曲', '科': '太阴', '忌': '天同' },
    '辛': { '禄': '巨门', '权': '太阳', '科': '天同', '忌': '文昌' },
    '壬': { '禄': '天梁', '权': '紫微', '科': '太阳', '忌': '武曲' },
    '癸': { '禄': '破军', '权': '巨门', '科': '贪狼', '忌': '左辅' }
  };
  
  // 获取当前年干的四化星
  const fourTransformations = fourTransformationsMap[yearStem];
  
  if (!fourTransformations) {
    console.error('❌ 无效的年干:', yearStem);
    return palaces;
  }
  
  // 遍历宫位，为含有四化星的主星添加四化信息
  palaces.forEach(palace => {
    // 检查宫位中的每颗星
    palace.stars.forEach(star => {
      // 查找该星是否为四化星
      Object.entries(fourTransformations).forEach(([type, starName]) => {
        if (star.name === starName) {
          // 添加四化信息
          if (!palace.fourHua) {
            palace.fourHua = [];
          }
          
          palace.fourHua.push({
            star: star.name,
            type: type
          });
          
          console.log(`📍 ${palace.branch}宫 ${star.name}化${type}`);
        }
      });
    });
  });
  
  return palaces;
}

module.exports = {
  calculatePalaceLayout,
  generateEmptyPalaceLayout,
  calculateMingGongBranch,
  calculateShenGongBranch,
  calculateTwelvePalaces,
  convertToGridLayout,
  getHourBranch,
  EARTHLY_BRANCHES,
  PALACE_NAMES,
  calculateHeavenlyStems,
  HEAVENLY_STEMS,
  calculateFiveElementsPattern,
  getStemElement,
  getBranchElement,
  placeZiWeiStar,
  placeMainStars,
  placeAuxiliaryStars,
  getLuCunIndex,
  getDiKongIndex,
  getFireStarIndex,
  getBellStarIndex,
  placeFourTransformationStars
}; 