# 紫微排盘调试指南

## 问题描述
排盘组件只能看到各个宫位，但看不到星曜信息。

## ✅ 已解决的问题

### 1. 路径引用错误
**问题**: `Error: module 'pages/utils/star-placement.js' is not defined`
**原因**: 从 `pages/index/index.js` 到 `utils/star-placement.js` 的路径错误
**解决**: 将 `../utils/star-placement` 改为 `../../utils/star-placement`

**修复的文件**:
- `pages/index/index.js` 第75行: `require('../../utils/star-placement')`
- `pages/index/index.js` 第369行: `require('../../utils/pattern-analysis')`

### 2. 点击事件错误
**问题**: `TypeError: e.currentTarget.getBoundingClientRect is not a function`
**原因**: 在微信小程序中，`getBoundingClientRect` 方法不可用
**解决**: 使用 `createSelectorQuery().select('#zwdsCanvas').boundingClientRect()` 获取Canvas位置

**修复的文件**:
- `components/zwds-chart/zwds-chart.js` 中的 `onTap` 方法

**修复逻辑**:
```javascript
// 修复前（错误）
const rect = e.currentTarget.getBoundingClientRect();
const x = e.detail.x - rect.left;
const y = e.detail.y - rect.top;

// 修复后（正确）
const query = this.createSelectorQuery();
query.select('#zwdsCanvas').boundingClientRect((rect) => {
  const x = e.detail.x - rect.left;
  const y = e.detail.y - rect.top;
  // ... 处理点击逻辑
}).exec();
```

### 3. 连线开关无法控制连线显示
**问题**: 连线开关无法控制各个宫之间的虚线和标签的显隐
**原因**: 
1. `getPalaceIndex` 函数中的逻辑错误，当宫位索引为 `0` 时，`|| -1` 会返回 `-1`（因为 `0` 是falsy值）
2. 连线绘制的索引判断错误，使用了错误的宫位索引
3. 连线绘制逻辑过于复杂，容易出错

**解决**: 
1. 修复 `getPalaceIndex` 函数，正确处理索引为 `0` 的情况
2. 修复连线绘制的索引判断错误
3. 简化连线绘制逻辑，使用通用处理

**修复的文件**:
- `utils/palace-lines.js` 中的 `getPalaceIndex` 函数
- `components/zwds-chart/zwds-chart.js` 中的连线绘制逻辑

**修复逻辑**:
```javascript
// 修复前（错误）
function getPalaceIndex(palaceName) {
  return LAYOUT_INDEX[palaceName] || -1;  // 当索引为0时，0 || -1 返回 -1
}

// 修复后（正确）
function getPalaceIndex(palaceName) {
  const index = LAYOUT_INDEX[palaceName];
  return index !== undefined ? index : -1;  // 正确处理索引为0的情况
}
```

**连线绘制逻辑修复**:
```javascript
// 修复前（复杂且容易出错）
if (idx1 === 0 && idx2 === 6) { // 命宫-迁移宫（错误索引）
  // ... 特殊处理
} else if (idx1 === 3 && idx2 === 9) { // 子女宫-田宅宫（错误索引）
  // ... 特殊处理
}
// ... 更多特殊条件

// 修复后（简洁且通用）
// 计算连线起点和终点（通用处理，不需要特殊条件判断）
startX = c1.x + c1.w / 2;
startY = c1.y + c1.h / 2;
endX = c2.x + c2.w / 2;
endY = c2.y + c2.h / 2;
```

**问题详情**:
- `命宫` 的索引是 `0`，但 `getPalaceIndex('命宫')` 返回 `-1`
- 连线绘制的索引判断使用了错误的宫位索引（如 `6` 而不是 `7`）
- 导致部分连线无法绘制，连线开关虽然能切换状态，但连线绘制逻辑本身有缺陷

**修复验证**:
- 所有12个宫位现在都有正确的索引（0-15，跳过中宫位置）
- 6条连线都能正确绘制：命迁线、兄友线、官夫线、子田线、财福线、父疾线
- 连线开关现在能完全控制连线和标签的显示/隐藏
- 连线绘制逻辑更加简洁和通用，不容易出错

## 调试步骤

