// 测试安星算法
const { StarPlacement } = require('./star-placement');

// 测试用例：1991年1月22日1时，男性，农历
function testStarPlacement() {
  console.log('=== 测试安星算法 ===');
  
  try {
    const starPlacement = new StarPlacement(1991, 1, 22, 1, 'male', 'lunar');
    
    console.log('基本信息:');
    console.log('年干:', starPlacement.yearStem);
    console.log('年支:', starPlacement.yearBranch);
    console.log('月干:', starPlacement.monthStem);
    console.log('月支:', starPlacement.monthBranch);
    console.log('日干:', starPlacement.dayStem);
    console.log('日支:', starPlacement.dayBranch);
    console.log('时干:', starPlacement.hourStem);
    console.log('时支:', starPlacement.hourBranch);
    console.log('五行局:', starPlacement.wuxingJu);
    console.log('命宫:', starPlacement.mingGong);
    console.log('身宫:', starPlacement.shenGong);
    
    console.log('\n十二宫:');
    starPlacement.palaces.forEach((palace, index) => {
      console.log(`${index + 1}. ${palace.name}: ${palace.branch}`);
    });
    
    console.log('\n主星分布:');
    const majorStars = starPlacement.placeMajorStars();
    Object.entries(majorStars).forEach(([branch, stars]) => {
      console.log(`${branch}: ${stars.join(', ')}`);
    });
    
    console.log('\n辅星分布:');
    const auxiliaryStars = starPlacement.placeAuxiliaryStars();
    Object.entries(auxiliaryStars).forEach(([branch, stars]) => {
      console.log(`${branch}: ${stars.join(', ')}`);
    });
    
    console.log('\n四化星:');
    const fourTransformations = starPlacement.placeFourTransformations();
    Object.entries(fourTransformations).forEach(([branch, stars]) => {
      console.log(`${branch}: ${stars.join(', ')}`);
    });
    
    console.log('\n完整排盘:');
    const chartData = starPlacement.generateChart();
    chartData.palaces.forEach((palace, index) => {
      console.log(`${index + 1}. ${palace.name}(${palace.branch}): ${palace.stars}`);
    });
    
    return chartData;
    
  } catch (error) {
    console.error('测试失败:', error);
    return null;
  }
}

// 导出测试函数
module.exports = {
  testStarPlacement
};

// 如果直接运行此文件，执行测试
if (require.main === module) {
  testStarPlacement();
} 