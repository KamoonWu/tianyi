# 紫微斗数宫位字段优化系统

## 系统概述

本系统按照用户提供的表格要求，对紫微斗数排盘中的每个宫位字段进行了全面的增加和优化。系统实现了智能星曜分类、精确定位布局、颜色区分显示等功能，完全符合传统紫微斗数的显示规范。

## 表格要求对照

| 字段内容 | 位置描述 | 类目名称 | 实现状态 |
|---------|---------|---------|---------|
| 天相得 | 宫格内左上角或最显眼位置 | 主星(及其亮度: 得) | ✅ 已实现 |
| 文曲庙 | 主星下方或旁边 | 辅星(及其亮度: 庙) | ✅ 已实现 |
| 科 (紫色) | 紧邻"文曲" | 四化星(属于文曲) | ✅ 已实现 |
| 流年・乙 (紫色高亮) | 宫格正中央 | 流年标记(及流年天干) | ✅ 已实现 |
| 天马、恩光、天巫、天福、空亡、年解 | 分布在主星和辅星周围 | 杂曜/神煞星 | ✅ 已实现 |
| 运禄、运鸾 (红色) | 通常位于宫格右侧或特定位置 | 大运或小限的流曜 | ✅ 已实现 |
| 临官、将军、吊客、岁驿 | 宫格最底部一行 | 长生十二神 & 流年岁前十二神 | ✅ 已实现 |
| 5 17 29 41 53 65 77 85-94 | 宫格底部,与神煞星同行 | 大运或小限对应的年龄区间 | ✅ 已实现 |
| 官禄 | 宫格左下角 | 宫位名称 | ✅ 已实现 |
| 癸巳 | 宫格左下角,紧邻"官禄" | 宫位地支 | ✅ 已实现 |

## 系统架构

### 核心模块

1. **字段优化系统** (`utils/palace-field-optimization.js`)
   - 星曜分类和颜色定义
   - 宫位字段结构定义
   - 智能分类算法
   - 绘制辅助函数

2. **示例数据系统** (`utils/sample-palace-data.js`)
   - 完整的十二宫示例数据
   - 流年数据示例
   - 数据生成函数

3. **排盘组件** (`components/zwds-chart/zwds-chart.js`)
   - 集成字段优化系统
   - 支持流年数据
   - 回退机制保障

### 星曜分类系统

