/**
 * 测试宫位位置修复
 * 验证宫位位置是否根据命宫位置动态调整
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

// 测试宫位位置
function testPalacePositions() {
  console.log('🔄 开始测试宫位位置...');
  
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
      
      // 验证十二宫排列方向
      console.log(`📊 验证十二宫排列方向:`);
      const palaceOrder = [
        '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', 
        '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
      ];
      
      // 获取原始十二宫的名称顺序
      const originalPalaceNames = palaceLayoutResult.originalPalaces.map(p => p.name);
      
      // 检查顺序是否一致
      const isOrderCorrect = palaceOrder.every((name, i) => name === originalPalaceNames[i]);
      if (isOrderCorrect) {
        console.log(`✅ 十二宫排列顺序正确`);
      } else {
        console.log(`❌ 十二宫排列顺序错误`);
        console.log(`  期望顺序: ${palaceOrder.join(', ')}`);
        console.log(`  实际顺序: ${originalPalaceNames.join(', ')}`);
      }
      
      // 验证地支排列方向
      console.log(`📊 验证地支排列方向:`);
      const mingGongBranch = palaceLayoutResult.mingGong.branch;
      const mingGongBranchIndex = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(mingGongBranch);
      
      // 获取原始十二宫的地支顺序
      const originalBranches = palaceLayoutResult.originalPalaces.map(p => p.branch);
      
      // 检查地支是否顺时针排列
      let isClockwise = true;
      for (let i = 1; i < originalBranches.length; i++) {
        const prevBranchIndex = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(originalBranches[i-1]);
        const currBranchIndex = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(originalBranches[i]);
        if ((prevBranchIndex + 1) % 12 !== currBranchIndex) {
          isClockwise = false;
          break;
        }
      }
      
      if (isClockwise) {
        console.log(`✅ 地支顺时针排列正确`);
      } else {
        console.log(`❌ 地支排列方向错误`);
        console.log(`  实际地支顺序: ${originalBranches.join(', ')}`);
      }
    } else {
      console.error(`❌ ${profile.name}: 排盘计算失败`);
    }
  });
  
  console.log('\n🎉 宫位位置测试完成');
}

// 运行测试
testPalacePositions(); 