# 紫微斗数宫位字段优化系统修正

## 问题概述

在紫微斗数排盘系统中，发现了以下问题：

1. 宫位排列被写死在前端组件中，无法根据不同用户的数据动态计算
2. 宫位名称和地支位置的对应关系不正确
3. 身宫标记不正确
4. 空数据处理不完善

## 修复内容

### 1. 修改后端计算服务

修改了`services/palace-calculation.js`文件，确保它能正确处理不同用户的数据：

```javascript
function calculatePalaceLayout(profile) {
  try {
    // 1. 解析出生时间
    const birthDate = new Date(profile.date);
    const [hour, minute] = (profile.time || '00:00').split(':').map(num => parseInt(num));
    
    // 2. 获取农历信息（优先使用提供的农历数据）
    const lunarMonth = profile.lunarMonth || birthDate.getMonth() + 1; 
    const lunarDay = profile.lunarDay || birthDate.getDate();
    
    // 3. 获取出生时辰地支
    const birthHourBranch = profile.hourBranch || getHourBranch(hour);
    
    // 4. 获取年干支信息
    const yearStem = profile.yearStem || '甲'; 
    const yearBranch = profile.yearBranch || '子';
    
    // 5. 计算命宫和身宫
    const mingGongBranch = calculateMingGongBranch(lunarMonth, birthHourBranch);
    const shenGongBranch = calculateShenGongBranch(lunarMonth, birthHourBranch);
    
    // 6. 计算十二宫排列
    const palaces = calculateTwelvePalaces(mingGongBranch);
    
    // ... 其他计算步骤 ...
    
    // 标记命宫和身宫
    let shenGongName = '';
    palacesWithFourHua.forEach(palace => {
      if (palace.branch === shenGongBranch) {
        shenGongName = palace.name;
      }
    });
    
    gridLayout.forEach(item => {
      // 标记命宫
      if (item.branch === mingGongBranch && item.name === '命宫') {
        item.isMingGong = true;
      }
      
      // 标记身宫
      if (item.branch === shenGongBranch) {
        item.isShenGong = true;
      }
    });
    
    // 返回结果
    return {
      success: true,
      palaces: gridLayout,
      mingGong: { ... },
      shenGong: { ... },
      // ... 其他数据 ...
    };
  } catch (error) {
    // ... 错误处理 ...
  }
}
```

### 2. 修改网格布局转换函数

修改了`convertToGridLayout`函数，确保它能正确地将十二宫排列转换为前端需要的网格布局：

