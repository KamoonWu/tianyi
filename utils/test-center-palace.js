// 测试中宫个人信息显示优化

console.log('开始测试中宫个人信息显示优化...');

// 模拟中宫数据
const mockCenterData = {
  name: '张三',
  gender: '男',
  birthDate: '1990-01-01 12:00:00',
  lunarDate: '庚午年十二月初六',
  solarTime: '12:05:30',
  time: '午时',
  lord: '太阳',
  bodyLord: '太阴',
  ziDou: '子',
  fiveElements: '水二局',
  sign: '摩羯座',
  zodiac: '马',
  fourPillars: {
    year: '庚午',
    month: '己丑',
    day: '丁未',
    hour: '丙午'
  }
};

// 模拟Canvas上下文
class MockCanvasContext {
  constructor() {
    this.operations = [];
    this.fillStyle = '';
    this.strokeStyle = '';
    this.lineWidth = 1;
    this.font = '';
    this.textAlign = 'left';
  }

  fillRect(x, y, width, height) {
    this.operations.push({
      type: 'fillRect',
      x, y, width, height,
      style: this.fillStyle
    });
  }

  strokeRect(x, y, width, height) {
    this.operations.push({
      type: 'strokeRect',
      x, y, width, height,
      style: this.strokeStyle,
      lineWidth: this.lineWidth
    });
  }

  fillText(text, x, y) {
    this.operations.push({
      type: 'fillText',
      text, x, y,
      style: this.fillStyle,
      font: this.font,
      align: this.textAlign
    });
  }
}

