/**
 * 测试固定地支布局
 * 验证地支的顺序和对应关系是否按照标准布局
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

// 测试固定地支布局
function testFixedBranchLayout() {
  console.log('🔄 开始测试固定地支布局...');
  
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
  
  console.log('\n🎉 固定地支布局测试完成');
}

// 运行测试
testFixedBranchLayout(); 