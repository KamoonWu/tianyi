// 宫位字段优化系统
// 按照表格要求：字段内容、位置描述、类目名称

// 星曜分类定义
const STAR_CATEGORIES = {
  main: {
    color: '#1e293b', // 深色
    description: '主星'
  },
  auxiliary: {
    color: '#3b82f6', // 蓝色
    description: '辅星'
  },
  fourHua: {
    color: '#8b5cf6', // 紫色
    description: '四化星'
  },
  flowYear: {
    color: '#f59e0b', // 橙色
    description: '流年标记'
  },
  misc: {
    color: '#10b981', // 绿色
    description: '杂曜/神煞星'
  },
  fortune: {
    color: '#ef4444', // 红色
    description: '运限流曜'
  },
  longevity: {
    color: '#dc2626', // 深红色，更明显
    description: '长生十二神'
  },
  ageRange: {
    color: '#059669', // 深绿色，更明显
    description: '年龄区间'
  },
  palaceName: {
    color: '#1e293b', // 深色
    description: '宫位名称'
  },
  palaceBranch: {
    color: '#1e293b', // 深色
    description: '宫位地支'
  },
  divine: { // 新增神煞分类
    color: '#1e293b',
    description: '神煞'
  },
  brightness: { // 新增星曜亮度分类
    color: '#1e293b',
    description: '星曜亮度'
  },
  heavenlyStemBranch: { // 天干地支
    color: '#1e293b',
    description: '天干地支'
  },
  fortyEightDeities: { // 48神煞
    color: '#7c3aed', // 紫色，区分于其他分类
    description: '48神煞'
  },
  suiQian: { // 新增岁前分类
    color: '#1e293b',
    description: '岁前'
  },
  jiangQian: { // 新增将前分类
    color: '#1e293b',
    description: '将前'
  },
  boShi: { // 新增博士分类
    color: '#1e293b',
    description: '博士'
  }
};

// 宫位字段结构定义
const PALACE_FIELD_STRUCTURE = {
  // 主星：左上角区域
  mainStars: {
    x: 2,           // 从左边距2px开始
    y: 2,           // 从顶部2px开始
    width: 40,      // 可用宽度40px
    height: 40,     // 高度40px
    align: 'left',
    category: 'main',
    layer: 1,
    horizontal: true,    // 水平排列
    verticalText: true,  // 每个字符垂直排列
    maxItems: 3,        // 最多显示3个主星
    lineHeight: 12,     // 垂直间距12px
    columnWidth: 10,     // 单列宽度（字符列）
    columnGap: 2        // 列间距 2px
  },
  
  // 辅星：主星右侧区域
  auxStars: {
    x: 36,          // 从左边距36px开始
    y: 2,           // 从顶部2px开始
    width: 40,      // 可用宽度40px
    height: 40,     // 高度40px
    align: 'left',
    category: 'auxiliary',
    layer: 1,
    horizontal: true,    // 水平排列
    verticalText: true,  // 每个字符垂直排列
    maxItems: 3,        // 最多显示3个辅星
    lineHeight: 12,     // 垂直间距12px
    columnWidth: 10,     // 单列宽度（字符列）
    columnGap: 2        // 列间距 2px
  },
  
  // 杂耀：辅星右侧区域
  miscStars: {
    x: 70,          // 从左边距70px开始
    y: 2,           // 从顶部2px开始
    width: 20,      // 可用宽度20px
    height: 40,     // 高度40px
    align: 'left',
    category: 'misc',
    layer: 1,
    horizontal: false,   // 垂直排列
    verticalText: false, // 水平文字
    maxItems: 3,        // 最多显示3个杂耀
    lineHeight: 10,     // 垂直间距10px
  },

  // 四化标记（右上角）
  fourTransformations: {
    x: 78,
    y: 7,           // 从顶部7px开始
    width: 10,
    height: 12,
    align: 'right',
    category: 'fourTransformations',
    layer: 2
  },

  // 流年（中间左侧）
  flowYear: {
    x: 2,
    y: 29,          // 从顶部29px开始
    width: 20,
    height: 12,
    align: 'left',
    category: 'flowYear',
    layer: 3
  },

  // 小限（中间左侧）
  minorLimit: {
    x: 2,
    y: 41,          // 从顶部41px开始
    width: 20,
    height: 12,
    align: 'left',
    category: 'minorLimit',
    layer: 3
  },

  // 年龄区间（中间左侧）
  ageRange: {
    x: 2,
    y: 53,          // 从顶部53px开始
    width: 20,
    height: 12,
    align: 'left',
    category: 'ageRange',
    layer: 3
  },

  // 长生十二神（中间右侧）
  longevity: {
    x: 78,
    y: 95,          // 放在右下角地支上方2px处
    width: 10,
    height: 12,
    align: 'right',
    category: 'longevity',
    layer: 3,
    anchorBottom: 105 - 2 // 与地支顶部保持 2px 距离
  },

  // 天干地支组合（右下角，垂直排列）
  heavenlyStemBranch: {
    x: 78,
    y: 105,         // 回退用，实际以 anchorBottom 进行底对齐
    width: 10,
    height: 16,
    align: 'right',
    category: 'heavenlyStemBranch',
    layer: 5,
    verticalText: true, // 垂直文字
    // 与宫位底部对齐，留出5px边距
    anchorBottom: 108  // 宫位高度约为114px，留出5px边距
  },

  // 宫位名称（天干地支左边，紧挨着）
  palaceName: {
    x: 66,  // 距离天干地支2px间距
    y: 105,         // 从顶部105px开始
    width: 12,
    height: 16,
    align: 'right',
    category: 'palaceName',
    layer: 5,
    // 与天干地支底部对齐
    anchorBottom: 108  // 与heavenlyStemBranch保持一致
  },

  // 左下角复合堆叠：岁前 → 将前 → 博士（自下而上），底部与宫名底对齐
  leftBottomGods: {
    x: 2,
    y: 81,   // 作为回退参考，不参与锚定计算
    width: 40,
    height: 32,
    align: 'left',
    category: 'leftBottomGods',
    layer: 4,
    // 与天干地支和宫位名称底部对齐
    anchorBottom: 108  // 与heavenlyStemBranch保持一致
  },
  
  // 神煞（中间区域）
  divineStars: {
    x: 2,
    y: 65,
    width: 86,
    height: 16,
    align: 'left',
    category: 'divine',
    layer: 4,
    maxItems: 2,
    lineHeight: 10
  }
};

