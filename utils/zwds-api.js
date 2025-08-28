const { computeRawChart } = require('./iztro-adapter');
const { loadActiveProfile } = require('./zwds');
const { DESCRIPTIONS } = require('./palace-descriptions');

function getChart(profile) {
  const p = profile || loadActiveProfile();
  const raw = computeRawChart(p);
  return raw || null;
}

// 1) 紫微斗数 12 宫的星盘数据（返回数组，含宫名、星曜列表）
function getTwelvePalaces(profile) {
  const chart = getChart(profile);
  if (!chart) return [];
  const list = chart.palaces || chart.gong || chart.palaceList || [];
  return list.map((p, i) => ({
    index: i,
    name: p.name || p.label || `宫位${i + 1}`,
    brief: DESCRIPTIONS[p.name || p.label] || '',
    stars: Array.isArray(p.stars) ? p.stars : (p.starList || p.yao || []),
  }));
}

// 2) 获取生肖
function getZodiac(profile) {
  const chart = getChart(profile);
  return chart?.zodiac || chart?.shengxiao || null;
}

// 3) 获取星座
function getConstellation(profile) {
  const chart = getChart(profile);
  return chart?.constellation || chart?.xingzuo || null;
}

// 4) 获取四柱（年柱、月柱、日柱、时柱）
function getFourPillars(profile) {
  const chart = getChart(profile);
  const stems = chart?.fourPillars || chart?.ganzhi || null;
  if (!stems) return null;
  return {
    year: stems.year || stems.nianzhu || null,
    month: stems.month || stems.yuezhu || null,
    day: stems.day || stems.rizhu || null,
    hour: stems.hour || stems.shizhu || null,
  };
}

// 5) 获取运限（大限、小限、流年、流月、流日、流时）
function getFortuneCycles(profile) {
  const chart = getChart(profile);
  if (!chart) return null;
  return chart.cycles || chart.yunxian || {
    major: chart.major || chart.daxian || null,
    minor: chart.minor || chart.xiaoxian || null,
    yearFlow: chart.yearFlow || chart.liunian || null,
    monthFlow: chart.monthFlow || chart.liuYue || null,
    dayFlow: chart.dayFlow || chart.liuri || null,
    hourFlow: chart.hourFlow || chart.liushi || null
  };
}

// 6) 获取流耀（大限和流年的动态星耀）
function getDynamicStars(profile) {
  const chart = getChart(profile);
  return chart?.dynamicStars || chart?.liuyao || null;
}

// 工具：在指定宫位或其三方四正中查找星曜/四化/亮度
function findPalaceByName(chart, palaceName) {
  if (!chart) return null;
  const list = chart.palaces || chart.gong || chart.palaceList || [];
  return list.find((p) => (p.name || p.label) === palaceName) || null;
}

function getSanFangSiZhengPalaces(chart, palaceName) {
  // 若有现成 API，用之；否则占位基于 palace 对象的关系字段
  const p = findPalaceByName(chart, palaceName);
  if (!p) return [];
  const rel = p.sanfang || p.sifang || p.quadrants || [];
  return Array.isArray(rel) ? rel : [];
}

function hasStarsInPalace(chart, palaceName, starNames = []) {
  const p = findPalaceByName(chart, palaceName);
  if (!p) return false;
  const stars = Array.isArray(p.stars) ? p.stars.map((s) => s.name || s) : [];
  return starNames.every((n) => stars.includes(n));
}

function hasHuaInPalace(chart, palaceName, huaNames = []) {
  const p = findPalaceByName(chart, palaceName);
  if (!p) return false;
  const hua = p.hua || p.siHua || [];
  const names = Array.isArray(hua) ? hua.map((x) => x.name || x) : [];
  return huaNames.every((n) => names.includes(n));
}

// 7-20) 判定与查询 API（尽量占位实现，等待 iztro 具体字段适配）
function palaceHasStars(palaceName, stars) {
  const chart = getChart();
  return hasStarsInPalace(chart, palaceName, stars);
}

function sanFangSiZhengHasStars(palaceName, stars) {
  const chart = getChart();
  const rel = getSanFangSiZhengPalaces(chart, palaceName);
  return rel.some((n) => hasStarsInPalace(chart, n, stars));
}

function sanFangSiZhengHasHua(palaceName, huaNames) {
  const chart = getChart();
  const rel = getSanFangSiZhengPalaces(chart, palaceName);
  return rel.some((n) => hasHuaInPalace(chart, n, huaNames));
}

function starHasHua(starName) {
  const chart = getChart();
  const palaces = getTwelvePalaces();
  for (const p of palaces) {
    const hua = (p.siHua || p.hua || []).map((x) => x.name || x);
    if (hua.includes(starName)) return true;
  }
  return false;
}

