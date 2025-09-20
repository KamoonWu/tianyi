/**
 * 测试标准地支布局
 * 验证地支位置是否符合紫微斗数标准布局
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

// 测试标准地支布局
function testStandardBranchLayout() {
  console.log('🔄 开始测试标准地支布局...');
  
  // 期望的地支顺序（按照紫微斗数标准布局）
  const expectedBranches = ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'];
  
  // 期望的地支在网格中的位置
  const expectedGridIndices = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4];
  
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
        
        // 检查原始十二宫的地支顺序是否符合预期
        const originalBranches = palaceLayoutResult.originalPalaces.map(p => p.branch);
        console.log(`  地支顺序: ${originalBranches.join(', ')}`);
        
        const isOriginalBranchesCorrect = originalBranches.every((branch, i) => branch === expectedBranches[i]);
        if (isOriginalBranchesCorrect) {
          console.log(`✅ 原始十二宫地支顺序正确`);
        } else {
          console.log(`❌ 原始十二宫地支顺序错误`);
          console.log(`  期望顺序: ${expectedBranches.join(', ')}`);
          console.log(`  实际顺序: ${originalBranches.join(', ')}`);
        }
      }
      
      // 输出网格布局数据
      console.log(`📊 网格布局数据 (${palaceLayoutResult.palaces.length}):`);
      const gridLayout = palaceLayoutResult.palaces.filter(p => p && !p.isCenter);
      
      // 检查网格布局中的地支位置是否符合预期
      const gridBranches = new Array(16).fill(null);
      gridLayout.forEach(palace => {
        if (palace && palace.branch) {
          gridBranches[palace.layoutIndex] = palace.branch;
        }
      });
      
      // 过滤掉中宫位置
      const nonNullGridBranches = gridBranches.filter(b => b !== null);
      console.log(`  网格地支顺序: ${nonNullGridBranches.join(', ')}`);
      
      // 检查每个地支是否在正确的位置
      let isGridPositionCorrect = true;
      expectedBranches.forEach((branch, i) => {
        const expectedIndex = expectedGridIndices[i];
        const actualIndex = gridBranches.indexOf(branch);
        if (actualIndex !== expectedIndex) {
          isGridPositionCorrect = false;
          console.log(`❌ 地支 ${branch} 位置错误: 期望在索引 ${expectedIndex}，实际在索引 ${actualIndex}`);
        }
      });
      
      if (isGridPositionCorrect) {
        console.log(`✅ 网格布局地支位置正确`);
      } else {
        console.log(`❌ 网格布局地支位置错误`);
      }
      
      // 输出每个宫位的信息
      gridLayout.forEach((palace, i) => {
        if (palace && palace.name) {
          console.log(`  ${palace.layoutIndex}. ${palace.name} - ${palace.branch}宫 (${palace.heavenlyStem}${palace.branch})`);
        }
      });

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
  
  console.log('\n🎉 标准地支布局测试完成');
}

// 运行测试
testStandardBranchLayout(); 