// 星曜分类函数
function categorizeStars(stars = []) {
  const categories = {
    main: [],      // 14主星
    auxiliary: [], // 14辅星
    misc: [],      // 37杂耀
    fourHua: [],   // 四化星
    fortune: [],   // 运限流曜
    longevity: [], // 长生十二神
    ageRange: [],  // 年龄区间
    divine: [],    // 48神煞
    brightness: [], // 星曜亮度
    suiQian: [],   // 岁前12神
    jiangQian: [], // 将前12神
    boShi: []      // 博士12神
  };
  
  if (!Array.isArray(stars)) return categories;
  
  // 14主星列表
  const mainStars = [
    '紫微', '天机', '太阳', '武曲', '天同', '廉贞', 
    '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'
  ];
  
  // 14辅星列表
  const auxiliaryStars = [
    '左辅', '右弼', '文昌', '文曲', '天魁', '天钺', 
    '禄存', '天马', '擎羊', '陀罗', '火星', '铃星', '地空', '地劫'
  ];
  
  // 37杂耀部分列表
  const miscStars = [
    '天刑', '天姚', '解神', '天巫', '天月', '阴煞', '台辅', '封诰', 
    '天空', '天哭', '天虚', '龙池', '凤阁', '红鸾', '天喜', '孤辰', 
    '寡宿', '蜚廉', '破碎', '天才', '天寿', '天伤', '天使', '天官', 
    '天福', '天厨', '截空', '旬空', '空亡', '天贵', '天钺', '天厄', 
    '天煞', '指背', '咸池', '月煞', '亡神'
  ];
  
  // 四化星列表
  const fourHuaStars = ['禄', '权', '科', '忌'];
  
  // 48神煞部分列表
  const divineStars = [
    '天乙', '太乙', '文昌', '文曲', '华盖', '金舆', '恩光', '天贵', 
    '天德', '月德', '天才', '天寿', '截路', '空亡', '旬空', '劫煞', 
    '灾煞', '天煞', '指背', '咸池', '月煞', '亡神'
  ];
  
  stars.forEach(star => {
    if (!star || !star.name) return;
    
    const name = star.name;
    const brightness = star.brightness || '';
    const type = star.type || '';
    
    // 根据类型优先判断
    if (type === 'main' || mainStars.includes(name)) {
      categories.main.push({ ...star, category: 'main' });
    } 
    else if (type === 'auxiliary' || auxiliaryStars.includes(name)) {
      categories.auxiliary.push({ ...star, category: 'auxiliary' });
    }
    // 四化星判断
    else if (fourHuaStars.includes(name) || name.startsWith('化')) {
      categories.fourHua.push({ ...star, category: 'fourHua' });
    }
    // 运限流曜判断
    else if (['运禄', '运鸾', '运科', '运忌'].includes(name) || name.startsWith('运')) {
      categories.fortune.push({ ...star, category: 'fortune' });
    }
    // 长生十二神判断
    else if (['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'].includes(name)) {
      categories.longevity.push({ ...star, category: 'longevity' });
    }
    // 年龄区间判断
    else if (typeof name === 'string' && /^\d+(-\d+)?$/.test(name)) {
      categories.ageRange.push({ ...star, category: 'ageRange' });
    }
    // 神煞判断
    else if (divineStars.includes(name)) {
      categories.divine.push({ ...star, category: 'divine' });
    }
    // 星曜亮度判断
    else if (brightness && typeof brightness === 'string' && brightness.length > 0) {
      categories.brightness.push({ ...star, category: 'brightness' });
    }
    // 其他归类为杂曜
    else if (miscStars.includes(name) || type === 'misc') {
      categories.misc.push({ ...star, category: 'misc' });
    }
    // 兜底逻辑
    else {
      categories.misc.push({ ...star, category: 'misc' });
    }
  });
  
  return categories;
}

