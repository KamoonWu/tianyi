// 测试宫位索引映射
console.log('=== 测试宫位索引映射 ===');

const { SIX_LINES, LAYOUT_INDEX, getPalaceIndex } = require('./palace-lines');

console.log('宫位索引映射:', LAYOUT_INDEX);
console.log('六条线定义:', SIX_LINES);

// 测试每条线的宫位索引
console.log('\n=== 测试每条线的宫位索引 ===');

Object.entries(SIX_LINES).forEach(([key, line]) => {
  const idx1 = getPalaceIndex(line.palaces[0]);
  const idx2 = getPalaceIndex(line.palaces[1]);
  
  console.log(`${key}:`, {
    palace1: line.palaces[0],
    palace2: line.palaces[1],
    idx1,
    idx2,
    valid: idx1 >= 0 && idx2 >= 0,
    color: line.color,
    alias: line.alias
  });
});

// 验证所有宫位都有正确的索引
console.log('\n=== 验证宫位索引完整性 ===');

const allPalaces = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫',
  '财帛宫', '迁移宫', '疾厄宫', '交友宫',
  '事业宫', '田宅宫', '福德宫', '父母宫'
];

allPalaces.forEach(palace => {
  const index = getPalaceIndex(palace);
  console.log(`${palace}: 索引 ${index} ${index >= 0 ? '✅' : '❌'}`);
});

// 测试4x4布局的宫位排列
console.log('\n=== 4x4布局宫位排列 ===');

const layout4x4 = [
  ['命宫', '兄弟宫', '夫妻宫', '子女宫'],
  ['财帛宫', '中宫', '中宫', '迁移宫'],
  ['疾厄宫', '中宫', '中宫', '交友宫'],
  ['事业宫', '田宅宫', '福德宫', '父母宫']
];

layout4x4.forEach((row, rowIndex) => {
  const rowStr = row.map((palace, colIndex) => {
    if (palace === '中宫') {
      return '中宫';
    } else {
      const index = getPalaceIndex(palace);
      return `${palace}(${index})`;
    }
  }).join(' | ');
  
  console.log(`第${rowIndex + 1}行: ${rowStr}`);
});

console.log('\n🎉 宫位索引映射测试完成！');
console.log('如果所有宫位都有正确的索引，说明映射是正确的'); 