/**
 * 测试优化后的星曜展示效果
 */

// 引入宫位计算服务
const palaceCalculation = require('../services/palace-calculation');
const { getPalaceFieldData } = require('./palace-field-optimization');

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

// 测试星曜展示效果
function testStarDisplay() {
  console.log('🧪 开始测试优化后的星曜展示效果');
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
  
  // 9. 测试优化后的星曜展示效果
  console.log('\n📋 优化后的星曜展示效果:');
  palacesWithFourHua.forEach(palace => {
    // 获取宫位字段数据
    const fieldData = getPalaceFieldData(palace, null);
    
    console.log(`\n📍 ${palace.name} (${palace.heavenlyStem}${palace.branch})`);
    
    // 打印主星
    if (fieldData.mainStars && fieldData.mainStars.length > 0) {
      console.log(`  ⭐ 主星: ${fieldData.mainStars.map(s => s.name).join(', ')}`);
    } else {
      console.log(`  ⭐ 主星: 无`);
    }
    
    // 打印辅星
    if (fieldData.auxStars && fieldData.auxStars.length > 0) {
      console.log(`  🔹 辅星: ${fieldData.auxStars.map(s => s.name).join(', ')}`);
    } else {
      console.log(`  🔹 辅星: 无`);
    }
    
    // 打印杂耀
    if (fieldData.miscStars && fieldData.miscStars.length > 0) {
      console.log(`  🔸 杂耀: ${fieldData.miscStars.map(s => s.name).join(', ')}`);
    } else {
      console.log(`  🔸 杂耀: 无`);
    }
    
    // 打印四化星
    if (fieldData.fourHuaFlags && fieldData.fourHuaFlags.length > 0) {
      console.log(`  🔄 四化: ${fieldData.fourHuaFlags.join(', ')}`);
    }
  });
  
  console.log('\n✅ 星曜展示测试完成');
}

// 执行测试
testStarDisplay(); 