/**
 * 测试不同用户数据的宫位排列
 * 验证动态计算宫位布局，而不是硬编码在前端
 */

// 导入所需模块
const { calculatePalaceLayout, generateEmptyPalaceLayout } = require('../services/palace-calculation');

// 测试用例
const testUsers = [
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
    description: '2000年1月22日北京出生的女性'
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
    description: '2005年1月22日广州出生的女性'
  },
  {
    id: 'empty',
    name: '空',
    gender: null,
    date: null,
    time: null,
    city: null,
    calendarType: null,
    trueSolarTime: null,
    description: '空白命例，用于查看数据展示逻辑'
  }
];

// 运行测试
function runTests() {
  console.log('🧪 开始测试不同用户数据的宫位排列...');
  
  testUsers.forEach(user => {
    console.log(`\n📋 测试用户: ${user.name} (${user.id})`);
    
    if (user.id === 'empty') {
      console.log('📄 检测到空档案，使用空白布局');
      const emptyLayout = generateEmptyPalaceLayout();
      validateEmptyLayout(emptyLayout);
    } else {
      console.log('🧮 模拟页面计算：' + user.name);
      const result = calculatePalaceLayout(user);
      
      if (result.success) {
        validatePalaceLayout(result, user);
      } else {
        console.error(`❌ ${user.name}: 排盘计算失败 - ${result.error}`);
      }
    }
  });
  
  console.log('\n📈 测试完成');
}

// 验证宫位布局
function validatePalaceLayout(result, user) {
  // 1. 检查是否有足够的宫位
  const validPalaces = result.palaces.filter(p => !p.isEmpty && !p.isCenter);
  const centerPalaces = result.palaces.filter(p => p.isCenter);
  
  console.log(`📊 ${user.name}: 有效宫位${validPalaces.length}个，中宫位置${centerPalaces.length}个`);
  
  if (validPalaces.length !== 12) {
    console.error(`❌ ${user.name}: 宫位数量错误，期望12个，实际${validPalaces.length}个`);
    return;
  }
  
  if (centerPalaces.length !== 4) {
    console.error(`❌ ${user.name}: 中宫位置数量错误，期望4个，实际${centerPalaces.length}个`);
    return;
  }
  
  // 2. 检查命宫和身宫
  const mingGong = validPalaces.find(p => p.isMingGong);
  const shenGong = validPalaces.find(p => p.isShenGong);
  
  if (!mingGong) {
    console.error(`❌ ${user.name}: 未找到命宫`);
    return;
  }
  
  if (!shenGong) {
    console.error(`❌ ${user.name}: 未找到身宫`);
    return;
  }
  
  console.log(`✅ ${user.name}: 验证通过`);
  
  // 打印宫位排列
  console.log(`\n📋 ${user.name} 的宫位排列：`);
  result.palaces.forEach((palace, index) => {
    if (!palace.isEmpty && !palace.isCenter) {
      const specialMark = palace.isMingGong ? ' [命宫]' : (palace.isShenGong ? ' [身宫]' : '');
      console.log(`  ${index}: ${palace.name} - ${palace.branch}宫${specialMark}`);
    }
  });
}

// 验证空白布局
function validateEmptyLayout(emptyLayout) {
  // 检查是否有足够的宫位
  const validPalaces = emptyLayout.filter(p => !p.isCenter);
  const centerPalaces = emptyLayout.filter(p => p.isCenter);
  
  console.log(`📊 空档案: 有效宫位${validPalaces.filter(p => !p.isEmpty).length}个，中宫位置${centerPalaces.length}个`);
  
  if (validPalaces.length !== 12) {
    console.error(`❌ 空档案: 宫位数量错误，期望12个，实际${validPalaces.length}个`);
    return;
  }
  
  if (centerPalaces.length !== 4) {
    console.error(`❌ 空档案: 中宫位置数量错误，期望4个，实际${centerPalaces.length}个`);
    return;
  }
  
  // 检查所有宫位是否都标记为空
  const allEmpty = validPalaces.every(p => p.isEmpty);
  
  if (!allEmpty) {
    console.error(`❌ 空档案: 存在非空宫位`);
    return;
  }
  
  console.log(`✅ 空档案: 验证通过`);
  
  // 打印空白布局
  console.log(`\n📋 空档案 的宫位排列：`);
  console.log('无宫位数据（空白排盘）');
}

// 执行测试
runTests(); 