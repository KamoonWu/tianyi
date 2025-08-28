// 测试当前的三方四正计算逻辑
console.log('=== 测试当前的三方四正计算逻辑 ===');

console.log('🧪 当前4x4网格布局');
console.log('索引: 0  1  2  3');
console.log('      4  5  6  7');
console.log('      8  9  10 11');
console.log('      12 13 14 15');
console.log('');
console.log('宫位: 命宫 兄弟宫 夫妻宫 子女宫');
console.log('      财帛宫 [中宫] [中宫] 迁移宫');
console.log('      疾厄宫 [中宫] [中宫] 交友宫');
console.log('      事业宫 田宅宫 福德宫 父母宫');

console.log('\n🧪 当前对宫关系');
console.log('✅ 命宫(0) ↔ 迁移宫(6)');
console.log('✅ 兄弟宫(1) ↔ 交友宫(11)');
console.log('✅ 夫妻宫(2) ↔ 疾厄宫(8)');
console.log('✅ 子女宫(3) ↔ 田宅宫(13)');
console.log('✅ 财帛宫(4) ↔ 福德宫(14)');
console.log('✅ 交友宫(7) ↔ 父母宫(15)');
console.log('✅ 事业宫(12) ↔ 子女宫(3)');

console.log('\n🧪 当前三合关系');
console.log('✅ 命宫(0)：财帛宫(4)、事业宫(12)');
console.log('✅ 兄弟宫(1)：交友宫(7)、父母宫(15)');
console.log('✅ 夫妻宫(2)：疾厄宫(8)、福德宫(14)');
console.log('✅ 子女宫(3)：迁移宫(6)、田宅宫(13)');
console.log('✅ 财帛宫(4)：命宫(0)、事业宫(12)');
console.log('✅ 迁移宫(6)：子女宫(3)、田宅宫(13)');
console.log('✅ 交友宫(7)：兄弟宫(1)、父母宫(15)');
console.log('✅ 疾厄宫(8)：夫妻宫(2)、福德宫(14)');
console.log('✅ 事业宫(12)：命宫(0)、财帛宫(4)');
console.log('✅ 田宅宫(13)：子女宫(3)、迁移宫(6)');
console.log('✅ 福德宫(14)：夫妻宫(2)、疾厄宫(8)');
console.log('✅ 父母宫(15)：兄弟宫(1)、交友宫(7)');

console.log('\n🧪 测试案例：点击测试12（事业宫）');
console.log('🔍 本宫：事业宫(12)');
console.log('🔍 对宫：子女宫(3)');
console.log('🔍 三合：命宫(0)、财帛宫(4)');
console.log('🔍 左宫：田宅宫(13)');
console.log('🔍 右宫：交友宫(11)');
console.log('🔍 预期高亮：[12, 3, 0, 4, 13, 11]');

console.log('\n🧪 问题分析');
console.log('❌ 用户反馈：点击测试12时，8、13都亮了');
console.log('❌ 预期应该是：本宫和测试13、1、11');
console.log('🔍 需要重新检查三方四正的计算逻辑');

console.log('\n🧪 可能的问题');
console.log('1. 对宫关系计算错误');
console.log('2. 三合关系定义错误');
console.log('3. 左右宫计算错误');
console.log('4. 宫位索引映射错误');

console.log('\n🧪 建议的修复方向');
console.log('1. 重新验证对宫关系');
console.log('2. 重新定义三合关系');
console.log('3. 简化计算逻辑');
console.log('4. 添加更多调试信息');

console.log('\n🎉 当前三方四正计算逻辑测试完成！');

console.log('\n下一步：');
console.log('1. 分析用户反馈的具体问题');
console.log('2. 重新设计三方四正计算逻辑');
console.log('3. 验证修复后的效果');
console.log('4. 确保高亮宫位完全正确'); 