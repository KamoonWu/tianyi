# 紫微斗数固定地支位置修复

## 问题描述

在紫微斗数排盘系统中，十二地支在宫位中的位置应该是固定的，索引0固定为巳，索引1为午，依次类推。这样才能正确计算天干和其他信息。然而，在原来的代码中，地支的位置是根据命宫的位置动态调整的，这导致了天干计算的错误。

## 原因分析

在原来的代码中，`calculateTwelvePalaces`函数会根据命宫的地支位置来计算十二宫的排列：

```javascript
// 从命宫开始，顺时针依次排列十二宫
for (let i = 0; i < 12; i++) {
  // 顺时针排列，所以是加法
  const branchIndex = (mingGongIndex + i) % 12;
  const branch = EARTHLY_BRANCHES[branchIndex];
  const palaceName = PALACE_NAMES[i];
  
  // ...
}
```

这导致地支的位置会随着命宫的位置变化而变化，而不是固定的。

## 修复方案

我们需要修改两个关键函数：

1. `calculateTwelvePalaces`：使十二地支在宫位中的位置固定，索引0为巳，索引1为午，依次类推
2. `convertToGridLayout`：根据固定的地支位置来布局宫位

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
  
  // 固定地支顺序：索引0为巳，索引1为午，依次类推
  const fixedBranches = ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'];
  
  // 找到命宫地支在固定地支顺序中的位置
  const mingGongFixedIndex = fixedBranches.indexOf(mingGongBranch);
  
  const palaces = [];
  
  // 从命宫开始，顺时针依次排列十二宫
  for (let i = 0; i < 12; i++) {
    // 宫位名称按照固定顺序
    const palaceName = PALACE_NAMES[i];
    
    // 地支位置固定，不随命宫变化
    const branch = fixedBranches[i];
    
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
  
  // 固定的地支到网格位置的映射
  // 巳宫在索引0，午宫在索引1，依此类推
  const branchToGridIndex = {
    '巳': 0,
    '午': 1,
    '未': 2,
    '申': 3,
    '酉': 4,
    '戌': 7,
    '亥': 8,
    '子': 11,
    '丑': 12,
    '寅': 13,
    '卯': 14,
    '辰': 15
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

我们创建了一个测试脚本`utils/test-fixed-branch-positions.js`，用于验证地支位置是否固定。测试结果表明：

1. 原始十二宫的地支顺序是正确的：巳, 午, 未, 申, 酉, 戌, 亥, 子, 丑, 寅, 卯, 辰
2. 网格布局中的地支位置也是正确的，巳宫在索引0，午宫在索引1，依此类推
3. 天干的计算也是正确的，基于地支的位置

对于所有三个测试用户，地支位置都是固定的，不会随着命宫的位置变化而变化。

## 结论

通过修改`calculateTwelvePalaces`和`convertToGridLayout`函数，我们成功地实现了十二地支在宫位中的位置固定，索引0为巳，索引1为午，依次类推。这使得天干的计算更加准确，也使得紫微斗数排盘系统更加符合传统的排盘规则。 