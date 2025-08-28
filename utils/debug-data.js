// 调试数据流
const { StarPlacement } = require('./star-placement');

function debugDataFlow() {
  console.log('=== 调试数据流 ===');
  
  try {
    // 创建测试数据
    const starPlacement = new StarPlacement(1991, 1, 22, 1, 'male', 'lunar');
    const chartData = starPlacement.generateChart();
    
    console.log('1. 安星算法原始数据:');
    console.log(JSON.stringify(chartData, null, 2));
    
    // 模拟主页面的数据转换
    const formattedPalaces = chartData.palaces.map((palace, index) => {
      return {
        name: palace.name,
        branch: palace.branch,
        stars: palace.stars || '',
        starNames: palace.starNames || [],
        index: palace.index,
        isEmpty: !palace.stars || palace.stars.trim() === ''
      };
    });
    
    console.log('\n2. 格式化后的宫位数据:');
    console.log(JSON.stringify(formattedPalaces, null, 2));
    
    // 测试星曜分类
    const { classifyStars } = require('./stars-catalog');
    
    console.log('\n3. 星曜分类测试:');
    formattedPalaces.forEach((palace, index) => {
      if (palace.starNames && palace.starNames.length > 0) {
        const groups = classifyStars(palace.starNames);
        console.log(`${palace.name}:`, {
          stars: palace.starNames,
          classification: groups
        });
      }
    });
    
    return { chartData, formattedPalaces };
    
  } catch (error) {
    console.error('调试失败:', error);
    return null;
  }
}

// 导出调试函数
module.exports = {
  debugDataFlow
};

// 如果直接运行此文件，执行调试
if (require.main === module) {
  debugDataFlow();
} 