### 1. 检查数据流
运行以下命令验证数据流是否正常：
```bash
# 测试安星算法
node utils/test-star-placement.js

# 测试完整数据流
node utils/full-test.js

# 测试模块加载
node utils/test-require.js

# 测试完整流程
node utils/test-complete-flow.js

# 测试点击坐标计算
node utils/test-click-coordinates.js

# 测试修复后的点击事件
node utils/test-fixed-click.js
```

### 2. 检查小程序控制台
在微信开发者工具中查看控制台输出，应该能看到：
- 排盘组件开始绘制...
- 当前组件数据: { palaces: [...], center: {...}, fortune: {...} }
- 排盘组件接收到的宫位数据: 12 个宫位
- 映射宫位: 命宫 -> 命宫
- 找到宫位 命宫: 天相 天贵

### 3. 检查点击事件
点击宫位时应该能看到：
- 点击事件: { pageX: ..., pageY: ..., relativeX: ..., relativeY: ... }
- 点击了宫位 X: { x: ..., y: ..., w: ..., h: ... }
- 点击的宫位: 命宫 { ... }
- 选中宫位: 命宫

### 4. 检查数据传递
确保主页面正确传递了数据：
- `chart.palaces` 应该包含12个宫位
- 每个宫位应该有 `stars` 和 `starNames` 字段
- `isEmpty` 字段应该为 `false`

### 5. 检查组件观察者
排盘组件应该监听以下数据变化：
- `palaces` 变化时触发 `drawChart()`
- `center` 变化时触发 `drawChart()`
- `fortune` 变化时触发 `drawChart()`

### 6. 检查Canvas绘制
确保Canvas正确绘制了星曜：
- 宫位名称显示正确
- 星曜按分类显示（主星、辅星、杂曜、神煞、四化）
- 不同星曜使用不同颜色

## 常见问题

### 问题1: 数据没有传递到组件
**症状**: 控制台显示 "排盘组件接收到的宫位数据: 0 个宫位"
**解决**: 检查主页面是否正确调用了 `refreshAll()` 方法

### 问题2: 宫位名称不匹配
**症状**: 控制台显示 "未找到宫位 XXX，创建空宫位"
**解决**: 检查宫位名称标准化函数 `normalizePalaceName`

### 问题3: 星曜分类错误
**症状**: 星曜没有按预期颜色显示
**解决**: 检查 `stars-catalog.js` 中的星曜分类规则

### 问题4: Canvas绘制失败
**症状**: 控制台显示 "未找到canvas节点"
**解决**: 检查WXML中的canvas ID是否正确

### 问题5: 点击事件不工作
**症状**: 点击宫位没有反应或报错
**解决**: 检查 `onTap` 方法中的坐标计算逻辑

## 测试命令

### 测试模块加载
```bash
node utils/test-require.js
```

### 测试完整流程
```bash
node utils/test-complete-flow.js
```

### 测试点击事件
```bash
node utils/test-fixed-click.js
```

### 测试安星算法
```bash
node utils/test-star-placement.js
```

### 测试数据流
```bash
node utils/full-test.js
```

### 测试星曜分类
```bash
node -e "
const { classifyStars } = require('./utils/stars-catalog');
console.log(classifyStars(['紫微', '天机', '化禄']));
"
```

## 预期结果

正确的排盘应该显示：
1. 命宫: 天相 天贵
2. 兄弟宫: 太阳 巨门 天魁 破碎
3. 夫妻宫: 武曲 贪狼 文昌 咸池
4. 子女宫: 太阴 化忌
5. 财帛宫: 天同 天府
6. 疾厄宫: 廉贞 天寿
7. 迁移宫: 擎羊 恩光
8. 交友宫: 天马 天使
9. 事业宫: 破军 陀罗 凤阁
10. 田宅宫: 七杀 华盖
11. 福德宫: 紫微 化科 八座
12. 父母宫: 天机 天梁 化禄 化权

点击宫位时应该：
- 正确识别点击的宫位
- 显示宫位信息
- 高亮选中的宫位
- 触发三方四正连线显示

## 联系支持
如果问题仍然存在，请提供：
1. 控制台完整输出
2. 小程序版本信息
3. 微信开发者工具版本
4. 操作系统信息 