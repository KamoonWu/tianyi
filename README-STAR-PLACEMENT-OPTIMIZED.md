# 紫微斗数星曜安放系统优化

本文档详细说明了紫微斗数排盘系统中星曜安放系统的优化内容，包括五行局计算、紫微星安放、十四主星安放、辅星安放和四化星安放的改进。

## 目录

1. [五行局计算](#五行局计算)
2. [紫微星安放](#紫微星安放)
3. [十四主星安放](#十四主星安放)
4. [辅星安放](#辅星安放)
5. [四化星安放](#四化星安放)
6. [星曜亮度](#星曜亮度)

## 五行局计算

五行局是紫微斗数排盘的关键步骤，它决定了紫微星的落宫位置，进而影响整个命盘的星曜分布。

### 优化内容

1. **纳音表实现**：使用完整的六十纳音表计算五行局，更加准确可靠。
2. **纳音五行映射**：根据命宫天干地支组合的纳音五行确定五行局。
3. **兜底逻辑**：当纳音无法确定时，使用简化版五行局判断作为兜底。

### 实现代码

```javascript
function calculateFiveElementsPattern(mingGongStem, mingGongBranch) {
  // 使用六十纳音表计算五行局
  const naYinMap = {
    '甲子': '海中金', '乙丑': '海中金',
    '丙寅': '炉中火', '丁卯': '炉中火',
    // ... 其他纳音组合
  };
  
  // 获取命宫干支组合的纳音
  const stemBranchCombo = `${mingGongStem}${mingGongBranch}`;
  const naYin = naYinMap[stemBranchCombo] || '';
  
  // 根据纳音确定五行局
  if (naYin.includes('水')) {
    return { name: '水二局', number: 2, element: '水', naYin: naYin };
  } else if (naYin.includes('木')) {
    return { name: '木三局', number: 3, element: '木', naYin: naYin };
  } // ... 其他五行判断
}
```

## 紫微星安放

紫微星是紫微斗数命盘的核心星曜，其位置决定了其他主星的分布。

### 优化内容

1. **精确查表法**：使用精确的紫微星安放表，确保紫微星位置的准确性。
2. **口诀实现**：根据"二局寅申，三局寅午戌，四局巳申亥寅，五局巳酉丑巳酉，六局寅午戌寅午戌"口诀实现。
3. **详细日志**：输出详细的计算过程，便于验证和调试。

### 实现代码

```javascript
function placeZiWeiStar(lunarDay, fiveElements) {
  // 计算紫微星落宫位置
  const patternNumber = fiveElements.number;
  let remainder = lunarDay % patternNumber || patternNumber;
  
  // 精确的紫微星安放表
  const ziWeiPlacementTable = {
    2: { 1: '寅', 2: '申' }, // 水二局
    3: { 1: '寅', 2: '午', 3: '戌' }, // 木三局
    // ... 其他局数的安放位置
  };
  
  // 查表获取紫微星位置
  return ziWeiPlacementTable[patternNumber][remainder] || '寅';
}
```

## 十四主星安放

十四主星是紫微斗数命盘的核心星曜，包括紫微、天机、太阳、武曲、天同、廉贞、天府、太阴、贪狼、巨门、天相、天梁、七杀、破军。

### 优化内容

1. **口诀实现**：严格按照"紫微天机星逆行，隔一阳武天同行"等口诀实现。
2. **天机星修正**：修正天机星的位置，从紫微顺行一位改为紫微逆行一位。
3. **天府系星曜**：明确天府与廉贞同宫，并从天府开始逆行安排其他七颗星。
4. **星曜亮度**：为每颗主星建立完整的亮度表，根据所在地支确定亮度。

### 实现代码

```javascript
function placeMainStars(ziWeiBranch, palaces) {
  // 紫微系六星
  mainStarsPositions['紫微'] = ziWeiBranch;
  
  // 天机星（紫微逆行一位）
  const tianJiIndex = (ziWeiIndex - 1 + 12) % 12;
  mainStarsPositions['天机'] = EARTHLY_BRANCHES[tianJiIndex];
  
  // 太阳星（紫微顺行三位）
  const taiYangIndex = (ziWeiIndex + 3) % 12;
  mainStarsPositions['太阳'] = EARTHLY_BRANCHES[taiYangIndex];
  
  // ... 其他主星安放
  
  // 星曜亮度表
  const starBrightness = {
    '紫微': { '子': '平', '丑': '平', '寅': '庙', /* ... */ },
    // ... 其他星曜亮度
  };
}
```

## 辅星安放

辅星是紫微斗数命盘中辅助解读的重要星曜，包括左辅、右弼、文昌、文曲等。

### 优化内容

1. **口诀实现**：严格按照各辅星的安放口诀实现。
2. **左辅右弼**：从寅宫开始，顺数到生月，安左辅；其对宫安右弼。
3. **文昌文曲**：从卯宫开始，顺数到生时，安文昌；其对宫安文曲。
4. **火星铃星**：根据月支确定火星铃星位置，而不是简单的月数。
5. **辅星亮度**：为每颗辅星建立完整的亮度表，根据所在地支确定亮度。

### 实现代码

```javascript
function placeAuxiliaryStars(lunarMonth, birthHourBranch, yearStem, yearBranch, palaces) {
  // 左辅、右弼
  const leftRightIndex = (2 + lunarMonth - 1) % 12; // 寅宫索引为2
  auxStarsPositions['左辅'] = EARTHLY_BRANCHES[leftRightIndex];
  auxStarsPositions['右弼'] = EARTHLY_BRANCHES[(leftRightIndex + 6) % 12];
  
  // 文昌、文曲
  const hourOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const hourPosition = hourOrder.indexOf(birthHourBranch);
  const wenChangIndex = (3 + hourPosition) % 12; // 卯宫索引为3
  auxStarsPositions['文昌'] = EARTHLY_BRANCHES[wenChangIndex];
  auxStarsPositions['文曲'] = EARTHLY_BRANCHES[(wenChangIndex + 6) % 12];
  
  // ... 其他辅星安放
}
```

## 四化星安放

四化星是紫微斗数命盘中的重要变化力量，包括化禄、化权、化科、化忌。

### 优化内容

1. **口诀实现**：严格按照"甲廉破武阳，乙机梁紫阴..."等口诀实现。
2. **口诀解释**：添加四化星口诀的详细解释，便于理解和验证。
3. **四化星影响**：为每种四化星添加含义和影响描述。
4. **详细日志**：输出四化星分布总结，便于验证和调试。

### 实现代码

```javascript
function placeFourTransformationStars(yearStem, palaces) {
  // 四化星映射表
  const fourTransformationsMap = {
    '甲': { '禄': '廉贞', '权': '破军', '科': '武曲', '忌': '太阳' },
    // ... 其他年干的四化星
  };
  
  // 四化星口诀解释
  const fourHuaExplanation = {
    '甲': '甲廉破武阳 - 甲年生，廉贞化禄，破军化权，武曲化科，太阳化忌',
    // ... 其他年干的口诀解释
  };
  
  // 四化星对应的影响和含义
  const fourHuaMeaning = {
    '禄': { description: '代表财富、福气、官职', effect: '增强吉星力量，减轻凶星力量' },
    // ... 其他四化星的含义
  };
}
```

## 星曜亮度

星曜亮度是紫微斗数命盘中的重要概念，反映了星曜在不同地支的力量强弱。

### 优化内容

1. **完整亮度表**：为每颗主星和辅星建立完整的亮度表。
2. **七种亮度**：支持庙、旺、得、利、平、闲、陷七种亮度状态。
3. **亮度显示**：在星曜名称后显示非"平"亮度，便于直观了解星曜力量。

### 实现代码

```javascript
// 星曜亮度表（庙、旺、得、利、平、闲、陷）
const starBrightness = {
  '紫微': { '子': '平', '丑': '平', '寅': '庙', '卯': '庙', '辰': '闲', '巳': '旺', '午': '旺', '未': '闲', '申': '陷', '酉': '陷', '戌': '得', '亥': '得' },
  // ... 其他星曜亮度
};

// 格式化星曜亮度显示
const formattedStars = stars.map(star => {
  if (!star.brightness || star.brightness === '平') {
    return star; // 平亮度不显示
  }
  return {
    ...star,
    name: `${star.name}${star.brightness}` // 将亮度附加到名称
  };
});
```

## 总结

通过以上优化，紫微斗数星曜安放系统更加准确和完善，严格遵循传统紫微斗数的安星口诀和规则，为用户提供更专业的紫微斗数排盘服务。主要改进包括：

1. **严格遵循口诀**：所有星曜安放都严格按照传统口诀实现。
2. **修正错误**：修正了天机星位置等错误，确保星曜位置的准确性。
3. **完善亮度系统**：为每颗星曜建立完整的亮度表，反映星曜力量的强弱。
4. **详细日志**：输出详细的计算过程和结果，便于验证和调试。
5. **兜底逻辑**：添加兜底逻辑，确保系统的稳定性和可靠性。

这些优化使紫微斗数排盘系统更加符合传统理论，也更加直观易读，为用户提供更专业的紫微斗数排盘服务。 