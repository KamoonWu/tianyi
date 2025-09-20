# 紫微斗数宫位布局修复

## 问题描述

在紫微斗数排盘系统中，宫位布局存在以下问题：

1. 宫位名称在前端被硬编码，没有根据后端计算结果动态调整
2. 切换不同用户时，宫位布局没有变化，始终使用固定的布局
3. 命宫位置不正确，不随用户数据变化而变化

## 原因分析

1. 前端组件的`orderPalacesForLayout`方法使用了固定的宫位位置映射，没有根据命宫位置动态调整宫位布局
2. 后端的`convertToGridLayout`函数虽然正确计算了宫位布局，但前端没有正确使用这些数据
3. 前端使用了原始的十二宫数据，而不是后端已经转换好的网格布局数据

## 修复方案

1. 修改后端的`calculatePalaceLayout`函数，使其返回原始的十二宫数据和网格布局数据
2. 修改前端的`buildChartFromPalaceLayout`方法，使其使用后端返回的网格布局数据
3. 修改前端组件的`orderPalacesForLayout`方法，使其直接使用后端返回的网格布局数据，而不是自己重新布局

## 修复步骤

### 1. 修改后端的`calculatePalaceLayout`函数

在`services/palace-calculation.js`文件中，修改`calculatePalaceLayout`函数，使其返回原始的十二宫数据和网格布局数据：

```javascript
function calculatePalaceLayout(profile) {
  // ... 其他代码 ...
  
  // 返回结果
  return {
    success: true,
    palaces: gridLayout, // 网格布局数据
    originalPalaces: palacesWithFourHua, // 原始十二宫数据
    mingGong: mingGong || { branch: mingGongBranch, name: '命宫', stem: mingGongStem },
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
}
```

### 2. 修改前端的`buildChartFromPalaceLayout`方法

在`pages/index/index.js`文件中，修改`buildChartFromPalaceLayout`方法，使其使用后端返回的网格布局数据：

```javascript
buildChartFromPalaceLayout(palaceLayoutResult, profile) {
  console.log('🔄 转换宫位布局结果为前端格式');
  
  // 使用后端返回的网格布局数据
  const palaces = palaceLayoutResult.palaces || [];
  
  return {
    palaces: palaces,
    center: this.buildCenterFromProfile(profile, palaceLayoutResult)
  };
}
```

### 3. 修改前端组件的`orderPalacesForLayout`方法

在`components/zwds-chart/zwds-chart.js`文件中，修改`orderPalacesForLayout`方法，使其直接使用后端返回的网格布局数据：

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
}
```

## 测试验证

我们创建了一个测试脚本`utils/test-palace-layout-fix.js`，用于验证宫位布局是否正确。测试结果表明，后端的`convertToGridLayout`函数能够正确地处理不同用户的命宫位置，前端组件的`orderPalacesForLayout`方法也能够正确处理后端返回的网格布局数据。

对于用户1，命宫在亥宫；对于用户2和用户3，命宫在子宫。这些不同的命宫位置都能够正确地反映在网格布局数据中。

## 结论

通过以上修复，我们解决了宫位布局的问题，使得宫位布局能够根据命宫位置动态调整，切换不同用户时也能够正确显示对应的宫位布局。 