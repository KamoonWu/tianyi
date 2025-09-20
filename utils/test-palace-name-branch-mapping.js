/**
 * 测试宫位名称和地支的对应关系
 * 验证宫位名称和地支的对应关系是否符合紫微斗数标准
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
  }
];

// 测试宫位名称和地支的对应关系
function testPalaceNameBranchMapping() {
  console.log('🔄 开始测试宫位名称和地支的对应关系...');
  
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
          console.log(`  ${palace.layoutIndex}. ${palace.name} - ${palace.branch}宫 (${palace.heavenlyStem}${palace.branch})`);
        }
      });
      
      // 验证命宫位置
      const mingGong = gridLayout.find(p => p.name === '命宫');
      if (mingGong) {
        console.log(`📊 命宫位置: 索引 ${mingGong.layoutIndex}, 地支: ${mingGong.branch}`);
        
        // 验证命宫是否与计算的命宫地支一致
        if (mingGong.branch === palaceLayoutResult.mingGong.branch) {
          console.log(`✅ 命宫地支正确: ${mingGong.branch}`);
        } else {
          console.log(`❌ 命宫地支错误: 期望 ${palaceLayoutResult.mingGong.branch}，实际 ${mingGong.branch}`);
        }
      } else {
        console.log(`❌ 未找到命宫`);
      }
      
      // 打印4x4网格布局
      console.log('\n📊 4x4网格布局:');
      console.log('-------------------------');
      for (let row = 0; row < 4; row++) {
        let rowStr = '| ';
        for (let col = 0; col < 4; col++) {
          const index = row * 4 + col;
          const palace = palaceLayoutResult.palaces[index];
          if (palace && palace.isCenter) {
            rowStr += '中宫 | ';
          } else if (palace && palace.branch) {
            rowStr += `${palace.branch}(${palace.name}) | `;
          } else {
            rowStr += '  | ';
          }
        }
        console.log(rowStr);
        console.log('-------------------------');
      }
    } else {
      console.error(`❌ ${profile.name}: 排盘计算失败`);
    }
  });
  
  console.log('\n🎉 宫位名称和地支的对应关系测试完成');
}

// 运行测试
testPalaceNameBranchMapping(); 