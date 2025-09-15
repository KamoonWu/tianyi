/**
 * 紫微斗数宫位计算工具
 * 根据紫微斗数的安命宫和安身宫口诀计算宫位
 */

// 地支顺序（按照紫微斗数的顺序排列）
const EARTHLY_BRANCHES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

// 地支对应的月份（农历）
const BRANCH_TO_MONTH = {
  '寅': 1,  // 正月
  '卯': 2,  // 二月
  '辰': 3,  // 三月
  '巳': 4,  // 四月
  '午': 5,  // 五月
  '未': 6,  // 六月
  '申': 7,  // 七月
  '酉': 8,  // 八月
  '戌': 9,  // 九月
  '亥': 10, // 十月
  '子': 11, // 十一月
  '丑': 12  // 十二月
};

// 时辰对应的地支
const HOUR_TO_BRANCH = {
  '23': '子', '0': '子',  // 23:00-00:59
  '1': '丑', '2': '丑',   // 01:00-02:59
  '3': '寅', '4': '寅',   // 03:00-04:59
  '5': '卯', '6': '卯',   // 05:00-06:59
  '7': '辰', '8': '辰',   // 07:00-08:59
  '9': '巳', '10': '巳',  // 09:00-10:59
  '11': '午', '12': '午', // 11:00-12:59
  '13': '未', '14': '未', // 13:00-14:59
  '15': '申', '16': '申', // 15:00-16:59
  '17': '酉', '18': '酉', // 17:00-18:59
  '19': '戌', '20': '戌', // 19:00-20:59
  '21': '亥', '22': '亥'  // 21:00-22:59
};

/**
 * 计算命宫位置
 * 安命宫口诀：寅起正月，顺数至生月。从生月宫位起子时，逆数至生时。
 * 
 * @param {number} lunarMonth - 农历月份（1-12）
 * @param {string} birthHourBranch - 出生时辰地支（子、丑、寅...）
 * @return {string} - 命宫地支
 */
function calculateMingGongBranch(lunarMonth, birthHourBranch) {
  try {
    // 步骤1：寅起正月，顺数至生月
    // 寅宫对应正月，所以需要找到对应月份的地支
    const monthIndex = lunarMonth - 1; // 月份从1开始，索引从0开始
    if (monthIndex < 0 || monthIndex >= 12) {
      console.error('无效的农历月份:', lunarMonth);
      return '寅'; // 默认返回寅
    }
    
    // 获取月支
    const monthBranch = EARTHLY_BRANCHES[monthIndex];
    console.log(`农历${lunarMonth}月对应地支: ${monthBranch} (索引: ${monthIndex})`);
    
    // 步骤2：从生月宫位起子时，逆数至生时
    // 首先找到子时在地支中的位置
    const ziIndex = EARTHLY_BRANCHES.indexOf('子');
    console.log(`子时地支索引: ${ziIndex}`);
    
    // 然后找到出生时辰在地支中的位置
    const birthHourIndex = EARTHLY_BRANCHES.indexOf(birthHourBranch);
    console.log(`出生时辰${birthHourBranch}地支索引: ${birthHourIndex}`);
    
    if (birthHourIndex === -1) {
      console.error('无法识别的出生时辰地支:', birthHourBranch);
      return monthBranch; // 出错时返回月支
    }
    
    // 计算从子时逆数到出生时辰需要的步数
    // 逆时针方向，所以是子时位置减去出生时辰位置
    let steps = ziIndex - birthHourIndex;
    
    // 如果步数为负，需要加上12（地支一圈）
    if (steps < 0) {
      steps += 12;
    }
    
    console.log(`从子时逆数到${birthHourBranch}需要${steps}步`);
    
    // 从月支位置逆时针走steps步
    let mingGongIndex = monthIndex - steps;
    
    // 如果索引为负，需要加上12
    if (mingGongIndex < 0) {
      mingGongIndex += 12;
    }
    
    console.log(`从月支${monthBranch}逆时针走${steps}步到达索引${mingGongIndex}`);
    
    const mingGongBranch = EARTHLY_BRANCHES[mingGongIndex];
    console.log(`命宫地支: ${mingGongBranch} (从${monthBranch}逆时针走${steps}步)`);
    
    return mingGongBranch;
  } catch (error) {
    console.error('计算命宫出错:', error);
    return '寅'; // 出错时默认返回寅
  }
}

