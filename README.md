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

## 项目概述

这是一个基于微信小程序的紫微斗数排盘系统，能够根据用户的出生年月日时和地点，计算命盘并进行展示。

## 主要功能

1. **多用户管理**：支持多个用户档案，可以在不同用户之间切换
2. **动态排盘计算**：根据用户的出生信息动态计算命盘
3. **农历日期转换**：支持公历转农历，并计算真太阳时
4. **完整排盘信息**：计算命宫、身宫、十二宫位、星曜等信息
5. **精美图表展示**：使用Canvas绘制美观的排盘图表

## 技术特点

1. **动态计算**：宫位排列不再写死在前端，而是根据不同用户的数据动态计算
2. **模块化设计**：将排盘计算、图表绘制等功能拆分为独立模块
3. **数据驱动**：使用数据驱动的方式进行排盘计算和图表绘制
4. **可扩展性**：支持添加更多的排盘功能和分析功能

## 用户数据

系统内置了三个用户档案和一个空档案，用于测试和演示：

1. **用户1**：公历1991年1月22日凌晨4点太原出生的男性（农历庚午年十二月初七寅时）
2. **用户2**：2000年1月22日北京出生的女性（农历己卯年十二月十六日丑时）
3. **用户3**：2005年1月22日广州出生的女性（农历甲申年十二月十二日丑时）
4. **空**：空白命例，用于查看数据展示逻辑

## 排盘计算流程

1. **农历转换**：将公历日期转换为农历日期
2. **真太阳时计算**：根据出生地点计算真太阳时
3. **命宫计算**：根据农历月份和时辰计算命宫位置
4. **身宫计算**：根据农历月份和时辰计算身宫位置
5. **十二宫排列**：从命宫开始，逆时针排列十二宫
6. **天干计算**：根据年干计算十二宫天干
7. **五行局计算**：根据命宫天干地支计算五行局
8. **星曜安放**：根据五行局和农历日期安放紫微星等主星
9. **辅星安放**：根据农历月份和时辰安放辅星
10. **四化星安放**：根据年干安放四化星

## 文件结构

- **services/palace-calculation.js**：后端排盘计算服务
- **utils/lunar-converter.js**：农历转换和八字计算工具
- **components/zwds-chart/zwds-chart.js**：排盘图表组件
- **utils/palace-field-optimization.js**：宫位字段优化系统
- **pages/index/index.js**：首页逻辑，处理用户切换和排盘计算
- **app.js**：应用程序入口，存储用户数据

## 最近更新

1. **宫位排列修正**：修复了宫位排列方向问题，确保从命宫开始逆时针排列十二宫
2. **农历转换优化**：优化了农历转换逻辑，确保正确计算农历日期
3. **用户切换功能**：改进了用户切换功能，确保切换后能正确显示对应的排盘信息
4. **空数据处理**：优化了空数据处理，确保在没有数据时正确显示"—"
5. **身宫标记修正**：修复了身宫标记问题，确保身宫被正确标记

## 使用方法

1. 在微信开发者工具中打开项目
2. 点击页面上的"切换命例"按钮，选择不同的用户
3. 系统会自动计算并显示对应用户的排盘信息

## 测试

项目包含多个测试脚本，用于验证排盘计算的正确性：

- **test-dynamic-palace-layout.js**：测试不同用户数据的宫位排列
- **test-user1-fixed.js**：测试用户1的排盘结果
- **test-integration.js**：测试整个系统的集成
- **test-profile-switching.js**：测试用户切换功能
