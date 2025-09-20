# 紫微斗数宫位名称和地支对应关系修复

## 问题描述

在紫微斗数排盘系统中，宫位名称和地支的对应关系应该是根据命宫的位置动态计算的。命宫的位置是由用户的农历出生年月和时辰决定的，然后从命宫开始，顺时针依次排列十二宫。但是在网格布局中，宫位的位置应该是固定的，与宫位名称对应。

从日志中可以看出，宫位的索引和名称不匹配，例如：
- 索引4位置显示的是"父母宫"，但地支是"辰"
- 索引7位置显示的是"财帛宫"，但地支是"酉"
- 索引8位置显示的是"福德宫"，但地支是"卯"

这说明宫位名称和地支的对应关系出现了问题。

## 原因分析

在原来的代码中，`calculateTwelvePalaces`函数会根据命宫的地支位置来计算十二宫的排列，但是在`convertToGridLayout`函数中，我们使用了固定的地支到网格位置的映射，没有考虑宫位名称。这导致了宫位名称和地支的对应关系错误。

## 修复方案

我们需要修改两个关键函数：

1. `calculateTwelvePalaces`：确保从命宫开始，顺时针依次排列十二宫
2. `convertToGridLayout`：确保宫位在网格中的位置是固定的，与宫位名称对应

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
  
  // 找到命宫地支在EARTHLY_BRANCHES中的位置
  const mingGongBranchIndex = EARTHLY_BRANCHES.indexOf(mingGongBranch);
  if (mingGongBranchIndex === -1) {
    console.error(`❌ 命宫地支 ${mingGongBranch} 不在地支顺序中`);
    return [];
  }
  
  const palaces = [];
  
  // 从命宫开始，顺时针依次排列十二宫
  for (let i = 0; i < 12; i++) {
    // 计算当前宫位对应的地支索引，从命宫地支开始顺时针排列
    const branchIndex = (mingGongBranchIndex + i) % 12;
    const branch = EARTHLY_BRANCHES[branchIndex];
    
    // 宫位名称按照固定顺序，从命宫开始
    const palaceName = PALACE_NAMES[i];
    
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
  
  // 找到命宫
  const mingGong = palaces.find(palace => palace.name === '命宫');
  if (!mingGong) {
    console.error('❌ 未找到命宫，无法生成布局');
    return layoutData;
  }
  
  // 创建宫位名称到宫位数据的映射
  const palaceNameMap = {};
  palaces.forEach(palace => {
    palaceNameMap[palace.name] = palace;
  });
  
  // 标准的宫位位置映射 - 这是固定的布局格式
  const standardGridPositions = {
    '命宫': 0,
    '兄弟宫': 4,
    '夫妻宫': 8,
    '子女宫': 12,
    '财帛宫': 13,
    '疾厄宫': 14,
    '迁移宫': 15,
    '交友宫': 11,
    '官禄宫': 7,
    '田宅宫': 3,
    '福德宫': 2,
    '父母宫': 1
  };
  
  // 处理每个宫位数据
  Object.entries(standardGridPositions).forEach(([palaceName, gridIndex]) => {
    const palace = palaceNameMap[palaceName];
    if (palace) {
      layoutData[gridIndex] = {
        ...palace,
        displayName: palace.name, // 添加displayName字段，用于前端显示
        isEmpty: false,
        layoutIndex: gridIndex
      };
    } else {
      console.error(`❌ 未找到宫位 ${palaceName}`);
    }
  });
  
  return layoutData;
}
```

## 测试验证

我们创建了一个测试脚本`utils/test-palace-name-branch-mapping.js`，用于验证宫位名称和地支的对应关系是否正确。测试结果表明：

1. 原始十二宫数据中，命宫对应的是亥宫，兄弟宫对应的是子宫，等等。这是正确的。
2. 在网格布局数据中，命宫对应的是亥宫，父母宫对应的是戌宫，等等。这也是正确的。

网格布局如下：

```
-------------------------
| 亥(命宫) | 戌(父母宫) | 酉(福德宫) | 申(田宅宫) | 
-------------------------
| 子(兄弟宫) | 中宫 | 中宫 | 未(官禄宫) | 
-------------------------
| 丑(夫妻宫) | 中宫 | 中宫 | 午(交友宫) | 
-------------------------
| 寅(子女宫) | 卯(财帛宫) | 辰(疾厄宫) | 巳(迁移宫) | 
-------------------------
```

## 结论

通过修改`calculateTwelvePalaces`和`convertToGridLayout`函数，我们成功地实现了：
1. 命宫的位置是根据用户的农历出生年月和时辰动态计算的
2. 十二宫的排列是从命宫开始，顺时针依次排列的
3. 宫位名称和地支的对应关系是正确的
4. 宫位在网格中的位置是固定的，与宫位名称对应

这使得紫微斗数排盘系统更加准确，也更加符合传统的排盘规则。 