#### 主星 (Main Stars)
- **颜色**: 深色 (#1e293b)
- **位置**: 左上角或最显眼位置
- **亮度**: 得、平、陷、庙、旺、闲、弱
- **示例**: 紫微庙、天机得、太阳旺

#### 辅星 (Auxiliary Stars)
- **颜色**: 蓝色 (#3b82f6)
- **位置**: 主星下方或旁边
- **亮度**: 庙、旺、得、平、闲、弱、陷
- **示例**: 左辅旺、右弼平、文昌庙

#### 四化星 (Four Transformations)
- **颜色**: 紫色 (#8b5cf6)
- **位置**: 右上角，紧邻主星或辅星
- **类型**: 禄、权、科、忌
- **示例**: 禄、权、科、忌

#### 流年标记 (Flow Year)
- **颜色**: 橙色 (#f59e0b)
- **位置**: 宫格正中央
- **格式**: 流年・{天干}
- **示例**: 流年・乙

#### 杂曜/神煞星 (Miscellaneous Stars)
- **颜色**: 绿色 (#10b981)
- **位置**: 左侧分布，围绕主星和辅星
- **示例**: 天马、恩光、天巫、天福、空亡、年解

#### 运限流曜 (Fortune Stars)
- **颜色**: 红色 (#ef4444)
- **位置**: 右侧，特定位置
- **示例**: 运禄、运鸾、运科、运忌

#### 长生十二神 (Longevity Gods)
- **颜色**: 灰色 (#6b7280)
- **位置**: 宫格最底部一行
- **示例**: 临官、将军、吊客、岁驿、长生、沐浴

#### 年龄区间 (Age Range)
- **颜色**: 灰色 (#6b7280)
- **位置**: 底部右侧，与神煞星同行
- **格式**: 数字范围
- **示例**: 1-13、14-26、27-39

## 字段布局详解

### 坐标系统
每个宫位使用相对坐标系统，以宫位左上角为原点(0,0)：

```
(0,0) ────────────────── (120,0)
   │                         │
   │  主星(8,20)  四化星(85,16) │
   │                         │
   │  辅星(8,40)             │
   │                         │
   │  流年标记(50,50)         │
   │                         │
   │  杂曜(8,65)  运限(85,65) │
   │                         │
   │  长生神(8,110) 年龄(85,110)│
   │                         │
   │  宫名(8,130) 地支(50,130) │
   │                         │
(0,150) ────────────────── (120,150)
```

### 对齐方式
- **左对齐**: 主星、辅星、杂曜、长生神、宫名
- **右对齐**: 四化星、运限、年龄区间
- **居中对齐**: 流年标记

## 使用方法

### 1. 基本使用

```javascript
// 引入字段优化系统
const { getPalaceFieldData } = require('./utils/palace-field-optimization');

// 获取宫位字段数据
const fieldData = getPalaceFieldData(palace, flowYearData);

// 字段数据包含所有分类信息
console.log(fieldData.mainStar);      // 主星
console.log(fieldData.auxiliaryStar); // 辅星
console.log(fieldData.fourHua);       // 四化星
console.log(fieldData.flowYear);      // 流年标记
// ... 其他字段
```

### 2. 在小程序中使用

```xml
<!-- 排盘组件 -->
<zwds-chart 
  id="zwds-chart" 
  palaces="{{chart.palaces}}" 
  center="{{center}}" 
  fortune="{{fortune}}" 
  flowYear="{{flowYear}}" 
  showLines="{{showLines}}" 
  bind:palaceClick="onPalaceClick" 
/>
```

```javascript
// 页面数据
data: {
  flowYear: {
    currentFlowYear: {
      heavenlyStem: '乙',
      earthlyBranch: '巳',
      year: 2024
    }
  }
}
```

### 3. 测试功能

点击"测试"按钮可以加载示例数据，查看字段优化效果：

```javascript
// 测试方法
testChart() {
  const { generateSampleChartData, sampleFlowYearData } = require('../../utils/sample-palace-data');
  const samplePalaces = generateSampleData();
  
  this.setData({
    'chart.palaces': samplePalaces,
    flowYear: sampleFlowYearData
  });
}
```

## 技术特性

### 1. 智能分类
- 自动识别星曜类型
- 支持亮度信息
- 智能归类算法

### 2. 精确定位
- 像素级坐标控制
- 自适应布局
- 防止文字重叠

### 3. 颜色系统
- 语义化颜色定义
- 高亮状态支持
- 无障碍友好

### 4. 回退机制
- 优化系统失败时自动回退
- 保证基本功能可用
- 错误日志记录

### 5. 性能优化
- 按需加载模块
- 缓存分类结果
- 最小化重绘

## 测试验证

### 运行测试

```bash
# 基础功能测试
node utils/test-palace-field-optimization.js

# 示例数据测试
node utils/test-sample-palace-data.js

# 综合系统测试
node utils/test-complete-system.js
```

### 测试覆盖

- ✅ 模块导入验证
- ✅ 星曜分类准确性
- ✅ 字段布局正确性
- ✅ 颜色配置验证
- ✅ 流年数据处理
- ✅ 示例数据完整性
- ✅ 系统集成测试

## 扩展功能

### 1. 自定义星曜
可以轻松添加新的星曜类型：

```javascript
// 在 STAR_CATEGORIES 中添加新类型
custom: {
  color: '#ff6b6b',
  position: '自定义位置'
}
```

### 2. 布局调整
可以修改 `PALACE_FIELD_STRUCTURE` 来调整字段位置：

```javascript
customField: {
  x: 10,
  y: 25,
  width: 100,
  height: 20,
  align: 'center',
  category: 'custom'
}
```

### 3. 颜色主题
支持自定义颜色主题：

```javascript
const customTheme = {
  main: '#2d3748',
  auxiliary: '#3182ce',
  // ... 其他颜色
};
```

## 故障排除

### 常见问题

1. **星曜不显示**
   - 检查星曜数据格式
   - 验证分类算法
   - 查看控制台错误

2. **位置偏移**
   - 检查坐标系统
   - 验证宫位尺寸
   - 调整字段配置

3. **颜色异常**
   - 检查颜色定义
   - 验证高亮状态
   - 查看CSS样式

### 调试方法

```javascript
// 启用详细日志
console.log('🔍 字段数据:', fieldData);
console.log('🔍 分类结果:', categorized);
console.log('🔍 绘制配置:', config);
```

## 更新日志

### v1.0.0 (当前版本)
- ✅ 实现基础字段优化系统
- ✅ 支持十二宫完整布局
- ✅ 智能星曜分类
- ✅ 精确定位系统
- ✅ 颜色区分显示
- ✅ 流年数据支持
- ✅ 回退机制保障
- ✅ 完整测试覆盖

### 计划功能
- [ ] 支持更多星曜类型
- [ ] 自定义布局主题
- [ ] 动画效果支持
- [ ] 国际化支持
- [ ] 性能优化

## 贡献指南

欢迎提交Issue和Pull Request来改进系统！

### 开发环境
- Node.js 14+
- 微信小程序开发工具
- ESLint + Prettier

### 代码规范
- 使用ES6+语法
- 遵循小程序开发规范
- 添加适当的注释和文档

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件
- 微信交流群

---

**紫微斗数宫位字段优化系统** - 让传统紫微斗数在现代技术中焕发新生！ 