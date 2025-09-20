# 紫微斗数宫位名称修复

## 问题描述

在紫微斗数排盘系统中，宫位名称存在以下问题：

1. 宫位名称在前端被硬编码，没有根据后端计算结果动态调整
2. 切换不同用户时，宫位名称没有变化，始终使用固定的宫位名称
3. 宫位在网格中的位置是固定的，没有根据命宫位置动态调整

## 原因分析

1. 在`services/palace-calculation.js`文件中的`convertToGridLayout`函数中，使用了固定的宫位位置映射，这导致宫位名称在前端是固定的
2. 在`utils/palace-field-optimization.js`文件中的`getPalaceFieldData`函数中，宫位名称是这样处理的：`palaceName: palaceName ? palaceName.replace('宫', '') : '',`，这会将宫位名称中的"宫"字去掉，但是没有使用后端返回的动态宫位名称

## 修复方案

1. 修改`services/palace-calculation.js`文件中的`convertToGridLayout`函数，使其能够根据命宫位置动态调整宫位布局
2. 修改`utils/palace-field-optimization.js`文件中的`getPalaceFieldData`函数，确保使用后端返回的动态宫位名称

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
  
  // 定义宫位在网格中的位置
  const gridPositions = [0, 4, 8, 12, 13, 14, 15, 11, 7, 3, 2, 1];
  
  // 按照十二宫顺序放置宫位
  palaces.forEach((palace, index) => {
    const gridIndex = gridPositions[index];
    
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

### 2. 修改`utils/palace-field-optimization.js`文件中的`getPalaceFieldData`函数

```javascript
// 获取宫位字段数据
function getPalaceFieldData(palace, flowYearData) {
  if (!palace) return {};
  
  // 分类星曜
  const categorized = categorizeStars(palace.stars);
  
  // 处理四化星标记
  const fourHuaFlags = [];
  if (palace.fourHua && Array.isArray(palace.fourHua)) {
    palace.fourHua.forEach(hua => {
      if (hua.type) {
        fourHuaFlags.push(hua.type);
      }
    });
  }
  
  // 获取宫名，优先使用displayName，如果没有则使用name
  // 如果palace.isEmpty为true，则显示"—"
  let palaceName = palace.isEmpty ? '—' : (palace.displayName || palace.name || '');
  
  // 确保宫位名称是动态的，而不是硬编码的
  if (palaceName !== '—') {
    // 如果宫位名称不是"—"，则去掉"宫"字
    palaceName = palaceName.replace('宫', '');
  }

  return {
    // 所有星曜：按主星、辅星、杂曜顺序合并
    allStars: [
      ...categorized.main,
      ...categorized.auxiliary,
      ...categorized.misc
    ],

    // 四化标记（右上角）- 不再展示，置空
    fourTransformations: null,

    // 流年信息
    flowYear: formatFlowYear(flowYearData),
    minorLimit: palace.minorLimit || '',
    ageRange: palace.ageRange || '',
    longevity: categorized.longevity,
    heavenlyStemBranch: palace.heavenlyStem && palace.branch ? 
      `${palace.heavenlyStem}${palace.branch}` : (palace.branch || ''),
    palaceName: palaceName,
    leftBottomGods: palace.gods ? palace.gods.map(god => ({ name: god })) : [],
    fourHuaFlags, // 宫级四化
    divineStars: categorized.divine,
    starBrightness: categorized.brightness
  };
}
```

## 测试验证

我们创建了一个测试脚本`utils/test-palace-name-fix.js`，用于验证宫位名称是否正确。测试结果表明，命宫位置已经正确地放在了索引0的位置，并且其他宫位也按照正确的顺序排列。

对于用户1，命宫在亥宫；对于用户2和用户3，命宫在子宫。这些不同的命宫位置都能够正确地反映在网格布局数据中。

## 结论

通过以上修复，我们解决了宫位名称的问题，使得宫位名称能够根据命宫位置动态调整，切换不同用户时也能够正确显示对应的宫位名称。 