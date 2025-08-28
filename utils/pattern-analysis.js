// 紫微斗数格局分析
// 参考：https://ziwei.pro/learn/pattern.html

// 格局定义
const PATTERNS = {
  // 君臣庆会格
  '君臣庆会': {
    name: '君臣庆会',
    description: '命宫有紫微星和破军星，并且前后两个宫位分别有左辅星和右弼星夹着',
    conditions: [
      '命宫有紫微星和破军星',
      '前后宫位分别有左辅星和右弼星夹着'
    ],
    effects: '主贵显，有领导才能，适合从政或管理'
  },
  
  // 三奇加会格
  '三奇加会': {
    name: '三奇加会',
    description: '命宫化科、财帛宫化禄、官禄宫化权',
    conditions: [
      '命宫化科',
      '财帛宫化禄', 
      '官禄宫化权'
    ],
    effects: '主富贵，有贵人相助，机会较多'
  },
  
  // 禄马交驰格
  '禄马交驰': {
    name: '禄马交驰',
    description: '禄存星和天马星同宫',
    conditions: [
      '禄存星和天马星同宫'
    ],
    effects: '主财运，适合经商，有流动性收入'
  },
  
  // 禄合鸳鸯格
  '禄合鸳鸯': {
    name: '禄合鸳鸯',
    description: '化禄和禄存同宫或者对拱',
    conditions: [
      '化禄和禄存同宫或对拱'
    ],
    effects: '主财运，理财能力强，有投资眼光'
  },
  
  // 明禄暗禄格
  '明禄暗禄': {
    name: '明禄暗禄',
    description: '命宫中有化禄（或禄存）坐守，而暗合宫中有禄存（或化禄）',
    conditions: [
      '命宫有化禄或禄存',
      '暗合宫有禄存或化禄'
    ],
    effects: '主富贵，锦上添花，位至公卿'
  },
  
  // 禄马佩印格
  '禄马佩印': {
    name: '禄马佩印',
    description: '禄存星、天马星和天相星同宫',
    conditions: [
      '禄存星、天马星、天相星同宫'
    ],
    effects: '主富贵，在财的基础上加权，不可多得'
  },
  
  // 两重华盖格
  '两重华盖': {
    name: '两重华盖',
    description: '禄存化禄坐命遇空劫',
    conditions: [
      '禄存化禄同宫',
      '遇地空或地劫星'
    ],
    effects: '不能过于看重金钱，否则将生活在纠结和痛苦中'
  },
  
  // 左右同宫格
  '左右同宫': {
    name: '左右同宫',
    description: '左辅星和右弼星同宫',
    conditions: [
      '左辅星和右弼星同宫'
    ],
    effects: '主贵人相助，人际关系好，有助力'
  },
  
  // 魁钺夹命格
  '魁钺夹命': {
    name: '魁钺夹命',
    description: '天魁星和天钺星夹着命宫',
    conditions: [
      '天魁星和天钺星夹着命宫'
    ],
    effects: '主贵人相助，考试运好，有权威'
  },
  
  // 昌曲夹命格
  '昌曲夹命': {
    name: '昌曲夹命',
    description: '文昌星和文曲星夹着命宫',
    conditions: [
      '文昌星和文曲星夹着命宫'
    ],
    effects: '主文采好，学习能力强，适合文化工作'
  }
};

// 分析格局
function analyzePatterns(palaces, center) {
  const results = [];
  
  // 获取命宫信息
  const mingGong = palaces.find(p => p.name === '命宫');
  const caiBoGong = palaces.find(p => p.name === '财帛宫');
  const guanLuGong = palaces.find(p => p.name === '事业宫');
  
  // 检查君臣庆会格
  if (mingGong && hasStars(mingGong, ['紫微', '破军'])) {
    const leftPalace = getLeftPalace(palaces, '命宫');
    const rightPalace = getRightPalace(palaces, '命宫');
    
    if (hasStars(leftPalace, ['左辅']) && hasStars(rightPalace, ['右弼'])) {
      results.push({
        pattern: PATTERNS['君臣庆会'],
        palaces: ['命宫', leftPalace?.name, rightPalace?.name],
        stars: ['紫微', '破军', '左辅', '右弼']
      });
    }
  }
  
  // 检查三奇加会格
  if (mingGong && caiBoGong && guanLuGong) {
    const mingHua = hasFourHua(mingGong, '化科');
    const caiHua = hasFourHua(caiBoGong, '化禄');
    const guanHua = hasFourHua(guanLuGong, '化权');
    
    if (mingHua && caiHua && guanHua) {
      results.push({
        pattern: PATTERNS['三奇加会'],
        palaces: ['命宫', '财帛宫', '事业宫'],
        stars: ['化科', '化禄', '化权']
      });
    }
  }
  
  // 检查禄马交驰格
  palaces.forEach(palace => {
    if (hasStars(palace, ['禄存', '天马'])) {
      results.push({
        pattern: PATTERNS['禄马交驰'],
        palaces: [palace.name],
        stars: ['禄存', '天马']
      });
    }
  });
  
  // 检查左右同宫格
  palaces.forEach(palace => {
    if (hasStars(palace, ['左辅', '右弼'])) {
      results.push({
        pattern: PATTERNS['左右同宫'],
        palaces: [palace.name],
        stars: ['左辅', '右弼']
      });
    }
  });
  
  // 检查魁钺夹命格
  if (mingGong) {
    const leftPalace = getLeftPalace(palaces, '命宫');
    const rightPalace = getRightPalace(palaces, '命宫');
    
    if (hasStars(leftPalace, ['天魁']) && hasStars(rightPalace, ['天钺'])) {
      results.push({
        pattern: PATTERNS['魁钺夹命'],
        palaces: ['命宫', leftPalace?.name, rightPalace?.name],
        stars: ['天魁', '天钺']
      });
    }
  }
  
  // 检查昌曲夹命格
  if (mingGong) {
    const leftPalace = getLeftPalace(palaces, '命宫');
    const rightPalace = getRightPalace(palaces, '命宫');
    
    if (hasStars(leftPalace, ['文昌']) && hasStars(rightPalace, ['文曲'])) {
      results.push({
        pattern: PATTERNS['昌曲夹命'],
        palaces: ['命宫', leftPalace?.name, rightPalace?.name],
        stars: ['文昌', '文曲']
      });
    }
  }
  
  return results;
}

// 辅助函数
function hasStars(palace, starNames) {
  if (!palace || !palace.starNames) return false;
  return starNames.every(name => palace.starNames.includes(name));
}

function hasFourHua(palace, huaType) {
  if (!palace || !palace.starNames) return false;
  return palace.starNames.some(name => name === huaType);
}

function getLeftPalace(palaces, targetName) {
  const targetIndex = palaces.findIndex(p => p.name === targetName);
  if (targetIndex === -1) return null;
  const leftIndex = (targetIndex - 1 + palaces.length) % palaces.length;
  return palaces[leftIndex];
}

function getRightPalace(palaces, targetName) {
  const targetIndex = palaces.findIndex(p => p.name === targetName);
  if (targetIndex === -1) return null;
  const rightIndex = (targetIndex + 1) % palaces.length;
  return palaces[rightIndex];
}

// 获取格局描述
function getPatternDescription(patternName) {
  return PATTERNS[patternName] || null;
}

// 获取所有格局
function getAllPatterns() {
  return Object.values(PATTERNS);
}

module.exports = {
  analyzePatterns,
  getPatternDescription,
  getAllPatterns,
  PATTERNS
}; 