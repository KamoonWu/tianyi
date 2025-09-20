/**
 * 紫微斗数星曜安放测试脚本
 * 按照ziwei.pro网站的方式验证星曜安放
 */

// 引入宫位计算服务
const palaceCalculation = require('../services/palace-calculation');

// 测试用户信息
const testProfile = {
  name: '测试用户',
  date: '1990-01-15',
  time: '23:30',
  lunarYear: 1989,
  lunarMonth: 12,
  lunarDay: 19,
  yearStem: '己',
  yearBranch: '巳',
  hourBranch: '子',
  gender: '男'
};

/**
 * 测试星曜安放
 */
function testStarPlacement() {
  console.log('🧪 开始测试星曜安放 - ziwei.pro 标准');
  console.log('👤 测试用户信息:', testProfile);
  
  // 1. 计算命宫和身宫
  const mingGongBranch = palaceCalculation.calculateMingGongBranch(testProfile.lunarMonth, testProfile.hourBranch);
  const shenGongBranch = palaceCalculation.calculateShenGongBranch(testProfile.lunarMonth, testProfile.hourBranch);
  
  console.log(`\n📊 命宫: ${mingGongBranch}宫, 身宫: ${shenGongBranch}宫`);
  
  // 2. 计算十二宫排列
  const palaces = palaceCalculation.calculateTwelvePalaces(mingGongBranch);
  
  // 3. 计算十二宫天干
  const palacesWithStems = palaceCalculation.calculateHeavenlyStems(testProfile.yearStem, palaces);
  
  // 4. 计算五行局
  const mingGongPalace = palacesWithStems.find(p => p.name === '命宫');
  const mingGongStem = mingGongPalace ? mingGongPalace.heavenlyStem : '';
  
  const fiveElements = palaceCalculation.calculateFiveElementsPattern(mingGongStem, mingGongBranch);
  console.log(`\n🔮 五行局: ${fiveElements.name} (${fiveElements.number}局), 纳音: ${fiveElements.naYin || '未知'}`);
  
  // 5. 安紫微星
  const ziWeiBranch = palaceCalculation.placeZiWeiStar(testProfile.lunarDay, fiveElements);
  console.log(`\n🌟 紫微星落宫: ${ziWeiBranch}宫`);
  
  // 6. 安十四主星
  const palacesWithStars = palaceCalculation.placeMainStars(ziWeiBranch, palacesWithStems);
  
  // 7. 安辅星
  const palacesWithAuxStars = palaceCalculation.placeAuxiliaryStars(
    testProfile.lunarMonth,
    testProfile.hourBranch,
    testProfile.yearStem,
    testProfile.yearBranch,
    palacesWithStars
  );
  
  // 8. 安四化星
  const palacesWithFourHua = palaceCalculation.placeFourTransformationStars(testProfile.yearStem, palacesWithAuxStars);
  
  // 9. 验证星曜分布
  console.log('\n📋 十二宫星曜分布:');
  
  // 创建地支到宫位的映射
  const branchToPalaceMap = {};
  palacesWithFourHua.forEach(palace => {
    branchToPalaceMap[palace.branch] = palace;
  });
  
  // 按照地支顺序输出宫位星曜
  const branchOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  branchOrder.forEach(branch => {
    const palace = branchToPalaceMap[branch];
    if (!palace) {
      console.log(`\n❌ 未找到${branch}宫数据`);
      return;
    }
    
    console.log(`\n📍 ${palace.name} (${palace.heavenlyStem}${palace.branch})`);
    
    // 主星
    const mainStars = palace.stars.filter(s => s.type === 'main');
    if (mainStars.length > 0) {
      console.log(`  ⭐ 主星: ${mainStars.map(s => `${s.name}${s.brightness === '平' ? '' : s.brightness}`).join(', ')}`);
    } else {
      console.log(`  ⭐ 主星: 无`);
    }
    
    // 辅星
    const auxStars = palace.stars.filter(s => s.type === 'auxiliary');
    if (auxStars.length > 0) {
      console.log(`  🔹 辅星: ${auxStars.map(s => `${s.name}${s.brightness === '平' ? '' : s.brightness}`).join(', ')}`);
    } else {
      console.log(`  🔹 辅星: 无`);
    }
    
    // 杂耀
    const miscStars = palace.stars.filter(s => s.type === 'misc');
    if (miscStars.length > 0) {
      console.log(`  🔸 杂耀: ${miscStars.map(s => `${s.name}${s.brightness === '平' ? '' : s.brightness}`).join(', ')}`);
    } else {
      console.log(`  🔸 杂耀: 无`);
    }
    
    // 四化
    if (palace.fourHua && palace.fourHua.length > 0) {
      console.log(`  🔄 四化: ${palace.fourHua.map(h => `${h.star}化${h.type}`).join(', ')}`);
    }
  });
  
  // 10. 验证紫微星系统
  console.log('\n🔍 紫微星系统验证:');
  const ziWeiIndex = branchOrder.indexOf(ziWeiBranch);
  console.log(`  紫微: ${ziWeiBranch}宫`);
  console.log(`  天机: ${branchOrder[(ziWeiIndex - 1 + 12) % 12]}宫 (紫微逆行一位)`);
  console.log(`  太阳: ${branchOrder[(ziWeiIndex + 2) % 12]}宫 (紫微顺行二位，即隔一)`);
  console.log(`  武曲: ${branchOrder[(ziWeiIndex + 3) % 12]}宫 (紫微顺行三位)`);
  console.log(`  天同: ${branchOrder[(ziWeiIndex + 4) % 12]}宫 (紫微顺行四位)`);
  console.log(`  廉贞: ${branchOrder[(ziWeiIndex + 6) % 12]}宫 (紫微顺行六位，对宫)`);
  
  // 11. 验证天府星系统
  console.log('\n🔍 天府星系统验证:');
  const tianFuIndex = (ziWeiIndex + 6) % 12;
  console.log(`  天府: ${branchOrder[tianFuIndex]}宫 (紫微对宫)`);
  console.log(`  太阴: ${branchOrder[(tianFuIndex + 1) % 12]}宫 (天府顺行一位)`);
  console.log(`  贪狼: ${branchOrder[(tianFuIndex + 2) % 12]}宫 (天府顺行二位)`);
  console.log(`  巨门: ${branchOrder[(tianFuIndex + 3) % 12]}宫 (天府顺行三位)`);
  console.log(`  天相: ${branchOrder[(tianFuIndex + 4) % 12]}宫 (天府顺行四位)`);
  console.log(`  天梁: ${branchOrder[(tianFuIndex + 5) % 12]}宫 (天府顺行五位)`);
  console.log(`  七杀: ${branchOrder[(tianFuIndex + 6) % 12]}宫 (天府顺行六位)`);
  console.log(`  破军: ${branchOrder[(tianFuIndex + 7) % 12]}宫 (天府顺行七位)`);
  
  console.log('\n✅ 星曜安放测试完成');
}

// 执行测试
testStarPlacement(); 