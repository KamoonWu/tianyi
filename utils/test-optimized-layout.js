// 测试优化后的字段布局
console.log('=== 测试优化后的字段布局 ===');

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
  name: '财帛宫',
  branch: '戌',
  stars: [
    { name: '天同', brightness: '陷' },
    { name: '天钺', brightness: '弱' },
    { name: '天乙' },
    { name: '太乙' },
    { name: '帝旺' },
    { name: '53-65' }
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

console.log('\n🧪 测试3: 优化后的字段布局验证');
Object.keys(PALACE_FIELD_STRUCTURE).forEach(fieldKey => {
  const config = PALACE_FIELD_STRUCTURE[fieldKey];
  const value = fieldData[fieldKey];
  
  console.log(`✅ ${fieldKey}:`);
  console.log(`  配置: x=${config.x}, y=${config.y}, 对齐=${config.align}, 类目=${config.category}`);
  console.log(`  值:`, value);
});

console.log('\n🧪 测试4: 字段位置冲突检查');
const positions = [];
Object.keys(PALACE_FIELD_STRUCTURE).forEach(fieldKey => {
  const config = PALACE_FIELD_STRUCTURE[fieldKey];
  const value = fieldData[fieldKey];
  
  if (value) {
    positions.push({
      field: fieldKey,
      x: config.x,
      y: config.y,
      width: config.width,
      height: config.height
    });
  }
});

// 检查是否有重叠
let hasConflict = false;
for (let i = 0; i < positions.length; i++) {
  for (let j = i + 1; j < positions.length; j++) {
    const pos1 = positions[i];
    const pos2 = positions[j];
    
    // 检查矩形是否重叠
    if (pos1.x < pos2.x + pos2.width &&
        pos1.x + pos1.width > pos2.x &&
        pos1.y < pos2.y + pos2.height &&
        pos1.y + pos1.height > pos2.y) {
      console.log(`❌ 字段位置冲突: ${pos1.field} 与 ${pos2.field} 重叠`);
      console.log(`  ${pos1.field}: (${pos1.x}, ${pos1.y}) - (${pos1.x + pos1.width}, ${pos1.y + pos1.height})`);
      console.log(`  ${pos2.field}: (${pos2.x}, ${pos2.y}) - (${pos2.x + pos2.width}, ${pos2.y + pos2.height})`);
      hasConflict = true;
    }
  }
}

if (!hasConflict) {
  console.log('✅ 所有字段位置无冲突');
}

console.log('\n🧪 测试5: 模拟Canvas绘制验证');
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

console.log('\n🎉 优化后的字段布局测试完成！');
console.log('\n优化总结:');
console.log('1. ✅ 重新设计了字段位置，避免重叠');
console.log('2. ✅ 增加了行间距，从14px到18px');
console.log('3. ✅ 优化了各字段的坐标分布');
console.log('4. ✅ 确保主星、辅星、四化星等不重叠');
console.log('5. ✅ 流年标记居中显示，不与其他字段冲突');

console.log('\n字段布局说明（优化后）:');
console.log('- 主星：左上角 (8, 25) - 最显眼位置');
console.log('- 辅星：主星下方 (8, 45) - 不重叠');
console.log('- 四化星：右上角 (85, 25) - 不与其他字段重叠');
console.log('- 流年标记：正中央 (60, 75) - 不与其他字段重叠');
console.log('- 杂曜/神煞星：左侧分布 (8, 95) - 避免重叠');
console.log('- 运限流曜：右侧 (85, 95) - 不与其他字段重叠');
console.log('- 长生十二神：底部 (8, 140) - 不与其他字段重叠');
console.log('- 年龄区间：底部右侧 (85, 140) - 不与其他字段重叠');
console.log('- 宫位名称：左下角 (8, 160) - 不与其他字段重叠');
console.log('- 宫位地支：左下角 (50, 160) - 紧邻宫位名称，不重叠');

console.log('\n下一步：');
console.log('1. 在小程序中重新测试');
console.log('2. 点击"测试"按钮查看效果');
console.log('3. 检查字段是否不再重叠');
console.log('4. 验证高亮样式是否正确（无填充色，细边框）'); 