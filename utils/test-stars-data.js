/**
 * 测试星曜数据是否正确包含在宫位计算结果中
 */

const { calculatePalaceLayout } = require('../services/palace-calculation');

function testStarsData() {
  console.log('🌟 测试星曜数据...\n');
  
  const testProfile = {
    name: '测试星曜',
    date: '1991-03-15',
    time: '16:00',
    gender: '男',
    city: '北京市'
  };
  
  const result = calculatePalaceLayout(testProfile);
  
  if (!result.success) {
    console.log('❌ 宫位计算失败');
    return false;
  }
  
  console.log('✅ 宫位计算成功，检查星曜数据：\n');
  
  // 检查每个有效宫位的星曜数据
  let hasStars = false;
  result.palaces.forEach((palace, index) => {
    if (!palace.isEmpty && !palace.isCenter) {
      console.log(`🏯 ${palace.name} (${palace.branch}宫):`);
      
      if (palace.stars && palace.stars.length > 0) {
        hasStars = true;
        palace.stars.forEach(star => {
          const brightness = star.brightness ? `(${star.brightness})` : '';
          const type = star.type ? `[${star.type}]` : '';
          console.log(`  ⭐ ${star.name}${brightness}${type}`);
        });
      } else {
        console.log(`  📝 暂无星曜`);
      }
      
      // 特别标记命宫和身宫
      if (palace.isMingGong) {
        console.log(`  🎯 【命宫】`);
      }
      if (palace.isShenGong) {
        console.log(`  🎯 【身宫】`);
      }
      
      console.log('');
    }
  });
  
  if (hasStars) {
    console.log('✅ 检测到星曜数据，数据结构正确');
  } else {
    console.log('❌ 未检测到星曜数据，可能存在问题');
  }
  
  return hasStars;
}

function testFieldOptimizationData() {
  console.log('\n🔧 测试字段优化系统数据格式...\n');
  
  const { getPalaceFieldData } = require('../utils/palace-field-optimization');
  
  // 模拟宫位数据
  const mockPalace = {
    name: '命宫',
    branch: '申',
    stars: [
      { name: '紫微', brightness: '庙', type: 'main' },
      { name: '左辅', brightness: '平', type: 'auxiliary' }
    ],
    gods: [],
    heavenlyStem: '',
    minorLimit: '',
    ageRange: '',
    fourHua: []
  };
  
  const mockFlowYear = {
    heavenlyStem: '乙',
    earthlyBranch: '巳',
    year: 2024
  };
  
  try {
    const fieldData = getPalaceFieldData(mockPalace, mockFlowYear);
    
    console.log('📋 字段优化系统提取的数据：');
    console.log(`  allStars: [${fieldData.allStars.map(s => s.name).join(', ')}]`);
    console.log(`  palaceName: "${fieldData.palaceName}"`);
    console.log(`  heavenlyStemBranch: "${fieldData.heavenlyStemBranch}"`);
    console.log(`  flowYear: "${fieldData.flowYear}"`);
    
    if (fieldData.allStars.length > 0) {
      console.log('✅ 字段优化系统能正确提取星曜数据');
      return true;
    } else {
      console.log('❌ 字段优化系统未能提取到星曜数据');
      return false;
    }
  } catch (error) {
    console.error('❌ 字段优化系统测试失败:', error);
    return false;
  }
}

function runStarsDataTest() {
  console.log('🔬 开始运行星曜数据测试...\n');
  
  const test1 = testStarsData();
  const test2 = testFieldOptimizationData();
  
  console.log('\n📊 测试结果总结：');
  console.log(`  宫位星曜数据: ${test1 ? '✅ 通过' : '❌ 失败'}`);
  console.log(`  字段优化系统: ${test2 ? '✅ 通过' : '❌ 失败'}`);
  
  if (test1 && test2) {
    console.log('\n🎉 所有星曜数据测试通过！');
  } else {
    console.log('\n⚠️ 部分测试失败，需要检查数据结构');
  }
  
  return test1 && test2;
}

// 如果直接运行此文件
if (require.main === module) {
  runStarsDataTest();
}

module.exports = {
  runStarsDataTest,
  testStarsData,
  testFieldOptimizationData
}; 