// 格式化流年标记（禁用显示）
function formatFlowYear(flowYearData) {
  return '';
}

// 工具：地支顺序
const ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
function indexOfZhi(zhi) { return Math.max(0, ZHI_ORDER.indexOf(zhi)); }
function zhiDistance(fromZhi, toZhi) {
  const a = indexOfZhi(fromZhi);
  const b = indexOfZhi(toZhi);
  return (b - a + 12) % 12; // 顺行距离
}

// 岁前十二神（按文档顺序）
const SUI_QIAN_SEQUENCE = ['岁建','晦气','丧门','贯索','官符','小耗','大耗','龙德','白虎','天德','吊客','病符'];
// 将前十二神（按文档顺序）
const JIANG_QIAN_SEQUENCE = ['将星','攀鞍','岁驿','息神','华盖','劫煞','灾煞','天煞','指背','咸池','月煞','亡神'];
// 博士十二神（按常见顺序）
const BOSHI_SEQUENCE = ['博士','力士','青龙','小耗','将军','奏书','飞廉','喜神','病符','大耗','伏兵','官府'];

// 计算：给定宫地支与流年地支，返回岁前对应名
function computeSuiQianForPalace(palaceBranch, flowYearBranch) {
  if (!palaceBranch || !flowYearBranch) return '';
  const offset = zhiDistance(flowYearBranch, palaceBranch);
  return SUI_QIAN_SEQUENCE[offset] || '';
}

// 计算：将前起点（将星所在地支）
function getJiangQianStartBranch(flowYearBranch) {
  const group1 = ['寅','午','戌']; // 午
  const group2 = ['申','子','辰']; // 子
  const group3 = ['巳','酉','丑']; // 酉
  const group4 = ['亥','卯','未']; // 卯
  if (group1.includes(flowYearBranch)) return '午';
  if (group2.includes(flowYearBranch)) return '子';
  if (group3.includes(flowYearBranch)) return '酉';
  if (group4.includes(flowYearBranch)) return '卯';
  return flowYearBranch;
}

// 计算：给定宫地支与流年地支，返回将前对应名（以将星起，顺行）
function computeJiangQianForPalace(palaceBranch, flowYearBranch) {
  if (!palaceBranch || !flowYearBranch) return '';
  const start = getJiangQianStartBranch(flowYearBranch);
  const offset = zhiDistance(start, palaceBranch);
  return JIANG_QIAN_SEQUENCE[offset] || '';
}

