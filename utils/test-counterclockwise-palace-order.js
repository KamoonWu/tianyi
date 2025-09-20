/**
 * 测试逆时针宫位排列
 * 验证宫位的排列顺序是否是逆时针，同时地支的固定布局不变
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

// 测试逆时针宫位排列
function testCounterclockwisePalaceOrder() {
  console.log('🔄 开始测试逆时针宫位排列...');
  
  // 标准布局中地支的位置
  const standardLayout = [
    '巳', '午', '未', '申',
    '辰', null, null, '酉',
    '卯', null, null, '戌',
    '寅', '丑', '子', '亥'
  ];
  
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
      
      // 验证网格布局中地支的位置
      const gridLayout = palaceLayoutResult.palaces;
      const actualBranches = new Array(16).fill(null);
      
      gridLayout.forEach((palace, i) => {
        if (palace && !palace.isCenter && palace.branch) {
          actualBranches[i] = palace.branch;
        }
      });
      
      // 验证地支位置是否符合标准布局
      let isCorrect = true;
      for (let i = 0; i < 16; i++) {
        if (standardLayout[i] !== null && actualBranches[i] !== standardLayout[i]) {
          console.log(`❌ 位置 ${i} 地支错误: 期望 ${standardLayout[i]}, 实际 ${actualBranches[i]}`);
          isCorrect = false;
        }
      }
      
      if (isCorrect) {
        console.log(`✅ 地支布局正确`);
      } else {
        console.log(`❌ 地支布局错误`);
      }
      
      // 验证宫位排列是否是逆时针
      // 命宫的位置
      const mingGongPosition = palaceLayoutResult.originalPalaces.findIndex(p => p.name === '命宫');
      
      // 检查相邻宫位是否按逆时针排列
      const expectedOrder = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'];
      let isOrderCorrect = true;
      
      // 检查宫位名称顺序
      for (let i = 0; i < 12; i++) {
        const actualName = palaceLayoutResult.originalPalaces[i].name;
        const expectedName = expectedOrder[i];
        if (actualName !== expectedName) {
          console.log(`❌ 宫位顺序错误: 位置 ${i} 期望 ${expectedName}, 实际 ${actualName}`);
          isOrderCorrect = false;
        }
      }
      
      if (isOrderCorrect) {
        console.log(`✅ 宫位顺序正确（逆时针排列）`);
      } else {
        console.log(`❌ 宫位顺序错误`);
      }
      
      // 检查地支顺序是否逆时针
      const mingGongBranch = palaceLayoutResult.mingGong.branch;
      const fixedBranches = ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'];
      const mingGongBranchIndex = fixedBranches.indexOf(mingGongBranch);
      
      let isBranchOrderCorrect = true;
      for (let i = 0; i < 12; i++) {
        const expectedBranch = fixedBranches[(mingGongBranchIndex - i + 12) % 12];
        const actualBranch = palaceLayoutResult.originalPalaces[i].branch;
        if (actualBranch !== expectedBranch) {
          console.log(`❌ 地支顺序错误: 位置 ${i} 期望 ${expectedBranch}, 实际 ${actualBranch}`);
          isBranchOrderCorrect = false;
        }
      }
      
      if (isBranchOrderCorrect) {
        console.log(`✅ 地支顺序正确（逆时针排列）`);
      } else {
        console.log(`❌ 地支顺序错误`);
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
  
  console.log('\n🎉 逆时针宫位排列测试完成');
}

// 运行测试
testCounterclockwisePalaceOrder(); 