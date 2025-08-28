// 三方四正关系计算工具
// 参考：https://ziwei.pro/learn/palace.html#%E4%B8%89%E6%96%B9%E5%9B%9B%E6%AD%A3

// 地支六冲关系（对宫/四正位）
const OPPOSITE_PAIRS = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳'
};

// 地支三合局关系（三合宫/三方位）
const TRINE_GROUPS = {
  '寅': ['午', '戌'], // 寅午戌三合火局
  '午': ['寅', '戌'],
  '戌': ['寅', '午'],
  '亥': ['卯', '未'], // 亥卯未三合木局
  '卯': ['亥', '未'],
  '未': ['亥', '卯'],
  '巳': ['酉', '丑'], // 巳酉丑三合金局
  '酉': ['巳', '丑'],
  '丑': ['巳', '酉'],
  '申': ['子', '辰'], // 申子辰三合水局
  '子': ['申', '辰'],
  '辰': ['申', '子']
};

// 宫位索引映射（4x4布局）
const PALACE_INDEX_MAP = {
  // 第一行
  0: { name: '田宅宫', branch: '巳', row: 0, col: 0 },
  1: { name: '官禄宫', branch: '午', row: 0, col: 1 },
  2: { name: '仆役宫', branch: '未', row: 0, col: 2 },
  3: { name: '迁移宫', branch: '申', row: 0, col: 3 },
  
  // 第二行
  4: { name: '福德宫', branch: '辰', row: 1, col: 0 },
  5: { name: '中宫', branch: '中', row: 1, col: 1, isCenter: true },
  6: { name: '中宫', branch: '中', row: 1, col: 2, isCenter: true },
  7: { name: '疾厄宫', branch: '酉', row: 1, col: 3 },
  
  // 第三行
  8: { name: '父母宫', branch: '卯', row: 2, col: 0 },
  9: { name: '中宫', branch: '中', row: 2, col: 1, isCenter: true },
  10: { name: '中宫', branch: '中', row: 2, col: 2, isCenter: true },
  11: { name: '财帛宫', branch: '戌', row: 2, col: 3 },
  
  // 第四行
  12: { name: '命宫', branch: '寅', row: 3, col: 0 },
  13: { name: '兄弟宫', branch: '丑', row: 3, col: 1 },
  14: { name: '夫妻宫', branch: '子', row: 3, col: 2 },
  15: { name: '子女宫', branch: '亥', row: 3, col: 3 }
};

/**
 * 获取宫位的三方四正关系
 * @param {number} palaceIndex - 宫位索引
 * @returns {Object} 三方四正关系
 */
function getPalaceRelations(palaceIndex) {
  const palace = PALACE_INDEX_MAP[palaceIndex];
  if (!palace || palace.isCenter) {
    return { target: null, opposite: null, trine: [] };
  }
  
  const branch = palace.branch;
  
  // 对宫（四正位）
  const oppositeBranch = OPPOSITE_PAIRS[branch];
  const oppositeIndex = getPalaceIndexByBranch(oppositeBranch);
  
  // 三合宫（三方位）
  const trineBranches = TRINE_GROUPS[branch] || [];
  const trineIndices = trineBranches.map(b => getPalaceIndexByBranch(b)).filter(i => i !== -1);
  
  return {
    target: palaceIndex,
    opposite: oppositeIndex,
    trine: trineIndices
  };
}

/**
 * 根据地支获取宫位索引
 * @param {string} branch - 地支
 * @returns {number} 宫位索引
 */
function getPalaceIndexByBranch(branch) {
  for (const [index, palace] of Object.entries(PALACE_INDEX_MAP)) {
    if (palace.branch === branch) {
      return parseInt(index);
    }
  }
  return -1;
}

/**
 * 获取所有宫位的三方四正关系
 * @returns {Object} 所有宫位的关系映射
 */
function getAllPalaceRelations() {
  const relations = {};
  
  for (let i = 0; i < 16; i++) {
    if (!PALACE_INDEX_MAP[i].isCenter) {
      relations[i] = getPalaceRelations(i);
    }
  }
  
  return relations;
}

/**
 * 验证三方四正关系的正确性
 */
function validateRelations() {
  console.log('=== 验证三方四正关系 ===');
  
  const testCases = [
    { index: 12, name: '命宫(寅)', expected: { opposite: '申', trine: ['午', '戌'] } },
    { index: 13, name: '兄弟宫(丑)', expected: { opposite: '未', trine: ['巳', '酉'] } },
    { index: 14, name: '夫妻宫(子)', expected: { opposite: '午', trine: ['申', '辰'] } },
    { index: 15, name: '子女宫(亥)', expected: { opposite: '巳', trine: ['卯', '未'] } },
    { index: 0, name: '田宅宫(巳)', expected: { opposite: '亥', trine: ['酉', '丑'] } },
    { index: 1, name: '官禄宫(午)', expected: { opposite: '子', trine: ['寅', '戌'] } },
    { index: 2, name: '仆役宫(未)', expected: { opposite: '丑', trine: ['亥', '卯'] } },
    { index: 3, name: '迁移宫(申)', expected: { opposite: '寅', trine: ['子', '辰'] } },
    { index: 4, name: '福德宫(辰)', expected: { opposite: '戌', trine: ['申', '子'] } },
    { index: 7, name: '疾厄宫(酉)', expected: { opposite: '卯', trine: ['巳', '丑'] } },
    { index: 8, name: '父母宫(卯)', expected: { opposite: '酉', trine: ['亥', '未'] } },
    { index: 11, name: '财帛宫(戌)', expected: { opposite: '辰', trine: ['寅', '午'] } }
  ];
  
  testCases.forEach(test => {
    const relations = getPalaceRelations(test.index);
    const palace = PALACE_INDEX_MAP[test.index];
    
    console.log(`\n🧪 ${test.name}:`);
    console.log(`  对宫: ${palace.branch} → ${PALACE_INDEX_MAP[relations.opposite]?.branch} (${relations.opposite !== -1 ? '✅' : '❌'})`);
    console.log(`  三合: ${palace.branch} → [${relations.trine.map(i => PALACE_INDEX_MAP[i]?.branch).join(', ')}] (${relations.trine.length === 2 ? '✅' : '❌'})`);
  });
}

// 导出函数
module.exports = {
  getPalaceRelations,
  getAllPalaceRelations,
  validateRelations,
  PALACE_INDEX_MAP
};

// 如果直接运行此文件，则执行验证
if (require.main === module) {
  validateRelations();
} 