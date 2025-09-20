/**
 * 测试天干顺时针排列
 * 验证天干的排列顺序是否是顺时针，同时地支和宫位的排列不变
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

// 测试天干顺时针排列
function testHeavenlyStemsOrder() {
  console.log('🔄 开始测试天干顺时针排列...');
  
  // 地支顺序（十二地支）
  const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
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
      
      // 验证天干顺序是否顺时针
      // 检查寅宫的天干
      const yinPalace = palaceLayoutResult.originalPalaces.find(p => p.branch === '寅');
      if (!yinPalace) {
        console.error('❌ 未找到寅宫，无法验证天干顺序');
        return;
      }
      
      const yinStem = yinPalace.heavenlyStem;
      console.log(`📊 寅宫天干: ${yinStem}`);
      
      // 验证天干顺序是否顺时针
      const branchOrder = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
      const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
      const yinStemIndex = heavenlyStems.indexOf(yinStem);
      
      if (yinStemIndex === -1) {
        console.error(`❌ 无效的寅宫天干: ${yinStem}`);
        return;
      }
      
      // 检查每个地支对应的天干是否符合顺时针排列
      let isStemOrderCorrect = true;
      for (let i = 0; i < branchOrder.length; i++) {
        const branch = branchOrder[i];
        const palace = palaceLayoutResult.originalPalaces.find(p => p.branch === branch);
        
        if (!palace) {
          console.error(`❌ 未找到地支 ${branch} 对应的宫位`);
          isStemOrderCorrect = false;
          continue;
        }
        
        // 计算期望的天干（顺时针方向）
        const expectedStemIndex = (yinStemIndex + i) % 10;
        const expectedStem = heavenlyStems[expectedStemIndex];
        
        if (palace.heavenlyStem !== expectedStem) {
          console.log(`❌ 地支 ${branch} 的天干错误: 期望 ${expectedStem}, 实际 ${palace.heavenlyStem}`);
          isStemOrderCorrect = false;
        }
      }
      
      if (isStemOrderCorrect) {
        console.log(`✅ 天干顺序正确（顺时针排列）`);
      } else {
        console.log(`❌ 天干顺序错误`);
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
            rowStr += `${palace.heavenlyStem}${palace.branch}(${palace.name}) | `;
          } else {
            rowStr += '  | ';
          }
        }
        console.log(rowStr);
        console.log('-------------------------');
      }
      
      // 验证命宫和身宫的计算是否符合口诀
      // 命宫口诀：寅起正月，顺数至生月。从生月宫位起子时，逆数至生时。
      const lunarMonth = profile.lunarMonth;
      const birthHourBranch = profile.hourBranch;
      
      // 步骤1：寅起正月，顺数至生月
      const monthBranchIndex = (2 + lunarMonth - 1) % 12; // 从寅宫开始，正月=寅
      const monthBranch = EARTHLY_BRANCHES[monthBranchIndex];
      
      // 步骤2：从生月宫位起子时，逆数至生时
      const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      const hourPosition = hourOrder.indexOf(birthHourBranch);
      
      // 从月支位置逆时针走hourPosition步
      const expectedMingGongIndex = (monthBranchIndex - hourPosition + 12) % 12;
      const expectedMingGongBranch = EARTHLY_BRANCHES[expectedMingGongIndex];
      
      // 验证命宫计算
      if (palaceLayoutResult.mingGong.branch === expectedMingGongBranch) {
        console.log(`✅ 命宫计算正确: ${palaceLayoutResult.mingGong.branch}`);
      } else {
        console.log(`❌ 命宫计算错误: 期望 ${expectedMingGongBranch}, 实际 ${palaceLayoutResult.mingGong.branch}`);
      }
      
      // 验证身宫计算
      // 身宫口诀：寅起正月，顺数至生月。从生月宫位起子时，顺数至生时。
      const expectedShenGongIndex = (monthBranchIndex + hourPosition) % 12;
      const expectedShenGongBranch = EARTHLY_BRANCHES[expectedShenGongIndex];
      
      if (palaceLayoutResult.shenGong.branch === expectedShenGongBranch) {
        console.log(`✅ 身宫计算正确: ${palaceLayoutResult.shenGong.branch}`);
      } else {
        console.log(`❌ 身宫计算错误: 期望 ${expectedShenGongBranch}, 实际 ${palaceLayoutResult.shenGong.branch}`);
      }
      
      // 验证宫位排列是否符合描述
      // 从命宫开始，逆时针依次排列十二宫
      const mingGongIndex = palaceLayoutResult.originalPalaces.findIndex(p => p.name === '命宫');
      const expectedPalaceOrder = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'];
      
      let isPalaceOrderCorrect = true;
      for (let i = 0; i < 12; i++) {
        const expectedName = expectedPalaceOrder[i];
        const actualName = palaceLayoutResult.originalPalaces[i].name;
        
        if (expectedName !== actualName) {
          console.log(`❌ 宫位顺序错误: 位置 ${i} 期望 ${expectedName}, 实际 ${actualName}`);
          isPalaceOrderCorrect = false;
        }
      }
      
      if (isPalaceOrderCorrect) {
        console.log(`✅ 宫位顺序正确（从命宫开始逆时针排列）`);
      } else {
        console.log(`❌ 宫位顺序错误`);
      }
      
    } else {
      console.error(`❌ ${profile.name}: 排盘计算失败`);
    }
  });
  
  console.log('\n🎉 天干顺时针排列测试完成');
}

// 运行测试
testHeavenlyStemsOrder(); 