/**
 * 农历转换和八字计算工具
 * 
 * 注意：这是一个简化版本，仅包含1990-1991年的部分农历数据
 * 实际应用中应使用完整的农历转换库
 */

// 天干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 1990-1991年的农历数据映射表
// 格式: { 公历日期: { year: 农历年, yearStem: 年干, yearBranch: 年支, month: 农历月, day: 农历日 } }
const LUNAR_DATE_MAP = {
  // 1990年12月
  '1990-12-01': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 15 },
  '1990-12-02': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 16 },
  '1990-12-03': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 17 },
  '1990-12-04': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 18 },
  '1990-12-05': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 19 },
  '1990-12-06': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 20 },
  '1990-12-07': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 21 },
  '1990-12-08': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 22 },
  '1990-12-09': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 23 },
  '1990-12-10': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 24 },
  '1990-12-11': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 25 },
  '1990-12-12': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 26 },
  '1990-12-13': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 27 },
  '1990-12-14': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 28 },
  '1990-12-15': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 29 },
  '1990-12-16': { year: 1990, yearStem: '庚', yearBranch: '午', month: 10, day: 30 },
  '1990-12-17': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 1 },
  '1990-12-18': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 2 },
  '1990-12-19': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 3 },
  '1990-12-20': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 4 },
  '1990-12-21': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 5 },
  '1990-12-22': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 6 },
  '1990-12-23': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 7 },
  '1990-12-24': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 8 },
  '1990-12-25': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 9 },
  '1990-12-26': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 10 },
  '1990-12-27': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 11 },
  '1990-12-28': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 12 },
  '1990-12-29': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 13 },
  '1990-12-30': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 14 },
  '1990-12-31': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 15 },

  // 1991年1月
  '1991-01-01': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 16 },
  '1991-01-02': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 17 },
  '1991-01-03': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 18 },
  '1991-01-04': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 19 },
  '1991-01-05': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 20 },
  '1991-01-06': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 21 },
  '1991-01-07': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 22 },
  '1991-01-08': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 23 },
  '1991-01-09': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 24 },
  '1991-01-10': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 25 },
  '1991-01-11': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 26 },
  '1991-01-12': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 27 },
  '1991-01-13': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 28 },
  '1991-01-14': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 29 },
  '1991-01-15': { year: 1990, yearStem: '庚', yearBranch: '午', month: 11, day: 30 },
  '1991-01-16': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 1 },
  '1991-01-17': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 2 },
  '1991-01-18': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 3 },
  '1991-01-19': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 4 },
  '1991-01-20': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 5 },
  '1991-01-21': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 6 },
  '1991-01-22': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 7 },
  '1991-01-23': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 8 },
  '1991-01-24': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 9 },
  '1991-01-25': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 10 },
  '1991-01-26': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 11 },
  '1991-01-27': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 12 },
  '1991-01-28': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 13 },
  '1991-01-29': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 14 },
  '1991-01-30': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 15 },
  '1991-01-31': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 16 },

  // 1991年2月 (农历正月)
  '1991-02-01': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 17 },
  '1991-02-02': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 18 },
  '1991-02-03': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 19 },
  '1991-02-04': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 20 },
  '1991-02-05': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 21 },
  '1991-02-06': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 22 },
  '1991-02-07': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 23 },
  '1991-02-08': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 24 },
  '1991-02-09': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 25 },
  '1991-02-10': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 26 },
  '1991-02-11': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 27 },
  '1991-02-12': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 28 },
  '1991-02-13': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 29 },
  '1991-02-14': { year: 1990, yearStem: '庚', yearBranch: '午', month: 12, day: 30 },
  '1991-02-15': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 1 },
  '1991-02-16': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 2 },
  '1991-02-17': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 3 },
  '1991-02-18': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 4 },
  '1991-02-19': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 5 },
  '1991-02-20': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 6 },
  '1991-02-21': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 7 },
  '1991-02-22': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 8 },
  '1991-02-23': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 9 },
  '1991-02-24': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 10 },
  '1991-02-25': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 11 },
  '1991-02-26': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 12 },
  '1991-02-27': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 13 },
  '1991-02-28': { year: 1991, yearStem: '辛', yearBranch: '未', month: 1, day: 14 }
};

/**
 * 将公历日期转换为农历日期
 * @param {string} solarDate - 公历日期字符串，格式为 YYYY-MM-DD
 * @returns {Object} - 农历日期对象，包含年、月、日、年干支等信息
 */
function convertSolarToLunar(solarDate) {
  // 尝试从映射表中获取农历日期
  const dateKey = solarDate.substring(0, 10); // 只取日期部分，不包括时间
  if (LUNAR_DATE_MAP[dateKey]) {
    return LUNAR_DATE_MAP[dateKey];
  }
  
  // 如果映射表中没有对应的日期，返回默认值
  console.warn(`⚠️ 未找到公历${dateKey}对应的农历日期，使用默认值`);
  return { 
    year: new Date(solarDate).getFullYear(), 
    yearStem: '甲', 
    yearBranch: '子', 
    month: 1, 
    day: 1 
  };
}

/**
 * 根据小时数获取时辰地支
 * @param {number} hour - 小时数（0-23）
 * @param {number} [minute=0] - 分钟数（0-59）
 * @returns {string} - 对应的时辰地支
 */
