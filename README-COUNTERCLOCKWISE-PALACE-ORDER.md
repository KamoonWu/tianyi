# 紫微斗数宫位逆时针排列修复

## 问题描述

紫微斗数排盘系统中，宫位的排列顺序应该是从命宫开始逆时针排列，而不是顺时针排列。同时，地支的固定布局应该保持不变。

## 原因分析

在之前的代码中，宫位的排列顺序是从命宫开始顺时针排列的：

```javascript
// 从命宫开始，顺时针依次排列十二宫
for (let i = 0; i < 12; i++) {
  // 宫位名称按照固定顺序，从命宫开始
  const palaceName = PALACE_NAMES[i];
  
  // 地支位置固定，不随命宫变化
  const branch = fixedBranches[(mingGongFixedIndex + i) % 12];
  
  // ...
}
```

这导致宫位的排列顺序与紫微斗数的传统规则不符。正确的做法应该是从命宫开始逆时针排列十二宫。

## 修复方案

修改`calculateTwelvePalaces`函数，将宫位的排列顺序从顺时针改为逆时针，同时保持地支的固定布局不变。

## 修复步骤

### 修改`calculateTwelvePalaces`函数

```javascript
/**
 * 计算十二宫排列
 * 从命宫开始，逆时针依次排列十二宫，但地支位置固定
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
  
  // 从命宫开始，逆时针依次排列十二宫
  for (let i = 0; i < 12; i++) {
    // 宫位名称按照固定顺序，从命宫开始
    const palaceName = PALACE_NAMES[i];
    
    // 地支位置固定，不随命宫变化
    // 逆时针方向，所以是减法，而不是加法
    const branch = fixedBranches[(mingGongFixedIndex - i + 12) % 12];
    
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

关键修改是将顺时针的加法运算改为逆时针的减法运算：

```javascript
// 逆时针方向，所以是减法，而不是加法
const branch = fixedBranches[(mingGongFixedIndex - i + 12) % 12];
```

## 测试验证

我们创建了一个测试脚本`utils/test-counterclockwise-palace-order.js`，用于验证宫位的排列顺序是否是逆时针，同时地支的固定布局不变。测试结果表明：

1. 宫位名称按照固定顺序，从命宫开始逆时针排列：命宫、兄弟宫、夫妻宫、子女宫、财帛宫、疾厄宫、迁移宫、交友宫、官禄宫、田宅宫、福德宫、父母宫
2. 地支的位置仍然是固定的，按照标准布局排列

网格布局如下：

```
-------------------------
| 巳(迁移宫) | 午(疾厄宫) | 未(财帛宫) | 申(子女宫) | 
-------------------------
| 辰(交友宫) | 中宫 | 中宫 | 酉(夫妻宫) | 
-------------------------
| 卯(官禄宫) | 中宫 | 中宫 | 戌(兄弟宫) | 
-------------------------
| 寅(田宅宫) | 丑(福德宫) | 子(父母宫) | 亥(命宫) | 
-------------------------
```

## 结论

通过修改`calculateTwelvePalaces`函数，我们成功地将宫位的排列顺序从顺时针改为逆时针，同时保持地支的固定布局不变。这使得紫微斗数排盘系统更加准确，也更加符合传统的排盘规则。 