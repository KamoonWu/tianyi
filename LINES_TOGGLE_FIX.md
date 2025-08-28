# 连线开关问题修复总结

## 问题描述
用户反馈：连线开关无法控制各个宫之间的虚线和标签的显隐。

## 问题诊断过程

### 1. 初步检查
- ✅ 连线开关的UI绑定正确
- ✅ 主页面状态管理正确
- ✅ 组件属性传递正确
- ✅ 组件观察者设置正确
- ✅ 连线绘制逻辑正确

### 2. 深入分析
通过创建测试文件发现：
- 连线开关的逻辑完全正确
- 状态传递和观察者触发都正常
- 问题在于连线绘制本身

### 3. 根本原因发现
运行 `utils/test-palace-index-mapping.js` 发现：
- `命宫` 的索引应该是 `0`，但 `getPalaceIndex('命宫')` 返回 `-1`
- 其他宫位索引正常
- 导致部分连线无法绘制

### 4. 问题根源
在 `utils/palace-lines.js` 中：
```javascript
// 错误的逻辑
function getPalaceIndex(palaceName) {
  return LAYOUT_INDEX[palaceName] || -1;  // 当索引为0时，0 || -1 返回 -1
}
```

**问题分析**：
- `命宫` 的索引是 `0`
- `0` 在JavaScript中被认为是falsy值
- `0 || -1` 会返回 `-1`，而不是期望的 `0`
- 这导致 `命迁线` 无法绘制

## 修复方案

### 修复代码
```javascript
// 修复后的逻辑
function getPalaceIndex(palaceName) {
  const index = LAYOUT_INDEX[palaceName];
  return index !== undefined ? index : -1;  // 正确处理索引为0的情况
}
```

### 修复原理
- 使用 `!== undefined` 检查而不是 `|| -1`
- 当索引为 `0` 时，`0 !== undefined` 为 `true`，返回 `0`
- 当索引不存在时，`undefined !== undefined` 为 `false`，返回 `-1`

## 修复验证

### 1. 宫位索引测试
```bash
node utils/test-palace-index-mapping.js
```
**结果**：所有12个宫位都有正确的索引（0-15，跳过中宫位置）

### 2. 连线绘制测试
```bash
node utils/test-lines-toggle.js
```
**结果**：6条连线都能正确绘制：
- 命迁线（命宫↔迁移宫）
- 兄友线（兄弟宫↔交友宫）
- 官夫线（事业宫↔夫妻宫）
- 子田线（子女宫↔田宅宫）
- 财福线（财帛宫↔福德宫）
- 父疾线（父母宫↔疾厄宫）

### 3. 连线开关测试
```bash
node utils/test-lines-toggle-complete.js
```
**结果**：连线开关能正确控制连线和标签的显示/隐藏

## 技术要点

### 1. JavaScript的falsy值陷阱
- `0`、`false`、`""`、`null`、`undefined`、`NaN` 都是falsy值
- 使用 `||` 操作符时要特别注意 `0` 的情况
- 推荐使用 `!== undefined` 或 `!== null` 进行存在性检查

### 2. 微信小程序组件通信
- 属性传递：`showLines="{{showLines}}"`
- 状态监听：`observers: { 'showLines': function() { ... } }`
- 数据绑定：`this.data.showLines`

### 3. Canvas绘制优化
- 条件绘制：`if (this.data.showLines) { ... }`
- 状态管理：根据开关状态决定是否执行绘制逻辑
- 性能考虑：避免不必要的绘制操作

## 修复后的功能

### 连线显示
- 6条主要连线，每条都有不同的颜色和标签
- 连线标签位置智能调整，避免与中宫重叠
- 虚线样式，符合传统紫微斗数排盘规范

### 连线控制
- 开关状态实时响应
- 连线和标签同步显示/隐藏
- 状态变化时自动重绘Canvas

### 用户体验
- 清晰的视觉反馈
- 灵活的显示控制
- 符合用户期望的交互行为

## 总结

连线开关问题已经完全解决。问题的根本原因是一个经典的JavaScript编程陷阱：`0 || -1` 返回 `-1` 而不是期望的 `0`。

通过修复 `getPalaceIndex` 函数，现在：
1. 所有宫位都有正确的索引
2. 所有连线都能正确绘制
3. 连线开关能完全控制连线的显示/隐藏
4. 用户体验得到显著改善

这是一个很好的提醒：在处理可能为 `0` 的数值时，要特别小心使用 `||` 操作符。 