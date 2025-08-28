// 最终测试：验证无重叠的字段布局
console.log('=== 最终测试：验证无重叠的字段布局 ===');

// 引入字段优化系统
const {
  PALACE_FIELD_STRUCTURE
} = require('./palace-field-optimization');

console.log('🧪 测试1: 字段布局配置验证');
Object.keys(PALACE_FIELD_STRUCTURE).forEach(fieldKey => {
  const config = PALACE_FIELD_STRUCTURE[fieldKey];
  console.log(`✅ ${fieldKey}: x=${config.x}, y=${config.y}, w=${config.width}, h=${config.height}, 对齐=${config.align}`);
});

console.log('\n🧪 测试2: 字段位置冲突检查');
const positions = [];
Object.keys(PALACE_FIELD_STRUCTURE).forEach(fieldKey => {
  const config = PALACE_FIELD_STRUCTURE[fieldKey];
  positions.push({
    field: fieldKey,
    x: config.x,
    y: config.y,
    width: config.width,
    height: config.height
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
      console.log(`❌ 字段位置冲突: ${pos1.field} 与 ${pos2.field} 重叠`);
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

console.log('\n🧪 测试3: 字段分布可视化');
console.log('宫位布局示意图 (120x180):');
console.log('┌─────────────────────────────────────────────────────────┐');
console.log('│ 0,0                                                      │');
console.log('│  ┌─────────────┐  ┌─────────┐                           │');
console.log('│  │ 主星(8,25)  │  │四化(90,25)│                        │');
console.log('│  │ 70x16       │  │ 25x16   │                           │');
console.log('│  └─────────────┘  └─────────┘                           │');
console.log('│  ┌─────────────┐                                         │');
console.log('│  │ 辅星(8,45)  │                                         │');
console.log('│  │ 70x16       │                                         │');
console.log('│  └─────────────┘                                         │');
console.log('│                                                           │');
console.log('│                    ┌─────────────┐                        │');
console.log('│                    │ 流年(60,75) │                        │');
console.log('│                    │ 60x16       │                        │');
console.log('│                    └─────────────┘                        │');
console.log('│  ┌─────────────┐  ┌─────────┐                           │');
console.log('│  │ 杂曜(8,95)  │  │运限(90,95)│                        │');
console.log('│  │ 70x40       │  │ 25x40   │                           │');
console.log('│  └─────────────┘  └─────────┘                           │');
console.log('│  ┌─────────────┐  ┌─────────┐                           │');
console.log('│  │长生(8,140)  │  │年龄(90,140)│                       │');
console.log('│  │ 70x16       │  │ 25x16   │                           │');
console.log('│  └─────────────┘  └─────────┘                           │');
console.log('│  ┌─────────┐ ┌─────────┐                               │');
console.log('│  │宫名(8,160)│ │地支(50,160)│                          │');
console.log('│  │ 40x16   │ │ 40x16   │                               │');
console.log('│  └─────────┘ └─────────┘                               │');
console.log('│                                                           │');
console.log('└─────────────────────────────────────────────────────────┘');

console.log('\n🎉 最终字段布局测试完成！');
console.log('\n优化总结:');
console.log('1. ✅ 重新设计了字段位置，完全避免重叠');
console.log('2. ✅ 调整了字段宽度，确保左右不冲突');
console.log('3. ✅ 优化了各字段的坐标分布');
console.log('4. ✅ 主星、辅星、四化星等完全分离');
console.log('5. ✅ 流年标记居中显示，不与其他字段冲突');

console.log('\n字段布局说明（最终优化）:');
console.log('- 主星：左上角 (8, 25) - 70x16，最显眼位置');
console.log('- 辅星：主星下方 (8, 45) - 70x16，不重叠');
console.log('- 四化星：右上角 (90, 25) - 25x16，不与其他字段重叠');
console.log('- 流年标记：正中央 (60, 75) - 60x16，不与其他字段重叠');
console.log('- 杂曜/神煞星：左侧分布 (8, 95) - 70x40，避免重叠');
console.log('- 运限流曜：右侧 (90, 95) - 25x40，不与其他字段重叠');
console.log('- 长生十二神：底部 (8, 140) - 70x16，不与其他字段重叠');
console.log('- 年龄区间：底部右侧 (90, 140) - 25x16，不与其他字段重叠');
console.log('- 宫位名称：左下角 (8, 160) - 40x16，不与其他字段重叠');
console.log('- 宫位地支：左下角 (50, 160) - 40x16，紧邻宫位名称，不重叠');

console.log('\n下一步：');
console.log('1. 在小程序中重新测试');
console.log('2. 点击"测试"按钮查看效果');
console.log('3. 检查字段是否完全不再重叠');
console.log('4. 验证高亮样式是否正确（无填充色，细边框）');
console.log('5. 确认所有字段都在正确位置显示'); 