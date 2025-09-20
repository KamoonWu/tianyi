/**
 * 测试星曜安放系统
 * 测试五行局、紫微星、十四主星、辅星、流星和四化星的计算
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

// 测试五行局、紫微星、十四主星、辅星、流星和四化星的计算
function testStarPlacement() {
  console.log('🧪 开始测试星曜安放系统');
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
  console.log(`\n🔮 五行局: ${fiveElements.name} (${fiveElements.number}局)`);
  
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
  
  // 打印结果
  console.log('\n📋 十二宫星曜分布:');
  palacesWithFourHua.forEach(palace => {
    console.log(`\n📍 ${palace.name} (${palace.heavenlyStem}${palace.branch})`);
    
    // 打印主星
    const mainStars = palace.stars.filter(s => s.type === 'main');
    if (mainStars.length > 0) {
      console.log(`  ⭐ 主星: ${mainStars.map(s => `${s.name}${s.brightness || ''}`).join(', ')}`);
    }
    
    // 打印辅星
    const auxStars = palace.stars.filter(s => s.type === 'auxiliary');
    if (auxStars.length > 0) {
      console.log(`  🔹 辅星: ${auxStars.map(s => `${s.name}${s.brightness || ''}`).join(', ')}`);
    }
    
    // 打印四化星
    if (palace.fourHua && palace.fourHua.length > 0) {
      console.log(`  🔄 四化: ${palace.fourHua.map(h => `${h.star}化${h.type}`).join(', ')}`);
    }
  });
  
  console.log('\n✅ 星曜安放测试完成');
}

// 执行测试
testStarPlacement(); 