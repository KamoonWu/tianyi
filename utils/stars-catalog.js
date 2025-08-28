// 参考资料：星曜分类，详见：https://ziwei.pro/learn/star.html
// 14主星
const MAIN_STARS = new Set(['紫微','天机','太阳','武曲','天同','廉贞','天府','太阴','贪狼','巨门','天相','天梁','七杀','破军']);

// 辅星（六吉六煞等）
const AUX_STARS = new Set(['左辅','右弼','文昌','文曲','天魁','天钺','禄存','擎羊','陀罗','火星','铃星','地空','地劫']);

// 杂曜（37杂曜）
const MISC_STARS = new Set([
  '天马','红鸾','天喜','天刑','天姚','咸池','天德','月德','解神','天巫','天月','天厨','天才','天寿',
  '天官','天福','天哭','天虚','天使','天伤','天贵','龙德','天煞','华盖','孤辰','寡宿',
  '蜚廉','破碎','小耗','大耗','岁建','岁驿','息神','喜神','病符','死符','攀鞍'
]);

// 神煞（48神煞）- 移除与辅星和杂曜重复的
const SHENSHA_STARS = new Set([
  '青龙','白虎','朱雀','玄武','勾陈','螣蛇','天乙','太乙'
]);

// 四化星
const FOUR_HUA_STARS = new Set(['化禄','化权','化科','化忌']);

// 运限星
const FORTUNE_STARS = new Set(['运曲','运陀','运马','年解','月解','日解','时解']);

function classifyStars(names = []) {
  const result = { 
    main: [],      // 主星
    aux: [],       // 辅星
    misc: [],      // 杂曜
    shensha: [],   // 神煞
    fourHua: [],   // 四化
    fortune: [],   // 运限
    other: []      // 其他
  };
  
  (names || []).forEach((name) => {
    const n = String(name || '').trim();
    if (!n) return;
    
    if (MAIN_STARS.has(n)) {
      result.main.push(n);
    } else if (AUX_STARS.has(n)) {
      result.aux.push(n);
    } else if (MISC_STARS.has(n)) {
      result.misc.push(n);
    } else if (SHENSHA_STARS.has(n)) {
      result.shensha.push(n);
    } else if (FOUR_HUA_STARS.has(n)) {
      result.fourHua.push(n);
    } else if (FORTUNE_STARS.has(n)) {
      result.fortune.push(n);
    } else {
      result.other.push(n);
    }
  });
  
  return result;
}

module.exports = { MAIN_STARS, AUX_STARS, MISC_STARS, SHENSHA_STARS, classifyStars };

