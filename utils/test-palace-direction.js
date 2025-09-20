/**
 * 测试宫位排列方向
 * 验证命宫计算和十二宫排列方向是否正确
 */

// 导入所需模块
const { 
  calculateMingGongBranch, 
  calculateShenGongBranch, 
  calculateTwelvePalaces,
  calculateHeavenlyStems,
  EARTHLY_BRANCHES
} = require('../services/palace-calculation');

// 测试用例
const testCases = [
  { month: 12, hour: '寅', expectedMing: '亥', expectedShen: '卯' }, // 农历十二月寅时
  { month: 1, hour: '子', expectedMing: '寅', expectedShen: '寅' },  // 农历正月子时
  { month: 3, hour: '申', expectedMing: '申', expectedShen: '子' },  // 农历三月申时
  { month: 6, hour: '午', expectedMing: '丑', expectedShen: '丑' },  // 农历六月午时，修正期望值
  { month: 9, hour: '卯', expectedMing: '未', expectedShen: '丑' }   // 农历九月卯时，修正期望值
];

// 运行测试
function runTests() {
  console.log('🧪 开始测试宫位排列方向...');
  
  let passedCount = 0;
  
  testCases.forEach((testCase, index) => {
    console.log(`\n📋 测试用例 ${index + 1}: 农历${testCase.month}月${testCase.hour}时`);
    
    // 1. 测试命宫计算
    const mingGongBranch = calculateMingGongBranch(testCase.month, testCase.hour);
    const mingGongCorrect = mingGongBranch === testCase.expectedMing;
    
    console.log(`命宫计算结果: ${mingGongBranch}宫`);
    console.log(`期望结果: ${testCase.expectedMing}宫`);
    console.log(`命宫计算 ${mingGongCorrect ? '✅ 正确' : '❌ 错误'}`);
    
    // 2. 测试身宫计算
    const shenGongBranch = calculateShenGongBranch(testCase.month, testCase.hour);
    const shenGongCorrect = shenGongBranch === testCase.expectedShen;
    
    console.log(`身宫计算结果: ${shenGongBranch}宫`);
    console.log(`期望结果: ${testCase.expectedShen}宫`);
    console.log(`身宫计算 ${shenGongCorrect ? '✅ 正确' : '❌ 错误'}`);
    
    // 3. 测试十二宫排列
    const palaces = calculateTwelvePalaces(mingGongBranch);
    const palacesWithStems = calculateHeavenlyStems('庚', palaces);
    
    console.log('\n📊 十二宫排列:');
    palacesWithStems.forEach((palace, i) => {
      console.log(`${i + 1}. ${palace.name} - ${palace.heavenlyStem}${palace.branch}宫`);
    });
    
    // 验证排列是否逆时针
    const mingGongIndex = EARTHLY_BRANCHES.indexOf(mingGongBranch);
    const expectedNextBranch = EARTHLY_BRANCHES[(mingGongIndex - 1 + 12) % 12];
    const actualNextBranch = palaces[1].branch;
    const directionCorrect = actualNextBranch === expectedNextBranch;
    
    console.log(`\n排列方向验证:`);
    console.log(`命宫的下一个宫应该是: ${expectedNextBranch}宫（逆时针）`);
    console.log(`实际的下一个宫是: ${actualNextBranch}宫`);
    console.log(`排列方向 ${directionCorrect ? '✅ 正确（逆时针）' : '❌ 错误（非逆时针）'}`);
    
    if (mingGongCorrect && shenGongCorrect && directionCorrect) {
      passedCount++;
    }
  });
  
  console.log(`\n📈 测试结果: ${passedCount}/${testCases.length} 通过`);
  if (passedCount === testCases.length) {
    console.log('🎉 所有测试通过！宫位排列方向修复成功！');
  } else {
    console.log('⚠️ 部分测试未通过，请检查修复代码。');
  }
}

// 执行测试
runTests(); 