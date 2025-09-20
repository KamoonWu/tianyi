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
  
  // 紫微斗数宫位在4x4网格中的位置映射
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
  
  // 使用六十纳音表计算五行局
  const naYinMap = {
    '甲子': '海中金', '乙丑': '海中金',
    '丙寅': '炉中火', '丁卯': '炉中火',
    '戊辰': '大林木', '己巳': '大林木',
    '庚午': '路旁土', '辛未': '路旁土',
    '壬申': '剑锋金', '癸酉': '剑锋金',
    '甲戌': '山头火', '乙亥': '山头火',
    '丙子': '涧下水', '丁丑': '涧下水',
    '戊寅': '城头土', '己卯': '城头土',
    '庚辰': '白蜡金', '辛巳': '白蜡金',
    '壬午': '杨柳木', '癸未': '杨柳木',
    '甲申': '泉中水', '乙酉': '泉中水',
    '丙戌': '屋上土', '丁亥': '屋上土',
    '戊子': '霹雳火', '己丑': '霹雳火',
    '庚寅': '松柏木', '辛卯': '松柏木',
    '壬辰': '长流水', '癸巳': '长流水',
    '甲午': '沙中金', '乙未': '沙中金',
    '丙申': '山下火', '丁酉': '山下火',
    '戊戌': '平地木', '己亥': '平地木',
    '庚子': '壁上土', '辛丑': '壁上土',
    '壬寅': '金箔金', '癸卯': '金箔金',
    '甲辰': '覆灯火', '乙巳': '覆灯火',
    '丙午': '天河水', '丁未': '天河水',
    '戊申': '大驿土', '己酉': '大驿土',
    '庚戌': '钗环金', '辛亥': '钗环金',
    '壬子': '桑柘木', '癸丑': '桑柘木',
    '甲寅': '大溪水', '乙卯': '大溪水',
    '丙辰': '沙中土', '丁巳': '沙中土',
    '戊午': '天上火', '己未': '天上火',
    '庚申': '石榴木', '辛酉': '石榴木',
    '壬戌': '大海水', '癸亥': '大海水'
  };
  
  // 获取命宫干支组合
  const stemBranchCombo = `${mingGongStem}${mingGongBranch}`;
  
  // 获取纳音五行
  const naYin = naYinMap[stemBranchCombo] || '';
  
  // 根据纳音确定五行局
  let pattern = '';
  let number = 0;
  let element = '';
  
  if (naYin.includes('水')) {
    pattern = '水二局';
    number = 2;
    element = '水';
  } else if (naYin.includes('木')) {
    pattern = '木三局';
    number = 3;
    element = '木';
  } else if (naYin.includes('金')) {
    pattern = '金四局';
    number = 4;
    element = '金';
  } else if (naYin.includes('土')) {
    pattern = '土五局';
    number = 5;
    element = '土';
  } else if (naYin.includes('火')) {
    pattern = '火六局';
    number = 6;
    element = '火';
  } else {
    // 如果无法通过纳音确定，则使用简化版五行局判断
    const stemElement = getStemElement(mingGongStem);
    const branchElement = getBranchElement(mingGongBranch);
    
    if (stemElement === '水' || branchElement === '水') {
      pattern = '水二局';
      number = 2;
      element = '水';
    } else if (stemElement === '木' || branchElement === '木') {
      pattern = '木三局';
      number = 3;
      element = '木';
    } else if (stemElement === '金' || branchElement === '金') {
      pattern = '金四局';
      number = 4;
      element = '金';
    } else if (stemElement === '土' || branchElement === '土') {
      pattern = '土五局';
      number = 5;
      element = '土';
    } else {
      pattern = '火六局';
      number = 6;
      element = '火';
    }
  }
  
  console.log(`🔍 五行局：${pattern}（${number}），纳音：${naYin || '未知'}`);
  
  return {
    name: pattern,
    number: number,
    element: element,
    naYin: naYin
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
  
  // 紫微星安星口诀
  // 二局寅申，三局寅午戌，四局巳申亥寅，五局巳酉丑巳酉，六局寅午戌寅午戌
  let ziWeiBranch = '';
  
  // 精确的紫微星安放表
  const ziWeiPlacementTable = {
    // 水二局
    2: {
      1: '寅', 2: '申'
    },
    // 木三局
    3: {
      1: '寅', 2: '午', 3: '戌'
    },
    // 金四局
    4: {
      1: '巳', 2: '申', 3: '亥', 4: '寅'
    },
    // 土五局
    5: {
      1: '巳', 2: '酉', 3: '丑', 4: '巳', 5: '酉'
    },
    // 火六局
    6: {
      1: '寅', 2: '午', 3: '戌', 4: '寅', 5: '午', 6: '戌'
    }
  };
  
  // 查表获取紫微星位置
  if (ziWeiPlacementTable[patternNumber] && ziWeiPlacementTable[patternNumber][remainder]) {
    ziWeiBranch = ziWeiPlacementTable[patternNumber][remainder];
  } else {
    // 默认安在寅宫
    ziWeiBranch = '寅';
    console.error(`❌ 无法确定紫微星位置: 局数=${patternNumber}, 余数=${remainder}`);
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
  
  // 紫微系六星：紫微、天机、太阳、武曲、天同、廉贞
  // 紫微系口诀：紫微天机星逆行，隔一阳武天同行，廉贞反首紫微宫
  
  // 1. 安紫微星
  mainStarsPositions['紫微'] = ziWeiBranch;
  console.log(`📍 安紫微星在${ziWeiBranch}宫`);
  
  // 2. 安天机星（紫微逆行一位）
  // 注意：逆行是逆时针，即减一位
  const tianJiIndex = (ziWeiIndex - 1 + 12) % 12;
  mainStarsPositions['天机'] = EARTHLY_BRANCHES[tianJiIndex];
  console.log(`📍 安天机星在${EARTHLY_BRANCHES[tianJiIndex]}宫（紫微逆行一位）`);
  
  // 3. 安太阳星（紫微顺行三位）
  const taiYangIndex = (ziWeiIndex + 3) % 12;
  mainStarsPositions['太阳'] = EARTHLY_BRANCHES[taiYangIndex];
  console.log(`📍 安太阳星在${EARTHLY_BRANCHES[taiYangIndex]}宫（紫微顺行三位）`);
  
  // 4. 安武曲星（紫微顺行四位）
  const wuQuIndex = (ziWeiIndex + 4) % 12;
  mainStarsPositions['武曲'] = EARTHLY_BRANCHES[wuQuIndex];
  console.log(`📍 安武曲星在${EARTHLY_BRANCHES[wuQuIndex]}宫（紫微顺行四位）`);
  
  // 5. 安天同星（紫微顺行五位）
  const tianTongIndex = (ziWeiIndex + 5) % 12;
  mainStarsPositions['天同'] = EARTHLY_BRANCHES[tianTongIndex];
  console.log(`📍 安天同星在${EARTHLY_BRANCHES[tianTongIndex]}宫（紫微顺行五位）`);
  
  // 6. 安廉贞星（紫微顺行六位，即对宫）
  const lianZhenIndex = (ziWeiIndex + 6) % 12;
  mainStarsPositions['廉贞'] = EARTHLY_BRANCHES[lianZhenIndex];
  console.log(`📍 安廉贞星在${EARTHLY_BRANCHES[lianZhenIndex]}宫（紫微顺行六位，对宫）`);
  
  // 天府系八星：天府、太阴、贪狼、巨门、天相、天梁、七杀、破军
  // 天府系口诀：天府居午宫，顺数至紫微，逆数安天府，余星逐宫布
  
  // 7. 安天府星（紫微对宫，即相隔六位）
  // 注意：天府与廉贞同宫
  const tianFuIndex = lianZhenIndex;
  mainStarsPositions['天府'] = EARTHLY_BRANCHES[tianFuIndex];
  console.log(`📍 安天府星在${EARTHLY_BRANCHES[tianFuIndex]}宫（与廉贞同宫）`);
  
  // 8-14. 安其余七颗主星（天府系列，逆行安星）
  const tianFuStars = ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];
  
  for (let i = 1; i < tianFuStars.length; i++) {
    const starIndex = (tianFuIndex - i + 12) % 12;
    mainStarsPositions[tianFuStars[i]] = EARTHLY_BRANCHES[starIndex];
    console.log(`📍 安${tianFuStars[i]}星在${EARTHLY_BRANCHES[starIndex]}宫（天府逆行${i}位）`);
  }
  
  // 星曜亮度表（庙、旺、得、利、平、闲、陷）
  const starBrightness = {
    '紫微': { '子': '平', '丑': '平', '寅': '庙', '卯': '庙', '辰': '闲', '巳': '旺', '午': '旺', '未': '闲', '申': '陷', '酉': '陷', '戌': '得', '亥': '得' },
    '天机': { '子': '平', '丑': '平', '寅': '庙', '卯': '庙', '辰': '闲', '巳': '陷', '午': '陷', '未': '闲', '申': '旺', '酉': '旺', '戌': '得', '亥': '得' },
    '太阳': { '子': '陷', '丑': '陷', '寅': '旺', '卯': '旺', '辰': '平', '巳': '庙', '午': '庙', '未': '平', '申': '平', '酉': '平', '戌': '闲', '亥': '闲' },
    '武曲': { '子': '闲', '丑': '闲', '寅': '平', '卯': '平', '辰': '陷', '巳': '陷', '午': '陷', '未': '陷', '申': '庙', '酉': '庙', '戌': '旺', '亥': '旺' },
    '天同': { '子': '庙', '丑': '庙', '寅': '闲', '卯': '闲', '辰': '平', '巳': '平', '午': '得', '未': '得', '申': '陷', '酉': '陷', '戌': '旺', '亥': '旺' },
    '廉贞': { '子': '陷', '丑': '陷', '寅': '平', '卯': '平', '辰': '闲', '巳': '庙', '午': '庙', '未': '闲', '申': '得', '酉': '得', '戌': '旺', '亥': '旺' },
    '天府': { '子': '庙', '丑': '庙', '寅': '闲', '卯': '闲', '辰': '旺', '巳': '旺', '午': '陷', '未': '陷', '申': '平', '酉': '平', '戌': '得', '亥': '得' },
    '太阴': { '子': '庙', '丑': '庙', '寅': '闲', '卯': '闲', '辰': '平', '巳': '平', '午': '陷', '未': '陷', '申': '旺', '酉': '旺', '戌': '得', '亥': '得' },
    '贪狼': { '子': '旺', '丑': '旺', '寅': '平', '卯': '平', '辰': '得', '巳': '得', '午': '陷', '未': '陷', '申': '闲', '酉': '闲', '戌': '庙', '亥': '庙' },
    '巨门': { '子': '得', '丑': '得', '寅': '陷', '卯': '陷', '辰': '旺', '巳': '旺', '午': '闲', '未': '闲', '申': '庙', '酉': '庙', '戌': '平', '亥': '平' },
    '天相': { '子': '平', '丑': '平', '寅': '得', '卯': '得', '辰': '庙', '巳': '庙', '午': '旺', '未': '旺', '申': '闲', '酉': '闲', '戌': '陷', '亥': '陷' },
    '天梁': { '子': '得', '丑': '得', '寅': '陷', '卯': '陷', '辰': '平', '巳': '平', '午': '庙', '未': '庙', '申': '旺', '酉': '旺', '戌': '闲', '亥': '闲' },
    '七杀': { '子': '闲', '丑': '闲', '寅': '陷', '卯': '陷', '辰': '得', '巳': '得', '午': '平', '未': '平', '申': '庙', '酉': '庙', '戌': '旺', '亥': '旺' },
    '破军': { '子': '庙', '丑': '庙', '寅': '闲', '卯': '闲', '辰': '陷', '巳': '陷', '午': '得', '未': '得', '申': '平', '酉': '平', '戌': '旺', '亥': '旺' }
  };
  
  // 将主星添加到宫位数据中
  palaces.forEach(palace => {
    const branch = palace.branch;
    
    // 查找落在该宫位的主星
    const starsInPalace = Object.entries(mainStarsPositions)
      .filter(([_, starBranch]) => starBranch === branch)
      .map(([starName, _]) => {
        // 确定星曜亮度
        let brightness = '平';
        if (starBrightness[starName] && starBrightness[starName][branch]) {
          brightness = starBrightness[starName][branch];
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
      console.log(`📍 ${branch}宫添加主星：${starsInPalace.map(s => `${s.name}${s.brightness}`).join(', ')}`);
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
  
  // 1. 安左辅、右弼
  // 口诀：左辅右弼安命坐，寅起正月顺数去
  // 解释：从寅宫开始，顺数到生月，安左辅；其对宫安右弼
  const leftRightIndex = (2 + lunarMonth - 1) % 12; // 寅宫索引为2
  auxStarsPositions['左辅'] = EARTHLY_BRANCHES[leftRightIndex];
  auxStarsPositions['右弼'] = EARTHLY_BRANCHES[(leftRightIndex + 6) % 12]; // 对宫
  console.log(`📍 安左辅在${EARTHLY_BRANCHES[leftRightIndex]}宫（寅宫顺数至生月）`);
  console.log(`📍 安右弼在${EARTHLY_BRANCHES[(leftRightIndex + 6) % 12]}宫（左辅对宫）`);
  
  // 2. 安文昌、文曲
  // 口诀：文昌文曲安时坐，卯起子时顺行去
  // 解释：从卯宫开始，顺数到生时，安文昌；其对宫安文曲
  const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const hourPosition = hourOrder.indexOf(birthHourBranch);
  if (hourPosition === -1) {
    console.error('❌ 无效的出生时辰地支:', birthHourBranch);
  } else {
    const wenChangIndex = (3 + hourPosition) % 12; // 卯宫索引为3
    auxStarsPositions['文昌'] = EARTHLY_BRANCHES[wenChangIndex];
    auxStarsPositions['文曲'] = EARTHLY_BRANCHES[(wenChangIndex + 6) % 12]; // 对宫
    console.log(`📍 安文昌在${EARTHLY_BRANCHES[wenChangIndex]}宫（卯宫顺数至生时）`);
    console.log(`📍 安文曲在${EARTHLY_BRANCHES[(wenChangIndex + 6) % 12]}宫（文昌对宫）`);
  }
  
  // 3. 安禄存
  // 口诀：禄存天干定，甲禄到寅宫，乙禄居卯位，丙戊在巳中，丁己禄在午，庚禄到申中，辛禄居酉位，壬禄亥中逢，癸禄在子中
  const luCunMap = {
    '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
    '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
    '壬': '亥', '癸': '子'
  };
  
  if (luCunMap[yearStem]) {
    const luCunBranch = luCunMap[yearStem];
    auxStarsPositions['禄存'] = luCunBranch;
    console.log(`📍 安禄存在${luCunBranch}宫（${yearStem}年禄存安${luCunBranch}）`);
  }
  
  // 4. 安天马
  // 口诀：天马常随太岁，寅午戌年在申，申子辰年在寅，巳酉丑年在亥，亥卯未年在巳
  let tianMaBranch = '';
  if (['寅', '午', '戌'].includes(yearBranch)) {
    tianMaBranch = '申';
  } else if (['申', '子', '辰'].includes(yearBranch)) {
    tianMaBranch = '寅';
  } else if (['巳', '酉', '丑'].includes(yearBranch)) {
    tianMaBranch = '亥';
  } else if (['亥', '卯', '未'].includes(yearBranch)) {
    tianMaBranch = '巳';
  }
  
  if (tianMaBranch) {
    auxStarsPositions['天马'] = tianMaBranch;
    console.log(`📍 安天马在${tianMaBranch}宫（${yearBranch}年天马安${tianMaBranch}）`);
  }
  
  // 5. 安擎羊、陀罗
  // 口诀：擎羊陀罗天干定，甲羊戌陀辰，乙羊酉陀卯，丙羊申陀寅，丁羊未陀丑，
  // 戊羊午陀子，己羊巳陀亥，庚羊辰陀戌，辛羊卯陀酉，壬羊寅陀申，癸羊丑陀未
  const qingYangMap = {
    '甲': '戌', '乙': '酉', '丙': '申', '丁': '未',
    '戊': '午', '己': '巳', '庚': '辰', '辛': '卯',
    '壬': '寅', '癸': '丑'
  };
  
  const tuoLuoMap = {
    '甲': '辰', '乙': '卯', '丙': '寅', '丁': '丑',
    '戊': '子', '己': '亥', '庚': '戌', '辛': '酉',
    '壬': '申', '癸': '未'
  };
  
  if (qingYangMap[yearStem]) {
    const qingYangBranch = qingYangMap[yearStem];
    auxStarsPositions['擎羊'] = qingYangBranch;
    console.log(`📍 安擎羊在${qingYangBranch}宫（${yearStem}年擎羊安${qingYangBranch}）`);
  }
  
  if (tuoLuoMap[yearStem]) {
    const tuoLuoBranch = tuoLuoMap[yearStem];
    auxStarsPositions['陀罗'] = tuoLuoBranch;
    console.log(`📍 安陀罗在${tuoLuoBranch}宫（${yearStem}年陀罗安${tuoLuoBranch}）`);
  }
  
  // 6. 安地空、地劫
  // 口诀：地空地劫年支定，子年居戌辰，丑年在亥巳，寅年居子午，卯年在丑未，
  // 辰年在寅申，巳年在卯酉，午年在辰戌，未年在巳亥，申年在午子，酉年在未丑，戌年在申寅，亥年在酉卯
  const diKongJieMap = {
    '子': ['戌', '辰'], '丑': ['亥', '巳'], '寅': ['子', '午'], '卯': ['丑', '未'],
    '辰': ['寅', '申'], '巳': ['卯', '酉'], '午': ['辰', '戌'], '未': ['巳', '亥'],
    '申': ['午', '子'], '酉': ['未', '丑'], '戌': ['申', '寅'], '亥': ['酉', '卯']
  };
  
  if (diKongJieMap[yearBranch]) {
    const diKongBranch = diKongJieMap[yearBranch][0];
    const diJieBranch = diKongJieMap[yearBranch][1];
    
    auxStarsPositions['地空'] = diKongBranch;
    auxStarsPositions['地劫'] = diJieBranch;
    console.log(`📍 安地空在${diKongBranch}宫（${yearBranch}年地空安${diKongBranch}）`);
    console.log(`📍 安地劫在${diJieBranch}宫（${yearBranch}年地劫安${diJieBranch}）`);
  }
  
  // 7. 安火星、铃星
  // 口诀：火铃常随太阴，寅午戌月在寅戌，申子辰月在申辰，巳酉丑月在巳丑，亥卯未月在亥未
  let fireStarBranch = '';
  let bellStarBranch = '';
  
  // 月支对应表
  const monthBranchMap = {
    1: '寅', 2: '卯', 3: '辰', 4: '巳', 5: '午', 6: '未',
    7: '申', 8: '酉', 9: '戌', 10: '亥', 11: '子', 12: '丑'
  };
  
  const monthBranch = monthBranchMap[lunarMonth] || '';
  
  if (['寅', '午', '戌'].includes(monthBranch)) {
    fireStarBranch = '寅';
    bellStarBranch = '戌';
  } else if (['申', '子', '辰'].includes(monthBranch)) {
    fireStarBranch = '申';
    bellStarBranch = '辰';
  } else if (['巳', '酉', '丑'].includes(monthBranch)) {
    fireStarBranch = '巳';
    bellStarBranch = '丑';
  } else if (['亥', '卯', '未'].includes(monthBranch)) {
    fireStarBranch = '亥';
    bellStarBranch = '未';
  }
  
  if (fireStarBranch) {
    auxStarsPositions['火星'] = fireStarBranch;
    console.log(`📍 安火星在${fireStarBranch}宫（${monthBranch}月火星安${fireStarBranch}）`);
  }
  
  if (bellStarBranch) {
    auxStarsPositions['铃星'] = bellStarBranch;
    console.log(`📍 安铃星在${bellStarBranch}宫（${monthBranch}月铃星安${bellStarBranch}）`);
  }
  
  // 8. 安天魁、天钺
  // 口诀：天魁天钺天干定，甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，六辛逢马虎
  const tianKuiYueMap = {
    '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '戊': ['丑', '未'], '己': ['子', '申'], '庚': ['丑', '未'], '辛': ['午', '寅'],
    '壬': ['巳', '卯'], '癸': ['巳', '卯']
  };
  
  if (tianKuiYueMap[yearStem]) {
    const tianKuiBranch = tianKuiYueMap[yearStem][0];
    const tianYueBranch = tianKuiYueMap[yearStem][1];
    
    auxStarsPositions['天魁'] = tianKuiBranch;
    auxStarsPositions['天钺'] = tianYueBranch;
    console.log(`📍 安天魁在${tianKuiBranch}宫（${yearStem}年天魁安${tianKuiBranch}）`);
    console.log(`📍 安天钺在${tianYueBranch}宫（${yearStem}年天钺安${tianYueBranch}）`);
  }
  
  // 辅星亮度表
  const auxStarBrightness = {
    '左辅': { '子': '平', '丑': '平', '寅': '庙', '卯': '庙', '辰': '闲', '巳': '旺', '午': '旺', '未': '闲', '申': '陷', '酉': '陷', '戌': '得', '亥': '得' },
    '右弼': { '子': '平', '丑': '平', '寅': '庙', '卯': '庙', '辰': '闲', '巳': '陷', '午': '陷', '未': '闲', '申': '旺', '酉': '旺', '戌': '得', '亥': '得' },
    '文昌': { '子': '得', '丑': '得', '寅': '旺', '卯': '旺', '辰': '平', '巳': '平', '午': '庙', '未': '庙', '申': '闲', '酉': '闲', '戌': '陷', '亥': '陷' },
    '文曲': { '子': '庙', '丑': '庙', '寅': '闲', '卯': '闲', '辰': '陷', '巳': '陷', '午': '得', '未': '得', '申': '平', '酉': '平', '戌': '旺', '亥': '旺' },
    '禄存': { '子': '旺', '丑': '旺', '寅': '庙', '卯': '庙', '辰': '得', '巳': '得', '午': '平', '未': '平', '申': '闲', '酉': '闲', '戌': '陷', '亥': '陷' },
    '天马': { '子': '平', '丑': '平', '寅': '庙', '卯': '庙', '辰': '闲', '巳': '庙', '午': '庙', '未': '闲', '申': '庙', '酉': '庙', '戌': '平', '亥': '平' },
    '擎羊': { '子': '陷', '丑': '陷', '寅': '平', '卯': '平', '辰': '平', '巳': '平', '午': '平', '未': '平', '申': '平', '酉': '平', '戌': '平', '亥': '平' },
    '陀罗': { '子': '陷', '丑': '陷', '寅': '平', '卯': '平', '辰': '平', '巳': '平', '午': '平', '未': '平', '申': '平', '酉': '平', '戌': '平', '亥': '平' },
    '地空': { '子': '陷', '丑': '陷', '寅': '平', '卯': '平', '辰': '平', '巳': '平', '午': '平', '未': '平', '申': '平', '酉': '平', '戌': '平', '亥': '平' },
    '地劫': { '子': '陷', '丑': '陷', '寅': '平', '卯': '平', '辰': '平', '巳': '平', '午': '平', '未': '平', '申': '平', '酉': '平', '戌': '平', '亥': '平' },
    '火星': { '子': '陷', '丑': '陷', '寅': '旺', '卯': '旺', '辰': '平', '巳': '庙', '午': '庙', '未': '平', '申': '平', '酉': '平', '戌': '闲', '亥': '闲' },
    '铃星': { '子': '闲', '丑': '闲', '寅': '平', '卯': '平', '辰': '陷', '巳': '陷', '午': '陷', '未': '陷', '申': '庙', '酉': '庙', '戌': '旺', '亥': '旺' },
    '天魁': { '子': '庙', '丑': '庙', '寅': '闲', '卯': '闲', '辰': '平', '巳': '平', '午': '得', '未': '得', '申': '旺', '酉': '旺', '戌': '平', '亥': '平' },
    '天钺': { '子': '庙', '丑': '庙', '寅': '闲', '卯': '闲', '辰': '平', '巳': '平', '午': '得', '未': '得', '申': '旺', '酉': '旺', '戌': '平', '亥': '平' }
  };
  
  // 将辅星添加到宫位数据中
  palaces.forEach(palace => {
    const branch = palace.branch;
    
    // 查找落在该宫位的辅星
    const auxStarsInPalace = Object.entries(auxStarsPositions)
      .filter(([_, starBranch]) => starBranch === branch)
      .map(([starName, _]) => {
        // 确定星曜亮度
        let brightness = '平';
        if (auxStarBrightness[starName] && auxStarBrightness[starName][branch]) {
          brightness = auxStarBrightness[starName][branch];
        }
        
        return {
          name: starName,
          type: 'auxiliary',
          brightness: brightness
        };
      });
    
    // 将辅星添加到宫位星曜列表中
    if (auxStarsInPalace.length > 0) {
      palace.stars = [...palace.stars, ...auxStarsInPalace];
      console.log(`📍 ${branch}宫添加辅星：${auxStarsInPalace.map(s => `${s.name}${s.brightness}`).join(', ')}`);
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
  
  // 四化星映射表（标准版）
  // 口诀：甲廉破武阳，乙机梁紫阴，丙同机昌贞，丁阴同机门，
  //      戊狼阴弼机，己武狼梁曲，庚阳武阴同，辛门阳同昌，
  //      壬梁紫阳武，癸破门狼辅
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
  
  // 四化星口诀解释
  const fourHuaExplanation = {
    '甲': '甲廉破武阳 - 甲年生，廉贞化禄，破军化权，武曲化科，太阳化忌',
    '乙': '乙机梁紫阴 - 乙年生，天机化禄，天梁化权，紫微化科，太阴化忌',
    '丙': '丙同机昌贞 - 丙年生，天同化禄，天机化权，文昌化科，廉贞化忌',
    '丁': '丁阴同机门 - 丁年生，太阴化禄，天同化权，天机化科，巨门化忌',
    '戊': '戊狼阴弼机 - 戊年生，贪狼化禄，太阴化权，右弼化科，天机化忌',
    '己': '己武狼梁曲 - 己年生，武曲化禄，贪狼化权，天梁化科，文曲化忌',
    '庚': '庚阳武阴同 - 庚年生，太阳化禄，武曲化权，太阴化科，天同化忌',
    '辛': '辛门阳同昌 - 辛年生，巨门化禄，太阳化权，天同化科，文昌化忌',
    '壬': '壬梁紫阳武 - 壬年生，天梁化禄，紫微化权，太阳化科，武曲化忌',
    '癸': '癸破门狼辅 - 癸年生，破军化禄，巨门化权，贪狼化科，左辅化忌'
  };
  
  // 获取当前年干的四化星
  const fourTransformations = fourTransformationsMap[yearStem];
  
  if (!fourTransformations) {
    console.error('❌ 无效的年干:', yearStem);
    return palaces;
  }
  
  console.log(`📝 四化星口诀: ${fourHuaExplanation[yearStem]}`);
  
  // 四化星对应的影响和含义
  const fourHuaMeaning = {
    '禄': { description: '代表财富、福气、官职', effect: '增强吉星力量，减轻凶星力量' },
    '权': { description: '代表权力、地位、能力', effect: '增强星曜力量，使其更具支配性' },
    '科': { description: '代表学业、文凭、才华', effect: '增加学术成就、文名、声誉' },
    '忌': { description: '代表阻碍、困难、是非', effect: '减弱吉星力量，增强凶星力量' }
  };
  
  // 记录四化星所在宫位，用于日志输出
  const fourHuaPalaces = {
    '禄': '',
    '权': '',
    '科': '',
    '忌': ''
  };
  
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
            type: type,
            description: fourHuaMeaning[type]?.description || '',
            effect: fourHuaMeaning[type]?.effect || ''
          });
          
          // 记录四化星所在宫位
          fourHuaPalaces[type] = `${palace.name}(${palace.branch})`;
          
          console.log(`📍 ${palace.branch}宫 ${star.name}化${type} - ${fourHuaMeaning[type]?.description || ''}`);
        }
      });
    });
  });
  
  // 输出四化星总结
  console.log(`\n🔄 四化星分布总结:`);
  console.log(`  禄星: ${fourTransformations['禄']} → ${fourHuaPalaces['禄'] || '未找到'}`);
  console.log(`  权星: ${fourTransformations['权']} → ${fourHuaPalaces['权'] || '未找到'}`);
  console.log(`  科星: ${fourTransformations['科']} → ${fourHuaPalaces['科'] || '未找到'}`);
  console.log(`  忌星: ${fourTransformations['忌']} → ${fourHuaPalaces['忌'] || '未找到'}`);
  
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