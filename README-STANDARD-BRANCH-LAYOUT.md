# 紫微斗数标准地支布局修复

## 问题描述

紫微斗数排盘系统中，地支的顺序和对应关系应该按照标准布局排列，如下所示：

```
-------------------------
| 巳 | 午 | 未 | 申 | 
-------------------------
| 辰 | 中宫 | 中宫 | 酉 | 
-------------------------
| 卯 | 中宫 | 中宫 | 戌 | 
-------------------------
| 寅 | 丑 | 子 | 亥 | 
-------------------------
```

但是在之前的实现中，地支的位置没有按照这个标准布局排列，导致宫位名称和地支的对应关系错误。

## 原因分析

在原来的代码中，我们尝试根据宫位名称来确定网格位置，但这导致了地支位置不固定，无法按照标准布局排列。正确的做法应该是：

1. 地支的位置是固定的，按照标准布局排列
2. 宫位名称是根据命宫的位置动态计算的，从命宫开始，顺时针依次排列十二宫
3. 在网格布局中，根据地支来确定宫位的位置

## 修复方案

我们需要修改两个关键函数：

1. `calculateTwelvePalaces`：确保地支的排列是按照标准布局
2. `convertToGridLayout`：确保根据地支来确定宫位在网格中的位置

## 修复步骤

### 1. 修改`calculateTwelvePalaces`函数

```javascript
/**
 * 计算十二宫排列
 * 从命宫开始，顺时针依次排列十二宫，但地支位置固定
 * @param {string} mingGongBranch - 命宫地支
 * @returns {Array} - 十二宫排列数组
 */
function calculateTwelvePalaces(mingGongBranch) {
  console.log(`🏯 开始计算十二宫排列，命宫在${mingGongBranch}宫`);
  
  const mingGongIndex = EARTHLY_BRANCHES.indexOf(mingGongBranch);
  if (mingGongIndex === -1) {
    console.error('❌ 无效的命宫地支:', mingGongBranch);
    return [];
  }
  
  // 固定地支顺序：按照紫微斗数标准布局
  // 从左上角开始，顺时针排列：巳、午、未、申、酉、戌、亥、子、丑、寅、卯、辰
  const fixedBranches = ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'];
  
  // 找到命宫地支在fixedBranches中的位置
  const mingGongFixedIndex = fixedBranches.indexOf(mingGongBranch);
  if (mingGongFixedIndex === -1) {
    console.error(`❌ 命宫地支 ${mingGongBranch} 不在固定地支顺序中`);
    return [];
  }
  
  const palaces = [];
  
  // 从命宫开始，顺时针依次排列十二宫
  for (let i = 0; i < 12; i++) {
    // 宫位名称按照固定顺序，从命宫开始
    const palaceName = PALACE_NAMES[i];
    
    // 地支位置固定，不随命宫变化
    const branch = fixedBranches[(mingGongFixedIndex + i) % 12];
    
    // 计算地支在EARTHLY_BRANCHES中的索引，用于后续天干计算
    const branchIndex = EARTHLY_BRANCHES.indexOf(branch);
    
    palaces.push({
      name: palaceName,
      branch: branch,
      index: i, // 宫位序号（0-11）
      branchIndex: branchIndex, // 地支索引（0-11）
      stars: [], // 星曜列表（暂时为空，后续添加星曜计算）
      gods: [], // 神煞列表（暂时为空）
      heavenlyStem: '', // 天干（暂时为空，后续添加天干计算）
      minorLimit: '', // 小限信息
      ageRange: '', // 年龄区间
      fourHua: [] // 四化星信息
    });
    
    console.log(`📍 第${i + 1}宫：${palaceName} - ${branch}宫（地支索引${branchIndex}）`);
  }
  
  return palaces;
}
```

### 2. 修改`convertToGridLayout`函数

```javascript
/**
 * 根据前端布局需求，将十二宫转换为4x4网格布局
 * @param {Array} palaces - 十二宫数组
 * @returns {Array} - 16个位置的布局数组（包含空位）
 */
function convertToGridLayout(palaces) {
  // 4x4网格布局映射（与前端组件一致）- 紫微斗数标准布局
  // 顶行：巳 | 午 | 未 | 申
  // 中行：辰 | [中宫区域] | 酉
  // 中行：卯 | [中宫区域] | 戌  
  // 底行：寅 | 丑 | 子 | 亥
  
  // 创建一个16位置的数组，用于存放布局数据
  const layoutData = new Array(16);
  
  // 中宫位置
  layoutData[5] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 5 };
  layoutData[6] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 6 };
  layoutData[9] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 9 };
  layoutData[10] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 10 };
  
  // 固定的地支到网格位置的映射
  // 按照紫微斗数标准布局
  const branchToGridIndex = {
    '巳': 0,
    '午': 1,
    '未': 2,
    '申': 3,
    '酉': 7,
    '戌': 11,
    '亥': 15,
    '子': 14,
    '丑': 13,
    '寅': 12,
    '卯': 8,
    '辰': 4
  };
  
  // 处理每个宫位数据
  palaces.forEach(palace => {
    // 获取宫位地支对应的网格位置
    const gridIndex = branchToGridIndex[palace.branch];
    
    if (gridIndex !== undefined) {
      // 将宫位数据放入对应的网格位置
      layoutData[gridIndex] = {
        ...palace,
        displayName: palace.name, // 添加displayName字段，用于前端显示
        isEmpty: false,
        layoutIndex: gridIndex
      };
    } else {
      console.error(`❌ 未找到地支 ${palace.branch} 对应的网格位置`);
    }
  });
  
  return layoutData;
}
```

## 测试验证

我们创建了一个测试脚本`utils/test-fixed-branch-layout.js`，用于验证地支的顺序和对应关系是否按照标准布局。测试结果表明：

1. 地支的位置是固定的，按照标准布局排列
2. 宫位名称是根据命宫的位置动态计算的，从命宫开始，顺时针依次排列十二宫
3. 在网格布局中，地支和宫位名称的对应关系是正确的

网格布局如下：

```
-------------------------
| 巳(迁移宫) | 午(交友宫) | 未(官禄宫) | 申(田宅宫) | 
-------------------------
| 辰(疾厄宫) | 中宫 | 中宫 | 酉(福德宫) | 
-------------------------
| 卯(财帛宫) | 中宫 | 中宫 | 戌(父母宫) | 
-------------------------
| 寅(子女宫) | 丑(夫妻宫) | 子(兄弟宫) | 亥(命宫) | 
-------------------------
```

## 结论

通过修改`calculateTwelvePalaces`和`convertToGridLayout`函数，我们成功地实现了：
1. 地支的位置是固定的，按照标准布局排列
2. 宫位名称是根据命宫的位置动态计算的，从命宫开始，顺时针依次排列十二宫
3. 在网格布局中，地支和宫位名称的对应关系是正确的

这使得紫微斗数排盘系统更加准确，也更加符合传统的排盘规则。 