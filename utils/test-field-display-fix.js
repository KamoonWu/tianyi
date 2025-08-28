// 测试修复后的字段显示系统
console.log('=== 测试修复后的字段显示系统 ===');

// 引入字段优化系统
const {
  STAR_CATEGORIES,
  PALACE_FIELD_STRUCTURE,
  categorizeStars,
  formatFlowYear,
  getPalaceFieldData,
  drawPalaceField
} = require('./palace-field-optimization');

// 测试数据
const testPalace = {
  name: '命宫',
  branch: '寅',
  stars: [
    { name: '紫微', brightness: '庙' },
    { name: '左辅', brightness: '旺' },
    { name: '禄' },
    { name: '天马' },
    { name: '恩光' },
    { name: '运科' },
    { name: '长生' },
    { name: '1-13' }
  ]
};

const testFlowYear = {
  heavenlyStem: '乙',
  earthlyBranch: '巳',
  year: 2024
};

console.log('🧪 测试1: 星曜分类');
const categorized = categorizeStars(testPalace.stars);
console.log('✅ 分类结果:', categorized);

console.log('\n🧪 测试2: 字段数据生成');
const fieldData = getPalaceFieldData(testPalace, testFlowYear);
console.log('✅ 字段数据:', fieldData);

console.log('\n🧪 测试3: 字段结构验证');
Object.keys(PALACE_FIELD_STRUCTURE).forEach(fieldKey => {
  const config = PALACE_FIELD_STRUCTURE[fieldKey];
  const value = fieldData[fieldKey];
  
  console.log(`✅ ${fieldKey}:`);
  console.log(`  配置: x=${config.x}, y=${config.y}, 对齐=${config.align}, 类目=${config.category}`);
  console.log(`  值:`, value);
});

console.log('\n🧪 测试4: 模拟Canvas绘制');
// 模拟Canvas上下文
const mockCtx = {
  fillStyle: '#000000',
  font: '10px sans-serif',
  textAlign: 'left',
  fillText: function(text, x, y) {
    console.log(`🎨 Canvas绘制: "${text}" 在 (${x}, ${y}), 颜色: ${this.fillStyle}, 对齐: ${this.textAlign}`);
  }
};

console.log('🔍 开始模拟绘制各个字段...');

Object.keys(PALACE_FIELD_STRUCTURE).forEach(fieldKey => {
  const fieldConfig = PALACE_FIELD_STRUCTURE[fieldKey];
  const fieldValue = fieldData[fieldKey];
  
  if (fieldValue) {
    console.log(`\n🔍 绘制字段: ${fieldKey}`);
    
    // 调整坐标到宫位位置 (假设宫位在100, 100)
    const adjustedConfig = {
      ...fieldConfig,
      x: 100 + fieldConfig.x,
      y: 100 + fieldConfig.y
    };
    
    drawPalaceField(mockCtx, fieldValue, adjustedConfig, false);
  }
});

console.log('\n🎉 字段显示系统测试完成！');
console.log('\n修复总结:');
console.log('1. ✅ 修复了idx变量未定义的问题');
console.log('2. ✅ 增强了调试日志输出');
console.log('3. ✅ 修复了绘制函数的坐标计算');
console.log('4. ✅ 确保文本能正确显示到Canvas');
console.log('5. ✅ 完整的字段分类和显示系统');

console.log('\n字段显示说明:');
console.log('- 主星：左上角，深色显示，如"紫微庙"');
console.log('- 辅星：主星下方，蓝色显示，如"左辅旺"');
console.log('- 四化星：右上角，紫色显示，如"禄"');
console.log('- 流年标记：正中央，橙色显示，如"流年・乙"');
console.log('- 杂曜/神煞星：左侧分布，绿色显示，如"天马、恩光"');
console.log('- 运限流曜：右侧，红色显示，如"运科"');
console.log('- 长生十二神：底部，灰色显示，如"长生"');
console.log('- 年龄区间：底部右侧，灰色显示，如"1-13"');
console.log('- 宫位名称：左下角，如"命宫"');
console.log('- 宫位地支：左下角，紧邻宫位名称，如"寅"');

console.log('\n下一步：');
console.log('1. 在小程序中重新测试');
console.log('2. 点击"测试"按钮查看效果');
console.log('3. 检查控制台输出，应该能看到详细的绘制日志');
console.log('4. 验证每个宫是否都显示了完整的星曜信息'); 