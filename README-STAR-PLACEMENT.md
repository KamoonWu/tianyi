# 紫微斗数星曜安放系统

本文档详细说明了紫微斗数排盘系统中五行局、紫微星、十四主星、辅星和四化星的计算方法和实现逻辑。

## 目录

1. [五行局计算](#五行局计算)
2. [紫微星安放](#紫微星安放)
3. [十四主星安放](#十四主星安放)
4. [辅星安放](#辅星安放)
5. [四化星安放](#四化星安放)

## 五行局计算

五行局是紫微斗数排盘的关键步骤，它决定了紫微星的落宫位置，进而影响整个命盘的星曜分布。

### 计算方法

1. **六十纳音表法**：根据命宫的天干地支组合，查询六十纳音表，确定其五行属性。
2. **确定五行局**：根据纳音五行确定五行局：
   - 水 → 水二局
   - 木 → 木三局
   - 金 → 金四局
   - 土 → 土五局
   - 火 → 火六局

### 代码实现

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
  let pattern = '';
  let number = 0;
  
  if (naYin.includes('水')) {
    pattern = '水二局';
    number = 2;
  } else if (naYin.includes('木')) {
    pattern = '木三局';
    number = 3;
  } // ... 其他五行判断
  
  return { name: pattern, number: number, element: pattern.charAt(0), naYin: naYin };
}
```

## 紫微星安放

紫微星是紫微斗数命盘的核心星曜，其位置决定了其他主星的分布。

### 计算方法

1. **确定五行局数**：从五行局获取局数（2、3、4、5或6）。
2. **计算余数**：农历日期除以局数取余数。
3. **查表安星**：根据余数和局数查表确定紫微星落宫：
   - 水二局：1→寅，2→申
   - 木三局：1→寅，2→午，3→戌
   - 金四局：1→巳，2→申，3→亥，4→寅
   - 土五局：1→巳，2→酉，3→丑，4→巳，5→酉
   - 火六局：1→寅，2→午，3→戌，4→寅，5→午，6→戌

### 代码实现

```javascript
function placeZiWeiStar(lunarDay, fiveElements) {
  const patternNumber = fiveElements.number;
  let remainder = lunarDay % patternNumber;
  
  if (remainder === 0) {
    remainder = patternNumber;
  }
  
  // 紫微星安放表
  const ziWeiPlacementTable = {
    2: { 1: '寅', 2: '申' },
    3: { 1: '寅', 2: '午', 3: '戌' },
    // ... 其他局数的安放位置
  };
  
  // 查表获取紫微星位置
  const ziWeiBranch = ziWeiPlacementTable[patternNumber][remainder] || '寅';
  
  return ziWeiBranch;
}
```

## 十四主星安放

十四主星包括紫微、天机、太阳、武曲、天同、廉贞、天府、太阴、贪狼、巨门、天相、天梁、七杀和破军。

### 计算方法

1. **紫微系六星**：紫微、天机、太阳、武曲、天同、廉贞
   - 紫微：由五行局和日期决定
   - 天机：紫微顺行一位
   - 太阳：紫微顺行三位
   - 武曲：紫微顺行四位
   - 天同：紫微顺行五位
   - 廉贞：紫微顺行六位

2. **天府系八星**：天府、太阴、贪狼、巨门、天相、天梁、七杀、破军
   - 天府：紫微对宫（相隔六位）
   - 其余七星：从天府开始逆行安排

3. **星曜亮度**：每颗星在不同地支有不同亮度（庙、旺、得、利、平、闲、陷）

### 代码实现

```javascript
function placeMainStars(ziWeiBranch, palaces) {
  const ziWeiIndex = EARTHLY_BRANCHES.indexOf(ziWeiBranch);
  const mainStarsPositions = {};
  
  // 安紫微系六星
  mainStarsPositions['紫微'] = ziWeiBranch;
  mainStarsPositions['天机'] = EARTHLY_BRANCHES[(ziWeiIndex + 1) % 12];
  // ... 其他紫微系星曜
  
  // 安天府系八星
  const tianFuIndex = (ziWeiIndex + 6) % 12;
  mainStarsPositions['天府'] = EARTHLY_BRANCHES[tianFuIndex];
  
  const tianFuStars = ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];
  for (let i = 1; i < tianFuStars.length; i++) {
    const starIndex = (tianFuIndex - i + 12) % 12;
    mainStarsPositions[tianFuStars[i]] = EARTHLY_BRANCHES[starIndex];
  }
  
  // 星曜亮度表
  const starBrightness = {
    '紫微': { '子': '平', '丑': '平', '寅': '庙', /* ... */ },
    // ... 其他星曜亮度
  };
  
  // 将主星添加到宫位数据
  palaces.forEach(palace => {
    // ... 实现逻辑
  });
  
  return palaces;
}
```

## 辅星安放

辅星包括左辅、右弼、文昌、文曲、天魁、天钺、禄存、天马、擎羊、陀罗、火星、铃星等。

### 计算方法

1. **左辅、右弼**：以寅宫为起点，顺数至生月
   - 左辅：寅宫顺数至生月
   - 右弼：左辅对宫

2. **文昌、文曲**：以卯宫为起点，顺数至生时
   - 文昌：卯宫顺数至生时
   - 文曲：文昌对宫

3. **禄存**：根据年干确定位置
   - 甲年在寅，乙年在卯，丙戊年在巳，丁己年在午，庚年在申，辛年在酉，壬年在子，癸年在丑

4. **天马**：根据年支确定位置
   - 寅午戌年在申，申子辰年在寅，巳酉丑年在亥，亥卯未年在巳

5. **擎羊、陀罗**：根据年干确定位置
   - 具体安放规则见代码实现

6. **地空、地劫**：根据年支确定位置
   - 具体安放规则见代码实现

7. **火星、铃星**：根据月份确定位置
   - 具体安放规则见代码实现

8. **天魁、天钺**：根据年干确定位置
   - 具体安放规则见代码实现

### 代码实现

```javascript
function placeAuxiliaryStars(lunarMonth, birthHourBranch, yearStem, yearBranch, palaces) {
  const auxStarsPositions = {};
  
  // 安左辅、右弼
  const leftRightIndex = (2 + lunarMonth - 1) % 12; // 寅宫索引为2
  auxStarsPositions['左辅'] = EARTHLY_BRANCHES[leftRightIndex];
  auxStarsPositions['右弼'] = EARTHLY_BRANCHES[(leftRightIndex + 6) % 12];
  
  // 安文昌、文曲
  const wenChangIndex = (3 + EARTHLY_BRANCHES.indexOf(birthHourBranch)) % 12;
  auxStarsPositions['文昌'] = EARTHLY_BRANCHES[wenChangIndex];
  auxStarsPositions['文曲'] = EARTHLY_BRANCHES[(wenChangIndex + 6) % 12];
  
  // 安禄存
  const luCunIndex = getLuCunIndex(yearStem);
  auxStarsPositions['禄存'] = EARTHLY_BRANCHES[luCunIndex];
  
  // ... 其他辅星安放逻辑
  
  // 辅星亮度表
  const auxStarBrightness = {
    '左辅': { '子': '平', '丑': '平', '寅': '庙', /* ... */ },
    // ... 其他辅星亮度
  };
  
  // 将辅星添加到宫位数据
  palaces.forEach(palace => {
    // ... 实现逻辑
  });
  
  return palaces;
}
```

## 四化星安放

四化星包括化禄、化权、化科、化忌，它们是对主星的变化，会增强或减弱主星的力量。

### 计算方法

1. **确定四化星**：根据年干确定哪些主星会化为四化星
   - 甲年：廉贞化禄，破军化权，武曲化科，太阳化忌
   - 乙年：天机化禄，天梁化权，紫微化科，太阴化忌
   - 丙年：天同化禄，天机化权，文昌化科，廉贞化忌
   - 丁年：太阴化禄，天同化权，天机化科，巨门化忌
   - 戊年：贪狼化禄，太阴化权，右弼化科，天机化忌
   - 己年：武曲化禄，贪狼化权，天梁化科，文曲化忌
   - 庚年：太阳化禄，武曲化权，太阴化科，天同化忌
   - 辛年：巨门化禄，太阳化权，天同化科，文昌化忌
   - 壬年：天梁化禄，紫微化权，太阳化科，武曲化忌
   - 癸年：破军化禄，巨门化权，贪狼化科，左辅化忌

2. **四化星影响**：
   - 化禄：代表财富、福气、官职
   - 化权：代表权力、地位、能力
   - 化科：代表学业、文凭、才华
   - 化忌：代表阻碍、困难、是非

### 代码实现

```javascript
function placeFourTransformationStars(yearStem, palaces) {
  // 四化星映射表
  const fourTransformationsMap = {
    '甲': { '禄': '廉贞', '权': '破军', '科': '武曲', '忌': '太阳' },
    // ... 其他年干的四化星
  };
  
  // 获取当前年干的四化星
  const fourTransformations = fourTransformationsMap[yearStem];
  
  // 四化星对应的影响和含义
  const fourHuaMeaning = {
    '禄': { description: '代表财富、福气、官职', effect: '增强吉星力量，减轻凶星力量' },
    // ... 其他四化星含义
  };
  
  // 遍历宫位，为含有四化星的主星添加四化信息
  palaces.forEach(palace => {
    // ... 实现逻辑
  });
  
  return palaces;
}
```

## 总结

紫微斗数星曜安放系统是紫微斗数排盘的核心部分，通过精确计算五行局、紫微星位置、十四主星分布、辅星安放和四化星变化，可以构建完整的命盘，为后续的命盘解读提供基础。

本系统实现了传统紫微斗数排盘的核心算法，确保星曜安放的准确性和完整性，为用户提供专业的紫微斗数排盘服务。 