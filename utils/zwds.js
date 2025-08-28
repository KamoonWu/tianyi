// 这里先做 iztro 的轻封装；若在小程序构建阶段无法直接使用 npm 包，
// 可在微信开发者工具中勾选“使用 npm 模块”，并执行：工具-构建 npm。
// 如仍有兼容问题，可将 iztro 源码以自定义模块形式放入 miniprogram_npm/。

function loadActiveProfile() {
  const profiles = wx.getStorageSync('profiles') || [];
  const index = wx.getStorageSync('activeProfileIndex') || 0;
  return profiles[index] || {
    name: '默认用户',
    gender: 'unknown',
    calendarType: 'lunar',
    city: '北京市',
    trueSolarTime: true,
    date: '2001-12-01',
    time: '12:20'
  };
}

function toDateTime(profile) {
  const dateStr = `${profile.date} ${profile.time}:00`;
  // 这里只做简单拼接，真实项目可结合时区、真太阳时与地理经度修正
  return new Date(dateStr.replace(/-/g, '/'));
}

const { computeChartWithIztro } = require('./iztro-adapter');

function buildChartSummary(profile) {
  try {
    const computed = computeChartWithIztro(profile);
    if (computed && computed.summaryText) return computed.summaryText;
    const dt = toDateTime(profile);
    return `${profile.name} · ${profile.city}\n时间：${profile.calendarType === 'lunar' ? '农历' : '公历'} ${profile.date} ${profile.time}\n真太阳时：${profile.trueSolarTime ? '是' : '否'}\n（示例）命盘已生成，点击设置可修改信息。`;
  } catch (e) {
    return '命盘生成失败（占位）';
  }
}

function buildPalaceList(profile) {
  const computed = computeChartWithIztro(profile);
  if (computed && Array.isArray(computed.palaces) && computed.palaces.length) return computed.palaces;
  
  // 返回更丰富的测试数据
  return [
    { 
      name: '命宫', 
      stars: '紫微 天机 左辅 天马 红鸾 天喜 化科',
      starNames: ['紫微', '天机', '左辅', '天马', '红鸾', '天喜', '化科']
    },
    { 
      name: '兄弟宫', 
      stars: '太阳 天梁 右弼 文昌 天魁',
      starNames: ['太阳', '天梁', '右弼', '文昌', '天魁']
    },
    { 
      name: '夫妻宫', 
      stars: '贪狼 天相 文曲 天钺 天刑',
      starNames: ['贪狼', '天相', '文曲', '天钺', '天刑']
    },
    { 
      name: '子女宫', 
      stars: '太阴 天同 禄存 擎羊 天姚',
      starNames: ['太阴', '天同', '禄存', '擎羊', '天姚']
    },
    { 
      name: '财帛宫', 
      stars: '武曲 破军 火星 铃星 地空 化禄',
      starNames: ['武曲', '破军', '火星', '铃星', '地空', '化禄']
    },
    { 
      name: '疾厄宫', 
      stars: '廉贞 七杀 陀罗 地劫 天哭',
      starNames: ['廉贞', '七杀', '陀罗', '地劫', '天哭']
    },
    { 
      name: '迁移宫', 
      stars: '天府 天机 天马 天巫 天月',
      starNames: ['天府', '天机', '天马', '天巫', '天月']
    },
    { 
      name: '交友宫', 
      stars: '天相 天梁 天厨 天才 天寿',
      starNames: ['天相', '天梁', '天厨', '天才', '天寿']
    },
    { 
      name: '事业宫', 
      stars: '武曲 破军 天官 天福 天虚 化权',
      starNames: ['武曲', '破军', '天官', '天福', '天虚', '化权']
    },
    { 
      name: '田宅宫', 
      stars: '太阴 天同 天使 天伤 天贵',
      starNames: ['太阴', '天同', '天使', '天伤', '天贵']
    },
    { 
      name: '福德宫', 
      stars: '贪狼 天相 龙德 天煞 华盖',
      starNames: ['贪狼', '天相', '龙德', '天煞', '华盖']
    },
    { 
      name: '父母宫', 
      stars: '紫微 天机 孤辰 寡宿 蜚廉',
      starNames: ['紫微', '天机', '孤辰', '寡宿', '蜚廉']
    }
  ];
}

function mapRangeText(range) {
  switch (range) {
    case 'today': return '今日';
    case 'tomorrow': return '明日';
    case 'week': return '本周';
    case 'month': return '本月';
    case 'year': return '本年';
    default: return '今日';
  }
}

// 构建运限信息
function buildFortunes(profile, range = 'today') {
  // 模拟运限数据，参照 https://ziwei.pub/astrolabe/?d=19910122&t=1&leap=false&g=male&type=lunar&n=%E9%A3%8E%E5%85%88%E7%94%9F
  return {
    decadal: {
      heavenlyStem: '辛',
      earthlyBranch: '未',
      age: 35,
      palaceNames: ['夫妻', '兄弟', '命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛', '子女']
    },
    yearly: {
      heavenlyStem: '乙',
      earthlyBranch: '巳',
      palaceNames: ['兄弟', '命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛', '子女', '夫妻']
    },
    monthly: {
      heavenlyStem: '庚',
      earthlyBranch: '申',
      palaceNames: ['子女', '夫妻', '兄弟', '命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛']
    },
    daily: {
      heavenlyStem: '戊',
      earthlyBranch: '午',
      palaceNames: ['子女', '夫妻', '兄弟', '命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛']
    },
    hourly: {
      heavenlyStem: '壬',
      earthlyBranch: '子',
      palaceNames: ['子女', '夫妻', '兄弟', '命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛']
    },
    currentPalace: '命宫',
    mingGong: '丑',
    shenGong: '卯',
    wuxingju: '土五局',
    mingZhu: '巨门',
    shenZhu: '天相'
  };
}

module.exports = {
  loadActiveProfile,
  buildChartSummary,
  buildPalaceList,
  buildFortunes
};

