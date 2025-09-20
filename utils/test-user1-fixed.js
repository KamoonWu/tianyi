/**
 * 用户一排盘测试（修复版）
 * 测试修复后的用户一排盘结果，特别是农历转换和时辰显示
 */

// 导入所需模块
const { calculatePalaceLayout } = require('../services/palace-calculation');
const lunarConverter = require('../utils/lunar-converter');

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
  console.log('🧪 开始测试修复后的用户一排盘结果...');
  console.log(`📊 用户信息: ${user1.name}, ${user1.date} ${user1.time}`);
  
  // 1. 测试农历转换
  const lunarDate = lunarConverter.convertSolarToLunar(user1.date);
  console.log('📆 农历日期转换结果:', lunarDate);
  console.log(`📆 农历年月日: ${lunarDate.yearStem}${lunarDate.yearBranch}年 ${lunarDate.month}月${lunarDate.day}日`);
  
  // 2. 测试时辰转换
  const [hour] = user1.time.split(':').map(num => parseInt(num));
  const hourBranch = lunarConverter.getHourBranch(hour);
  const hourName = lunarConverter.getHourName(hourBranch);
  console.log(`🕓 时辰转换: ${hour}点 -> ${hourBranch}时 (${hourName})`);
  
  // 3. 测试真太阳时计算
  const trueSolarTime = lunarConverter.calculateTrueSolarTime(user1.time, user1.city);
  console.log(`🕒 真太阳时: ${user1.time} -> ${trueSolarTime}`);
  
  // 4. 测试八字计算
  const baziInfo = lunarConverter.calculateBazi(user1);
  console.log('📊 八字计算结果:', baziInfo);
  
  // 5. 创建包含八字信息的用户资料
  const enrichedUser = {
    ...user1,
    ...baziInfo
  };
  
  // 6. 测试排盘计算
  const palaceLayoutResult = calculatePalaceLayout(enrichedUser);
  
  // 7. 验证结果
  if (palaceLayoutResult && palaceLayoutResult.success) {
    console.log('✅ 排盘计算成功');
    
    // 验证农历日期
    console.log(`📆 农历日期: ${palaceLayoutResult.calculation.yearStem}${palaceLayoutResult.calculation.yearBranch}年 ${palaceLayoutResult.calculation.lunarMonth}月${palaceLayoutResult.calculation.lunarDay}日`);
    
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
    const centerInfo = {
      name: user1.name || '—',
      gender: user1.gender || '—',
      solarDate: user1.date || '—',
      lunarDate: `农历${palaceLayoutResult.calculation.yearStem || ''}${palaceLayoutResult.calculation.yearBranch || ''}年${palaceLayoutResult.calculation.lunarMonth}月${palaceLayoutResult.calculation.lunarDay}日 ${palaceLayoutResult.calculation.hourName || ''}`,
      city: user1.city || '—',
      clockTime: `${user1.date} ${user1.time}`,
      trueSolarTime: palaceLayoutResult.calculation.trueSolarTime ? `已转换 (${palaceLayoutResult.calculation.trueSolarTime})` : '未转换',
      lifeMaster: palaceLayoutResult.mingGong.stem || '—', // 命主为命宫天干
      bodyMaster: palaceLayoutResult.shenGong.stem || '—', // 身主为身宫天干
      ziDou: palaceLayoutResult.ziWeiBranch || '—', // 紫微星所在地支
      fiveElements: palaceLayoutResult.fiveElements ? palaceLayoutResult.fiveElements.name : '—', // 五行局
      mingGong: palaceLayoutResult.mingGong,
      shenGong: palaceLayoutResult.shenGong,
      calculation: palaceLayoutResult.calculation
    };
    console.log('📊 中宫信息:', centerInfo);
    
    return true;
  } else {
    console.error('❌ 排盘计算失败:', palaceLayoutResult?.error || '未知错误');
    return false;
  }
}

// 运行测试
runTest(); 