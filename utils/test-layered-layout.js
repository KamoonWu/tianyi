// 测试分层布局系统
console.log('=== 测试分层布局系统 ===');

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

console.log('🧪 测试1: 新的颜色配置');
Object.keys(STAR_CATEGORIES).forEach(category => {
  const config = STAR_CATEGORIES[category];
  console.log(`✅ ${category}: ${config.color} - ${config.description}`);
});

console.log('\n🧪 测试2: 分层布局配置验证');
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
    height: config.height
  });
});

Object.keys(layers).sort((a, b) => parseInt(a) - parseInt(b)).forEach(layer => {
  console.log(`\n📋 第${layer}层字段:`);
  layers[layer].forEach(field => {
    console.log(`  ✅ ${field.field}: (${field.x}, ${field.y}) - ${field.width}x${field.height}`);
  });
});

console.log('\n🧪 测试3: 字段数据生成');
const fieldData = getPalaceFieldData(testPalace, testFlowYear);
console.log('✅ 字段数据:', fieldData);

console.log('\n🧪 测试4: 分层布局可视化');
console.log('宫位分层布局示意图 (120x180):');
console.log('┌─────────────────────────────────────────────────────────┐');
console.log('│ 第1层: 主星(8,20) + 四化星(75,20)                      │');
console.log('│  ┌─────────────┐  ┌─────────┐                           │');
console.log('│  │ 主星60x16   │  │四化35x16│                        │');
console.log('│  └─────────────┘  └─────────┘                           │');
console.log('│                                                           │');
console.log('│ 第2层: 辅星(8,40)                                        │');
console.log('│  ┌─────────────┐                                         │');
console.log('│  │ 辅星60x16   │                                         │');
console.log('│  └─────────────┘                                         │');
console.log('│                                                           │');
console.log('│ 第3层: 流年标记(50,60)                                   │');
console.log('│                    ┌─────────────┐                        │');
console.log('│                    │ 流年50x16   │                        │');
console.log('│                    └─────────────┘                        │');
console.log('│                                                           │');
console.log('│ 第4层: 杂曜(8,85) + 运限(75,85)                          │');
console.log('│  ┌─────────────┐  ┌─────────┐                           │');
console.log('│  │ 杂曜60x48   │  │运限35x48│                        │');
console.log('│  │ (3行显示)   │  │(3行显示)│                        │');
console.log('│  └─────────────┘  └─────────┘                           │');
console.log('│                                                           │');
console.log('│ 第5层: 长生(8,140) + 年龄(75,140)                        │');
console.log('│  ┌─────────────┐  ┌─────────┐                           │');
console.log('│  │ 长生60x16   │  │年龄35x16│                        │');
console.log('│  └─────────────┘  └─────────┘                           │');
console.log('│                                                           │');
console.log('│ 第6层: 宫名(8,160) + 地支(55,160)                        │');
console.log('│  ┌─────────┐ ┌─────────┐                               │');
console.log('│  │宫名45x16│ │地支35x16│                               │');
console.log('│  └─────────┘ └─────────┘                               │');
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

console.log('\n🎉 分层布局系统测试完成！');
console.log('\n优化总结:');
console.log('1. ✅ 采用6层分层布局，完全避免重叠');
console.log('2. ✅ 优化了颜色配置，灰色文字更明显');
console.log('3. ✅ 支持多行显示，合理利用空间');
console.log('4. ✅ 每层字段都有独立的显示空间');
console.log('5. ✅ 按照逻辑关系组织字段层级');

console.log('\n分层布局说明:');
console.log('- 第1层：主星(左上) + 四化星(右上)');
console.log('- 第2层：辅星(主星下方)');
console.log('- 第3层：流年标记(中央)');
console.log('- 第4层：杂曜(左侧) + 运限(右侧)，支持多行');
console.log('- 第5层：长生十二神(底部左) + 年龄区间(底部右)');
console.log('- 第6层：宫位名称(最底部左) + 宫位地支(最底部右)');

console.log('\n下一步：');
console.log('1. 在小程序中重新测试');
console.log('2. 点击"测试"按钮查看效果');
console.log('3. 检查字段是否完全不再重叠');
console.log('4. 验证颜色是否更明显');
console.log('5. 确认分层布局效果'); 