/**
 * iztro-cdn.js
 * 从CDN加载iztro库
 */

// 定义iztro全局变量
let iztro = null;

/**
 * 从CDN加载iztro库
 * @returns {Promise} 加载完成的Promise
 */
function loadIztroFromCDN() {
  return new Promise((resolve, reject) => {
    console.log('开始从CDN加载iztro库...');
    
    // 创建script标签
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/iztro/dist/iztro.min.js';
    script.async = true;
    
    // 成功加载
    script.onload = () => {
      console.log('iztro库从CDN加载成功');
      iztro = window.iztro;
      resolve(iztro);
    };
    
    // 加载失败
    script.onerror = (error) => {
      console.error('iztro库从CDN加载失败:', error);
      reject(error);
    };
    
    // 添加到文档中
    document.head.appendChild(script);
  });
}

/**
 * 获取iztro库实例
 * @returns {Object} iztro库实例
 */
function getIztro() {
  return iztro;
}

/**
 * 初始化iztro库
 * @returns {Promise} 初始化完成的Promise
 */
async function initIztro() {
  if (!iztro) {
    try {
      await loadIztroFromCDN();
      return iztro;
    } catch (error) {
      console.error('初始化iztro库失败:', error);
      throw error;
    }
  }
  return iztro;
}

module.exports = {
  loadIztroFromCDN,
  getIztro,
  initIztro
}; 