// 完整测试数据流
console.log('=== 完整测试数据流 ===');

// 1. 模拟安星算法输出
const { StarPlacement } = require('./star-placement');

try {
  const starPlacement = new StarPlacement(1991, 1, 22, 1, 'male', 'lunar');
  const chartData = starPlacement.generateChart();
  
  console.log('1. 安星算法输出:', chartData.palaces.length, '个宫位');
  
  // 2. 模拟主页面的数据转换
  const formattedPalaces = chartData.palaces.map((palace, index) => {
    return {
      name: palace.name,
      branch: palace.branch,
      stars: palace.stars || '',
      starNames: palace.starNames || [],
      index: palace.index,
      isEmpty: !palace.stars || palace.stars.trim() === ''
    };
  });
  
  console.log('2. 格式化后的宫位数据:', formattedPalaces.length, '个宫位');
  
  // 3. 模拟排盘组件的宫位名称标准化
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
  
  // 4. 模拟排盘组件的布局逻辑
  function orderPalacesForLayout(list) {
    const layoutOrder = [
      '命宫','兄弟宫','夫妻宫','子女宫',
      '财帛宫','','','迁移宫',
      '疾厄宫','','','交友宫',
      '事业宫','田宅宫','福德宫','父母宫'
    ];
    
    console.log('排盘组件接收到的宫位数据:', list.length, '个宫位');
    
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
        console.log(`找到宫位 ${k}:`, palace.stars);
        return palace;
      } else {
        console.log(`未找到宫位 ${k}，创建空宫位`);
        return { name: k, stars: '', isEmpty: true };
      }
    });
    
    console.log('布局后的宫位数据:', result.length, '个宫位');
    return result;
  }
  
  // 5. 测试完整流程
  const layoutResult = orderPalacesForLayout(formattedPalaces);
  
  console.log('\n=== 最终结果 ===');
  layoutResult.forEach((palace, index) => {
    if (palace.name && !palace.isEmpty) {
      console.log(`${index + 1}. ${palace.name}: ${palace.stars}`);
    }
  });
  
} catch (error) {
  console.error('测试失败:', error);
} 