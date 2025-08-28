// 调试宫位索引问题
console.log('=== 调试宫位索引问题 ===');

// 直接定义索引映射
const LAYOUT_INDEX = {
  '命宫': 0, '兄弟宫': 1, '夫妻宫': 2, '子女宫': 3,
  '财帛宫': 4, '迁移宫': 7,
  '疾厄宫': 8, '交友宫': 11,
  '事业宫': 12, '田宅宫': 13, '福德宫': 14, '父母宫': 15
};

console.log('直接定义的LAYOUT_INDEX:', LAYOUT_INDEX);
console.log('命宫索引:', LAYOUT_INDEX['命宫']);

function getPalaceIndex(palaceName) {
  console.log(`getPalaceIndex('${palaceName}') 调用:`);
  console.log('  palaceName类型:', typeof palaceName);
  console.log('  palaceName值:', palaceName);
  console.log('  palaceName长度:', palaceName.length);
  console.log('  palaceName in LAYOUT_INDEX:', palaceName in LAYOUT_INDEX);
  console.log('  LAYOUT_INDEX[palaceName]:', LAYOUT_INDEX[palaceName]);
  console.log('  返回结果:', LAYOUT_INDEX[palaceName] || -1);
  return LAYOUT_INDEX[palaceName] || -1;
}

// 测试各种情况
console.log('\n=== 测试各种情况 ===');

console.log('\n1. 测试命宫:');
getPalaceIndex('命宫');

console.log('\n2. 测试兄弟宫:');
getPalaceIndex('兄弟宫');

console.log('\n3. 测试不存在的宫位:');
getPalaceIndex('不存在的宫位');

console.log('\n4. 测试空字符串:');
getPalaceIndex('');

console.log('\n5. 测试null:');
getPalaceIndex(null);

console.log('\n6. 测试undefined:');
getPalaceIndex(undefined);

// 测试字符串编码
console.log('\n=== 测试字符串编码 ===');
const mingGong = '命宫';
console.log('命宫字符串:');
console.log('  原始:', mingGong);
console.log('  编码:', Buffer.from(mingGong, 'utf8').toString('hex'));
console.log('  长度:', mingGong.length);
console.log('  字符码:', mingGong.charCodeAt(0), mingGong.charCodeAt(1));

// 测试对象键的编码
console.log('\n对象键的编码:');
Object.keys(LAYOUT_INDEX).forEach(key => {
  console.log(`  ${key}: ${Buffer.from(key, 'utf8').toString('hex')}`);
});

console.log('\n🎉 调试完成！'); 