/**
 * 计算身宫位置
 * 安身宫口诀：寅起正月，顺数至生月。从生月宫位起子时，顺数至生时。
 * 
 * @param {number} lunarMonth - 农历月份（1-12）
 * @param {string} birthHourBranch - 出生时辰地支（子、丑、寅...）
 * @return {string} - 身宫地支
 */
function calculateShenGongBranch(lunarMonth, birthHourBranch) {
  try {
    // 步骤1：寅起正月，顺数至生月
    // 寅宫对应正月，所以需要找到对应月份的地支
    const monthIndex = lunarMonth - 1; // 月份从1开始，索引从0开始
    if (monthIndex < 0 || monthIndex >= 12) {
      console.error('无效的农历月份:', lunarMonth);
      return '寅'; // 默认返回寅
    }
    
    // 获取月支
    const monthBranch = EARTHLY_BRANCHES[monthIndex];
    console.log(`农历${lunarMonth}月对应地支: ${monthBranch} (索引: ${monthIndex})`);

    // 步骤2：从生月宫位起子时，顺数至生时
    // 首先找到子时在地支中的位置
    const ziIndex = EARTHLY_BRANCHES.indexOf('子');
    console.log(`子时地支索引: ${ziIndex}`);

    // 然后找到出生时辰在地支中的位置
    const birthHourIndex = EARTHLY_BRANCHES.indexOf(birthHourBranch);
    console.log(`出生时辰${birthHourBranch}地支索引: ${birthHourIndex}`);

    if (birthHourIndex === -1) {
      console.error('无法识别的出生时辰地支:', birthHourBranch);
      return monthBranch; // 出错时返回月支
    }

    // 计算从子时顺数到出生时辰需要的步数
    // 顺时针方向，所以是出生时辰位置减去子时位置
    let steps = birthHourIndex - ziIndex;

    // 如果步数为负，需要加上12（地支一圈）
    if (steps < 0) {
      steps += 12;
    }

    console.log(`从子时顺数到${birthHourBranch}需要${steps}步`);

    // 从月支位置顺时针走steps步
    let shenGongIndex = monthIndex + steps;

    // 如果索引超过11，需要减去12
    if (shenGongIndex > 11) {
      shenGongIndex -= 12;
    }

    console.log(`从月支${monthBranch}顺时针走${steps}步到达索引${shenGongIndex}`);

    const shenGongBranch = EARTHLY_BRANCHES[shenGongIndex];
    console.log(`身宫地支: ${shenGongBranch} (从${monthBranch}顺时针走${steps}步)`);

    return shenGongBranch;
  } catch (error) {
    console.error('计算身宫出错:', error);
    return '寅'; // 出错时默认返回寅
  }
}

/**
 * 根据出生时间的小时数获取对应的时辰地支
 * @param {number} hour - 小时数（0-23）
 * @return {string} - 时辰地支
 */
function getHourBranch(hour) {
  // 确保hour是数字
  const hourNum = parseInt(hour);
  if (isNaN(hourNum)) {
    console.error('无效的小时数:', hour);
    return '子'; // 默认返回子时
  }
  
  // 处理超出范围的小时数
  const normalizedHour = ((hourNum % 24) + 24) % 24;
  
  // 查找对应的地支
  const branch = HOUR_TO_BRANCH[normalizedHour.toString()];
  if (!branch) {
    console.error('无法找到对应的时辰地支:', normalizedHour);
    return '子'; // 默认返回子时
  }
  
  return branch;
}

/**
 * 获取地支对应的宫位索引
 * 按照紫微斗数的标准顺序：寅宫为命宫时，对应索引0
 * @param {string} branch - 地支
 * @return {number} - 宫位索引
 */
function getBranchIndex(branch) {
  const branchIndex = EARTHLY_BRANCHES.indexOf(branch);
  if (branchIndex === -1) {
    console.error('无法识别的地支:', branch);
    return 0; // 默认返回0
  }
  return branchIndex;
}

/**
 * 计算命宫在十二宫中的索引位置
 * @param {string} mingGongBranch - 命宫地支
 * @return {number} - 命宫在十二宫中的索引（0-11）
 */
function getMingGongIndex(mingGongBranch) {
  // 紫微斗数中，命宫的位置是固定的，其他宫位按照地支顺序排列
  return getBranchIndex(mingGongBranch);
}

// 导出函数
module.exports = {
  calculateMingGongBranch,
  calculateShenGongBranch,
  getHourBranch,
  getMingGongIndex,
  EARTHLY_BRANCHES
}; 