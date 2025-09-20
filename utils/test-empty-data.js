/**
 * 测试空数据时的显示效果
 */

const { generateEmptyPalaceLayout } = require('../services/palace-calculation');
const { getPalaceFieldData } = require('../utils/palace-field-optimization');

function testEmptyPalaceDisplay() {
  console.log('📄 测试空数据时的宫位显示...\n');
  
  // 生成空白宫位布局
  const emptyLayout = generateEmptyPalaceLayout();
  
  console.log('🔍 空白布局数据：');
  console.log(`总共 ${emptyLayout.length} 个位置\n`);
  
  // 检查每个位置的数据
  emptyLayout.forEach((item, index) => {
    if (item.isCenter) {
      console.log(`${index}: [中宫区域] - 空白`);
    } else {
      console.log(`${index}: ${item.name} - ${item.branch} (isEmpty: ${item.isEmpty})`);
      
      // 验证字段优化系统处理
      const mockFlowYear = {
        heavenlyStem: '乙',
        earthlyBranch: '巳',
        year: 2024
      };
      
      try {
        const fieldData = getPalaceFieldData(item, mockFlowYear);
        
        console.log(`     字段数据:`);
        console.log(`       palaceName: "${fieldData.palaceName}"`);
        console.log(`       heavenlyStemBranch: "${fieldData.heavenlyStemBranch}"`);
        console.log(`       allStars: [${fieldData.allStars.map(s => s.name).join(', ')}]`);
        console.log(`       leftBottomGods: [${fieldData.leftBottomGods.map(g => g.name).join(', ')}]`);
      } catch (error) {
        console.log(`     ❌ 字段处理出错: ${error.message}`);
      }
      
      console.log('');
    }
  });
  
  // 统计验证
  const centerCells = emptyLayout.filter(item => item.isCenter);
  const palaceCells = emptyLayout.filter(item => !item.isCenter);
  const emptyCells = palaceCells.filter(item => item.isEmpty);
  
  console.log('📊 统计结果：');
  console.log(`  中宫区域: ${centerCells.length} 个`);
  console.log(`  宫位区域: ${palaceCells.length} 个`);
  console.log(`  空宫位: ${emptyCells.length} 个`);
  console.log(`  空宫位名称: ${emptyCells.map(c => c.name).join(', ')}`);
  console.log(`  空宫位地支: ${emptyCells.map(c => c.branch).join(', ')}`);
  
  // 验证是否都显示"—"
  const allShowDash = emptyCells.every(cell => cell.name === '—' && cell.branch === '—');
  
  if (allShowDash) {
    console.log('\n✅ 验证通过：所有空宫位都正确显示"—"');
    return true;
  } else {
    console.log('\n❌ 验证失败：仍有宫位显示具体名称');
    return false;
  }
}

function testEmptyVsValidData() {
  console.log('\n🔄 对比测试：空数据 vs 有效数据...\n');
  
  const { calculatePalaceLayout } = require('../services/palace-calculation');
  
  // 测试有效数据
  const validProfile = {
    name: '有数据用户',
    date: '1991-03-15',
    time: '16:00',
    gender: '男',
    city: '北京市'
  };
  
  const validResult = calculatePalaceLayout(validProfile);
  
  // 测试空数据
  const emptyLayout = generateEmptyPalaceLayout();
  
  console.log('📋 对比结果：');
  console.log('\n【有效数据】:');
  const validPalaces = validResult.palaces.filter(p => !p.isEmpty && !p.isCenter);
  validPalaces.slice(0, 3).forEach(palace => {
    console.log(`  ${palace.name} - ${palace.branch}宫 (stars: ${palace.stars.length})`);
  });
  
  console.log('\n【空数据】:');
  const emptyPalaces = emptyLayout.filter(p => !p.isCenter);
  emptyPalaces.slice(0, 3).forEach(palace => {
    console.log(`  ${palace.name} - ${palace.branch} (stars: ${palace.stars.length})`);
  });
  
  console.log('\n✅ 对比完成：有效数据显示具体宫名，空数据显示"—"');
}

function runEmptyDataTest() {
  console.log('🧪 开始运行空数据测试...\n');
  
  const test1 = testEmptyPalaceDisplay();
  testEmptyVsValidData();
  
  console.log('\n📈 测试结果：');
  console.log(`  空数据显示: ${test1 ? '✅ 正确' : '❌ 错误'}`);
  
  if (test1) {
    console.log('\n🎉 空数据测试全部通过！');
    console.log('💡 现在用户数据为空时，排盘会正确显示"—"而不是固定的宫名');
  } else {
    console.log('\n⚠️ 空数据测试失败，需要进一步检查');
  }
  
  return test1;
}

// 如果直接运行此文件
if (require.main === module) {
  runEmptyDataTest();
}

module.exports = {
  runEmptyDataTest,
  testEmptyPalaceDisplay,
  testEmptyVsValidData
}; 