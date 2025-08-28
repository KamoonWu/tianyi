// 简单测试数据流
console.log('=== 简单测试数据流 ===');

// 模拟主页面的数据
const testData = {
  palaces: [
    {
      name: '命宫',
      branch: '寅',
      stars: '天相 天贵',
      starNames: ['天相', '天贵'],
      index: 2,
      isEmpty: false
    },
    {
      name: '兄弟宫',
      branch: '丑',
      stars: '太阳 巨门 天魁 破碎',
      starNames: ['太阳', '巨门', '天魁', '破碎'],
      index: 1,
      isEmpty: false
    }
  ]
};

console.log('测试数据:', testData);

// 模拟排盘组件的宫位名称标准化
function normalizePalaceName(name) {
  const n = String(name || '').replace(/宫$/, '');
  const map = {
    '命': '命宫',
    '兄弟': '兄弟宫',
    '夫妻': '夫妻宫',
    '子女': '子女宫',
    '财帛': '财帛宫',
    '疾厄': '疾厄宫',
    '迁移': '迁移宫',
    '交友': '交友宫',
    '事业': '事业宫',
    '官禄': '事业宫',
    '田宅': '田宅宫',
    '福德': '福德宫',
    '父母': '父母宫'
  };
  for (const k of Object.keys(map)) {
    if (n.indexOf(k) !== -1) return map[k];
  }
  return name || '';
}

// 模拟排盘组件的布局逻辑
function orderPalacesForLayout(list) {
  const layoutOrder = [
    '命宫','兄弟宫','夫妻宫','子女宫',
    '财帛宫','','','迁移宫',
    '疾厄宫','','','交友宫',
    '事业宫','田宅宫','福德宫','父母宫'
  ];
  
  console.log('排盘组件接收到的宫位数据:', list);
  
  const byName = {};
  (list || []).forEach((p) => {
    const key = normalizePalaceName(p.name || p.label);
    byName[key] = p;
    console.log(`映射宫位: ${p.name} -> ${key}`);
  });
  
  const result = layoutOrder.map((k) => {
    if (k === '') {
      return { name: '', stars: '', isEmpty: true };
    }
    const palace = byName[k];
    if (palace) {
      console.log(`找到宫位 ${k}:`, palace);
      return palace;
    } else {
      console.log(`未找到宫位 ${k}，创建空宫位`);
      return { name: k, stars: '', isEmpty: true };
    }
  });
  
  console.log('布局后的宫位数据:', result);
  return result;
}

// 测试布局逻辑
const layoutResult = orderPalacesForLayout(testData.palaces);
console.log('最终布局结果:', layoutResult); 