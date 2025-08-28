// 六条线定义，参考：https://ziwei.pro/learn/palace.html
const SIX_LINES = {
  '命迁线': { name: '命迁线', alias: '表里线', palaces: ['命宫', '迁移宫'], color: '#ef4444' },
  '兄友线': { name: '兄友线', alias: '沟通线/成就线', palaces: ['兄弟宫', '交友宫'], color: '#3b82f6' },
  '官夫线': { name: '官夫线', alias: '事业线', palaces: ['事业宫', '夫妻宫'], color: '#10b981' },
  '子田线': { name: '子田线', alias: '桃花线', palaces: ['子女宫', '田宅宫'], color: '#f59e0b' },
  '财福线': { name: '财福线', alias: '消费线', palaces: ['财帛宫', '福德宫'], color: '#8b5cf6' },
  '父疾线': { name: '父疾线', alias: '文书线', palaces: ['父母宫', '疾厄宫'], color: '#ec4899' }
};

// 4x4 布局中宫位索引映射（按排盘组件的实际顺序）
// 顶行：命宫(0) | 兄弟宫(1) | 夫妻宫(2) | 子女宫(3)
// 中行：财帛宫(4) | 中宫(5) | 中宫(6) | 迁移宫(7)
// 中行：疾厄宫(8) | 中宫(9) | 中宫(10) | 交友宫(11)
// 底行：事业宫(12) | 田宅宫(13) | 福德宫(14) | 父母宫(15)
const LAYOUT_INDEX = {
  '命宫': 0, '兄弟宫': 1, '夫妻宫': 2, '子女宫': 3,
  '财帛宫': 4, '迁移宫': 7,
  '疾厄宫': 8, '交友宫': 11,
  '事业宫': 12, '田宅宫': 13, '福德宫': 14, '父母宫': 15
};

// 三方四正映射（本宫 -> [三合宫1, 三合宫2, 对宫]）
// 三合：寅午戌、亥卯未、申子辰、巳酉丑
// 对宫：相隔6个宫位
const SANFANG_SIZHENG = {
  '命宫': ['兄弟宫', '交友宫', '迁移宫'],
  '兄弟宫': ['命宫', '交友宫', '疾厄宫'],
  '夫妻宫': ['财帛宫', '田宅宫', '事业宫'],
  '子女宫': ['财帛宫', '田宅宫', '疾厄宫'],
  '财帛宫': ['夫妻宫', '子女宫', '福德宫'],
  '疾厄宫': ['兄弟宫', '子女宫', '父母宫'],
  '迁移宫': ['命宫', '交友宫', '命宫'],
  '交友宫': ['命宫', '兄弟宫', '疾厄宫'],
  '事业宫': ['夫妻宫', '田宅宫', '夫妻宫'],
  '田宅宫': ['夫妻宫', '子女宫', '事业宫'],
  '福德宫': ['财帛宫', '田宅宫', '财帛宫'],
  '父母宫': ['疾厄宫', '田宅宫', '疾厄宫']
};

function getLineByPalaces(p1, p2) {
  for (const [key, line] of Object.entries(SIX_LINES)) {
    if (line.palaces.includes(p1) && line.palaces.includes(p2)) {
      return line;
    }
  }
  return null;
}

function getSanFangSiZheng(palaceName) {
  return SANFANG_SIZHENG[palaceName] || [];
}

function getPalaceIndex(palaceName) {
  const index = LAYOUT_INDEX[palaceName];
  return index !== undefined ? index : -1;
}

module.exports = { SIX_LINES, LAYOUT_INDEX, SANFANG_SIZHENG, getLineByPalaces, getSanFangSiZheng, getPalaceIndex };
