// iztro 适配器
// 参考：https://ziwei.pro/posts/astrolabe.html

let iztro = null;
try {
  // 尝试导入 iztro
  iztro = require('iztro');
  
  // 配置 iztro（参考：https://ziwei.pro/posts/config-n-plugin.html）
  if (iztro && iztro.astro) {
    // 自定义四化配置（可以根据不同流派调整）
    iztro.astro.config({
      mutagens: {
        // 庚天干四化：太阳化禄、武曲化权、天同化科、天相化忌
        庚: ['太阳', '武曲', '天同', '天相'],
        // 可以添加其他天干的四化配置
      },
      brightness: {
        // 贪狼星在所有宫位都显示为旺
        贪狼: ['旺', '旺', '旺', '旺', '旺', '旺', '旺', '旺', '旺', '旺', '旺', '旺'],
        // 可以添加其他星曜的亮度配置
      },
    });
    
    // 加载自定义插件
    if (iztro.astro.loadPlugin) {
      // 插件1：获取主要星曜
      function majorStarPlugin() {
        this.majorStar = function() {
          let stars = this.palace('命宫')
            ?.majorStars.filter((item) => item.type === 'major' && !['禄存', '天马'].includes(item.name))
            .map((item) => item.name)
            .join(',');

          if (!stars) {
            stars = this.palace('迁移')
              ?.majorStars.filter((item) => item.type === 'major' && !['禄存', '天马'].includes(item.name))
              .map((item) => item.name)
              .join(',');
          }

          return stars ?? '';
        };
      }
      
      // 插件2：获取星曜组合信息
      function starCombinationPlugin() {
        this.getStarCombination = function() {
          const combinations = [];
          this.palaces.forEach((palace, index) => {
            if (palace.majorStars && palace.majorStars.length > 0) {
              const starNames = palace.majorStars.map(s => s.name).join('+');
              combinations.push({
                palace: palace.name,
                stars: starNames,
                index: index
              });
            }
          });
          return combinations;
        };
      }
      
      // 加载插件
      try {
        iztro.astro.loadPlugin(majorStarPlugin);
        iztro.astro.loadPlugin(starCombinationPlugin);
      } catch (e) {
        console.warn('加载 iztro 插件失败:', e);
      }
    }
  }
} catch (e) {
  console.warn('iztro 不可用，使用模拟数据');
  iztro = null;
}

// 适配器：在小程序里优雅加载 iztro；失败时返回 null 让上层走占位逻辑
function tryLoadIztro() {
  try {
    // 微信小程序构建 npm 后从 miniprogram_npm 中加载
    // 常见导出形态：CJS 默认导出、命名导出
    // eslint-disable-next-line
    const mod = require('iztro');
    if (!mod) return null;
    return mod.default || mod; 
  } catch (e) {
    return null;
  }
}

// 将页面的 profile 映射为 iztro 预期参数；尽量字段直传
function mapProfileToParams(profile) {
  const [year, month, day] = (profile.date || '2001-12-01').split('-').map((x) => Number(x));
  const [hour, minute] = (profile.time || '12:20').split(':').map((x) => Number(x));
  return {
    year,
    month,
    day,
    hour,
    minute,
    sex: profile.gender === 'male' ? 1 : (profile.gender === 'female' ? 0 : -1),
    city: profile.city || '北京市',
    lunar: profile.calendarType === 'lunar',
    trueSolarTime: !!profile.trueSolarTime
  };
}

// 返回 iztro 的原始命盘对象（若可用）
function computeRawChart(profile) {
  const Iztro = tryLoadIztro();
  if (!Iztro) return null;
  const params = mapProfileToParams(profile);
  let chart = null;
  try {
    if (typeof Iztro === 'function') {
      try { chart = new Iztro(params); } catch (_) {}
    }
    if (!chart && Iztro && typeof Iztro.compute === 'function') {
      chart = Iztro.compute(params);
    }
    if (!chart && Iztro && typeof Iztro.create === 'function') {
      chart = Iztro.create(params);
    }
  } catch (_) {
    chart = null;
  }
  return chart || null;
}

// 计算命盘（若 iztro 可用）。
// 约定输出：{ summaryText: string, palaces: {name, stars}[] }
function computeChartWithIztro(profile) {
  const chart = computeRawChart(profile);
  if (!chart) return null;

  // 归纳为页面可用的结构（尽量容错）
  const palaces = [];
  const rawPalaces = chart.palaces || chart.gong || chart.palaceList || [];
  for (let i = 0; i < rawPalaces.length; i += 1) {
    const p = rawPalaces[i] || {};
    const name = p.name || p.label || `宫位${i + 1}`;
    const starsArr = p.stars || p.starList || p.yao || [];
    const starNames = Array.isArray(starsArr) ? starsArr.map((s) => (s.name || s)) : [];
    const stars = starNames.join(' ');
    palaces.push({ name, stars, starNames });
  }

  const summaryText = chart.summary || chart.brief || '命盘已生成';
  return { summaryText, palaces, __raw: chart };
}

module.exports = {
  computeChartWithIztro,
  computeRawChart
};