function getHourBranch(hour, minute = 0) {
  // 将小时和分钟转换为总分钟数
  const totalMinutes = hour * 60 + minute;
  
  // 时辰对应表（按总分钟数范围）
  const hourRanges = [
    { branch: '子', start: 23 * 60, end: 24 * 60 + 59 }, // 23:00-00:59
    { branch: '子', start: 0, end: 60 - 1 },            // 00:00-00:59
    { branch: '丑', start: 60, end: 3 * 60 - 1 },       // 01:00-02:59
    { branch: '寅', start: 3 * 60, end: 5 * 60 - 1 },   // 03:00-04:59
    { branch: '卯', start: 5 * 60, end: 7 * 60 - 1 },   // 05:00-06:59
    { branch: '辰', start: 7 * 60, end: 9 * 60 - 1 },   // 07:00-08:59
    { branch: '巳', start: 9 * 60, end: 11 * 60 - 1 },  // 09:00-10:59
    { branch: '午', start: 11 * 60, end: 13 * 60 - 1 }, // 11:00-12:59
    { branch: '未', start: 13 * 60, end: 15 * 60 - 1 }, // 13:00-14:59
    { branch: '申', start: 15 * 60, end: 17 * 60 - 1 }, // 15:00-16:59
    { branch: '酉', start: 17 * 60, end: 19 * 60 - 1 }, // 17:00-18:59
    { branch: '戌', start: 19 * 60, end: 21 * 60 - 1 }, // 19:00-20:59
    { branch: '亥', start: 21 * 60, end: 23 * 60 - 1 }  // 21:00-22:59
  ];
  
  // 处理跨日问题
  let normalizedMinutes = totalMinutes;
  while (normalizedMinutes < 0) normalizedMinutes += 24 * 60;
  while (normalizedMinutes >= 24 * 60) normalizedMinutes -= 24 * 60;
  
  // 查找对应的时辰
  for (const range of hourRanges) {
    if (normalizedMinutes >= range.start && normalizedMinutes <= range.end) {
      return range.branch;
    }
  }
  
  // 默认返回子时
  return '子';
}

/**
 * 根据地支获取时辰名称
 * @param {string} branch - 时辰地支
 * @returns {string} - 时辰名称
 */
function getHourName(branch) {
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
  
  return hourNames[branch] || branch;
}

/**
 * 计算真太阳时（简化版，仅考虑经度修正）
 * @param {string} time - 时间字符串，格式为 HH:MM
 * @param {string} location - 地点名称
 * @returns {string} - 修正后的时间字符串
 */
function calculateTrueSolarTime(time, location) {
  // 简化版本，仅考虑经度修正
  // 实际应用中应考虑更多因素
  
  // 主要城市经度参考值（东经为正，西经为负）
  const cityLongitudes = {
    '北京市': 116.4,
    '上海市': 121.5,
    '广州市': 113.3,
    '深圳市': 114.1,
    '太原市': 112.5,  // 太原市经度约为东经112.5度
    '杭州市': 120.2,
    '成都市': 104.1,
    '武汉市': 114.3,
    '西安市': 108.9,
    '南京市': 118.8
  };
  
  // 标准时区经度（东八区）
  const standardLongitude = 120;
  
  // 获取城市经度，如果没有则使用标准经度
  const cityLongitude = cityLongitudes[location] || standardLongitude;
  
  // 计算经度差引起的时间差（分钟）
  const longitudeTimeDiff = (standardLongitude - cityLongitude) * 4; // 每经度1度约等于4分钟时差
  
  // 解析原始时间
  const [hour, minute] = time.split(':').map(num => parseInt(num));
  
  // 计算调整后的分钟总数
  let totalMinutes = hour * 60 + minute - longitudeTimeDiff;
  
  // 处理跨日问题
  while (totalMinutes < 0) totalMinutes += 24 * 60;
  while (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
  
  // 转换回小时和分钟
  const adjustedHour = Math.floor(totalMinutes / 60);
  const adjustedMinute = totalMinutes % 60;
  
  // 格式化输出
  return `${String(adjustedHour).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
}

/**
 * 计算八字
 * @param {Object} profile - 用户档案信息
 * @returns {Object} - 八字信息
 */
function calculateBazi(profile) {
  // 1. 转换公历日期为农历日期
  const lunarDate = convertSolarToLunar(profile.date);
  
  // 2. 计算真太阳时
  let timeForHour = profile.time;
  if (profile.trueSolarTime) {
    timeForHour = calculateTrueSolarTime(profile.time, profile.city);
  }
  
  // 3. 获取时辰地支（使用真太阳时）
  const [hour, minute] = timeForHour.split(':').map(num => parseInt(num));
  const hourBranch = getHourBranch(hour, minute);
  
  // 4. 获取时辰名称
  const hourName = getHourName(hourBranch);
  
  // 5. 获取年干支
  const yearStem = lunarDate.yearStem;
  const yearBranch = lunarDate.yearBranch;
  
  // 6. 获取月干支（简化版）
  // 实际应该根据节气计算
  const monthStem = '';
  const monthBranch = '';
  
  // 7. 获取日干支（简化版）
  // 实际应该根据天干地支历法计算
  const dayStem = '';
  const dayBranch = '';
  
  // 8. 获取时干（简化版）
  // 实际应该根据日干推算
  const hourStem = '';
  
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
    lunarYear: lunarDate.year,
    lunarMonth: lunarDate.month,
    lunarDay: lunarDate.day,
    trueSolarTime: timeForHour
  };
}

module.exports = {
  convertSolarToLunar,
  getHourBranch,
  getHourName,
  calculateTrueSolarTime,
  calculateBazi,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES
}; 