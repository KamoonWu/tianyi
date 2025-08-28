// 测试点击坐标计算
console.log('=== 测试点击坐标计算 ===');

// 模拟Canvas尺寸和宫位布局
const canvasWidth = 690;
const canvasHeight = 800;
const padding = 6;
const gap = 0;
const cols = 4;
const rows = 4;

const cellW = (canvasWidth - padding * 2 - gap * (cols - 1));
const cellH = (canvasHeight - padding * 2 - gap * (rows - 1));
const w = cellW / cols;
const h = cellH / rows;

console.log('Canvas布局信息:', {
  canvasWidth, canvasHeight, padding, gap,
  cellW, cellH, w, h
});

// 模拟宫位数据
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

console.log('模拟宫位布局:', mockCells.map((cell, idx) => ({
  index: idx,
  x: cell.x,
  y: cell.y,
  w: cell.w,
  h: cell.h,
  skip: cell.skip,
  isCenter: cell.isCenter
})));

// 测试点击检测函数
function testClickDetection(clickX, clickY) {
  console.log(`\n测试点击坐标: (${clickX}, ${clickY})`);
  
  let clickedCell = null;
  let clickedIndex = -1;
  
  for (let i = 0; i < mockCells.length; i++) {
    const cell = mockCells[i];
    if (!cell || cell.skip) continue;
    
    if (clickX >= cell.x && clickX <= cell.x + cell.w && 
        clickY >= cell.y && clickY <= cell.y + cell.h) {
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

// 测试各种点击位置
console.log('\n=== 测试各种点击位置 ===');

// 测试命宫（左上角第一个宫位）
testClickDetection(padding + w/2, padding + h/2);

// 测试兄弟宫（左上角第二个宫位）
testClickDetection(padding + w + w/2, padding + h/2);

// 测试中宫区域
testClickDetection(padding + w + w/2, padding + h + h/2);

// 测试边界情况
testClickDetection(padding, padding);
testClickDetection(padding + w, padding + h);
testClickDetection(canvasWidth - padding, canvasHeight - padding);

// 测试无效点击
testClickDetection(0, 0);
testClickDetection(canvasWidth + 100, canvasHeight + 100);

console.log('\n🎉 点击坐标计算测试完成！'); 