// 计算：博士十二神（暂以流年地支近似为起点顺行；后续可换为禄存起点）
function computeBoShiForPalace(palaceBranch, flowYearBranch) {
  if (!palaceBranch || !flowYearBranch) return '';
  const offset = zhiDistance(flowYearBranch, palaceBranch);
  return BOSHI_SEQUENCE[offset] || '';
}

// 获取宫位字段数据
function getPalaceFieldData(palace, flowYearData) {
  if (!palace) return {};
  
  // 分类星曜
  const categorized = categorizeStars(palace.stars);
  
  // 处理四化星标记
  const fourHuaFlags = [];
  if (palace.fourHua && Array.isArray(palace.fourHua)) {
    palace.fourHua.forEach(hua => {
      if (hua.type) {
        fourHuaFlags.push(hua.type);
      }
    });
  }
  
  // 获取宫名，优先使用displayName，如果没有则使用name
  // 如果palace.isEmpty为true，则显示"—"
  let palaceName = palace.isEmpty ? '—' : (palace.displayName || palace.name || '');
  
  // 确保宫位名称是动态的，而不是硬编码的
  if (palaceName !== '—') {
    // 如果宫位名称不是"—"，则去掉"宫"字
    palaceName = palaceName.replace(/宫$/, '');
  }

  // 按照优先级排序星曜
  const sortedMainStars = [...categorized.main].sort((a, b) => {
    // 紫微星最高优先级
    if (a.name === '紫微') return -1;
    if (b.name === '紫微') return 1;
    
    // 按照主星顺序排序
    const mainStarOrder = [
      '紫微', '天机', '太阳', '武曲', '天同', '廉贞', 
      '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'
    ];
    return mainStarOrder.indexOf(a.name) - mainStarOrder.indexOf(b.name);
  });
  
  const sortedAuxStars = [...categorized.auxiliary].sort((a, b) => {
    // 按照辅星顺序排序
    const auxStarOrder = [
      '左辅', '右弼', '文昌', '文曲', '天魁', '天钺', 
      '禄存', '天马', '擎羊', '陀罗', '火星', '铃星', '地空', '地劫'
    ];
    return auxStarOrder.indexOf(a.name) - auxStarOrder.indexOf(b.name);
  });
  
  // 格式化星曜亮度显示 - 按照ziwei.pro标准
  const formattedMainStars = sortedMainStars.map(star => {
    // 只显示非"平"亮度
    if (!star.brightness || star.brightness === '平') {
      return {
        ...star,
        displayName: star.name // 不显示亮度
      };
    }
    return {
      ...star,
      displayName: `${star.name}${star.brightness}` // 将亮度附加到名称
    };
  });
  
  const formattedAuxStars = sortedAuxStars.map(star => {
    // 只显示非"平"亮度
    if (!star.brightness || star.brightness === '平') {
      return {
        ...star,
        displayName: star.name // 不显示亮度
      };
    }
    return {
      ...star,
      displayName: `${star.name}${star.brightness}` // 将亮度附加到名称
    };
  });
  
  // 合并星曜，主星在前，辅星其次，杂耀最后（用于兼容旧版展示）
  const allStars = [
    ...formattedMainStars,
    ...formattedAuxStars,
    ...categorized.misc
  ];

  // 调试输出
  console.log(`🔍 宫位字段数据: ${palace.name}(${palace.branch}), 主星: ${formattedMainStars.length}, 辅星: ${formattedAuxStars.length}, 杂耀: ${categorized.misc.length}`);

  return {
    // 所有星曜（兼容旧版）
    allStars: allStars,
    
    // 分类星曜（新版展示）
    mainStars: formattedMainStars,
    auxStars: formattedAuxStars,
    miscStars: categorized.misc,

    // 四化标记
    fourTransformations: fourHuaFlags.length > 0 ? fourHuaFlags : null,

    // 流年信息
    flowYear: formatFlowYear(flowYearData),
    minorLimit: palace.minorLimit || '',
    ageRange: palace.ageRange || '',
    longevity: categorized.longevity,
    heavenlyStemBranch: palace.heavenlyStem && palace.branch ? 
      `${palace.heavenlyStem}${palace.branch}` : (palace.branch || ''),
    palaceName: palaceName,
    leftBottomGods: palace.gods ? palace.gods.map(god => ({ name: god })) : [],
    fourHuaFlags, // 宫级四化
    divineStars: categorized.divine
  };
}

