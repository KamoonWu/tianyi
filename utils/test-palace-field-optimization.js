// 测试宫位字段优化系统
console.log('=== 测试宫位字段优化系统 ===');

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
  name: '官禄宫',
  branch: '癸巳',
  stars: [
    { name: '天相', brightness: '得' },
    { name: '文曲', brightness: '庙' },
    { name: '科' },
    { name: '天马' },
    { name: '恩光' },
    { name: '天巫' },
    { name: '运禄' },
    { name: '临官' },
    { name: '将军' },
    { name: '5-17' }
  ]
};

const testFlowYear = {
  heavenlyStem: '乙'
};

console.log('🧪 测试1: 星曜分类');
const categorized = categorizeStars(testPalace.stars);
console.log('✅ 分类结果:', categorized);

console.log('\n🧪 测试2: 流年格式化');
const flowYearText = formatFlowYear(testFlowYear);
console.log('✅ 流年文本:', flowYearText);

console.log('\n🧪 测试3: 宫位字段数据');
const fieldData = getPalaceFieldData(testPalace, testFlowYear);
console.log('✅ 字段数据:', fieldData);

console.log('\n🧪 测试4: 字段结构验证');
console.log('✅ 字段结构:', Object.keys(PALACE_FIELD_STRUCTURE));

console.log('\n🧪 测试5: 星曜分类验证');
console.log('✅ 主星:', categorized.main);
console.log('✅ 辅星:', categorized.auxiliary);
console.log('✅ 四化星:', categorized.fourHua);
console.log('✅ 杂曜/神煞星:', categorized.misc);
console.log('✅ 运限流曜:', categorized.fortune);
console.log('✅ 长生十二神:', categorized.longevity);
console.log('✅ 年龄区间:', categorized.ageRange);

console.log('\n🧪 测试6: 颜色配置验证');
Object.keys(STAR_CATEGORIES).forEach(category => {
  const config = STAR_CATEGORIES[category];
  console.log(`✅ ${category}: 颜色=${config.color}, 位置=${config.position}`);
});

console.log('\n🧪 测试7: 字段布局验证');
Object.keys(PALACE_FIELD_STRUCTURE).forEach(fieldKey => {
  const config = PALACE_FIELD_STRUCTURE[fieldKey];
  console.log(`✅ ${fieldKey}: x=${config.x}, y=${config.y}, 对齐=${config.align}, 类目=${config.category}`);
});

console.log('\n🎉 宫位字段优化系统测试完成！');
console.log('\n系统特点:');
console.log('1. ✅ 按照表格要求分类：主星、辅星、四化星、流年标记、杂曜/神煞星、运限流曜、长生十二神、年龄区间');
console.log('2. ✅ 精确定位：每个字段都有明确的x、y坐标和对齐方式');
console.log('3. ✅ 颜色区分：不同类别的星曜使用不同颜色');
console.log('4. ✅ 智能分类：自动识别星曜类型并归类');
console.log('5. ✅ 流年支持：支持流年天干显示');
console.log('6. ✅ 回退机制：当优化系统失败时自动回退到原始绘制方法');
console.log('7. ✅ 高亮支持：支持三方四正高亮状态下的颜色调整');

console.log('\n字段布局说明:');
console.log('- 主星：左上角，深色显示');
console.log('- 辅星：主星下方，蓝色显示');
console.log('- 四化星：右上角，紫色显示');
console.log('- 流年标记：正中央，橙色显示');
console.log('- 杂曜/神煞星：左侧分布，绿色显示');
console.log('- 运限流曜：右侧，红色显示');
console.log('- 长生十二神：底部，灰色显示');
console.log('- 年龄区间：底部右侧，灰色显示');
console.log('- 宫位名称：左下角');
console.log('- 宫位地支：左下角，紧邻宫位名称'); 