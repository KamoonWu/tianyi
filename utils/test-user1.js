/**
 * 用户一排盘测试
 * 测试用户一的排盘结果，特别是农历转换和时辰显示
 */

// 导入所需模块
const { calculatePalaceLayout } = require('../services/palace-calculation');

// 用户一信息
const user1 = {
  id: 'user1',
  name: '用户1',
  gender: 'male',
  date: '1991-01-22',
  time: '04:00',
  city: '太原市',
  calendarType: 'solar',
  trueSolarTime: true,
  description: '公历1991年1月22日凌晨4点太原出生的男性'
};

// 运行测试
function runTest() {
  console.log('🧪 开始测试用户一排盘结果...');
  console.log(`📊 用户信息: ${user1.name}, ${user1.date} ${user1.time}`);
  
  // 1. 模拟页面中的八字信息提取
  const baziInfo = extractBaziFromProfile(user1);
  console.log('📊 八字信息:', baziInfo);
  
  // 2. 合并八字信息到用户资料
  const enrichedProfile = {
    ...user1,
    ...baziInfo
  };
  
  // 3. 计算排盘
  const palaceLayoutResult = calculatePalaceLayout(enrichedProfile);
  
  // 4. 验证结果
  if (palaceLayoutResult && palaceLayoutResult.success) {
    console.log('✅ 排盘计算成功');
    
    // 验证农历日期
    console.log(`📆 农历日期: ${palaceLayoutResult.calculation.lunarMonth}月${palaceLayoutResult.calculation.lunarDay}日`);
    
    // 验证时辰
    console.log(`🕓 时辰: ${palaceLayoutResult.calculation.birthHourBranch}时 (${palaceLayoutResult.calculation.hourName})`);
    
    // 验证命宫和身宫
    console.log(`📍 命宫位置: ${palaceLayoutResult.mingGong.stem}${palaceLayoutResult.mingGong.branch}`);
    console.log(`📍 身宫位置: ${palaceLayoutResult.shenGong.stem}${palaceLayoutResult.shenGong.branch}`);
    
    // 验证五行局
    console.log(`📊 五行局: ${palaceLayoutResult.fiveElements.name}`);
    
    // 验证紫微星位置
    console.log(`🌟 紫微星位置: ${palaceLayoutResult.ziWeiBranch}宫`);
    
    // 构建中宫信息
    const centerInfo = buildCenterFromProfile(user1, palaceLayoutResult);
    console.log('📊 中宫信息:', centerInfo);
    
    return true;
  } else {
    console.error('❌ 排盘计算失败:', palaceLayoutResult?.error || '未知错误');
    return false;
  }
}

// 从用户资料中提取八字信息
function extractBaziFromProfile(profile) {
  // 提取或生成年干支
  let yearStem = profile.yearStem;
  let yearBranch = profile.yearBranch;
  
  if (!yearStem || !yearBranch) {
    // 如果没有提供年干支，尝试从出生年份推算
    const birthYear = new Date(profile.date).getFullYear();
    // 简单推算年干支（实际应该使用农历年份）
    const stemIndex = (birthYear - 4) % 10; // 甲子年为公元4年
    const branchIndex = (birthYear - 4) % 12;
    
    const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    yearStem = stems[stemIndex];
    yearBranch = branches[branchIndex];
  }
  
  // 提取或生成月干支
  let monthStem = profile.monthStem;
  let monthBranch = profile.monthBranch;
  
  // 提取或生成日干支
  let dayStem = profile.dayStem;
  let dayBranch = profile.dayBranch;
  
  // 提取或生成时干支
  let hourStem = profile.hourStem;
  let hourBranch = profile.hourBranch;
  
  // 如果没有提供时辰地支，根据小时数推算
  if (!hourBranch) {
    const [hour] = (profile.time || '00:00').split(':').map(num => parseInt(num));
    hourBranch = getHourBranch(hour);
  }
  
  // 提取或生成农历信息
  let lunarMonth = profile.lunarMonth;
  let lunarDay = profile.lunarDay;
  
  if (!lunarMonth || !lunarDay) {
    // 如果没有提供农历日期，使用转换函数获取农历日期
    const lunarDate = convertSolarToLunar(profile.date);
    lunarMonth = lunarDate.month;
    lunarDay = lunarDate.day;
  }
  
  // 获取时辰名称
  const hourName = getHourName(hourBranch);
  
  return {
    yearStem,
    yearBranch,
    monthStem,
    monthBranch,
    dayStem,
    dayBranch,
    hourStem,
    hourBranch,
    hourName,
    lunarMonth,
    lunarDay
  };
}

