/**
 * 测试用户切换功能
 * 验证不同用户数据的排盘计算是否正确
 */

// 导入所需模块
const { calculatePalaceLayout } = require('../services/palace-calculation');

// 模拟app.js中的用户数据
const profiles = [
  {
    id: 'user1',
    name: '用户1',
    gender: 'male',
    date: '1991-01-22',
    time: '04:00',
    city: '太原市',
    calendarType: 'solar',
    trueSolarTime: true,
    yearStem: '庚',
    yearBranch: '午',
    lunarYear: 1990,
    lunarMonth: 12,
    lunarDay: 7,
    hourBranch: '寅',
    description: '公历1991年1月22日凌晨4点太原出生的男性（农历庚午年十二月初七寅时）'
  },
  {
    id: 'user2', 
    name: '用户2',
    gender: 'female',
    date: '2000-01-22',
    time: '02:00',
    city: '北京市',
    calendarType: 'solar',
    trueSolarTime: true,
    yearStem: '己',
    yearBranch: '卯',
    lunarYear: 1999,
    lunarMonth: 12,
    lunarDay: 16,
    hourBranch: '丑',
    description: '2000年1月22日北京出生的女性（农历己卯年十二月十六日丑时）'
  },
  {
    id: 'user3',
    name: '用户3', 
    gender: 'female',
    date: '2005-01-22',
    time: '02:00',
    city: '广州市',
    calendarType: 'solar',
    trueSolarTime: true,
    yearStem: '甲',
    yearBranch: '申',
    lunarYear: 2004,
    lunarMonth: 12,
    lunarDay: 12,
    hourBranch: '丑',
    description: '2005年1月22日广州出生的女性（农历甲申年十二月十二日丑时）'
  }
];

// 模拟页面中的计算排盘函数
function calculateChart(profile) {
  console.log(`🧮 计算${profile.name}的排盘...`);
  
  // 如果用户资料中已有完整的农历信息和八字信息，直接使用
  const enrichedProfile = profile;
  
  // 使用后端服务计算宫位布局
  const palaceLayoutResult = calculatePalaceLayout(enrichedProfile);
  
  if (palaceLayoutResult && palaceLayoutResult.success) {
    console.log('✅ 排盘计算成功');
    return palaceLayoutResult;
  } else {
    console.error('❌ 排盘计算失败:', palaceLayoutResult?.error || '未知错误');
    return null;
  }
}

// 模拟用户切换
function simulateProfileSwitching() {
  console.log('🔄 开始模拟用户切换...');
  
  profiles.forEach((profile, index) => {
    console.log(`\n👤 切换到用户 ${index + 1}: ${profile.name}`);
    
    // 计算排盘
    const result = calculateChart(profile);
    
    if (result) {
      // 验证命宫和身宫
      console.log(`📍 命宫位置: ${result.mingGong.stem}${result.mingGong.branch}`);
      console.log(`📍 身宫位置: ${result.shenGong.stem}${result.shenGong.branch}`);
      
      // 验证农历日期
      console.log(`📆 农历日期: ${result.calculation.yearStem}${result.calculation.yearBranch}年 ${result.calculation.lunarMonth}月${result.calculation.lunarDay}日`);
      
      // 验证紫微星位置
      console.log(`🌟 紫微星位置: ${result.ziWeiBranch}宫`);
      
      // 打印宫位排列
      console.log(`\n📋 ${profile.name} 的宫位排列:`);
      const validPalaces = result.palaces.filter(p => !p.isEmpty && !p.isCenter);
      validPalaces.forEach(palace => {
        const specialMark = palace.isMingGong ? ' [命宫]' : (palace.isShenGong ? ' [身宫]' : '');
        console.log(`  ${palace.layoutIndex}: ${palace.name} - ${palace.branch}宫${specialMark}`);
      });
    }
  });
  
  console.log('\n🎉 用户切换测试完成');
}

// 运行测试
simulateProfileSwitching(); 