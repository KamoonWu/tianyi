/**
 * 测试宫位名称修复
 * 验证宫位名称是否根据命宫位置动态调整
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

// 测试宫位名称
function testPalaceNames() {
  console.log('🔄 开始测试宫位名称...');
  
  profiles.forEach((profile, index) => {
    console.log(`\n👤 测试用户 ${index + 1}: ${profile.name}`);
    
    // 计算排盘
    const palaceLayoutResult = calculatePalaceLayout(profile);
    
    if (palaceLayoutResult && palaceLayoutResult.success) {
      console.log(`✅ 后端计算成功`);
      
      // 输出命宫和身宫信息
      console.log(`📊 命宫: ${palaceLayoutResult.mingGong.branch} (${palaceLayoutResult.mingGong.name})`);
      console.log(`📊 身宫: ${palaceLayoutResult.shenGong.branch} (${palaceLayoutResult.shenGong.name})`);
      
      // 输出原始十二宫数据
      if (palaceLayoutResult.originalPalaces) {
        console.log(`📊 原始十二宫数据 (${palaceLayoutResult.originalPalaces.length}):`);
        palaceLayoutResult.originalPalaces.forEach((palace, i) => {
          console.log(`  ${i + 1}. ${palace.name} - ${palace.branch}宫 (${palace.heavenlyStem}${palace.branch})`);
        });
      }
      
      // 输出网格布局数据
      console.log(`📊 网格布局数据 (${palaceLayoutResult.palaces.length}):`);
      const gridLayout = palaceLayoutResult.palaces.filter(p => p && !p.isCenter);
      gridLayout.forEach((palace, i) => {
        if (palace && palace.name) {
          console.log(`  ${i}. ${palace.name} - ${palace.branch}宫 (${palace.heavenlyStem}${palace.branch})`);
        }
      });
      
      // 验证命宫位置
      const mingGong = gridLayout.find(p => p.name === '命宫');
      if (mingGong) {
        console.log(`📊 命宫位置: 索引 ${mingGong.layoutIndex}`);
        if (mingGong.layoutIndex === 0) {
          console.log(`✅ 命宫位置正确`);
        } else {
          console.log(`❌ 命宫位置错误，应该在索引 0，实际在索引 ${mingGong.layoutIndex}`);
        }
      } else {
        console.log(`❌ 未找到命宫`);
      }
    } else {
      console.error(`❌ ${profile.name}: 排盘计算失败`);
    }
  });
  
  console.log('\n🎉 宫位名称测试完成');
}

// 运行测试
testPalaceNames(); 