// 绘制宫位字段的辅助函数
function drawPalaceField(ctx, fieldData, fieldConfig, isHighlighted = false) {
  if (!fieldData || !fieldConfig) return;
  
  const { x, y, width, height, align, category, layer, maxItems } = fieldConfig;
  const colors = STAR_CATEGORIES[category]?.color || '#1e293b';
  
  // 设置文本样式 - 高亮状态下保持原有颜色
  ctx.fillStyle = colors; // 始终使用原有颜色，不高亮字体
  ctx.font = '8px sans-serif';
  ctx.textAlign = align;
  ctx.textBaseline = 'top'; // 设置文字基线为顶部，确保文字从指定Y坐标开始绘制
  
  console.log(`🎨 绘制字段: ${category}, 位置: (${x}, ${y}), 对齐: ${align}, 颜色: ${colors}, 层级: ${layer}`);
  
  // 绘制文本
  if (Array.isArray(fieldData)) {
    // 数组类型，绘制多个项目
    const items = fieldData.slice(0, maxItems || 10);
    
    // 针对长生十二神：与天干地支右对齐，自下而上堆叠，竖排两字显示
    if (category === 'longevity') {
      const anchorBottom = Number.isFinite(fieldConfig.anchorBottom) ? fieldConfig.anchorBottom : y + height;
      const fontHeight = 8;
      const lineGap = 12;      // 两字竖排的行距
      const itemGap = 2;       // 多项之间的间距2px
      const totalTwoCharHeight = lineGap + fontHeight; // 2字块总高=20
      const baseX = align === 'right' ? x + width : x;

      let currentBottom = anchorBottom; // 起始对齐到干支上方2px（外部已传入）
      const layout = [];
      items.forEach((raw) => {
        const textAll = (raw?.name ?? raw ?? '').toString();
        const text = textAll.slice(0, 2); // 只取前两字
        const blockHeight = text.length >= 2 ? totalTwoCharHeight : fontHeight;
        const topY = currentBottom - blockHeight;
        layout.push({ text, topY });
        currentBottom = topY - itemGap; // 下一项继续向上，间距2px
      });

      // 绘制：两字竖排（或单字）
      layout.forEach(({ text, topY }) => {
        if (text.length >= 2) {
          ctx.fillText(text[0], baseX, topY);
          ctx.fillText(text[1], baseX, topY + lineGap);
        } else if (text.length === 1) {
          ctx.fillText(text, baseX, topY);
        }
      });
    }
    // 主星、辅星：垂直文字，水平排列
    else if (category === 'main' || category === 'auxiliary') {
      const { columnWidth, columnGap, lineHeight, verticalText, horizontal } = fieldConfig;
      
      let currentX = x;
      let currentY = y;
      let columnCount = 0;
      
      items.forEach((item, index) => {
        // 使用displayName而不是name，确保亮度正确显示
        const text = item.displayName || item.name || '';
        
        if (verticalText) {
          // 垂直绘制文字
          const chars = text.split('');
          let charY = currentY;
          
          chars.forEach(char => {
            ctx.fillText(char, currentX, charY);
            console.log(`  📝 垂直绘制字符: "${char}" 在 (${currentX}, ${charY})`);
            charY += lineHeight;
          });
          
          // 移动到下一列
          if (horizontal) {
            currentX += columnWidth + columnGap;
            columnCount++;
            
            // 如果列数达到上限，换行
            if (columnCount >= 3) {
              currentX = x;
              currentY += 40; // 换到下一行
              columnCount = 0;
            }
          } else {
            currentY += chars.length * lineHeight + columnGap;
          }
        } else {
          // 水平绘制文字
          ctx.fillText(text, currentX, currentY);
          console.log(`  📝 水平绘制文字: "${text}" 在 (${currentX}, ${currentY})`);
          
          // 移动到下一行或列
          if (horizontal) {
            currentX += ctx.measureText(text).width + columnGap;
          } else {
            currentY += lineHeight;
          }
        }
      });
    }
    // 杂耀：水平文字，垂直排列
    else if (category === 'misc') {
      const { lineHeight } = fieldConfig;
      let currentY = y;
      
      items.forEach(item => {
        const text = item.name || '';
        ctx.fillText(text, x, currentY);
        console.log(`  📝 绘制杂耀: "${text}" 在 (${x}, ${currentY})`);
        currentY += lineHeight;
      });
    }
    // 左下角神煞（岁前、将前、博士）
    else if (category === 'leftBottomGods') {
      const anchorBottom = Number.isFinite(fieldConfig.anchorBottom) ? fieldConfig.anchorBottom : y + height;
      const lineHeight = 12;
      const maxLines = 3;
      
      let currentY = anchorBottom - lineHeight * Math.min(items.length, maxLines);
      
      items.slice(0, maxLines).forEach(item => {
        const text = item.name || '';
        ctx.fillText(text, x, currentY);
        console.log(`  📝 绘制神煞: "${text}" 在 (${x}, ${currentY})`);
        currentY += lineHeight;
      });
    }
    // 神煞
    else if (category === 'divine') {
      const { lineHeight, maxItems } = fieldConfig;
      let currentY = y;
      
      items.slice(0, maxItems || 2).forEach(item => {
        const text = item.name || '';
        ctx.fillText(text, x, currentY);
        console.log(`  📝 绘制神煞: "${text}" 在 (${x}, ${currentY})`);
        currentY += lineHeight;
      });
    }
    // 默认数组绘制方式
    else {
      items.forEach((item, index) => {
        const text = item.name || item.toString();
        ctx.fillText(text, x, y + index * 12);
        console.log(`  📝 绘制数组项: "${text}" 在 (${x}, ${y + index * 12})`);
      });
    }
  }
  // 四化标记（右上角）
  else if (category === 'fourTransformations') {
    if (Array.isArray(fieldData) && fieldData.length > 0) {
      // 绘制四化图标
      const icons = {
        '禄': '禄',
        '权': '权',
        '科': '科',
        '忌': '忌'
      };
      
      let currentX = x;
      fieldData.forEach(type => {
        const icon = icons[type] || type;
        ctx.fillStyle = type === '忌' ? '#ef4444' : '#3b82f6'; // 化忌用红色，其他用蓝色
        ctx.fillText(icon, currentX, y);
        console.log(`  📝 绘制四化: "${icon}" 在 (${currentX}, ${y})`);
        currentX -= 10; // 向左移动10px
      });
    }
  }
  // 天干地支（右下角）
  else if (category === 'heavenlyStemBranch') {
    if (typeof fieldData === 'string' && fieldData.length > 0) {
      // 天干地支竖排
      const anchorBottom = Number.isFinite(fieldConfig.anchorBottom) ? fieldConfig.anchorBottom : y + height;
      const chars = fieldData.split('');
      let currentY = anchorBottom - chars.length * 12;
      
      chars.forEach(char => {
        ctx.fillText(char, x, currentY);
        console.log(`  📝 垂直绘制天干地支: "${char}" 在 (${x}, ${currentY})`);
        currentY += 12;
      });
    }
  }
  // 宫位名称（右下角）
  else if (category === 'palaceName') {
    if (typeof fieldData === 'string' && fieldData.length > 0) {
      // 宫位名称底部对齐
      const anchorBottom = Number.isFinite(fieldConfig.anchorBottom) ? fieldConfig.anchorBottom : y + height;
      const baseY = anchorBottom - 5; // 底部留出5px间距
      
      ctx.fillText(fieldData, x + width, baseY);
      console.log(`  📝 底部对齐绘制字符串: "${fieldData}" 在 (${x + width}, ${baseY})`);
    }
  }
  // 字符串类型，直接绘制
  else if (typeof fieldData === 'string' && fieldData.length > 0) {
    ctx.fillText(fieldData, x, y);
    console.log(`  📝 绘制字符串: "${fieldData}" 在 (${x}, ${y})`);
  }
  // 对象类型，尝试获取name属性
  else if (typeof fieldData === 'object' && fieldData !== null && fieldData.name) {
    ctx.fillText(fieldData.name, x, y);
    console.log(`  📝 绘制对象名称: "${fieldData.name}" 在 (${x}, ${y})`);
  }
  
  console.log(`✅ 字段 ${category} 绘制完成`);
}

// 导出模块
module.exports = {
  STAR_CATEGORIES,
  PALACE_FIELD_STRUCTURE,
  categorizeStars,
  formatFlowYear,
  getPalaceFieldData,
  drawPalaceField
}; 