// 测试require路径
console.log('=== 测试require路径 ===');

try {
  console.log('1. 测试star-placement模块...');
  const { StarPlacement } = require('./star-placement');
  console.log('✅ star-placement模块加载成功');
  
  console.log('2. 测试pattern-analysis模块...');
  const { analyzePatterns } = require('./pattern-analysis');
  console.log('✅ pattern-analysis模块加载成功');
  
  console.log('3. 测试stars-catalog模块...');
  const { classifyStars } = require('./stars-catalog');
  console.log('✅ stars-catalog模块加载成功');
  
  console.log('4. 测试palace-lines模块...');
  const { SIX_LINES } = require('./palace-lines');
  console.log('✅ palace-lines模块加载成功');
  
  console.log('5. 测试zwds模块...');
  const { buildChartSummary } = require('./zwds');
  console.log('✅ zwds模块加载成功');
  
  console.log('\n🎉 所有模块加载成功！');
  
} catch (error) {
  console.error('❌ 模块加载失败:', error.message);
  console.error('错误详情:', error);
} 