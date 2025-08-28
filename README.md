<p align="center">
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png">
  </a>
</p>

<p align="center">
  <a href="https://img.shields.io/github/stars/Tencent/tdesign-miniprogram-starter-retail">
    <img src="https://img.shields.io/github/stars/Tencent/tdesign-miniprogram-starter-retail" alt="License">
  </a>  
  <a href="https://github.com/Tencent/tdesign-miniprogram-starter-retail/issues">
    <img src="https://img.shields.io/github/issues/Tencent/tdesign-miniprogram-starter-retail" alt="License">
  </a>  
  <a href="https://github.com/Tencent/tdesign-miniprogram-starter-retail/LICENSE">
    <img src="https://img.shields.io/github/license/Tencent/tdesign-miniprogram-starter-retail" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/tdesign-miniprogram">
    <img src="https://img.shields.io/npm/v/tdesign-miniprogram.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/tdesign-miniprogram">
    <img src="https://img.shields.io/npm/dw/tdesign-miniprogram" alt="Downloads">
  </a>
</p>

# TDesign 零售行业模版示例小程序

TDesign 零售模版示例小程序采用 [TDesign 企业级设计体系小程序解决方案](https://tdesign.tencent.com/miniprogram/overview) 进行搭建，依赖 [TDesign 微信小程序组件库](https://github.com/Tencent/tdesign-miniprogram)，涵盖完整的基本零售场景需求。

## :high_brightness: 预览

<p>请使用微信扫描以下二维码：</p>

 <img src="https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-mp/common/qrcode.jpeg" width = "200" height = "200" alt="模版小程序二维码" align=center />

## :pushpin: 项目介绍

### 1. 业务介绍

零售行业模版小程序是个经典的单店版电商小程序，涵盖了电商的黄金链路流程，从商品->购物车->结算->订单等。小程序总共包含 28 个完整的页面，涵盖首页，商品详情页，个人中心，售后流程等基础页面。采用 mock 数据进行展示，提供了完整的零售商品展示、交易与售后流程。页面详情：

<img src="https://tdesign.gtimg.com/miniprogram/template/retail/tdesign-starter-readmeV1.png" width = "650" height = "900" alt="模版小程序页面详情" align=center />

主要页面截图如下：

<p align="center">
    <img alt="example-home" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/home.png" />
    <img alt="example-sort" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v2/sort.png" />
    <img alt="example-cart" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/cart.png" />
    <img alt="example-user-center" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/user-center.png" />
    <img alt="example-goods-detail" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/goods-detail.png" />
    <img alt="example-pay" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/pay.png" />
    <img alt="example-order" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/order.png" />
    <img alt="example-order-detail" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v2/order.png" />
</p>

### 2. 项目构成

零售行业模版小程序采用基础的 JavaScript + WXSS + ESLint 进行构建，降低了使用门槛。

项目目录结构如下：

```
|-- tdesign-miniprogram-starter
    |-- README.md
    |-- app.js
    |-- app.json
    |-- app.wxss
    |-- components	//	公共组件库
    |-- config	//	基础配置
    |-- custom-tab-bar	//	自定义 tabbar
    |-- model	//	mock 数据
    |-- pages
    |   |-- cart	//	购物车相关页面
    |   |-- coupon	//	优惠券相关页面
    |   |-- goods	//	商品相关页面
    |   |-- home	//	首页
    |   |-- order	//	订单售后相关页面
    |   |-- promotion-detail	//	营销活动页面
    |   |-- usercenter	//	个人中心及收货地址相关页面
    |-- services	//	请求接口
    |-- style	//	公共样式与iconfont
    |-- utils	//	工具库
```

### 3. 数据模拟

零售小程序采用真实的接口数据，模拟后端返回逻辑，在小程序展示完整的购物场景与购物体验逻辑。

### 4. 添加新页面

1. 在 `pages `目录下创建对应的页面文件夹
2. 在 `app.json` 文件中的 ` "pages"` 数组中加上页面路径
3. [可选] 在 `project.config.json` 文件的 `"miniprogram-list"` 下添加页面配置

## :hammer: 构建运行

1. `npm install`
2. 小程序开发工具中引入工程
3. 构建 npm

## :art: 代码风格控制

`eslint` `prettier`

## :iphone: 基础库版本

最低基础库版本`^2.6.5`

## :dart: 反馈

企业微信群
TDesign 团队会及时在企业微信大群中同步发布版本、问题修复信息，也会有一些关于组件库建设的讨论，欢迎微信或企业微信扫码入群交流：

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/TDesign%20IM.png" width = "200" height = "200" alt="模版小程序页面详情" align=center />

邮件联系：tdesign@tencent.com

## :link: TDesign 其他技术栈实现

- 移动端 小程序 实现：[mobile-miniprogram](https://github.com/Tencent/tdesign-miniprogram)
- 桌面端 Vue 2 实现：[web-vue](https://github.com/Tencent/tdesign-vue)
- 桌面端 Vue 3 实现：[web-vue-next](https://github.com/Tencent/tdesign-vue-next)
- 桌面端 React 实现：[web-react](https://github.com/Tencent/tdesign-react)

## :page_with_curl: 开源协议

TDesign 遵循 [MIT 协议](https://github.com/Tencent/tdesign-miniprogram-starter-retail/LICENSE)。

# 紫微斗数排盘系统

## 概述

这是一个基于微信小程序的紫微斗数排盘系统，支持16格布局，中间4格合并显示用户信息，周围12格按传统紫微斗数布局排列。

## 主要特性

### 1. 16格布局设计
- **布局结构**: 4x4网格，总共16个格子
- **中间区域**: 4个格子合并为中宫，显示用户基本信息
- **周围12宫**: 按紫微斗数传统布局排列
- **无缝连接**: 宫格之间无缝连接，线条重合，形成完整的网格
- **文字位置**: 所有文字（宫名、星曜、四化等）都精确放置在宫格线框内

### 2. 宫位布局
```
┌─────────┬─────────┬─────────┬─────────┐
│  命宫   │  兄弟宫 │  夫妻宫 │  子女宫 │
├─────────┼─────────┼─────────┼─────────┤
│  财帛宫 │         │         │  迁移宫 │
│         │    中宫合并区域    │         │
│         │    (用户信息)      │         │
├─────────┼─────────┼─────────┼─────────┤
│  疾厄宫 │         │         │  交友宫 │
├─────────┼─────────┼─────────┼─────────┤
│  事业宫 │  田宅宫 │  福德宫 │  父母宫 │
└─────────┴─────────┴─────────┴─────────┘
```

### 3. 星曜分类显示
- **主星** (紫色): 14主星，左侧显示
- **辅星** (蓝色): 六吉六煞等，左侧显示
- **杂曜** (橙色): 37杂曜，左侧显示
- **神煞** (绿色): 48神煞，左侧显示
- **运限星** (蓝色): 运限相关星曜，左侧显示
- **四化星** (红色): 化禄、化权、化科、化忌，右上角显示

### 4. 中宫信息显示
- **基本信息（左列）**：
  - 五行局
  - 四柱信息
  - 命宫地支
  - 农历日期
  - 生肖
  - 命主
- **基本信息（右列）**：
  - 年龄(虚岁)
  - 阳历日期
  - 出生时辰
  - 星座
  - 身宫地支
  - 身主
- **运限信息**：
  - 大限信息
  - 流年信息
  - 流月信息
- **当前时间信息**：
  - 当前农历日期
  - 当前阳历日期
  - 当前时间

### 5. 格局分析功能
- **君臣庆会格**: 命宫有紫微星和破军星，前后宫位分别有左辅星和右弼星夹着
- **三奇加会格**: 命宫化科、财帛宫化禄、官禄宫化权
- **禄马交驰格**: 禄存星和天马星同宫
- **禄合鸳鸯格**: 化禄和禄存同宫或者对拱
- **明禄暗禄格**: 命宫中有化禄（或禄存）坐守，而暗合宫中有禄存（或化禄）
- **禄马佩印格**: 禄存星、天马星和天相星同宫
- **两重华盖格**: 禄存化禄坐命遇空劫
- **左右同宫格**: 左辅星和右弼星同宫
- **魁钺夹命格**: 天魁星和天钺星夹着命宫
- **昌曲夹命格**: 文昌星和文曲星夹着命宫

### 6. 交互功能
- 宫位点击高亮
- 三方四正连线显示
- 运限宫位标记
- 六条线显示（命迁线、兄友线、官夫线、子田线、财福线、父疾线）
- 宫位点击事件回调
- **连线开关**: 可控制六条线和标签的显示/隐藏

### 7. 命盘信息完善
- **运限信息**: 大限、流年、流月、流日、流时
- **宫位名称**: 每个运限对应的宫位名称
- **命理数据**: 五行局、命主、身主、命宫地支、身宫地支
- **时间信息**: 当前农历、阳历、时间等实时信息

## 技术实现

### 核心算法
- **安星诀算法**: 基于[紫微斗数安星诀](https://ziwei.pro/learn/setup.html)实现
  - 定寅首诀：根据年干确定起始宫位
  - 安命身宫诀：寅起正月，顺数至生月，逆数生时为命宫
  - 定十二宫诀：由命宫逆数十二宫
  - 起大限诀：大限由命宫起，阳男阴女顺行，阴男阳女逆行
  - 安命主诀：根据出生年地支确定命主
  - 安身主诀：根据出生年地支确定身主
  - 起紫微星诀：六五四三二，酉午亥辰丑，局数除日数，商数宫前走
  - 安天府星诀：天府南斗令，常对紫微宫
  - 安紫微诸星诀：紫微逆去天机星，隔一太阳武曲辰，连接天同空二宫，廉贞居处方是真
  - 安天府诸星诀：天府顺行有太阴，贪狼而后巨门临，随来天相天梁继，七杀空三是破军
  - 定五行局诀：甲乙丙丁一到五，子丑午未一来数，寅卯申酉二上走，辰巳戌亥三为足
  - 安四化星：根据年干确定化禄、化权、化科、化忌

### 星曜分类
- **主星**: 紫微、天机、太阳、武曲、天同、廉贞、天府、太阴、贪狼、巨门、天相、天梁、七杀、破军
- **辅星**: 左辅、右弼、文昌、文曲、天魁、天钺、禄存、擎羊、陀罗、天马
- **杂曜**: 红鸾、天喜、龙池、凤阁、天官、天福、天虚、天哭、天伤、天使、天厨、天才、天寿
- **神煞**: 孤辰、寡宿、蜚廉、破碎、华盖、咸池、三台、八座、恩光、天贵
- **四化星**: 化禄、化权、化科、化忌

### 算法验证
基于1991年1月22日1时（农历）的测试结果：
- **五行局**: 2局
- **命宫**: 寅宫
- **身宫**: 寅宫
- **主星分布**: 紫微在辰宫，天机天梁在卯宫，太阳巨门在丑宫，武曲贪狼在子宫等
- **辅星分布**: 天马在未宫，天魁在丑宫，文昌在子宫，陀罗在午宫，擎羊在申宫
- **四化星**: 化科在辰宫，化禄化权在卯宫，化忌在亥宫
- **杂曜神煞**: 天贵在寅宫，破碎在丑宫，咸池在子宫，天寿在酉宫，恩光在申宫，天使在未宫，凤阁在午宫，华盖在巳宫，八座在辰宫

### 完整排盘示例
```
1. 命宫(寅): 天相 天贵
2. 兄弟宫(丑): 太阳 巨门 天魁 破碎
3. 夫妻宫(子): 武曲 贪狼 文昌 咸池
4. 子女宫(亥): 太阴 化忌
5. 财帛宫(戌): 天同 天府
6. 疾厄宫(酉): 廉贞 天寿
7. 迁移宫(申): 擎羊 恩光
8. 交友宫(未): 天马 天使
9. 事业宫(午): 破军 陀罗 凤阁
10. 田宅宫(巳): 七杀 华盖
11. 福德宫(辰): 紫微 化科 八座
12. 父母宫(卯): 天机 天梁 化禄 化权
```

## 使用方法

### 1. 基本排盘
```javascript
// 在页面中使用
<zwds-chart palaces="{{chart.palaces}}" center="{{center}}" />
```

### 2. 数据格式
```javascript
// 宫位数据
palaces: [
  {
    name: '命宫',
    stars: '紫微 天机',
    starNames: ['紫微', '天机']
  }
  // ... 其他宫位
]

// 中宫信息
center: {
  wuxingju: '木三局',
  fourPillars: { year: '庚辰', month: '甲申', day: '丙午', hour: '庚寅' },
  zodiac: '龙',
  constellation: '狮子座'
}
```

## 样式定制

### 1. 颜色配置
```javascript
const colors = {
  main: '#7c3aed',      // 主星颜色
  aux: '#2563eb',       // 辅星颜色
  misc: '#ea580c',      // 杂曜颜色
  shensha: '#16a34a',   // 神煞颜色
  hua: '#dc2626',       // 四化颜色
  border: '#d1d5db'     // 边框颜色
};
```

### 2. 尺寸调整
```css
/* 调整canvas尺寸 */
canvas {
  width: 690rpx;
  height: 920rpx;
}
```

## 注意事项

1. 确保iztro库正确安装和配置
2. 星曜数据需要包含正确的分类信息
3. 中宫信息需要完整的数据支持
4. 建议在真机上测试，模拟器可能存在兼容性问题

## 更新日志

### v2.0.0
- 从12格布局升级到16格布局
- 优化中宫显示效果
- 改进星曜分类和显示
- 增强交互功能
- 支持iztro配置和插件

### v1.0.0
- 基础12格布局
- 基本星曜显示
- 简单交互功能