function starSanFangSiZhengHasHua(starName) {
  const chart = getChart();
  const palaces = getTwelvePalaces();
  const palace = palaces.find((p) => (p.stars || []).some((s) => (s.name || s) === starName));
  if (!palace) return false;
  const rel = getSanFangSiZhengPalaces(chart, palace.name);
  return rel.some((n) => hasHuaInPalace(chart, n, [starName]));
}

function starIsBrightness(starName, level) {
  const chart = getChart();
  const palaces = chart?.palaces || chart?.gong || [];
  for (const p of palaces) {
    const s = (p.stars || []).find((x) => (x.name || x) === starName);
    if (s && (s.brightness === level || s.liangdu === level)) return true;
  }
  return false;
}

function getSiHuaByTianGan(gan) {
  const chart = getChart();
  const map = chart?.siHuaMap || chart?.fourHuaMap || null;
  return map ? (map[gan] || null) : null;
}

function getPalaceOfStar(starName) {
  const palaces = getTwelvePalaces();
  return palaces.find((p) => (p.stars || []).some((s) => (s.name || s) === starName)) || null;
}

function getSanFangSiZhengPalacesByStar(starName) {
  const chart = getChart();
  const palace = getPalaceOfStar(starName);
  if (!palace) return [];
  return getSanFangSiZhengPalaces(chart, palace.name);
}

function getOppositePalaceOfStar(starName) {
  const chart = getChart();
  const palace = getPalaceOfStar(starName);
  if (!palace) return null;
  const p = findPalaceByName(chart, palace.name);
  return p?.opposite || p?.duiGong || null;
}

// 运限相关（占位字段名，具体以 iztro 实际为准）
function getFortunePalace(type, index) {
  const cycles = getFortuneCycles();
  const list = cycles?.[type] || [];
  return list[index] || null;
}

function getFortuneSanFangSiZheng(type, index) {
  const chart = getChart();
  const p = getFortunePalace(type, index);
  if (!p) return [];
  return getSanFangSiZhengPalaces(chart, p.name || p.label);
}

function fortunePalaceHasStars(type, index, stars) {
  const p = getFortunePalace(type, index);
  if (!p) return false;
  const starNames = (p.stars || []).map((s) => s.name || s);
  return stars.every((n) => starNames.includes(n));
}

function fortunePalaceHasHua(type, index, huaNames) {
  const p = getFortunePalace(type, index);
  if (!p) return false;
  const names = (p.hua || p.siHua || []).map((x) => x.name || x);
  return huaNames.every((n) => names.includes(n));
}

function fortuneSanFangSiZhengHasStars(type, index, stars) {
  const chart = getChart();
  const rel = getFortuneSanFangSiZheng(type, index);
  return rel.some((n) => hasStarsInPalace(chart, n, stars));
}

function fortuneSanFangSiZhengHasHua(type, index, huaNames) {
  const chart = getChart();
  const rel = getFortuneSanFangSiZheng(type, index);
  return rel.some((n) => hasHuaInPalace(chart, n, huaNames));
}

function isPalaceEmpty(palaceName) {
  const chart = getChart();
  const p = findPalaceByName(chart, palaceName);
  if (!p) return false;
  const count = Array.isArray(p.stars) ? p.stars.length : 0;
  return count === 0;
}

function palaceHasFlyingStarsTo(palaceName, targetName) {
  const chart = getChart();
  const p = findPalaceByName(chart, palaceName);
  if (!p) return false;
  const fly = p.feixing || p.flyTo || [];
  const names = Array.isArray(fly) ? fly.map((x) => x.name || x) : [];
  return names.includes(targetName);
}

function getPalaceFourHuaTargets(palaceName) {
  const chart = getChart();
  const p = findPalaceByName(chart, palaceName);
  if (!p) return [];
  const targets = p.huaTargets || p.siHuaTargets || [];
  return Array.isArray(targets) ? targets : [];
}

module.exports = {
  getChart,
  getTwelvePalaces,
  getZodiac,
  getConstellation,
  getFourPillars,
  getFortuneCycles,
  getDynamicStars,
  palaceHasStars,
  sanFangSiZhengHasStars,
  sanFangSiZhengHasHua,
  starHasHua,
  starSanFangSiZhengHasHua,
  starIsBrightness,
  getSiHuaByTianGan,
  getPalaceOfStar,
  getSanFangSiZhengPalacesByStar,
  getOppositePalaceOfStar,
  getFortunePalace,
  getFortuneSanFangSiZheng,
  fortunePalaceHasStars,
  fortunePalaceHasHua,
  fortuneSanFangSiZhengHasStars,
  fortuneSanFangSiZhengHasHua,
  isPalaceEmpty,
  palaceHasFlyingStarsTo,
  getPalaceFourHuaTargets
};

