# 紫微斗数宫位排列方向修复

## 问题概述

在紫微斗数排盘系统中，发现了命宫位置计算和十二宫排列方向的问题：

1. 命宫位置计算不准确，导致命宫和身宫位置错误
2. 十二宫排列方向错误，之前是顺时针排列，应该是逆时针排列
3. 前端组件无法正确显示后端计算的宫位数据，尤其是在空数据情况下
4. 宫位名称和地支位置的对应关系不正确，宫位名称应该按照固定顺序排列，但地支位置是从命宫开始逆时针排列

## 修复内容

### 1. 命宫计算修正

根据安命宫口诀：**寅起正月，顺数至生月。从生月宫位起子时，逆数至生时。**

修正了命宫计算函数 `calculateMingGongBranch`：

```javascript
function calculateMingGongBranch(lunarMonth, birthHourBranch) {
  // 步骤1：寅起正月，顺数至生月
  // 寅对应正月，地支顺序：寅、卯、辰、巳、午、未、申、酉、戌、亥、子、丑
  const startIndex = 2; // 寅的索引
  const monthBranchIndex = (startIndex + lunarMonth - 1) % 12;
  
  // 步骤2：从生月宫位起子时，逆数至生时
  const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const hourPosition = hourOrder.indexOf(birthHourBranch);
  
  // 从月支位置逆时针走hourPosition步
  let mingGongIndex = (monthBranchIndex - hourPosition + 12) % 12;
  
  return EARTHLY_BRANCHES[mingGongIndex];
}
```

### 2. 身宫计算修正

根据安身宫口诀：**寅起正月，顺数至生月。从生月宫位起子时，顺数至生时。**

修正了身宫计算函数 `calculateShenGongBranch`：

```javascript
function calculateShenGongBranch(lunarMonth, birthHourBranch) {
  // 步骤1：寅起正月，顺数至生月（与命宫相同）
  const startIndex = 2; // 寅的索引
  const monthBranchIndex = (startIndex + lunarMonth - 1) % 12;
  
  // 步骤2：从生月宫位起子时，顺数至生时
  const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const hourPosition = hourOrder.indexOf(birthHourBranch);
  
  // 从月支位置顺时针走hourPosition步
  let shenGongIndex = (monthBranchIndex + hourPosition) % 12;
  
  return EARTHLY_BRANCHES[shenGongIndex];
}
```

### 3. 十二宫排列方向修正

修正了十二宫排列函数 `calculateTwelvePalaces`，确保宫位名称按照固定顺序排列，但地支位置是从命宫开始逆时针排列：

```javascript
function calculateTwelvePalaces(mingGongBranch) {
  const mingGongIndex = EARTHLY_BRANCHES.indexOf(mingGongBranch);
  
  const palaces = [];
  
  // 从命宫开始，逆时针依次排列十二宫
  for (let i = 0; i < 12; i++) {
    // 逆时针排列，所以是减法
    const branchIndex = (mingGongIndex - i + 12) % 12;
    const branch = EARTHLY_BRANCHES[branchIndex];
    
    // 宫位名称按照固定顺序排列
    // 命宫永远是第0个，兄弟宫永远是第1个，以此类推
    const palaceName = PALACE_NAMES[i];
    
    palaces.push({
      name: palaceName,
      branch: branch,
      // ... 其他属性
    });
  }
  
  return palaces;
}
```

### 4. 前端组件修正

修正了前端组件的 `orderPalacesForLayout` 函数，确保正确显示后端计算的宫位数据：

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

### 5. 宫位字段优化系统修正

修正了 `getPalaceFieldData` 函数，确保正确处理宫位名称：

```javascript
function getPalaceFieldData(palace, flowYearData = null) {
  // ...
  
  // 获取宫名，优先使用displayName，如果没有则使用name
  // 如果palace.isEmpty为true，则显示"—"
  const palaceName = palace.isEmpty ? '—' : (palace.displayName || palace.name || '');

  return {
    // ...
    palaceName: palaceName ? palaceName.replace('宫', '') : '',
    // ...
  };
}
```

## 修复效果

### 用户一排盘结果

用户一（公历1991年1月22日凌晨4点太原出生的男性）的排盘结果：

- **农历日期**: 庚午年十二月初七
- **真太阳时**: 03:30
- **时辰**: 寅时（03:00-05:00）
- **命宫位置**: 辛亥
- **身宫位置**: 己卯
- **五行局**: 水二局
- **紫微星位置**: 寅宫

### 十二宫排列顺序

修正后的十二宫排列顺序：

1. 宫位名称按照固定顺序排列：命宫、兄弟宫、夫妻宫、子女宫、财帛宫、疾厄宫、迁移宫、交友宫、官禄宫、田宅宫、福德宫、父母宫
2. 地支位置是从命宫开始逆时针排列

例如，农历三月申时出生的用户：
- 命宫在申宫
- 从申宫开始，逆时针依次是：申、未、午、巳、辰、卯、寅、丑、子、亥、戌、酉
- 对应的宫位名称依次是：命宫、兄弟宫、夫妻宫、子女宫、财帛宫、疾厄宫、迁移宫、交友宫、官禄宫、田宅宫、福德宫、父母宫

## 测试结果

运行测试脚本 `test-palace-names.js`、`test-palace-direction.js`、`test-user1-fixed.js` 和 `test-integration.js`，所有测试均通过，证明修复有效。

### 测试用例

| 测试用例 | 农历月 | 时辰 | 命宫 | 身宫 | 结果 |
|---------|-------|------|------|------|------|
| 用例1   | 12月  | 寅时 | 亥宫 | 卯宫 | ✓ 通过 |
| 用例2   | 1月   | 子时 | 寅宫 | 寅宫 | ✓ 通过 |
| 用例3   | 3月   | 申时 | 申宫 | 子宫 | ✓ 通过 |
| 用例4   | 6月   | 午时 | 丑宫 | 丑宫 | ✓ 通过 |
| 用例5   | 9月   | 卯时 | 未宫 | 丑宫 | ✓ 通过 |

## 总结

通过正确理解和实现紫微斗数排盘口诀，成功修复了命宫计算和十二宫排列方向的问题。同时，通过修正前端组件的数据处理逻辑，确保了排盘结果的正确显示，包括空数据的处理。

特别重要的是，我们确保了宫位名称按照固定顺序排列，而地支位置是从命宫开始逆时针排列，这符合紫微斗数的传统排盘方法。这确保了排盘结果的准确性，为后续的星曜安放和运限计算奠定了坚实的基础。 