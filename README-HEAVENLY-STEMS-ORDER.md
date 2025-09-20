# 紫微斗数天干顺时针排列修复

## 问题描述

紫微斗数排盘系统中，天干的排列顺序应该是顺时针的，而不是逆时针的。同时，地支和宫位的排列应该保持不变。根据紫微斗数的传统规则，天干的排列应该符合"五虎遁"口诀：

> 甲己之年丙作首，乙庚之年戊为头。丙辛必定寻庚起，丁壬壬位顺行流。若问戊癸何方发，甲寅之上好追求。

这个口诀确定了寅宫的天干，然后按照顺时针方向依次给其他地支配上天干。

## 原因分析

在之前的代码中，天干的排列顺序是根据宫位的索引来计算的，而不是根据地支的顺序。这导致天干的排列顺序与紫微斗数的传统规则不符。

```javascript
// 为每个宫位计算天干
palaces.forEach((palace, i) => {
  const offset = (i - yinIndex + 12) % 12; // 相对于寅宫的偏移量
  const stemIndex = (yinStemIndex + offset) % 10;
  palace.heavenlyStem = HEAVENLY_STEMS[stemIndex];
  
  console.log(`📍 第${i+1}宫：${palace.name} - ${palace.heavenlyStem}${palace.branch}`);
});
```

这段代码中，`offset` 是根据宫位的索引 `i` 和寅宫的索引 `yinIndex` 计算的，而不是根据地支的顺序。

## 修复方案

修改 `calculateHeavenlyStems` 函数，使其根据地支的顺序来计算天干，而不是根据宫位的索引。

## 修复步骤

### 修改 `calculateHeavenlyStems` 函数

```javascript
/**
 * 计算十二宫天干（五虎遁）
 * 口诀：甲己之年丙作首，乙庚之年戊为头。丙辛必定寻庚起，丁壬壬位顺行流。若问戊癸何方发，甲寅之上好追求。
 * @param {string} yearStem - 出生年天干
 * @param {Array} palaces - 十二宫数组
 * @returns {Array} - 添加天干后的十二宫数组
 */
function calculateHeavenlyStems(yearStem, palaces) {
  console.log(`🔢 开始计算十二宫天干，年干：${yearStem}`);
  
  // 根据年干确定寅宫天干
  let yinStem = '';
  
  switch(yearStem) {
    case '甲':
    case '己':
      yinStem = '丙'; // 甲己之年丙作首
      break;
    case '乙':
    case '庚':
      yinStem = '戊'; // 乙庚之年戊为头
      break;
    case '丙':
    case '辛':
      yinStem = '庚'; // 丙辛必定寻庚起
      break;
    case '丁':
    case '壬':
      yinStem = '壬'; // 丁壬壬位顺行流
      break;
    case '戊':
    case '癸':
      yinStem = '甲'; // 若问戊癸何方发，甲寅之上好追求
      break;
    default:
      yinStem = '丙'; // 默认值
  }
  
  console.log(`🔍 五虎遁：${yearStem}年 → 寅宫天干为${yinStem}`);
  
  // 找到寅宫在十二宫中的位置
  const yinIndex = palaces.findIndex(palace => palace.branch === '寅');
  
  if (yinIndex === -1) {
    console.error('❌ 未找到寅宫，无法计算十二宫天干');
    return palaces;
  }
  
  // 从寅宫开始，按照天干顺序依次给各宫位配上天干
  const yinStemIndex = HEAVENLY_STEMS.indexOf(yinStem);
  
  if (yinStemIndex === -1) {
    console.error('❌ 无效的寅宫天干:', yinStem);
    return palaces;
  }
  
  // 为每个宫位计算天干 - 顺时针方向
  const branchOrder = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  
  palaces.forEach(palace => {
    // 找到当前宫位的地支在标准顺序中的位置
    const branchIndex = branchOrder.indexOf(palace.branch);
    if (branchIndex === -1) {
      console.error(`❌ 未找到地支 ${palace.branch} 在标准顺序中的位置`);
      return;
    }
    
    // 计算相对于寅宫的偏移量（顺时针方向）
    const offset = (branchIndex - 0 + 12) % 12; // 0是寅在branchOrder中的索引
    
    // 计算天干索引（顺时针方向）
    const stemIndex = (yinStemIndex + offset) % 10;
    palace.heavenlyStem = HEAVENLY_STEMS[stemIndex];
    
    console.log(`📍 ${palace.name} - ${palace.heavenlyStem}${palace.branch}`);
  });
  
  return palaces;
}
```

关键修改是使用 `branchOrder` 数组来确定地支的顺序，然后根据地支在 `branchOrder` 中的位置来计算天干的索引。这样，天干的排列就是按照地支的顺时针顺序来的，而不是按照宫位的索引。

## 测试验证

我们创建了一个测试脚本 `utils/test-heavenly-stems-order.js`，用于验证天干的排列顺序是否是顺时针的，同时地支和宫位的排列不变。测试结果表明：

1. 天干的排列顺序已经修改为顺时针
2. 地支和宫位的排列保持不变（宫位从命宫开始逆时针排列）
3. 命宫和身宫的计算是正确的

网格布局如下：

```
-------------------------
| 辛巳(迁移宫) | 壬午(疾厄宫) | 癸未(财帛宫) | 甲申(子女宫) | 
-------------------------
| 庚辰(交友宫) | 中宫 | 中宫 | 乙酉(夫妻宫) | 
-------------------------
| 己卯(官禄宫) | 中宫 | 中宫 | 丙戌(兄弟宫) | 
-------------------------
| 戊寅(田宅宫) | 己丑(福德宫) | 戊子(父母宫) | 丁亥(命宫) | 
-------------------------
```

可以看到，天干的排列是顺时针的：从寅宫的"戊"开始，顺时针依次是"己"、"庚"、"辛"、"壬"、"癸"、"甲"、"乙"、"丙"、"丁"、"戊"、"己"。

## 结论

通过修改 `calculateHeavenlyStems` 函数，我们成功地将天干的排列顺序从逆时针改为顺时针，同时保持地支和宫位的排列不变。这使得紫微斗数排盘系统更加准确，也更加符合传统的排盘规则。 