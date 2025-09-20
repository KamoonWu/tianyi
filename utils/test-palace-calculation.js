/**
 * 测试新的宫位计算逻辑
 */

const { calculatePalaceLayout, generateEmptyPalaceLayout } = require('../services/palace-calculation');

// 测试用例1：农历三月申时出生（按照用户提供的示例）
function testExample1() {
  console.log('\n🧪 测试用例1：农历三月申时出生');
  
  const testProfile = {
    name: '测试用户1',
    date: '1991-03-15', // 对应农历三月
    time: '16:00', // 申时
    gender: '男',
    city: '北京市'
  };
  
  const result = calculatePalaceLayout(testProfile);
  
  console.log('📊 计算结果：', result);
  
  if (result.success) {
    console.log('✅ 计算成功');
    console.log('🎯 命宫：', result.mingGong);
    console.log('🎯 身宫：', result.shenGong);
    
    // 验证宫位布局
    console.log('\n📋 宫位布局验证：');
    result.palaces.forEach((palace, index) => {
      if (!palace.isEmpty && !palace.isCenter) {
        console.log(`${index}: ${palace.name} - ${palace.branch}宫 ${palace.isMingGong ? '(命宫)' : ''} ${palace.isShenGong ? '(身宫)' : ''}`);
      }
    });
  } else {
    console.log('❌ 计算失败：', result.error);
  }
}

// 测试用例2：不同时辰的计算
function testDifferentHours() {
  console.log('\n🧪 测试用例2：不同时辰的计算');
  
  const testHours = [
    { hour: '00:00', expected: '子时' },
    { hour: '04:00', expected: '寅时' },
    { hour: '12:00', expected: '午时' },
    { hour: '16:00', expected: '申时' },
    { hour: '22:00', expected: '亥时' }
  ];
  
  testHours.forEach(test => {
    const testProfile = {
      name: `测试${test.expected}`,
      date: '1991-01-15',
      time: test.hour,
      gender: '男'
    };
    
    const result = calculatePalaceLayout(testProfile);
    
    if (result.success) {
      console.log(`⏰ ${test.hour} -> ${test.expected} -> 命宫：${result.mingGong.branch}宫, 身宫：${result.shenGong.branch}宫`);
    } else {
      console.log(`❌ ${test.hour} 计算失败`);
    }
  });
}

// 测试用例3：空白宫位布局
function testEmptyLayout() {
  console.log('\n🧪 测试用例3：空白宫位布局');
  
  const emptyLayout = generateEmptyPalaceLayout();
  
  console.log('📄 空白布局长度：', emptyLayout.length);
  console.log('📋 空白布局结构：');
  
  emptyLayout.forEach((item, index) => {
    if (item.isCenter) {
      console.log(`${index}: [中宫区域]`);
    } else {
      console.log(`${index}: ${item.name} - ${item.branch}`);
    }
  });
}

// 测试用例4：验证十二宫顺序
function testPalaceOrder() {
  console.log('\n🧪 测试用例4：验证十二宫顺序');
  
  const testProfile = {
    name: '测试顺序',
    date: '1991-01-15',
    time: '04:00', // 寅时
    gender: '男'
  };
  
  const result = calculatePalaceLayout(testProfile);
  
  if (result.success) {
    console.log('🏯 十二宫顺序验证：');
    const palaceNames = [
      '命宫', '父母宫', '福德宫', '田宅宫', '官禄宫', '交友宫',
      '迁移宫', '疾厄宫', '财帛宫', '子女宫', '夫妻宫', '兄弟宫'
    ];
    
    const actualPalaces = result.palaces.filter(p => !p.isEmpty && !p.isCenter);
    
    palaceNames.forEach((expectedName, i) => {
      const actualPalace = actualPalaces.find(p => p.name === expectedName);
      if (actualPalace) {
        console.log(`✅ ${i + 1}. ${expectedName} -> ${actualPalace.branch}宫 (布局索引: ${actualPalace.layoutIndex})`);
      } else {
        console.log(`❌ ${i + 1}. ${expectedName} -> 未找到`);
      }
    });
  }
}

// 运行所有测试
function runAllTests() {
  console.log('🔬 开始运行宫位计算测试...\n');
  
  testExample1();
  testDifferentHours();
  testEmptyLayout();
  testPalaceOrder();
  
  console.log('\n✅ 所有测试完成');
}

// 如果直接运行此文件
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testExample1,
  testDifferentHours,
  testEmptyLayout,
  testPalaceOrder
}; 