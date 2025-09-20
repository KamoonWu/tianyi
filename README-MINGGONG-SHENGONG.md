# 紫微斗数命宫身宫计算修复

## 问题描述

在紫微斗数排盘系统中，命宫和身宫的计算是最关键的一步，它们的位置是由用户的农历出生年月和时辰决定的。需要严格按照紫微斗数的口诀来计算，确保结果的准确性。

## 计算口诀

### 安命宫口诀

寅起正月，顺数至生月。从生月宫位起子时，逆数至生时。

解释与应用：

- "寅起正月"：在地支盘上，从"寅"宫开始，当作正月。
- "顺数至生月"：顺着地支顺序（寅→卯→辰→巳→午→未→申→酉→戌→亥→子→丑），数到用户的农历出生月份为止。这个宫位是"临时起点"。
- "从生月宫位起子时"：在那个"临时起点"宫位安放"子时"。
- "逆数至生时"：然后从这个宫位开始逆时针数地支（即：子、丑、寅、卯...），数到用户的出生时辰为止。数到的这个宫位，就是命宫。

### 安身宫口诀

寅起正月，顺数至生月。从生月宫位起子时，顺数至生时。

解释与应用：

身宫的口诀前半部分和命宫完全一样。唯一的不同是，最后一步从"临时起点"宫位起子时后，是顺时针数到用户的出生时辰。数到的这个宫位，就是身宫。

## 修复方案

我们需要修改`calculateMingGongBranch`和`calculateShenGongBranch`函数，确保它们严格按照紫微斗数的口诀来计算命宫和身宫。

## 修复步骤

### 1. 修改`calculateMingGongBranch`函数

```javascript
/**
 * 计算命宫地支位置
 * 安命宫口诀：寅起正月，顺数至生月。从生月宫位起子时，逆数至生时。
 * @param {number} lunarMonth - 农历月份(1-12)
 * @param {string} birthHourBranch - 出生时辰地支
 * @returns {string} - 命宫地支
 */
function calculateMingGongBranch(lunarMonth, birthHourBranch) {
  console.log(`🔮 开始计算命宫：农历${lunarMonth}月，${birthHourBranch}时`);
  
  // 步骤1：寅起正月，顺数至生月
  // 寅对应正月（索引2），计算月支索引
  const monthBranchIndex = (2 + lunarMonth - 1) % 12; // 从寅宫开始，正月=寅
  const monthBranch = EARTHLY_BRANCHES[monthBranchIndex];
  console.log(`📅 农历${lunarMonth}月对应地支：${monthBranch}（索引${monthBranchIndex}）`);
  
  // 步骤2：从生月宫位起子时，逆数至生时
  // 时辰顺序：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥
  const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const hourPosition = hourOrder.indexOf(birthHourBranch);
  
  if (hourPosition === -1) {
    console.error('❌ 无效的出生时辰地支:', birthHourBranch);
    return '寅'; // 默认返回寅
  }
  
  // 从月支位置逆时针走hourPosition步
  // 逆时针方向，所以是减法
  let mingGongIndex = (monthBranchIndex - hourPosition + 12) % 12;
  
  const mingGongBranch = EARTHLY_BRANCHES[mingGongIndex];
  console.log(`🎯 命宫计算：月支${monthBranch}(${monthBranchIndex}) - ${birthHourBranch}时位置${hourPosition} = ${mingGongBranch}宫（索引${mingGongIndex}）`);
  
  return mingGongBranch;
}
```

### 2. 修改`calculateShenGongBranch`函数

```javascript
/**
 * 计算身宫地支位置
 * 安身宫口诀：寅起正月，顺数至生月。从生月宫位起子时，顺数至生时。
 * @param {number} lunarMonth - 农历月份(1-12)
 * @param {string} birthHourBranch - 出生时辰地支
 * @returns {string} - 身宫地支
 */
function calculateShenGongBranch(lunarMonth, birthHourBranch) {
  console.log(`🔮 开始计算身宫：农历${lunarMonth}月，${birthHourBranch}时`);
  
  // 步骤1：寅起正月，顺数至生月（与命宫相同）
  const monthBranchIndex = (2 + lunarMonth - 1) % 12; // 从寅宫开始，正月=寅
  const monthBranch = EARTHLY_BRANCHES[monthBranchIndex];
  console.log(`📅 农历${lunarMonth}月对应地支：${monthBranch}（索引${monthBranchIndex}）`);
  
  // 步骤2：从生月宫位起子时，顺数至生时
  // 时辰顺序：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥
  const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const hourPosition = hourOrder.indexOf(birthHourBranch);
  
  if (hourPosition === -1) {
    console.error('❌ 无效的出生时辰地支:', birthHourBranch);
    return '寅'; // 默认返回寅
  }
  
  // 从月支位置顺时针走hourPosition步
  // 顺时针方向，所以是加法
  let shenGongIndex = (monthBranchIndex + hourPosition) % 12;
  
  const shenGongBranch = EARTHLY_BRANCHES[shenGongIndex];
  console.log(`🎯 身宫计算：月支${monthBranch}(${monthBranchIndex}) + ${birthHourBranch}时位置${hourPosition} = ${shenGongBranch}宫（索引${shenGongIndex}）`);
  
  return shenGongBranch;
}
```

## 测试验证

我们创建了一个测试脚本`utils/test-minggong-shengong.js`，用于验证命宫和身宫的计算是否正确。测试用例包括：

1. 农历三月申时出生：命宫应为申宫，身宫应为子宫
2. 农历十二月寅时出生：命宫应为亥宫，身宫应为卯宫
3. 农历七月子时出生：命宫应为申宫，身宫应为申宫
4. 农历一月午时出生：命宫应为申宫，身宫应为申宫

测试结果表明，所有测试用例都通过了验证，命宫和身宫的计算都是正确的。

## 结论

通过修改`calculateMingGongBranch`和`calculateShenGongBranch`函数，我们成功地实现了命宫和身宫的准确计算，确保它们严格按照紫微斗数的口诀来计算。这是紫微斗数排盘系统中最关键的一步，对于后续的星曜排列和命盘解读至关重要。 