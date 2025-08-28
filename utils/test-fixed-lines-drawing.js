// 测试修复后的连线绘制逻辑
console.log('=== 测试修复后的连线绘制逻辑 ===');

// 模拟宫位索引映射（修复后的）
const LAYOUT_INDEX = {
  '命宫': 0, '兄弟宫': 1, '夫妻宫': 2, '子女宫': 3,
  '财帛宫': 4, '迁移宫': 7,
  '疾厄宫': 8, '交友宫': 11,
  '事业宫': 12, '田宅宫': 13, '福德宫': 14, '父母宫': 15
};

// 模拟六条线定义
const SIX_LINES = {
  '命迁线': { name: '命迁线', alias: '表里线', palaces: ['命宫', '迁移宫'], color: '#ef4444' },
  '兄友线': { name: '兄友线', alias: '沟通线/成就线', palaces: ['兄弟宫', '交友宫'], color: '#3b82f6' },
  '官夫线': { name: '官夫线', alias: '事业线', palaces: ['事业宫', '夫妻宫'], color: '#10b981' },
  '子田线': { name: '子田线', alias: '桃花线', palaces: ['子女宫', '田宅宫'], color: '#f59e0b' },
  '财福线': { name: '财福线', alias: '消费线', palaces: ['财帛宫', '福德宫'], color: '#8b5cf6' },
  '父疾线': { name: '父疾线', alias: '文书线', palaces: ['父母宫', '疾厄宫'], color: '#ec4899' }
};

// 模拟宫位单元格
const mockCells = [];
for (let i = 0; i < 16; i++) {
  const row = Math.floor(i / 4);
  const col = i % 4;
  const x = 6 + col * 169.5;
  const y = 6 + row * 197;
  
  // 检查是否是中间4个格子（需要合并）
  const isCenter = (row === 1 || row === 2) && (col === 1 || col === 2);
  
  if (isCenter) {
    if (row === 1 && col === 1) {
      // 绘制合并后的中宫区域
      mockCells[i] = { x, y, w: 339, h: 394, isCenter: true, skip: true };
    } else {
      // 其他中间格子不绘制，但记录位置信息
      mockCells[i] = { x, y, w: 169.5, h: 197, isCenter: true, skip: true };
    }
  } else {
    // 正常绘制12个宫位格子
    mockCells[i] = { x, y, w: 169.5, h: 197, skip: false };
  }
}

function getPalaceIndex(palaceName) {
  const index = LAYOUT_INDEX[palaceName];
  return index !== undefined ? index : -1;
}

// 测试连线绘制逻辑
function testLinesDrawing(showLines) {
  console.log(`\n连线显示状态: ${showLines ? '显示' : '隐藏'}`);
  
  if (showLines) {
    console.log('✅ 应该绘制连线');
    
    // 绘制所有六条线
    const allLines = Object.keys(SIX_LINES);
    console.log('可用的连线:', allLines);
    
    let linesDrawn = 0;
    
    for (const key of allLines) {
      const line = SIX_LINES[key];
      if (!line) continue;
      
      const idx1 = getPalaceIndex(line.palaces[0]);
      const idx2 = getPalaceIndex(line.palaces[1]);
      
      console.log(`\n连线 ${key}:`, {
        palace1: line.palaces[0],
        palace2: line.palaces[1],
        idx1,
        idx2,
        valid: idx1 >= 0 && idx2 >= 0
      });
      
      if (idx1 >= 0 && idx2 >= 0) {
        const c1 = mockCells[idx1];
        const c2 = mockCells[idx2];
        
        if (c1 && c2 && !c1.skip && !c2.skip) {
          // 计算连线起点和终点
          let startX, startY, endX, endY;
          
          // 根据宫位位置确定连线起点和终点（使用正确的索引）
          if (idx1 === 0 && idx2 === 7) { // 命宫(0)-迁移宫(7)
            startX = c1.x + c1.w / 2;
            startY = c1.y + c1.h / 2;
            endX = c2.x + c2.w / 2;
            endY = c2.y + c2.h / 2;
          } else if (idx1 === 1 && idx2 === 11) { // 兄弟宫(1)-交友宫(11)
            startX = c1.x + c1.w / 2;
            startY = c1.y + c1.h / 2;
            endX = c2.x + c2.w / 2;
            endY = c2.y + c2.h / 2;
          } else if (idx1 === 2 && idx2 === 12) { // 夫妻宫(2)-事业宫(12)
            startX = c1.x + c1.w / 2;
            startY = c1.y + c1.h / 2;
            endX = c2.x + c2.w / 2;
            endY = c2.y + c2.h / 2;
          } else if (idx1 === 3 && idx2 === 13) { // 子女宫(3)-田宅宫(13)
            startX = c1.x + c1.w / 2;
            startY = c1.y + c1.h / 2;
            endX = c2.x + c2.w / 2;
            endY = c2.y + c2.h / 2;
          } else if (idx1 === 4 && idx2 === 14) { // 财帛宫(4)-福德宫(14)
            startX = c1.x + c1.w / 2;
            startY = c1.y + c1.h / 2;
            endX = c2.x + c2.w / 2;
            endY = c2.y + c2.h / 2;
          } else if (idx1 === 8 && idx2 === 15) { // 疾厄宫(8)-父母宫(15)
            startX = c1.x + c1.w / 2;
            startY = c1.y + c1.h / 2;
            endX = c2.x + c2.w / 2;
            endY = c2.y + c2.h / 2;
          } else {
            // 其他连线（通用处理）
            startX = c1.x + c1.w / 2;
            startY = c1.y + c1.h / 2;
            endX = c2.x + c2.w / 2;
            endY = c2.y + c2.h / 2;
          }
          
          console.log(`✅ 连线 ${key} 绘制成功:`, {
            from: line.palaces[0],
            to: line.palaces[1],
            start: `(${startX.toFixed(1)}, ${startY.toFixed(1)})`,
            end: `(${endX.toFixed(1)}, ${endY.toFixed(1)})`,
            color: line.color,
            alias: line.alias
          });
          
          linesDrawn++;
        } else {
          console.log(`❌ 跳过连线 ${key}:`, {
            cell1: c1 ? { skip: c1.skip } : 'null',
            cell2: c2 ? { skip: c2.skip } : 'null'
          });
        }
      } else {
        console.log(`❌ 连线 ${key} 宫位索引无效:`, { idx1, idx2 });
      }
    }
    
    console.log(`\n🎯 总共绘制了 ${linesDrawn} 条连线`);
    
  } else {
    console.log('❌ 连线已隐藏，不绘制任何连线');
  }
}

// 测试连线开关的不同状态
console.log('=== 测试连线开关状态 ===');

// 测试显示连线
testLinesDrawing(true);

console.log('\n--- 切换连线状态 ---');

// 测试隐藏连线
testLinesDrawing(false);

console.log('\n--- 再次切换连线状态 ---');

// 测试重新显示连线
testLinesDrawing(true);

console.log('\n🎉 修复后的连线绘制逻辑测试完成！');
console.log('现在连线开关应该能正确控制连线的显示和隐藏了！'); 