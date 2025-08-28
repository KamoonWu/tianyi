// 测试修复后的点击事件处理
console.log('=== 测试修复后的点击事件处理 ===');

// 模拟微信小程序的点击事件
function simulateClickEvent(pageX, pageY, canvasRect) {
  console.log(`\n模拟点击事件: 页面坐标(${pageX}, ${pageY})`);
  console.log('Canvas位置信息:', canvasRect);
  
  // 计算相对于Canvas的坐标
  const relativeX = pageX - canvasRect.left;
  const relativeY = pageY - canvasRect.top;
  
  console.log('相对Canvas坐标:', { relativeX, relativeY });
  
  // 模拟宫位布局（与之前测试相同）
  const padding = 6;
  const gap = 0;
  const cols = 4;
  const rows = 4;
  const w = 169.5;
  const h = 197;
  
  const mockCells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const idx = r * cols + c;
      const x = padding + c * (w + gap);
      const y = padding + r * (h + gap);
      
      // 检查是否是中间4个格子（需要合并）
      const isCenter = (r === 1 || r === 2) && (c === 1 || c === 2);
      
      if (isCenter) {
        if (r === 1 && c === 1) {
          // 绘制合并后的中宫区域
          const centerW = w * 2 + gap;
          const centerH = h * 2 + gap;
          mockCells[idx] = { x, y, w: centerW, h: centerH, isCenter: true, skip: true };
        } else {
          // 其他中间格子不绘制，但记录位置信息
          mockCells[idx] = { x, y, w, h, isCenter: true, skip: true };
        }
      } else {
        // 正常绘制12个宫位格子
        mockCells[idx] = { x, y, w, h, skip: false };
      }
    }
  }
  
  // 查找点击的宫位
  let clickedCell = null;
  let clickedIndex = -1;
  
  for (let i = 0; i < mockCells.length; i++) {
    const cell = mockCells[i];
    if (!cell || cell.skip) continue;
    
    if (relativeX >= cell.x && relativeX <= cell.x + cell.w && 
        relativeY >= cell.y && relativeY <= cell.y + cell.h) {
      clickedCell = cell;
      clickedIndex = i;
      console.log(`✅ 点击了宫位 ${i}:`, {
        x: cell.x, y: cell.y, w: cell.w, h: cell.h,
        centerX: cell.x + cell.w / 2,
        centerY: cell.y + cell.h / 2
      });
      break;
    }
  }
  
  if (!clickedCell || clickedIndex === -1) {
    console.log('❌ 未找到点击的宫位');
  }
  
  return { clickedCell, clickedIndex };
}

// 模拟Canvas位置信息
const mockCanvasRect = {
  left: 50,  // Canvas距离页面左边的距离
  top: 100,  // Canvas距离页面顶部的距离
  width: 690,
  height: 800
};

// 测试各种点击位置
console.log('=== 测试各种点击位置 ===');

// 测试命宫（左上角第一个宫位）
simulateClickEvent(50 + 90, 100 + 104, mockCanvasRect);

// 测试兄弟宫（左上角第二个宫位）
simulateClickEvent(50 + 260, 100 + 104, mockCanvasRect);

// 测试中宫区域（应该被跳过）
simulateClickEvent(50 + 260, 100 + 301, mockCanvasRect);

// 测试边界情况
simulateClickEvent(50 + 6, 100 + 6, mockCanvasRect);
simulateClickEvent(50 + 175, 100 + 203, mockCanvasRect);
simulateClickEvent(50 + 684, 100 + 794, mockCanvasRect);

// 测试无效点击
simulateClickEvent(0, 0, mockCanvasRect);
simulateClickEvent(800, 900, mockCanvasRect);

console.log('\n🎉 修复后的点击事件处理测试完成！');
console.log('现在应该能正确处理微信小程序中的点击事件了！'); 