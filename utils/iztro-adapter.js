// iztro 适配器 - 微信小程序版本
// 参考：https://ziwei.pro/posts/astrolabe.html

let iztro = null;

// 尝试加载iztro库
function tryLoadIztro() {
  if (iztro !== null) {
    return iztro;
  }
  
  try {
    // 方法1：直接require
    const mod = require('iztro');
    if (mod && mod.astro) {
      iztro = mod;
      console.log('✅ iztro库加载成功 (直接引入)');
      return iztro;
    }
  } catch (e) {
    console.warn('方法1失败:', e.message);
  }

  try {
    // 方法2：从miniprogram_npm加载
    const mod = require('../miniprogram_npm/iztro/index');
    if (mod && mod.astro) {
      iztro = mod;
      console.log('✅ iztro库加载成功 (miniprogram_npm)');
      return iztro;
    }
  } catch (e) {
    console.warn('方法2失败:', e.message);
  }

  try {
    // 方法3：尝试不同的路径
    const mod = require('miniprogram_npm/iztro/index.js');
    if (mod && mod.astro) {
      iztro = mod;
      console.log('✅ iztro库加载成功 (相对路径)');
      return iztro;
    }
  } catch (e) {
    console.warn('方法3失败:', e.message);
  }

  console.warn('⚠️ iztro库加载失败，将使用模拟数据');
  iztro = false; // 标记为失败，避免重复尝试
  return null;
}

// 将profile数据转换为iztro参数
function mapProfileToParams(profile) {
  // 解析日期
  const [year, month, day] = (profile.date || '1991-1-22').split('-').map(x => parseInt(x));
  
  // 解析时间并转换为时辰索引
  const [hour, minute] = (profile.time || '04:00').split(':').map(x => parseInt(x));
  
  // 时辰索引转换
  const timeIndexMap = {
    23: 0, 0: 0, 1: 0,        // 子时
    2: 1, 3: 1,               // 丑时
    4: 2, 5: 2,               // 寅时
    6: 3, 7: 3,               // 卯时
    8: 4, 9: 4,               // 辰时
    10: 5, 11: 5,             // 巳时
    12: 6, 13: 6,             // 午时
    14: 7, 15: 7,             // 未时
    16: 8, 17: 8,             // 申时
    18: 9, 19: 9,             // 酉时
    20: 10, 21: 10,           // 戌时
    22: 11                    // 亥时
  };
  
  const timeIndex = timeIndexMap[hour] || 0;
  
  return {
    date: profile.date,
    timeIndex: timeIndex,
    gender: profile.gender || '男',
    // 兼容其他可能的参数格式
    year,
    month,
    day,
    hour,
    minute,
    sex: profile.gender === '男' ? 1 : 0,
    city: profile.city || '太原市',
    lunar: profile.calendarType === 'lunar' || false,
    trueSolarTime: !!profile.trueSolarTime
  };
}

// 使用iztro计算排盘
function computeRawChart(profile) {
  const mod = tryLoadIztro();
  if (!mod || !mod.astro) {
    return null;
  }

  const params = mapProfileToParams(profile);
  
  try {
    // 使用iztro的bySolar方法
    const astrolabe = mod.astro.bySolar(
      params.date,
      params.timeIndex,
      params.gender
    );
    
    if (astrolabe) {
      console.log('🌟 iztro排盘计算成功');
      return astrolabe;
    }
  } catch (error) {
    console.error('iztro计算失败:', error);
  }
  
  return null;
}

// 高级接口：返回适配后的排盘数据
function computeChartWithIztro(profile) {
  const rawChart = computeRawChart(profile);
  if (!rawChart) {
    return null;
  }

  try {
    // 转换为标准格式
    const palaces = [];
    
    if (rawChart.palaces && Array.isArray(rawChart.palaces)) {
      rawChart.palaces.forEach((palace, index) => {
        const stars = [];
        
        // 收集所有星曜
        if (palace.majorStars) {
          palace.majorStars.forEach(star => {
            stars.push(star.name || star);
          });
        }
        if (palace.minorStars) {
          palace.minorStars.forEach(star => {
            stars.push(star.name || star);
          });
        }
        if (palace.adjectiveStars) {
          palace.adjectiveStars.forEach(star => {
            stars.push(star.name || star);
          });
        }
        
        palaces.push({
          name: palace.name || `宫位${index + 1}`,
          stars: stars.join(' '),
          starNames: stars,
          index: index,
          palace: palace // 保留原始数据
        });
      });
    }

    const summaryText = `${rawChart.gender} ${rawChart.solarDate} ${rawChart.lunarDate} ${rawChart.fiveElementsClass}`;
    
    return {
      summaryText,
      palaces,
      __raw: rawChart
    };
  } catch (error) {
    console.error('转换iztro数据失败:', error);
    return null;
  }
}

// 检查iztro是否可用
function isIztroAvailable() {
  const mod = tryLoadIztro();
  return mod && mod.astro && typeof mod.astro.bySolar === 'function';
}

module.exports = {
  computeChartWithIztro,
  computeRawChart,
  isIztroAvailable,
  tryLoadIztro
};
