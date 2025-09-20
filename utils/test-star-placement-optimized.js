/**
 * 测试优化后的星曜安放逻辑
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

// 测试星曜安放逻辑
function testStarPlacementOptimized() {
  console.log('🧪 开始测试优化后的星曜安放逻辑');
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
  
  // 9. 验证星曜安放结果
  console.log('\n📋 星曜安放验证:');
  
  // 创建地支到宫位的映射
  const branchToPalaceMap = {};
  palacesWithFourHua.forEach(palace => {
    branchToPalaceMap[palace.branch] = palace;
  });
  
  // 验证紫微星位置
  const ziWeiPalace = branchToPalaceMap[ziWeiBranch];
  const ziWeiStar = ziWeiPalace ? ziWeiPalace.stars.find(s => s.name === '紫微') : null;
  console.log(`\n✅ 紫微星验证:`);
  console.log(`  位置: ${ziWeiBranch}宫 (${ziWeiPalace?.name || '未知'})`);
  console.log(`  亮度: ${ziWeiStar?.brightness || '未知'}`);
  
  // 验证天机星位置（紫微逆行一位）
  const tianJiIndex = (EARTHLY_BRANCHES.indexOf(ziWeiBranch) - 1 + 12) % 12;
  const tianJiBranch = EARTHLY_BRANCHES[tianJiIndex];
  const tianJiPalace = branchToPalaceMap[tianJiBranch];
  const tianJiStar = tianJiPalace ? tianJiPalace.stars.find(s => s.name === '天机') : null;
  console.log(`\n✅ 天机星验证:`);
  console.log(`  位置: ${tianJiBranch}宫 (${tianJiPalace?.name || '未知'})`);
  console.log(`  亮度: ${tianJiStar?.brightness || '未知'}`);
  
  // 验证辅星位置
  console.log('\n✅ 辅星验证:');
  
  // 左辅、右弼
  const leftRightIndex = (2 + testProfile.lunarMonth - 1) % 12; // 寅宫索引为2
  const leftBranch = EARTHLY_BRANCHES[leftRightIndex];
  const rightBranch = EARTHLY_BRANCHES[(leftRightIndex + 6) % 12];
  const leftPalace = branchToPalaceMap[leftBranch];
  const rightPalace = branchToPalaceMap[rightBranch];
  console.log(`  左辅: ${leftBranch}宫 (${leftPalace?.name || '未知'})`);
  console.log(`  右弼: ${rightBranch}宫 (${rightPalace?.name || '未知'})`);
  
  // 文昌、文曲
  const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const hourPosition = hourOrder.indexOf(testProfile.hourBranch);
  if (hourPosition !== -1) {
    const wenChangIndex = (3 + hourPosition) % 12; // 卯宫索引为3
    const wenChangBranch = EARTHLY_BRANCHES[wenChangIndex];
    const wenQuBranch = EARTHLY_BRANCHES[(wenChangIndex + 6) % 12];
    const wenChangPalace = branchToPalaceMap[wenChangBranch];
    const wenQuPalace = branchToPalaceMap[wenQuBranch];
    console.log(`  文昌: ${wenChangBranch}宫 (${wenChangPalace?.name || '未知'})`);
    console.log(`  文曲: ${wenQuBranch}宫 (${wenQuPalace?.name || '未知'})`);
  }
  
  // 验证四化星
  console.log('\n✅ 四化星验证:');
  const fourHuaStars = {
    '甲': { '禄': '廉贞', '权': '破军', '科': '武曲', '忌': '太阳' },
    '乙': { '禄': '天机', '权': '天梁', '科': '紫微', '忌': '太阴' },
    '丙': { '禄': '天同', '权': '天机', '科': '文昌', '忌': '廉贞' },
    '丁': { '禄': '太阴', '权': '天同', '科': '天机', '忌': '巨门' },
    '戊': { '禄': '贪狼', '权': '太阴', '科': '右弼', '忌': '天机' },
    '己': { '禄': '武曲', '权': '贪狼', '科': '天梁', '忌': '文曲' },
    '庚': { '禄': '太阳', '权': '武曲', '科': '太阴', '忌': '天同' },
    '辛': { '禄': '巨门', '权': '太阳', '科': '天同', '忌': '文昌' },
    '壬': { '禄': '天梁', '权': '紫微', '科': '太阳', '忌': '武曲' },
    '癸': { '禄': '破军', '权': '巨门', '科': '贪狼', '忌': '左辅' }
  };
  
  const yearStem = testProfile.yearStem;
  if (fourHuaStars[yearStem]) {
    Object.entries(fourHuaStars[yearStem]).forEach(([type, starName]) => {
      // 找到该星所在宫位
      let starPalace = null;
      let starFound = false;
      
      palacesWithFourHua.forEach(palace => {
        const star = palace.stars.find(s => s.name === starName);
        if (star) {
          starPalace = palace;
          starFound = true;
        }
      });
      
      if (starFound) {
        console.log(`  ${starName}化${type}: ${starPalace.branch}宫 (${starPalace.name})`);
      } else {
        console.log(`  ${starName}化${type}: 未找到`);
      }
    });
  }
  
  // 打印完整星曜分布
  console.log('\n📋 完整星曜分布:');
  palacesWithFourHua.forEach(palace => {
    // 获取宫位字段数据
    const fieldData = getPalaceFieldData(palace, null);
    
    console.log(`\n📍 ${palace.name} (${palace.heavenlyStem}${palace.branch})`);
    
    // 打印主星
    if (fieldData.mainStars && fieldData.mainStars.length > 0) {
      console.log(`  ⭐ 主星: ${fieldData.mainStars.map(s => `${s.name}${s.brightness}`).join(', ')}`);
    } else {
      console.log(`  ⭐ 主星: 无`);
    }
    
    // 打印辅星
    if (fieldData.auxStars && fieldData.auxStars.length > 0) {
      console.log(`  🔹 辅星: ${fieldData.auxStars.map(s => `${s.name}${s.brightness}`).join(', ')}`);
    } else {
      console.log(`  🔹 辅星: 无`);
    }
    
    // 打印四化星
    if (fieldData.fourHuaFlags && fieldData.fourHuaFlags.length > 0) {
      console.log(`  🔄 四化: ${fieldData.fourHuaFlags.join(', ')}`);
    }
  });
  
  console.log('\n✅ 星曜安放验证完成');
}

// 引入常量
const { EARTHLY_BRANCHES } = palaceCalculation;

// 执行测试
testStarPlacementOptimized(); 