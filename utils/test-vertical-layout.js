// 测试纵向布局系统
console.log('=== 测试纵向布局系统 ===');

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
    { name: '禄' },
    { name: '权' },
    { name: '科' },
    { name: '忌' },
    { name: '流年・乙' },
    { name: '运科' }
  ]
};

const testFlowYear = {
  heavenlyStem: '乙',
  earthlyBranch: '巳',
  year: 2024
};

console.log('🧪 测试1: 新的颜色配置');
Object.keys(STAR_CATEGORIES).forEach(category => {
  const config = STAR_CATEGORIES[category];
  console.log(`✅ ${category}: ${config.color} - ${config.description}`);
});

console.log('\n🧪 测试2: 纵向布局配置验证');
const layers = {};
Object.keys(PALACE_FIELD_STRUCTURE).forEach(fieldKey => {
  const config = PALACE_FIELD_STRUCTURE[fieldKey];
  if (!layers[config.layer]) {
    layers[config.layer] = [];
  }
  layers[config.layer].push({
    field: fieldKey,
    x: config.x,
    y: config.y,
    width: config.width,
    height: config.height,
    vertical: config.vertical || false
  });
});

Object.keys(layers).sort((a, b) => parseInt(a) - parseInt(b)).forEach(layer => {
  console.log(`\n📋 第${layer}层字段:`);
  layers[layer].forEach(field => {
    const verticalText = field.vertical ? ' (纵向)' : ' (横向)';
    console.log(`  ✅ ${field.field}: (${field.x}, ${field.y}) - ${field.width}x${field.height}${verticalText}`);
  });
});

console.log('\n🧪 测试3: 字段数据生成');
const fieldData = getPalaceFieldData(testPalace, testFlowYear);
console.log('✅ 字段数据:', fieldData);

console.log('\n🧪 测试4: 纵向布局可视化');
console.log('宫位纵向布局示意图 (90x116):');
console.log('┌─────────────────────────────────────────────────────────┐');
console.log('│ 0,0                                                      │');
console.log('│ 第1层: 主星(8,15) + 辅星(32,15) + 杂曜(56,15) + 神煞(80,15) │');
console.log('│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                        │');
console.log('│  │主星 │ │辅星 │ │杂曜 │ │神煞 │                        │');
console.log('│  │20x16│ │20x16│ │20x16│ │20x16│                        │');
console.log('│  └─────┘ └─────┘ └─────┘ └─────┘                        │');
console.log('│                                                           │');
console.log('│ 第2层: 星曜亮度(8,35) - 74x16                            │');
console.log('│  ┌─────────────────────────────────────────────────────┐  │');
console.log('│  │ 亮度信息                                            │  │');
console.log('│  └─────────────────────────────────────────────────────┘  │');
console.log('│                                                           │');
console.log('│ 第3层: 科权禄忌(8,55) - 74x16                            │');
console.log('│  ┌─────────────────────────────────────────────────────┐  │');
console.log('│  │ 四化信息                                            │  │');
console.log('│  └─────────────────────────────────────────────────────┘  │');
console.log('│                                                           │');
console.log('│ 第4层: 流年标记(25,75) - 40x16                           │');
console.log('│                    ┌─────────────────┐                    │');
console.log('│                    │ 流年信息        │                    │');
console.log('│                    └─────────────────┘                    │');
console.log('│                                                           │');
console.log('│ 第5层: 运限流曜(8,95) + 宫名(45,95) + 地支(65,95)        │');
console.log('│  ┌─────────────────────────────────────────────────────┐  │');
console.log('│  │ 运限信息 + 宫名 + 地支                              │  │');
console.log('│  └─────────────────────────────────────────────────────┘  │');
console.log('│                                                           │');
console.log('└─────────────────────────────────────────────────────────┘');

console.log('\n🧪 测试5: 位置冲突检查');
const positions = [];
Object.keys(PALACE_FIELD_STRUCTURE).forEach(fieldKey => {
  const config = PALACE_FIELD_STRUCTURE[fieldKey];
  positions.push({
    field: fieldKey,
    x: config.x,
    y: config.y,
    width: config.width,
    height: config.height,
    layer: config.layer
  });
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
      console.log(`❌ 字段位置冲突: ${pos1.field}(第${pos1.layer}层) 与 ${pos2.field}(第${pos2.layer}层) 重叠`);
      console.log(`  ${pos1.field}: (${pos1.x}, ${pos1.y}) - (${pos1.x + pos1.width}, ${pos1.y + pos1.height})`);
      console.log(`  ${pos2.field}: (${pos2.x}, ${pos2.y}) - (${pos2.x + pos2.width}, ${pos2.y + pos2.height})`);
      hasConflict = true;
    }
  }
}

if (!hasConflict) {
  console.log('✅ 所有字段位置无冲突！');
} else {
  console.log('❌ 仍有字段位置冲突需要解决');
}

console.log('\n🧪 测试6: 模拟Canvas绘制验证');
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

// 按层级顺序绘制
Object.keys(layers).sort((a, b) => parseInt(a) - parseInt(b)).forEach(layer => {
  console.log(`\n🔍 绘制第${layer}层字段...`);
  
  layers[layer].forEach(field => {
    const fieldKey = field.field;
    const fieldConfig = PALACE_FIELD_STRUCTURE[fieldKey];
    const fieldValue = fieldData[fieldKey];
    
    if (fieldValue) {
      console.log(`  🔍 绘制字段: ${fieldKey}`);
      
      // 调整坐标到宫位位置 (假设宫位在100, 100)
      const adjustedConfig = {
        ...fieldConfig,
        x: 100 + fieldConfig.x,
        y: 100 + fieldConfig.y
      };
      
      drawPalaceField(mockCtx, fieldValue, adjustedConfig, false);
    }
  });
});

console.log('\n🎉 纵向布局系统测试完成！');
console.log('\n优化总结:');
console.log('1. ✅ 宫位尺寸改为90x116');
console.log('2. ✅ 顶部从左到右排布：主星、辅星、杂曜、神煞');
console.log('3. ✅ 星曜亮度放在下方，紧挨着');
console.log('4. ✅ 科权禄忌放在亮度下方');
console.log('5. ✅ 宫位地支纵向排列在右下角');
console.log('6. ✅ 宫名称放在地支左边，紧挨着');

console.log('\n纵向布局说明:');
console.log('- 第1层：主星(8,15) + 辅星(32,15) + 杂曜(56,15) + 神煞(80,15)');
console.log('- 第2层：星曜亮度(8,35) - 横向排列');
console.log('- 第3层：科权禄忌(8,55) - 横向排列');
console.log('- 第4层：流年标记(25,75) - 居中显示');
console.log('- 第5层：运限流曜(8,95) + 宫名(45,95) + 地支(65,95)');

console.log('\n下一步：');
console.log('1. 在小程序中重新测试');
console.log('2. 点击"测试"按钮查看效果');
console.log('3. 检查90x116宫位尺寸是否正确');
console.log('4. 验证纵向排版效果');
console.log('5. 确认字段布局符合要求'); 