// 模拟drawCenterPalace函数
function drawCenterPalace(ctx, x, y, width, height, center) {
  try {
    // 绘制中宫背景
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(x, y, width, height);
    
    // 绘制中宫边框
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    // 设置字体大小，根据中宫大小动态调整
    const titleSize = Math.max(12, Math.min(14, width / 18));
    const normalSize = Math.max(8, Math.min(10, width / 25));
    const smallSize = Math.max(7, Math.min(8, width / 30));
    
    // 绘制标题
    ctx.fillStyle = '#1e293b';
    ctx.font = `bold ${titleSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('个人信息', x + width / 2, y + 16);
    
    // 绘制个人信息
    ctx.font = `${normalSize}px sans-serif`;
    ctx.textAlign = 'left';
    
    let lineY = y + 32;
    const lineHeight = normalSize * 1.1;
    
    // 使用两列布局显示更多信息
    const leftColX = x + 10;
    const rightColX = x + width / 2 + 5;
    let leftColY = lineY;
    let rightColY = lineY;
    
    // 左列信息
    // 姓名
    if (center.name && center.name !== '空') {
      ctx.fillText(`姓名: ${center.name}`, leftColX, leftColY);
      leftColY += lineHeight;
    }
    
    // 性别
    if (center.gender && center.gender !== '—' && center.gender !== '未知') {
      ctx.fillText(`性别: ${center.gender}`, leftColX, leftColY);
      leftColY += lineHeight;
    }
    
    // 出生日期
    if (center.birthDate && center.birthDate !== '—' && center.birthDate !== '未知') {
      ctx.fillText(`出生: ${center.birthDate}`, leftColX, leftColY);
      leftColY += lineHeight;
    }
    
    // 农历日期
    if (center.lunarDate && center.lunarDate !== '—' && center.lunarDate !== '未知') {
      ctx.fillText(`农历: ${center.lunarDate}`, leftColX, leftColY);
      leftColY += lineHeight;
    }
    
    // 真太阳时
    if (center.solarTime && center.solarTime !== '—' && center.solarTime !== '未知') {
      ctx.fillText(`真太阳时: ${center.solarTime}`, leftColX, leftColY);
      leftColY += lineHeight;
    }
    
    // 中标时间
    if (center.time && center.time !== '—' && center.time !== '未知') {
      ctx.fillText(`时辰: ${center.time}`, leftColX, leftColY);
      leftColY += lineHeight;
    }
    
    // 命主
    if (center.lord && center.lord !== '—' && center.lord !== '未知') {
      ctx.fillText(`命主: ${center.lord}`, leftColX, leftColY);
      leftColY += lineHeight;
    }
    
    // 右列信息
    // 身主
    if (center.bodyLord && center.bodyLord !== '—' && center.bodyLord !== '未知') {
      ctx.fillText(`身主: ${center.bodyLord}`, rightColX, rightColY);
      rightColY += lineHeight;
    }
    
    // 子斗
    if (center.ziDou && center.ziDou !== '—' && center.ziDou !== '未知') {
      ctx.fillText(`子斗: ${center.ziDou}`, rightColX, rightColY);
      rightColY += lineHeight;
    }
    
    // 五行局
    if (center.fiveElements && center.fiveElements !== '—' && center.fiveElements !== '未知') {
      ctx.fillText(`五行局: ${center.fiveElements}`, rightColX, rightColY);
      rightColY += lineHeight;
    }
    
    // 星座
    if (center.sign && center.sign !== '—' && center.sign !== '未知') {
      ctx.fillText(`星座: ${center.sign}`, rightColX, rightColY);
      rightColY += lineHeight;
    }
    
    // 生肖
    if (center.zodiac && center.zodiac !== '—' && center.zodiac !== '未知') {
      ctx.fillText(`生肖: ${center.zodiac}`, rightColX, rightColY);
      rightColY += lineHeight;
    }
    
    // 四柱 - 使用更紧凑的布局
    if (center.fourPillars) {
      const fp = center.fourPillars;
      let pillarsText = '';
      
      if (fp.year && fp.year !== '—' && fp.year !== '未知') {
        pillarsText += `年:${fp.year} `;
      }
      
      if (fp.month && fp.month !== '—' && fp.month !== '未知') {
        pillarsText += `月:${fp.month} `;
      }
      
      if (pillarsText) {
        ctx.fillText(pillarsText, leftColX, leftColY);
        leftColY += lineHeight;
      }
      
      pillarsText = '';
      
      if (fp.day && fp.day !== '—' && fp.day !== '未知') {
        pillarsText += `日:${fp.day} `;
      }
      
      if (fp.hour && fp.hour !== '—' && fp.hour !== '未知') {
        pillarsText += `时:${fp.hour}`;
      }
      
      if (pillarsText) {
        ctx.fillText(pillarsText, leftColX, leftColY);
        leftColY += lineHeight;
      }
    }
  } catch (error) {
    console.error('绘制中宫出错:', error);
  }
}

// 执行测试
const ctx = new MockCanvasContext();
const x = 100;
const y = 100;
const width = 200;
const height = 200;

drawCenterPalace(ctx, x, y, width, height, mockCenterData);

// 分析结果
console.log('中宫个人信息显示优化测试结果:');

// 统计文本操作
const textOperations = ctx.operations.filter(op => op.type === 'fillText');
console.log(`总共绘制了 ${textOperations.length} 条文本信息`);

// 检查是否包含新增的信息项
const hasSign = textOperations.some(op => op.text.includes('星座'));
const hasZodiac = textOperations.some(op => op.text.includes('生肖'));
const hasFourPillarsCompact = textOperations.some(op => op.text.includes('年:') && op.text.includes('月:'));

console.log(`是否显示星座信息: ${hasSign ? '是' : '否'}`);
console.log(`是否显示生肖信息: ${hasZodiac ? '是' : '否'}`);
console.log(`是否使用紧凑的四柱显示: ${hasFourPillarsCompact ? '是' : '否'}`);

// 检查左右两列布局
const leftColumnTexts = textOperations.filter(op => op.x === x + 10);
const rightColumnTexts = textOperations.filter(op => op.x === x + width / 2 + 5);

console.log(`左列信息数量: ${leftColumnTexts.length}`);
console.log(`右列信息数量: ${rightColumnTexts.length}`);

console.log('中宫个人信息显示优化测试完成!');
console.log('注意: 实际效果需要在微信开发者工具中查看。');

// 输出优化总结
console.log('\n中宫个人信息显示优化内容:');
console.log('1. 采用两列布局，左右分别显示不同信息');
console.log('2. 减小字体大小和行高，以显示更多信息');
console.log('3. 添加星座和生肖信息的显示');
console.log('4. 使用更紧凑的方式显示四柱信息');
console.log('5. 调整标题和提示信息的位置，优化整体布局');