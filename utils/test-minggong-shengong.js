/**
 * 测试命宫和身宫计算
 * 验证命宫和身宫的计算是否符合紫微斗数口诀
 */

// 导入所需模块
const { calculateMingGongBranch, calculateShenGongBranch } = require('../services/palace-calculation');

// 测试用例
const testCases = [
  { 
    description: '农历三月申时出生',
    lunarMonth: 3,
    birthHourBranch: '申',
    expectedMingGong: '申',
    expectedShenGong: '子'
  },
  { 
    description: '农历十二月寅时出生',
    lunarMonth: 12,
    birthHourBranch: '寅',
    expectedMingGong: '亥',
    expectedShenGong: '卯'
  },
  { 
    description: '农历七月子时出生',
    lunarMonth: 7,
    birthHourBranch: '子',
    expectedMingGong: '申',
    expectedShenGong: '申'
  },
  { 
    description: '农历一月午时出生',
    lunarMonth: 1,
    birthHourBranch: '午',
    expectedMingGong: '申',
    expectedShenGong: '申'
  }
];

// 测试命宫和身宫计算
function testMingGongShenGong() {
  console.log('🔄 开始测试命宫和身宫计算...');
  
  testCases.forEach((testCase, index) => {
    console.log(`\n👤 测试用例 ${index + 1}: ${testCase.description}`);
    
    // 计算命宫
    const mingGongBranch = calculateMingGongBranch(testCase.lunarMonth, testCase.birthHourBranch);
    
    // 验证命宫计算结果
    if (mingGongBranch === testCase.expectedMingGong) {
      console.log(`✅ 命宫计算正确: ${mingGongBranch}`);
    } else {
      console.log(`❌ 命宫计算错误: 期望 ${testCase.expectedMingGong}，实际 ${mingGongBranch}`);
      
      // 详细解释计算过程
      console.log('🔍 命宫计算详解:');
      console.log(`  1. 寅起正月，顺数至生月（${testCase.lunarMonth}月）`);
      const monthBranchIndex = (2 + testCase.lunarMonth - 1) % 12;
      const monthBranch = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][monthBranchIndex];
      console.log(`  2. 得到月支: ${monthBranch}（索引${monthBranchIndex}）`);
      
      const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      const hourPosition = hourOrder.indexOf(testCase.birthHourBranch);
      console.log(`  3. 从月支位置起子时，逆数至生时（${testCase.birthHourBranch}时，位置${hourPosition}）`);
      
      const mingGongIndex = (monthBranchIndex - hourPosition + 12) % 12;
      const expectedMingGongIndex = hourOrder.indexOf(testCase.expectedMingGong);
      console.log(`  4. 计算命宫: ${monthBranchIndex} - ${hourPosition} = ${mingGongIndex}（应为${expectedMingGongIndex}）`);
    }
    
    // 计算身宫
    const shenGongBranch = calculateShenGongBranch(testCase.lunarMonth, testCase.birthHourBranch);
    
    // 验证身宫计算结果
    if (shenGongBranch === testCase.expectedShenGong) {
      console.log(`✅ 身宫计算正确: ${shenGongBranch}`);
    } else {
      console.log(`❌ 身宫计算错误: 期望 ${testCase.expectedShenGong}，实际 ${shenGongBranch}`);
      
      // 详细解释计算过程
      console.log('🔍 身宫计算详解:');
      console.log(`  1. 寅起正月，顺数至生月（${testCase.lunarMonth}月）`);
      const monthBranchIndex = (2 + testCase.lunarMonth - 1) % 12;
      const monthBranch = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][monthBranchIndex];
      console.log(`  2. 得到月支: ${monthBranch}（索引${monthBranchIndex}）`);
      
      const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      const hourPosition = hourOrder.indexOf(testCase.birthHourBranch);
      console.log(`  3. 从月支位置起子时，顺数至生时（${testCase.birthHourBranch}时，位置${hourPosition}）`);
      
      const shenGongIndex = (monthBranchIndex + hourPosition) % 12;
      const expectedShenGongIndex = hourOrder.indexOf(testCase.expectedShenGong);
      console.log(`  4. 计算身宫: ${monthBranchIndex} + ${hourPosition} = ${shenGongIndex}（应为${expectedShenGongIndex}）`);
    }
  });
  
  console.log('\n🎉 命宫和身宫计算测试完成');
}

// 运行测试
testMingGongShenGong(); 