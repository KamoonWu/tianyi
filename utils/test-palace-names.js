/**
 * 测试宫位名称和地支位置的正确性
 * 验证宫位名称是固定顺序，但地支位置是从命宫开始逆时针排列
 */

// 导入所需模块
const { 
  calculateMingGongBranch, 
  calculateShenGongBranch, 
  calculateTwelvePalaces,
  calculateHeavenlyStems,
  EARTHLY_BRANCHES,
  PALACE_NAMES
} = require('../services/palace-calculation');

// 测试用例
const testCases = [
  { month: 3, hour: '申', expectedMing: '申', description: '农历三月申时出生' }
];

// 运行测试
function runTests() {
  console.log('🧪 开始测试宫位名称和地支位置...');
  
  testCases.forEach((testCase, index) => {
    console.log(`\n📋 测试用例 ${index + 1}: ${testCase.description}`);
    
    // 1. 计算命宫
    const mingGongBranch = calculateMingGongBranch(testCase.month, testCase.hour);
    console.log(`命宫计算结果: ${mingGongBranch}宫`);
    
    // 2. 计算十二宫排列
    const palaces = calculateTwelvePalaces(mingGongBranch);
    
    // 3. 验证宫位名称顺序
    console.log('\n📊 宫位名称顺序验证:');
    let nameOrderCorrect = true;
    for (let i = 0; i < palaces.length; i++) {
      const expectedName = PALACE_NAMES[i];
      const actualName = palaces[i].name;
      const isCorrect = expectedName === actualName;
      
      console.log(`${i + 1}. 期望: ${expectedName}, 实际: ${actualName} ${isCorrect ? '✓' : '✗'}`);
      
      if (!isCorrect) {
        nameOrderCorrect = false;
      }
    }
    
    console.log(`\n宫位名称顺序 ${nameOrderCorrect ? '✅ 正确' : '❌ 错误'}`);
    
    // 4. 验证地支位置
    console.log('\n📊 地支位置验证:');
    const mingGongIndex = EARTHLY_BRANCHES.indexOf(mingGongBranch);
    
    let branchOrderCorrect = true;
    for (let i = 0; i < palaces.length; i++) {
      const expectedBranchIndex = (mingGongIndex - i + 12) % 12;
      const expectedBranch = EARTHLY_BRANCHES[expectedBranchIndex];
      const actualBranch = palaces[i].branch;
      const isCorrect = expectedBranch === actualBranch;
      
      console.log(`${i + 1}. ${palaces[i].name}: 期望地支: ${expectedBranch}, 实际地支: ${actualBranch} ${isCorrect ? '✓' : '✗'}`);
      
      if (!isCorrect) {
        branchOrderCorrect = false;
      }
    }
    
    console.log(`\n地支位置 ${branchOrderCorrect ? '✅ 正确' : '❌ 错误'}`);
    
    // 5. 打印完整的十二宫排列
    console.log('\n📊 完整的十二宫排列:');
    palaces.forEach((palace, i) => {
      console.log(`${i + 1}. ${palace.name} - ${palace.branch}宫`);
    });
    
    // 6. 验证命宫例子
    if (testCase.description === '农历三月申时出生') {
      console.log('\n📊 验证农历三月申时出生的例子:');
      
      // 命宫应该在申宫
      const isMingGongCorrect = mingGongBranch === '申';
      console.log(`命宫应该在申宫: ${isMingGongCorrect ? '✅ 正确' : '❌ 错误'}`);
      
      // 命宫对应的宫位名称应该是"命宫"
      const mingGongPalace = palaces.find(p => p.branch === '申');
      const isMingGongNameCorrect = mingGongPalace && mingGongPalace.name === '命宫';
      console.log(`命宫对应的宫位名称应该是"命宫": ${isMingGongNameCorrect ? '✅ 正确' : '❌ 错误'}`);
      
      // 验证逆时针排列
      // 从申宫开始，逆时针依次是：申、未、午、巳、辰、卯、寅、丑、子、亥、戌、酉
      const expectedBranches = ['申', '未', '午', '巳', '辰', '卯', '寅', '丑', '子', '亥', '戌', '酉'];
      const actualBranches = palaces.map(p => p.branch);
      
      let isOrderCorrect = true;
      for (let i = 0; i < expectedBranches.length; i++) {
        if (expectedBranches[i] !== actualBranches[i]) {
          isOrderCorrect = false;
          break;
        }
      }
      
      console.log(`从命宫开始，逆时针排列地支: ${isOrderCorrect ? '✅ 正确' : '❌ 错误'}`);
      
      // 验证宫位名称固定顺序
      // 命宫、兄弟宫、夫妻宫、子女宫、财帛宫、疾厄宫、迁移宫、交友宫、官禄宫、田宅宫、福德宫、父母宫
      const expectedNames = PALACE_NAMES;
      const actualNames = palaces.map(p => p.name);
      
      let isNameOrderCorrect = true;
      for (let i = 0; i < expectedNames.length; i++) {
        if (expectedNames[i] !== actualNames[i]) {
          isNameOrderCorrect = false;
          break;
        }
      }
      
      console.log(`宫位名称固定顺序: ${isNameOrderCorrect ? '✅ 正确' : '❌ 错误'}`);
    }
  });
}

// 执行测试
runTests(); 