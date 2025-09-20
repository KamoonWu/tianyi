/**
 * 测试中宫信息更新
 * 验证中宫信息在切换用户时能够正确更新
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

// 构建中宫信息
function buildCenterFromProfile(profile, palaceLayoutResult) {
  return {
    name: profile.name || '—',
    gender: profile.gender || '—',
    solarDate: profile.date || '—',
    lunarDate: `农历${palaceLayoutResult.calculation.yearStem || ''}${palaceLayoutResult.calculation.yearBranch || ''}年${palaceLayoutResult.calculation.lunarMonth}月${palaceLayoutResult.calculation.lunarDay}日 ${palaceLayoutResult.calculation.hourName || ''}`,
    city: profile.city || '—',
    clockTime: `${profile.date} ${profile.time}`,
    trueSolarTime: palaceLayoutResult.calculation.trueSolarTime ? `已转换 (${palaceLayoutResult.calculation.trueSolarTime})` : '未转换',
    lifeMaster: palaceLayoutResult.mingGong.stem || '—', // 命主为命宫天干
    bodyMaster: palaceLayoutResult.shenGong.stem || '—', // 身主为身宫天干
    ziDou: palaceLayoutResult.ziWeiBranch || '—', // 紫微星所在地支
    fiveElements: palaceLayoutResult.fiveElements ? palaceLayoutResult.fiveElements.name : '—', // 五行局
    mingGong: palaceLayoutResult.mingGong,
    shenGong: palaceLayoutResult.shenGong,
    calculation: palaceLayoutResult.calculation
  };
}

// 模拟组件的observer
let _centerInfo = null;
function centerObserver(newVal) {
  console.log('🔄 中宫信息更新:', newVal);
  if (newVal && Object.keys(newVal).length > 0) {
    _centerInfo = newVal;
    console.log('✅ 中宫信息已更新');
  }
}

// 模拟用户切换
function simulateUserSwitching() {
  console.log('🔄 开始模拟用户切换...');
  
  profiles.forEach((profile, index) => {
    console.log(`\n👤 切换到用户 ${index + 1}: ${profile.name}`);
    
    // 计算排盘
    const palaceLayoutResult = calculatePalaceLayout(profile);
    
    if (palaceLayoutResult && palaceLayoutResult.success) {
      // 构建中宫信息
      const centerInfo = buildCenterFromProfile(profile, palaceLayoutResult);
      
      // 模拟组件的observer
      centerObserver(centerInfo);
      
      // 验证中宫信息
      console.log(`📊 中宫信息验证:`);
      console.log(`  姓名: ${_centerInfo.name}`);
      console.log(`  性别: ${_centerInfo.gender}`);
      console.log(`  公历: ${_centerInfo.solarDate}`);
      console.log(`  农历: ${_centerInfo.lunarDate}`);
      console.log(`  城市: ${_centerInfo.city}`);
      console.log(`  命主: ${_centerInfo.lifeMaster}`);
      console.log(`  身主: ${_centerInfo.bodyMaster}`);
      console.log(`  子斗: ${_centerInfo.ziDou}`);
      console.log(`  五行局: ${_centerInfo.fiveElements}`);
    } else {
      console.error(`❌ ${profile.name}: 排盘计算失败`);
    }
  });
  
  console.log('\n🎉 用户切换测试完成');
}

// 运行测试
simulateUserSwitching(); 