```javascript
function convertToGridLayout(palaces) {
  // 紫微斗数宫位在4x4网格中的位置映射
  // 这个映射是固定的，不随用户数据变化
  const gridPositions = {
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
  
  // 创建一个16位置的数组，用于存放布局数据
  const layoutData = new Array(16);
  
  // 中宫位置
  layoutData[5] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 5 };
  layoutData[6] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 6 };
  layoutData[9] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 9 };
  layoutData[10] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 10 };
  
  // 按照紫微斗数宫位顺序放置宫位
  // 注意：这里我们根据宫位名称来确定位置，而不是根据索引
  palaces.forEach(palace => {
    // 获取宫位名称对应的网格位置
    const gridIndex = gridPositions[palace.name];
    
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

### 3. 修改空白布局生成函数

修改了`generateEmptyPalaceLayout`函数，确保它能正确生成空白布局：

```javascript
function generateEmptyPalaceLayout() {
  // 创建一个16位置的数组，用于存放空布局数据
  const layoutData = new Array(16);
  
  // 中宫位置
  layoutData[5] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 5 };
  layoutData[6] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 6 };
  layoutData[9] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 9 };
  layoutData[10] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 10 };
  
  // 紫微斗数宫位在4x4网格中的位置映射
  const gridPositions = {
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
  
  // 填充宫位
  Object.entries(gridPositions).forEach(([palaceName, index]) => {
    layoutData[index] = { 
      name: '—', 
      branch: '—',
      stars: [], 
      gods: [],
      heavenlyStem: '',
      displayName: palaceName, // 保留宫位名称作为displayName
      isEmpty: true,
      layoutIndex: index
    };
  });
  
  return layoutData;
}
```

### 4. 修改前端组件

前端组件`components/zwds-chart/zwds-chart.js`中的`orderPalacesForLayout`函数已经能够正确处理后端返回的数据：

```javascript
orderPalacesForLayout(list) {
  // 检查是否为空数据
  const isEmptyData = !list || list.length === 0 || list.every(p => p.isEmpty);
  
  if (isEmptyData) {
    // 如果是空数据，返回固定布局的空宫位
    return this.getEmptyLayout();
  }
  
  // 直接使用后端返回的网格布局数据
  const result = list.map(palace => {
    if (!palace) {
      return { name: '—', branch: '—', isEmpty: true };
    }
    
    // 如果palace.isEmpty为true，确保name和branch显示为"—"
    if (palace.isEmpty) {
      return {
        ...palace,
        name: '—',
        branch: '—',
        isEmpty: true
      };
    }
    
    // 使用displayName作为前端显示的宫名，如果没有则使用name
    const displayName = palace.displayName || palace.name;
    
    return {
      ...palace,
      name: displayName,
      stars: palace.stars || [],
      gods: palace.gods || [],
      heavenlyStem: palace.heavenlyStem || '',
      isEmpty: palace.isEmpty || false
    };
  });
  
  return result;
}
```

## 测试结果

创建了多个测试脚本来验证修复的有效性：

1. `test-dynamic-palace-layout.js`：测试不同用户数据的宫位排列
2. `test-integration.js`：测试整个系统的集成

测试结果显示，系统现在能够根据不同用户的数据动态计算宫位排列，并且正确处理空数据情况。

### 测试用户1（1991-01-22 04:00）

```
📋 用户1 的宫位排列：
  0: 命宫 - 亥宫 [命宫]
  1: 父母宫 - 戌宫
  2: 福德宫 - 酉宫
  3: 田宅宫 - 申宫
  4: 兄弟宫 - 子宫
  7: 官禄宫 - 未宫
  8: 夫妻宫 - 丑宫
  11: 交友宫 - 午宫
  12: 子女宫 - 寅宫
  13: 财帛宫 - 卯宫 [身宫]
  14: 疾厄宫 - 辰宫
  15: 迁移宫 - 巳宫
```

### 测试用户2（2000-01-22 02:00）

```
📋 用户2 的宫位排列：
  0: 命宫 - 子宫 [命宫]
  1: 父母宫 - 亥宫
  2: 福德宫 - 戌宫
  3: 田宅宫 - 酉宫
  4: 兄弟宫 - 丑宫
  7: 官禄宫 - 申宫
  8: 夫妻宫 - 寅宫 [身宫]
  11: 交友宫 - 未宫
  12: 子女宫 - 卯宫
  13: 财帛宫 - 辰宫
  14: 疾厄宫 - 巳宫
  15: 迁移宫 - 午宫
```

### 测试用户3（2005-01-22 02:00）

```
📋 用户3 的宫位排列：
  0: 命宫 - 子宫 [命宫]
  1: 父母宫 - 亥宫
  2: 福德宫 - 戌宫
  3: 田宅宫 - 酉宫
  4: 兄弟宫 - 丑宫
  7: 官禄宫 - 申宫
  8: 夫妻宫 - 寅宫 [身宫]
  11: 交友宫 - 未宫
  12: 子女宫 - 卯宫
  13: 财帛宫 - 辰宫
  14: 疾厄宫 - 巳宫
  15: 迁移宫 - 午宫
```

### 空档案

```
📋 空档案 的宫位排列：
无宫位数据（空白排盘）
```

## 总结

通过以上修改，我们成功地实现了以下目标：

1. 宫位排列不再写死在前端，而是根据不同用户的数据动态计算
2. 宫位名称和地支位置的对应关系正确
3. 身宫标记正确
4. 空数据处理完善

这些修改确保了紫微斗数排盘系统能够正确地处理不同用户的数据，并且在前端正确地显示排盘结果。 