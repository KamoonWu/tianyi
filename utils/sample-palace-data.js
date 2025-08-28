// 示例宫位数据，展示字段优化系统效果
// 按照表格要求：字段内容、位置描述、类目名称

const samplePalaceData = {
  // 命宫示例
  mingGong: {
    name: '命宫',
    branch: '寅',
    stars: [
      { name: '紫微', brightness: '庙' },           // 主星（左上角）
      { name: '左辅', brightness: '旺' },          // 辅星（主星下方）
      { name: '禄' },                              // 四化星（右上角）
      { name: '天马' },                            // 杂曜/神煞星（左侧分布）
      { name: '恩光' },                            // 杂曜/神煞星
      { name: '运科' },                            // 运限流曜（右侧）
      { name: '长生' },                            // 长生十二神（底部）
      { name: '1-13' }                             // 年龄区间（底部右侧）
    ]
  },
  
  // 兄弟宫示例
  xiongDiGong: {
    name: '兄弟宫',
    branch: '丑',
    stars: [
      { name: '天机', brightness: '得' },          // 主星
      { name: '右弼', brightness: '平' },          // 辅星
      { name: '权' },                              // 四化星
      { name: '天巫' },                            // 杂曜/神煞星
      { name: '天福' },                            // 杂曜/神煞星
      { name: '运忌' },                            // 运限流曜
      { name: '沐浴' },                            // 长生十二神
      { name: '14-26' }                            // 年龄区间
    ]
  },
  
  // 夫妻宫示例
  fuQiGong: {
    name: '夫妻宫',
    branch: '子',
    stars: [
      { name: '太阳', brightness: '旺' },          // 主星
      { name: '文昌', brightness: '庙' },          // 辅星
      { name: '科' },                              // 四化星
      { name: '空亡' },                            // 杂曜/神煞星
      { name: '年解' },                            // 杂曜/神煞星
      { name: '运禄' },                            // 运限流曜
      { name: '冠带' },                            // 长生十二神
      { name: '27-39' }                            // 年龄区间
    ]
  },
  
  // 子女宫示例
  ziNvGong: {
    name: '子女宫',
    branch: '亥',
    stars: [
      { name: '武曲', brightness: '平' },          // 主星
      { name: '天魁', brightness: '得' },          // 辅星
      { name: '忌' },                              // 四化星
      { name: '天德' },                            // 杂曜/神煞星
      { name: '月德' },                            // 杂曜/神煞星
      { name: '运鸾' },                            // 运限流曜
      { name: '临官' },                            // 长生十二神
      { name: '40-52' }                            // 年龄区间
    ]
  },
  
  // 财帛宫示例
  caiBoGong: {
    name: '财帛宫',
    branch: '戌',
    stars: [
      { name: '天同', brightness: '陷' },          // 主星
      { name: '天钺', brightness: '弱' },          // 辅星
      { name: '天乙' },                            // 杂曜/神煞星
      { name: '太乙' },                            // 杂曜/神煞星
      { name: '帝旺' },                            // 长生十二神
      { name: '53-65' }                            // 年龄区间
    ]
  },
  
  // 疾厄宫示例
  jiEGong: {
    name: '疾厄宫',
    branch: '酉',
    stars: [
      { name: '廉贞', brightness: '闲' },          // 主星
      { name: '禄存', brightness: '平' },          // 辅星
      { name: '衰' },                              // 长生十二神
      { name: '66-78' }                            // 年龄区间
    ]
  },
  
  // 迁移宫示例
  qianYiGong: {
    name: '迁移宫',
    branch: '申',
    stars: [
      { name: '天府', brightness: '旺' },          // 主星
      { name: '擎羊', brightness: '得' },          // 辅星
      { name: '病' },                              // 长生十二神
      { name: '79-91' }                            // 年龄区间
    ]
  },
  
  // 交友宫示例
  jiaoYouGong: {
    name: '交友宫',
    branch: '未',
    stars: [
      { name: '太阴', brightness: '庙' },          // 主星
      { name: '陀罗', brightness: '平' },          // 辅星
      { name: '死' },                              // 长生十二神
      { name: '92-104' }                           // 年龄区间
    ]
  },
  
  // 事业宫示例
  shiYeGong: {
    name: '事业宫',
    branch: '午',
    stars: [
      { name: '贪狼', brightness: '得' },          // 主星
      { name: '火星', brightness: '旺' },          // 辅星
      { name: '墓' },                              // 长生十二神
      { name: '105-117' }                          // 年龄区间
    ]
  },
  
  // 田宅宫示例
  tianZhaiGong: {
    name: '田宅宫',
    branch: '巳',
    stars: [
      { name: '巨门', brightness: '平' },          // 主星
      { name: '铃星', brightness: '得' },          // 辅星
      { name: '绝' },                              // 长生十二神
      { name: '118-130' }                          // 年龄区间
    ]
  },
  
  // 福德宫示例
  fuDeGong: {
    name: '福德宫',
    branch: '辰',
    stars: [
      { name: '天相', brightness: '旺' },          // 主星
      { name: '文曲', brightness: '庙' },          // 辅星
      { name: '胎' },                              // 长生十二神
      { name: '131-143' }                          // 年龄区间
    ]
  },
  
  // 父母宫示例
  fuMuGong: {
    name: '父母宫',
    branch: '卯',
    stars: [
      { name: '天梁', brightness: '得' },          // 主星
      { name: '天马', brightness: '平' },          // 辅星
      { name: '养' },                              // 长生十二神
      { name: '144-156' }                          // 年龄区间
    ]
  }
};

// 流年数据示例
const sampleFlowYearData = {
  currentFlowYear: {
    heavenlyStem: '乙',
    earthlyBranch: '巳',
    year: 2024,
    description: '乙巳年'
  }
};

// 生成完整的排盘数据
function generateSampleChartData() {
  const layoutOrder = [
    'mingGong', 'xiongDiGong', 'fuQiGong', 'ziNvGong',
    'caiBoGong', '', '', 'qianYiGong',
    'jiEGong', '', '', 'jiaoYouGong',
    'shiYeGong', 'tianZhaiGong', 'fuDeGong', 'fuMuGong'
  ];
  
  return layoutOrder.map(key => {
    if (key === '') {
      return { name: '', stars: [], isEmpty: true };
    } else {
      return samplePalaceData[key] || { name: key, stars: [], isEmpty: true };
    }
  });
}

// 导出模块
module.exports = {
  samplePalaceData,
  sampleFlowYearData,
  generateSampleChartData
}; 