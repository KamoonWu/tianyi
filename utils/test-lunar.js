/**
 * 测试 lunar-typescript 和 iztro 库的加载
 */

// 测试 lunar-typescript 模块
function testLunarTypescript() {
  try {
    const lunarTS = require('../miniprogram_npm/lunar-lite/lunar-typescript.js');
    console.log('lunar-typescript 模块加载成功:', Object.keys(lunarTS));
    return true;
  } catch (error) {
    console.error('lunar-typescript 模块加载失败:', error);
    return false;
  }
}

// 测试 iztro 库
function testIztro() {
  try {
    // 尝试从 npm 加载
    const iztro = require('iztro');
    console.log('iztro 库加载成功 (npm):', typeof iztro);
    return true;
  } catch (npmError) {
    console.warn('从 npm 加载 iztro 失败:', npmError);
    
    try {
      // 尝试从本地加载
      const iztro = require('./lib/iztro.min.js');
      console.log('iztro 库加载成功 (本地):', typeof iztro);
      return true;
    } catch (localError) {
      console.error('从本地加载 iztro 失败:', localError);
      return false;
    }
  }
}

// 运行测试
console.log('===== 开始测试 =====');
const lunarResult = testLunarTypescript();
const iztroResult = testIztro();
console.log('lunar-typescript 测试结果:', lunarResult ? '成功' : '失败');
console.log('iztro 测试结果:', iztroResult ? '成功' : '失败');
console.log('===== 测试结束 =====');

module.exports = {
  testLunarTypescript,
  testIztro
};