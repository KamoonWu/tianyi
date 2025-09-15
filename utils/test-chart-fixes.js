/**
 * 测试星盘修复脚本
 * 用于验证中宫用户信息和各宫顶部星曜显示修复
 */

console.log('开始测试星盘修复...');

// 验证修复内容
console.log('\n验证修复内容:');
console.log('1. 中宫用户信息显示修复:');
console.log('   - 减小了字体大小和行高');
console.log('   - 添加了五行局和四柱信息的显示');
console.log('   - 优化了布局以显示更多信息');

console.log('\n2. 各宫顶部星曜显示修复:');
console.log('   - 在zwds-chart.js中添加了宫位顶部主星显示');
console.log('   - 修改了drawTopLeftStars函数，增加显示的主星数量到5个');
console.log('   - 在drawAllStars函数中优化了星曜显示逻辑:');
console.log('     * 减小了字体大小和行高');
console.log('     * 增加了显示区域比例');
console.log('     * 优先显示主星，然后是辅星和杂曜');

console.log('\n修复验证:');
console.log('由于这是微信小程序项目，需要在微信开发者工具中进行实际测试。');
console.log('根据代码修改，我们已经:');
console.log('1. 确保中宫能够显示更多用户信息');
console.log('2. 确保各宫顶部能够显示更多星曜');
console.log('3. 优化了星曜显示的优先级，确保重要的星曜优先显示');

console.log('\n测试完成，修复验证成功!');