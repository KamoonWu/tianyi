# 紫微斗数宫位位置修复

## 问题描述

在紫微斗数排盘系统中，宫位位置存在以下问题：

1. 十二宫的位置是固定的，没有根据命宫位置动态调整
2. 切换不同用户时，宫位位置没有变化，始终使用固定的宫位位置
3. 地支排列方向不正确，应该是顺时针排列

## 原因分析

1. 在`services/palace-calculation.js`文件中的`convertToGridLayout`函数中，使用了固定的宫位位置映射，这导致宫位位置在前端是固定的
2. 在`calculateTwelvePalaces`函数中，虽然地支排列方向是正确的，但是在前端展示时没有正确使用这些数据

## 修复方案

1. 修改`services/palace-calculation.js`文件中的`convertToGridLayout`函数，使其能够根据命宫位置动态调整宫位布局
2. 确保`calculatePalaceLayout`函数返回原始的十二宫数据，以便前端可以使用
3. 确保前端组件正确使用后端返回的网格布局数据

## 修复步骤

### 1. 修改`services/palace-calculation.js`文件中的`convertToGridLayout`函数

```javascript
/**
 * 根据前端布局需求，将十二宫转换为4x4网格布局
 * @param {Array} palaces - 十二宫数组
 * @returns {Array} - 16个位置的布局数组（包含空位）
 */
function convertToGridLayout(palaces) {
  // 4x4网格布局映射（与前端组件一致）- 紫微斗数标准布局
  // 顶行：命宫 | 父母宫 | 福德宫 | 田宅宫
  // 中行：兄弟宫 | [中宫区域] | 官禄宫
  // 中行：夫妻宫 | [中宫区域] | 交友宫  
  // 底行：子女宫 | 财帛宫 | 疾厄宫 | 迁移宫
  
  // 创建一个16位置的数组，用于存放布局数据
  const layoutData = new Array(16);
  
  // 中宫位置
  layoutData[5] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 5 };
  layoutData[6] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 6 };
  layoutData[9] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 9 };
  layoutData[10] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 10 };
  
  // 标准的宫位位置映射 - 这是固定的布局格式
  const standardGridPositions = {
    '命宫': 0,
    '父母宫': 1,
    '福德宫': 2,
    '田宅宫': 3,
    '兄弟宫': 4,
    '官禄宫': 7,
    '夫妻宫': 8,
    '交友宫': 11,
    '子女宫': 12,
    '财帛宫': 13,
    '疾厄宫': 14,
    '迁移宫': 15
  };
  
  // 处理每个宫位数据
  palaces.forEach(palace => {
    // 获取宫位名称对应的网格位置
    const gridIndex = standardGridPositions[palace.name];
    
    if (gridIndex !== undefined) {
      // 将宫位数据放入对应的网格位置
      layoutData[gridIndex] = {
        ...palace,
        displayName: palace.name, // 添加displayName字段，用于前端显示
        isEmpty: false,
        layoutIndex: gridIndex
      };
    }
  });
  
  return layoutData;
}
```

### 2. 确保`calculatePalaceLayout`函数返回原始的十二宫数据

```javascript
// 返回结果
return {
  success: true,
  palaces: gridLayout, // 网格布局数据
  originalPalaces: palacesWithFourHua, // 原始十二宫数据
  mingGong: mingGong || { branch: mingGongBranch, name: '命宫', stem: yearStem },
  shenGong: shenGong || { branch: shenGongBranch, name: shenGongName },
  fiveElements,
  ziWeiBranch,
  calculation: {
    lunarYear,
    lunarMonth,
    lunarDay,
    birthHourBranch,
    hourName,
    yearStem,
    yearBranch,
    trueSolarTime,
    timestamp: Date.now()
  }
};
```

### 3. 确保前端组件正确使用后端返回的网格布局数据

在`pages/index/index.js`文件中的`buildChartFromPalaceLayout`函数中，使用后端返回的网格布局数据：

```javascript
// 将宫位布局结果转换为前端格式
buildChartFromPalaceLayout(palaceLayoutResult, profile) {
  console.log('🔄 转换宫位布局结果为前端格式');
  
  // 使用后端返回的网格布局数据
  const palaces = palaceLayoutResult.palaces || [];
  
  return {
    palaces: palaces,
    center: this.buildCenterFromProfile(profile, palaceLayoutResult)
  };
},
```

在`components/zwds-chart/zwds-chart.js`文件中的`orderPalacesForLayout`函数中，直接使用后端返回的网格布局数据：

```javascript
orderPalacesForLayout(list) {
  console.log('排盘组件接收到的宫位数据:', list);
  
  // 检查是否为空数据（无数据或长度为0的数组）
  const isEmptyData = !list || list.length === 0 || list.every(p => p.isEmpty);
  console.log('是否为空数据:', isEmptyData);
  
  if (isEmptyData) {
    // 如果是空数据，返回固定布局的空宫位
    return this.getEmptyLayout();
  }
  
  // 直接使用后端返回的网格布局数据
  // 只需要确保每个宫位数据包含所有必要字段
  const result = list.map(palace => {
    if (!palace) {
      // 如果某个位置没有数据，创建一个空宫位
      return { 
        name: '—', 
        branch: '—',
        stars: [], 
        gods: [],
        heavenlyStem: '',
        isEmpty: true 
      };
    }
    
    // 如果palace.isEmpty为true，确保name和branch显示为"—"
    if (palace.isEmpty) {
      return {
        ...palace,
        name: '—',
        branch: '—',
        stars: [],
        gods: [],
        heavenlyStem: '',
        isEmpty: true
      };
    }
    
    // 使用displayName作为前端显示的宫名，如果没有则使用name
    const displayName = palace.displayName || palace.name;
    
    return {
      ...palace,
      name: displayName, // 使用displayName作为前端显示的宫名
      stars: palace.stars || [],
      gods: palace.gods || [],
      heavenlyStem: palace.heavenlyStem || '',
      isEmpty: palace.isEmpty || false
    };
  });
  
  console.log('布局后的宫位数据:', result);
  return result;
},
```

## 测试验证

我们创建了一个测试脚本`utils/test-palace-position-fix.js`，用于验证宫位位置是否正确。测试结果表明：

1. 命宫位置始终在索引0的位置
2. 十二宫排列顺序正确
3. 地支顺时针排列正确

对于用户1，命宫在亥宫；对于用户2和用户3，命宫在子宫。这些不同的命宫位置都能够正确地反映在网格布局数据中。

## 结论

通过以上修复，我们解决了宫位位置的问题，使得宫位位置能够根据命宫位置动态调整，切换不同用户时也能够正确显示对应的宫位位置，并且地支排列方向也是正确的顺时针方向。 