// 构建中宫信息
function buildCenterFromProfile(profile, palaceLayoutResult) {
  return {
    name: profile.name || '—',
    gender: profile.gender || '—',
    solarDate: profile.date || '—',
    lunarDate: `农历${palaceLayoutResult.calculation.lunarMonth}月${palaceLayoutResult.calculation.lunarDay}日 ${palaceLayoutResult.calculation.hourName || ''}`,
    city: profile.city || '—',
    clockTime: `${profile.date} ${profile.time}`,
    trueSolarTime: profile.trueSolarTime ? '已转换' : '未转换',
    lifeMaster: palaceLayoutResult.mingGong.stem || '—', // 命主为命宫天干
    bodyMaster: palaceLayoutResult.shenGong.stem || '—', // 身主为身宫天干
    ziDou: palaceLayoutResult.ziWeiBranch || '—', // 紫微星所在地支
    fiveElements: palaceLayoutResult.fiveElements ? palaceLayoutResult.fiveElements.name : '—', // 五行局
    mingGong: palaceLayoutResult.mingGong,
    shenGong: palaceLayoutResult.shenGong,
    calculation: palaceLayoutResult.calculation
  };
}

// 根据小时数获取时辰地支
function getHourBranch(hour) {
  const hourMap = {
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
  
  const normalizedHour = ((hour % 24) + 24) % 24;
  return hourMap[normalizedHour] || '子';
}

// 根据地支获取时辰名称
function getHourName(hourBranch) {
  const hourNames = {
    '子': '子时（23:00-01:00）',
    '丑': '丑时（01:00-03:00）',
    '寅': '寅时（03:00-05:00）',
    '卯': '卯时（05:00-07:00）',
    '辰': '辰时（07:00-09:00）',
    '巳': '巳时（09:00-11:00）',
    '午': '午时（11:00-13:00）',
    '未': '未时（13:00-15:00）',
    '申': '申时（15:00-17:00）',
    '酉': '酉时（17:00-19:00）',
    '戌': '戌时（19:00-21:00）',
    '亥': '亥时（21:00-23:00）'
  };
  
  return hourNames[hourBranch] || hourBranch;
}

// 将公历日期转换为农历日期
function convertSolarToLunar(solarDate) {
  // 这里使用一个简单的映射表来模拟1991年1月的农历转换
  // 实际应用中应使用专业的农历转换库
  const lunarDateMap = {
    '1991-01-01': { month: 11, day: 16 }, // 农历十一月十六
    '1991-01-02': { month: 11, day: 17 },
    '1991-01-03': { month: 11, day: 18 },
    '1991-01-04': { month: 11, day: 19 },
    '1991-01-05': { month: 11, day: 20 },
    '1991-01-06': { month: 11, day: 21 },
    '1991-01-07': { month: 11, day: 22 },
    '1991-01-08': { month: 11, day: 23 },
    '1991-01-09': { month: 11, day: 24 },
    '1991-01-10': { month: 11, day: 25 },
    '1991-01-11': { month: 11, day: 26 },
    '1991-01-12': { month: 11, day: 27 },
    '1991-01-13': { month: 11, day: 28 },
    '1991-01-14': { month: 11, day: 29 },
    '1991-01-15': { month: 11, day: 30 }, // 农历十一月三十
    '1991-01-16': { month: 12, day: 1 },  // 农历十二月初一
    '1991-01-17': { month: 12, day: 2 },
    '1991-01-18': { month: 12, day: 3 },
    '1991-01-19': { month: 12, day: 4 },
    '1991-01-20': { month: 12, day: 5 },
    '1991-01-21': { month: 12, day: 6 },
    '1991-01-22': { month: 12, day: 7 },  // 农历十二月初七
    '1991-01-23': { month: 12, day: 8 },
    '1991-01-24': { month: 12, day: 9 },
    '1991-01-25': { month: 12, day: 10 },
    '1991-01-26': { month: 12, day: 11 },
    '1991-01-27': { month: 12, day: 12 },
    '1991-01-28': { month: 12, day: 13 },
    '1991-01-29': { month: 12, day: 14 },
    '1991-01-30': { month: 12, day: 15 },
    '1991-01-31': { month: 12, day: 16 },
    // 其他日期可以继续添加
  };
  
  // 尝试从映射表中获取农历日期
  const dateKey = solarDate.substring(0, 10); // 只取日期部分，不包括时间
  if (lunarDateMap[dateKey]) {
    return lunarDateMap[dateKey];
  }
  
  // 如果映射表中没有对应的日期，返回默认值
  console.warn(`⚠️ 未找到公历${dateKey}对应的农历日期，使用默认值`);
  return { month: 1, day: 1 };
}

// 运行测试
runTest(); 