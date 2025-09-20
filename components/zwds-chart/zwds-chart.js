// 导入字段优化系统模块
const { getPalaceFieldData, drawPalaceField, PALACE_FIELD_STRUCTURE } = require('../../utils/palace-field-optimization.js');

// 地支顺序（十二地支）
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

Component({
  properties: {
    palaces: {
      type: Array,
      value: [],
      observer: function(newVal) {
        console.log('🔄 宫位数据更新:', newVal ? newVal.length : 0);
        if (newVal && newVal.length > 0) {
          this.setData({
            _layoutData: this.orderPalacesForLayout(newVal)
          });
        } else {
          console.log('⚠️ 宫位数据为空，使用空布局');
          this.setData({
            _layoutData: this.getEmptyLayout()
          });
        }
      }
    },
    center: {
      type: Object,
      value: {},
      observer: function(newVal) {
        console.log('🔄 中宫信息更新:', newVal);
        if (newVal && Object.keys(newVal).length > 0) {
          // 检查八字相关字段是否存在
          console.log('🔄 八字信息检查:', {
            bazi: newVal.bazi,
            yearPillar: newVal.yearPillar,
            monthPillar: newVal.monthPillar,
            dayPillar: newVal.dayPillar,
            hourPillar: newVal.hourPillar
          });
          
          // 确保八字相关字段存在，如果不存在，尝试从bazi字段中提取
          if (newVal.bazi && (!newVal.yearPillar || !newVal.monthPillar || !newVal.dayPillar || !newVal.hourPillar)) {
            console.log('🔄 尝试从bazi字段中提取八字信息');
            
            // 如果bazi字段存在，但单独的柱子字段不存在，尝试解析
            const baziParts = newVal.bazi.split(' ');
            const extractedData = {};
            
            baziParts.forEach(part => {
              if (part.includes('年柱')) {
                extractedData.yearPillar = part.replace('年柱', '');
              } else if (part.includes('月柱')) {
                extractedData.monthPillar = part.replace('月柱', '');
              } else if (part.includes('日柱')) {
                extractedData.dayPillar = part.replace('日柱', '');
              } else if (part.includes('时柱')) {
                extractedData.hourPillar = part.replace('时柱', '');
              }
            });
            
            // 合并提取的数据
            newVal = {
              ...newVal,
              ...extractedData
            };
            
            console.log('🔄 提取后的八字信息:', {
              yearPillar: newVal.yearPillar,
              monthPillar: newVal.monthPillar,
              dayPillar: newVal.dayPillar,
              hourPillar: newVal.hourPillar
            });
          }
          
          this.setData({
            _centerInfo: newVal
          });
          // 当中宫信息更新时，重绘图表
          this.drawChart();
        }
      }
    },
    fortune: {
      type: Object,
      value: {
        currentFlowYear: {
          heavenlyStem: '乙',
          earthlyBranch: '巳',
          year: 2024
        }
      }
    },
    // 高亮宫位索引
    highlightIndices: {
      type: Array,
      value: []
    },
    // 当前选中宫位索引
    selectedIndex: {
      type: Number,
      value: -1
    }
  },

  data: {
    _layoutData: [], // 布局后的宫位数据
    _cells: [], // 宫位单元格数据
    _centerInfo: {}, // 中宫信息
    canvasWidth: 0,
    canvasHeight: 0,
    devicePixelRatio: 1
  },

  lifetimes: {
    attached() {
      console.log('🔌 排盘组件已附加');
    },
    ready() {
      console.log('✅ 排盘组件已准备就绪');
      
      // 确保初始化时也能正确处理中宫信息
      if (this.data.center && Object.keys(this.data.center).length > 0) {
        // 检查八字相关字段是否存在
        const center = this.data.center;
        console.log('✅ 初始化时八字信息检查:', {
          bazi: center.bazi,
          yearPillar: center.yearPillar,
          monthPillar: center.monthPillar,
          dayPillar: center.dayPillar,
          hourPillar: center.hourPillar
        });
        
        // 如果需要，从bazi字段中提取八字信息
        let updatedCenter = {...center};
        if (center.bazi && (!center.yearPillar || !center.monthPillar || !center.dayPillar || !center.hourPillar)) {
          console.log('✅ 初始化时尝试从bazi字段中提取八字信息');
          
          const baziParts = center.bazi.split(' ');
          baziParts.forEach(part => {
            if (part.includes('年柱')) {
              updatedCenter.yearPillar = part.replace('年柱', '');
            } else if (part.includes('月柱')) {
              updatedCenter.monthPillar = part.replace('月柱', '');
            } else if (part.includes('日柱')) {
              updatedCenter.dayPillar = part.replace('日柱', '');
            } else if (part.includes('时柱')) {
              updatedCenter.hourPillar = part.replace('时柱', '');
            }
          });
          
          console.log('✅ 初始化时提取后的八字信息:', {
            yearPillar: updatedCenter.yearPillar,
            monthPillar: updatedCenter.monthPillar,
            dayPillar: updatedCenter.dayPillar,
            hourPillar: updatedCenter.hourPillar
          });
        }
        
        this.setData({
          _centerInfo: updatedCenter
        });
      }
      
      this.drawChart();
    },
    detached() {
      console.log('�� 排盘组件已分离');
    }
  },

  methods: {
    // 宫位点击事件
    onTap(e) {
      console.log('🎯 宫位点击事件触发');
      
      // 获取点击坐标
      const query = this.createSelectorQuery();
      query.select('#zwdsCanvas').boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          const canvasRect = res[0];
          const x = e.detail.x - canvasRect.left;
          const y = e.detail.y - canvasRect.top;
          
          console.log('🎯 点击坐标:', { x, y });
          console.log('🎯 画布位置:', canvasRect);
          
          // 找到点击的宫位
          const clickedPalaceIndex = this.findClickedPalace(x, y);
          if (clickedPalaceIndex !== -1) {
            const currentHighlighted = this.data.highlightedPalaces;
            
            // 如果点击的是已经高亮的宫位，则清除高亮
            if (currentHighlighted.includes(clickedPalaceIndex)) {
              this.setData({
                highlightedPalaces: []
              }, () => {
                console.log('🔍 点击原宫，清除高亮完成');
                this.drawChart(); // 重绘Canvas
              });
            } else {
              // 否则设置新的高亮
              const { threeSides, fourZheng } = this.getThreeSidesFourZheng(clickedPalaceIndex);
              const allHighlighted = [clickedPalaceIndex, ...threeSides, ...fourZheng];
              
              this.setData({
                highlightedPalaces: allHighlighted
              }, () => {
                console.log('🔍 点击宫位:', clickedPalaceIndex);
                console.log('🔍 三方四正:', { threeSides, fourZheng });
                console.log('🔍 高亮宫位:', allHighlighted);
                this.drawChart(); // 重绘Canvas
              });
            }
            
            // 触发事件
            this.triggerEvent('palaceClick', {
              palaceIndex: clickedPalaceIndex,
              palace: this.getPalaceData(clickedPalaceIndex)
            });
          }
        }
      });
    },

    normalizePalaceName(name) {
      const n = String(name || '').replace(/宫$/, '');
      const map = {
        '命': '命宫',
        '兄弟': '兄弟宫',
        '夫妻': '夫妻宫',
        '子女': '子女宫',
        '财帛': '财帛宫',
        '疾厄': '疾厄宫',
        '迁移': '迁移宫',
        '交友': '交友宫',
        '事业': '事业宫',
        '官禄': '事业宫',
        '田宅': '田宅宫',
        '福德': '福德宫',
        '父母': '父母宫'
      };
      for (const k of Object.keys(map)) {
        if (n.indexOf(k) !== -1) return map[k];
      }
      return name || '';
    },

    // 将宫位数据转换为布局格式
    orderPalacesForLayout(list) {
      console.log('排盘组件接收到的宫位数据:', list);
      
      // 检查是否为空数据（无数据或长度为0的数组）
      const isEmptyData = !list || list.length === 0 || list.every(p => p.isEmpty);
      console.log('是否为空数据:', isEmptyData);
      
      if (isEmptyData) {
        // 如果是空数据，返回固定布局的空宫位
        return this.getEmptyLayout();
      }
      
      // 直接使用后端返回的网格布局数据
      // 只需要确保每个宫位数据包含所有必要字段
      const result = list.map(palace => {
        if (!palace) {
          // 如果某个位置没有数据，创建一个空宫位
          return { 
            name: '—', 
            branch: '—',
            stars: [], 
            gods: [],
            heavenlyStem: '',
            isEmpty: true 
          };
        }
        
        // 如果palace.isEmpty为true，确保name和branch显示为"—"
        if (palace.isEmpty) {
          return {
            ...palace,
            name: '—',
            branch: '—',
            stars: [],
            gods: [],
            heavenlyStem: '',
            isEmpty: true
          };
        }
        
        // 使用displayName作为前端显示的宫名，如果没有则使用name
        const displayName = palace.displayName || palace.name;
        
        // 确保星曜数组存在
        const stars = Array.isArray(palace.stars) ? palace.stars : [];
        
        // 调试输出
        console.log(`🔍 处理宫位数据: ${displayName}(${palace.branch}), 星曜数量: ${stars.length}`);
        
        return {
          ...palace,
          name: displayName, // 使用displayName作为前端显示的宫名
          stars: stars,
          gods: palace.gods || [],
          heavenlyStem: palace.heavenlyStem || '',
          isEmpty: palace.isEmpty || false,
          // 确保有branchIndex字段
          branchIndex: palace.branchIndex !== undefined ? palace.branchIndex : 
            EARTHLY_BRANCHES.indexOf(palace.branch)
        };
      });
      
      console.log('布局后的宫位数据:', result);
      return result;
    },
    
    // 获取空布局
    getEmptyLayout() {
      // 紫微斗数标准十二宫布局（4x4网格，中间4格合并，周围12格按顺时针排列）：
      // 顶行：命宫 | 父母宫 | 福德宫 | 田宅宫
      // 中行：兄弟宫 | [中宫合并区域] | 官禄宫
      // 中行：夫妻宫 | [用户信息] | 交友宫  
      // 底行：子女宫 | 财帛宫 | 疾厄宫 | 迁移宫
      
      // 创建一个16位置的数组，用于存放空布局数据
      const emptyLayout = new Array(16);
      
      // 中宫位置
      emptyLayout[5] = { name: '', stars: '', isEmpty: true, isCenter: true };
      emptyLayout[6] = { name: '', stars: '', isEmpty: true, isCenter: true };
      emptyLayout[9] = { name: '', stars: '', isEmpty: true, isCenter: true };
      emptyLayout[10] = { name: '', stars: '', isEmpty: true, isCenter: true };
      
      // 宫位位置
      const palacePositions = [0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15];
      
      // 填充宫位
      palacePositions.forEach(index => {
        emptyLayout[index] = { 
          name: '—', 
          branch: '—',
          stars: [], 
          gods: [],
          heavenlyStem: '',
          isEmpty: true 
        };
      });
      
      return emptyLayout;
    },

    drawChart() {
      console.log('🎨 排盘组件开始绘制...');
      console.log('🎨 当前组件数据:', {
        layoutData: this.data._layoutData,
        center: this.data.center,
        centerInfo: this.data._centerInfo,
        fortune: this.data.fortune
      });
      
      // 确保中宫信息已经更新
      if (this.data.center && Object.keys(this.data.center).length > 0 && !this.data._centerInfo) {
        this.setData({
          _centerInfo: this.data.center
        });
      }
      
      if (!this.data._layoutData || this.data._layoutData.length === 0) {
        console.warn('⚠️ 无宫位数据可绘制，使用空布局');
        this.setData({
          _layoutData: this.getEmptyLayout()
        });
      }
      
      const query = this.createSelectorQuery();
      query.select('#zwdsCanvas').fields({ node: true, size: true }).exec((res) => {
        const { node, width, height } = res[0] || {};
        if (!node) {
          console.error('未找到canvas节点');
          return;
        }
        console.log('Canvas节点信息:', { node, width, height });
        
        const ctx = node.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio || 1;
        node.width = width * dpr;
        node.height = height * dpr;
        ctx.scale(dpr, dpr);

        // 背景
        // ctx.fillStyle = '#ffffff';
        // ctx.fillRect(0, 0, width, height);

        // 绘制 16 宫网格（4x4）
        const cols = 4;
        const rows = 4;
        const padding = 6;
        const gap = 0; // 宫格之间不留边距
        const cellW = (width - padding * 2 - gap * (cols - 1));
        const cellH = (height - padding * 2 - gap * (rows - 1));
        const w = cellW / cols;
        // 确保宫位高度至少为114px，以适配宫位名称位置
        const minHeight = 114;
        const calculatedH = cellH / rows;
        const h = Math.max(calculatedH, minHeight);
        
        this.setData({
          canvasWidth: width,
          canvasHeight: height,
          devicePixelRatio: dpr
        });

        // 存储宫位单元格信息
        const cells = [];

        // 绘制宫位
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            const x = padding + col * w;
            const y = padding + row * h;
            
            // 跳过中宫位置
            if ((row === 1 || row === 2) && (col === 1 || col === 2)) {
              cells.push({
                x, y, w, h,
                index,
                skip: true,
                isCenter: true
              });
              continue;
            }
            
            // 绘制宫位边框
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h);
            
            // 存储宫位信息
            cells.push({
              x, y, w, h,
              index,
              skip: false,
              isCenter: false
            });
          }
        }
        
        this.setData({
          _cells: cells
        });
        
        // 绘制中宫
        this.drawCenterArea(ctx, padding + w, padding + h, w * 2, h * 2);
        
        // 绘制宫位内容
        this.drawPalaceContents(ctx);
      });
    },

    // 回退绘制方法（当字段优化系统失败时使用）
    drawPalaceContentFallback(ctx, cell, x, y, w, h, isHighlighted) {
      // 绘制宫位名称
      const palaceName = cell.name || `宫位`;
      ctx.fillStyle = isHighlighted ? '#b8860b' : '#1e293b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(palaceName, x + w / 2, y + 20);
      
      // 绘制宫位地支
      if (cell.branch && cell.branch !== '中') {
        ctx.fillStyle = isHighlighted ? '#b8860b' : '#64748b';
        ctx.font = '10px sans-serif';
        ctx.fillText(cell.branch, x + w / 2, y + 35);
      }
      
      // 绘制星曜信息
      if (cell.stars && cell.stars.length > 0) {
        let starY = y + 50;
        const maxStars = Math.floor((h - 60) / 16);
        
        for (let j = 0; j < Math.min(cell.stars.length, maxStars); j++) {
          const star = cell.stars[j];
          if (!star) continue;
          
          ctx.fillStyle = star.color || '#1e293b';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(star.name, x + 8, starY);
          
          if (star.brightness) {
            ctx.fillStyle = '#fbbf24';
            ctx.fillText(`(${star.brightness})`, x + w - 30, starY);
          }
          
          starY += 16;
        }
      }
    },

    // 绘制中宫区域
    drawCenterArea(ctx, x, y, w, h) {
      console.log('🌟 开始绘制中宫区域');
                
      // 中宫背景色
      ctx.fillStyle = 'rgba(147, 197, 253, 0.1)';
      ctx.fillRect(x, y, w, h);
                
      // 中宫边框
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
                
      // 优先使用_centerInfo，如果没有则使用center
      const center = this.data._centerInfo || this.data.center || {};
      console.log('🌟 中宫信息:', center);
  
      // 检查八字相关字段
      console.log('🌟 八字信息检查:', {
        bazi: center.bazi,
        yearPillar: center.yearPillar,
        monthPillar: center.monthPillar,
        dayPillar: center.dayPillar,
        hourPillar: center.hourPillar
      });
                
      // 中宫标题
      ctx.fillStyle = '#1e40af';
      ctx.font = `12px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('个人信息', x + w / 2, y + 20);
      ctx.textAlign = 'left';
            
      // 简化条件判断，只要有center数据就绘制
      if (center && Object.keys(center).length > 0) {
        const contentX = x + 16;
        const contentY = y + 40; // 稍微上移起始位置
        const lineHeight = 14; // 减小行间距
        let currentY = contentY;
                  
        ctx.font = '8px sans-serif';
                  
        // 第一行：姓名、性别和五行局
        ctx.fillStyle = '#1e293b';
        ctx.font = '8px sans-serif';
        ctx.fillText(`${center.name || '—'} ${center.gender || '—'} ${center.fiveElements || '—'}`, contentX, currentY);
        currentY += lineHeight;
                  
        // 八字信息标题
        ctx.fillStyle = '#1e40af';
        ctx.fillText('八字', contentX, currentY);
        currentY += lineHeight;
        
        // 年柱
        ctx.fillStyle = '#1e293b';
        ctx.fillText(`年柱：${center.yearPillar || '—'}`, contentX, currentY);
        currentY += lineHeight;
        
        // 月柱
        ctx.fillStyle = '#1e293b';
        ctx.fillText(`月柱：${center.monthPillar || '—'}`, contentX, currentY);
        currentY += lineHeight;
        
        // 日柱
        ctx.fillStyle = '#1e293b';
        ctx.fillText(`日柱：${center.dayPillar || '—'}`, contentX, currentY);
        currentY += lineHeight;
        
        // 时柱
        ctx.fillStyle = '#1e293b';
        ctx.fillText(`时柱：${center.hourPillar || '—'}`, contentX, currentY);
        currentY += lineHeight;
                  
        // 真太阳时
        ctx.fillStyle = '#64748b';
        ctx.fillText(`真太阳时：${center.trueSolarTime || '—'}`, contentX, currentY);
        currentY += lineHeight;
                  
        // 农历时间
        ctx.fillStyle = '#64748b';
        ctx.fillText(`${center.lunarDate || '—'}`, contentX, currentY);
        currentY += lineHeight;
                  
        // 命主、身主、子斗
        ctx.fillStyle = '#1e293b';
        ctx.fillText(`命主：${center.lifeMaster || '—'} 身主：${center.bodyMaster || '—'}`, contentX, currentY);
        currentY += lineHeight;
        
        // 子斗单独一行
        ctx.fillStyle = '#1e293b';
        ctx.fillText(`子斗：${center.ziDou || '—'}`, contentX, currentY);
      } else {
        // 如果没有center数据，显示默认信息
        const contentX = x + 16;
        const contentY = y + 50;
                  
        ctx.font = '8px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('请设置个人信息', contentX, contentY);
      }
    },
    
    // 绘制宫位内容
    drawPalaceContents(ctx) {
      if (!this.data._layoutData || !this.data._cells) {
        console.warn('⚠️ 无宫位数据或单元格数据，无法绘制宫位内容');
        return;
                }
                
      // 引入字段优化系统
      const { PALACE_FIELD_STRUCTURE, getPalaceFieldData, drawPalaceField } = require('../../utils/palace-field-optimization');
      
      // 遍历所有宫位单元格
      this.data._cells.forEach((cell, index) => {
        if (!cell || cell.skip) return;
          
          const { x, y, w, h } = cell;
          
          // 检查是否需要高亮
        const isHighlighted = this.data.highlightIndices && this.data.highlightIndices.includes(index);
        
        // 获取宫位数据
        const palaceData = this.data._layoutData[index];
        if (!palaceData) {
          console.warn(`⚠️ 索引 ${index} 处没有宫位数据`);
          return;
        }
          
        console.log(`🔍 开始绘制宫位 ${index}: ${palaceData.name || '—'} (${palaceData.branch || '—'})`);
          console.log(`  位置: (${x}, ${y}), 尺寸: ${w}x${h}`);
          console.log(`  高亮状态: ${isHighlighted}`);
        console.log(`  高亮数组: [${this.data.highlightIndices ? this.data.highlightIndices.join(', ') : ''}]`);
          
        // 使用字段优化系统绘制宫位内容
          try {
          console.log(`🔍 宫位 ${index} 开始使用字段优化系统`);
            
            // 检查数据数组
          console.log(`🔍 数据数组长度: ${this.data._layoutData.length}`);
          console.log(`�� 当前索引 ${index} 的数据:`, palaceData);
            
            console.log(`✅ 字段优化系统模块加载成功`);
            console.log(`✅ 可用字段:`, Object.keys(PALACE_FIELD_STRUCTURE));
            
          // 获取流年数据
          const flowYearData = this.data.fortune?.currentFlowYear || null;
            
          console.log(`🔍 宫位 ${index} 数据:`, palaceData);
            console.log(`🔍 流年数据:`, flowYearData);
            
            const fieldData = getPalaceFieldData(palaceData, flowYearData);
          console.log(`🔍 宫位 ${index} 字段数据:`, fieldData);
            
            // 绘制各个字段
            let drawnFields = 0;
            Object.keys(PALACE_FIELD_STRUCTURE).forEach(fieldKey => {
              const fieldConfig = PALACE_FIELD_STRUCTURE[fieldKey];
              const fieldValue = fieldData[fieldKey];
              
              // 跳过旧版allStars字段，改用新的分类字段
              if (fieldKey === 'allStars') {
                return;
              }
              
              if (fieldValue) {
                console.log(`🔍 绘制字段 ${fieldKey}:`, fieldValue);
                
                // 调整坐标到当前宫位
                const adjustedConfig = {
                  ...fieldConfig,
                  x: x + fieldConfig.x,
                  y: y + fieldConfig.y
                };
                
              // 如果有anchorBottom属性，也需要调整
              if (fieldConfig.anchorBottom !== undefined) {
                adjustedConfig.anchorBottom = y + fieldConfig.anchorBottom;
              }
              
              console.log(`�� 调整后的配置:`, adjustedConfig);
                drawPalaceField(ctx, fieldValue, adjustedConfig, isHighlighted);
                drawnFields++;
              }
            });
            
          console.log(`✅ 宫位 ${index} 字段优化系统绘制完成，共绘制 ${drawnFields} 个字段`);
          } catch (error) {
          console.error(`❌ 宫位 ${index} 使用字段优化系统失败:`, error);
        }
      });
    },

    // 高亮宫位的三方四正关系
    getThreeSidesFourZheng(palaceIndex) {
      console.log('�� 计算宫位', palaceIndex, '的三方四正');
      
      if (palaceIndex < 0 || palaceIndex >= this._cells.length) {
        console.log('❌ 宫位索引无效:', palaceIndex);
        return { threeSides: [], fourZheng: [] };
      }
      
      const cell = this._cells[palaceIndex];
      if (!cell || cell.skip) {
        console.log('❌ 宫位数据无效:', cell);
        return { threeSides: [], fourZheng: [] };
      }
      
      console.log('🔍 当前宫位:', cell.name, cell.branch);
      
      // 完整的三方四正计算逻辑
      // 基于紫微斗数理论：本宫、对宫、三合宫
      
      // 三方：本宫、对宫、三合宫
      const threeSides = [];
      
      // 对宫（四正位）
      const oppositeIndex = this.getOppositePalaceIndex(palaceIndex);
      if (oppositeIndex !== -1) {
        threeSides.push(oppositeIndex);
        console.log('🔍 对宫(四正位)索引:', oppositeIndex);
      }
      
      // 三合宫（三方位）
      const sanHeIndices = this.getSanHePalaceIndices(palaceIndex);
      for (const index of sanHeIndices) {
        if (index !== palaceIndex && index !== -1) {
          threeSides.push(index);
          console.log('🔍 三合宫(三方位)索引:', index);
        }
      }
      
      // 四正：本宫、对宫、三合宫
      const fourZheng = [palaceIndex]; // 本宫
      
      // 对宫
      if (oppositeIndex !== -1) {
        fourZheng.push(oppositeIndex);
      }
      
      // 三合宫
      for (const index of sanHeIndices) {
        if (index !== palaceIndex && index !== -1) {
          fourZheng.push(index);
        }
      }
      
      // 去重
      const uniqueThreeSides = [...new Set(threeSides)];
      const uniqueFourZheng = [...new Set(fourZheng)];
      
      console.log('🔍 三方四正计算完成:');
      console.log('  三方:', uniqueThreeSides);
      console.log('  四正:', uniqueFourZheng);
      
      return {
        threeSides: uniqueThreeSides,
        fourZheng: uniqueFourZheng
      };
    },

    // 根据新的顺时针宫位布局设计三方四正关系
    getOppositePalaceIndex(palaceIndex) {
      // 对宫关系（相对位置）
      const oppositeMap = {
        0: 15,  // 命宫(0) ↔ 迁移宫(15)
        1: 14,  // 父母宫(1) ↔ 疾厄宫(14)
        2: 13,  // 福德宫(2) ↔ 财帛宫(13)
        3: 12,  // 田宅宫(3) ↔ 子女宫(12)
        4: 11,  // 兄弟宫(4) ↔ 交友宫(11)
        7: 8,   // 官禄宫(7) ↔ 夫妻宫(8)
        8: 7,   // 夫妻宫(8) ↔ 官禄宫(7)
        11: 4,  // 交友宫(11) ↔ 兄弟宫(4)
        12: 3,  // 子女宫(12) ↔ 田宅宫(3)
        13: 2,  // 财帛宫(13) ↔ 福德宫(2)
        14: 1,  // 疾厄宫(14) ↔ 父母宫(1)
        15: 0   // 迁移宫(15) ↔ 命宫(0)
      };
      return oppositeMap[palaceIndex] || -1;
    },

    // 根据新的顺时针宫位布局设计三合关系
    getSanHePalaceIndices(palaceIndex) {
      // 三合宫关系（地支三合）
      const sanHeMap = {
        0: [4, 8],    // 命宫(0)：兄弟宫(4)、夫妻宫(8)
        1: [7, 11],   // 父母宫(1)：官禄宫(7)、交友宫(11)
        2: [12, 14],  // 福德宫(2)：子女宫(12)、疾厄宫(14)
        3: [13, 15],  // 田宅宫(3)：财帛宫(13)、迁移宫(15)
        4: [0, 8],    // 兄弟宫(4)：命宫(0)、夫妻宫(8)
        7: [1, 11],   // 官禄宫(7)：父母宫(1)、交友宫(11)
        8: [0, 4],    // 夫妻宫(8)：命宫(0)、兄弟宫(4)
        11: [1, 7],   // 交友宫(11)：父母宫(1)、官禄宫(7)
        12: [2, 14],  // 子女宫(12)：福德宫(2)、疾厄宫(14)
        13: [3, 15],  // 财帛宫(13)：田宅宫(3)、迁移宫(15)
        14: [2, 12],  // 疾厄宫(14)：福德宫(2)、子女宫(12)
        15: [3, 13]   // 迁移宫(15)：田宅宫(3)、财帛宫(13)
      };
      
      const indices = sanHeMap[palaceIndex] || [];
      // 过滤掉无效索引和重复索引
      return indices.filter((index, pos) => 
        index !== -1 && 
        index < this._cells.length && 
        !this._cells[index]?.skip &&
        indices.indexOf(index) === pos
      );
    },

    // 根据4x4网格布局获取下一个宫位索引
    getNextPalaceIndex(palaceIndex) {
      // 顺时针顺序（基于新布局）
      const nextMap = {
        0: 1,   // 命宫 → 父母宫
        1: 2,   // 父母宫 → 福德宫
        2: 3,   // 福德宫 → 田宅宫
        3: 7,   // 田宅宫 → 官禄宫
        4: 0,   // 兄弟宫 → 命宫
        7: 11,  // 官禄宫 → 交友宫
        8: 4,   // 夫妻宫 → 兄弟宫
        11: 15, // 交友宫 → 迁移宫
        12: 8,  // 子女宫 → 夫妻宫
        13: 12, // 财帛宫 → 子女宫
        14: 13, // 疾厄宫 → 财帛宫
        15: 14  // 迁移宫 → 疾厄宫
      };
      
      const nextIndex = nextMap[palaceIndex];
      if (nextIndex !== undefined && nextIndex < this._cells.length && !this._cells[nextIndex]?.skip) {
        return nextIndex;
      }
      return -1;
    },

    // 根据4x4网格布局获取上一个宫位索引
    getPrevPalaceIndex(palaceIndex) {
      // 逆时针顺序（基于新布局）
      const prevMap = {
        0: 4,   // 命宫 ← 兄弟宫
        1: 0,   // 父母宫 ← 命宫
        2: 1,   // 福德宫 ← 父母宫
        3: 2,   // 田宅宫 ← 福德宫
        4: 8,   // 兄弟宫 ← 夫妻宫
        7: 3,   // 官禄宫 ← 田宅宫
        8: 12,  // 夫妻宫 ← 子女宫
        11: 7,  // 交友宫 ← 官禄宫
        12: 13, // 子女宫 ← 财帛宫
        13: 14, // 财帛宫 ← 疾厄宫
        14: 15, // 疾厄宫 ← 迁移宫
        15: 11  // 迁移宫 ← 交友宫
      };
      
      const prevIndex = prevMap[palaceIndex];
      if (prevIndex !== undefined && prevIndex < this._cells.length && !this._cells[prevIndex]?.skip) {
        return prevIndex;
      }
      return -1;
    },

    // 根据宫名获取地支
    getBranchByPalaceName(palaceName) {
      const palaceBranchMap = {
        '命宫': '寅',
        '兄弟宫': '丑',
        '夫妻宫': '子',
        '子女宫': '亥',
        '财帛宫': '戌',
        '疾厄宫': '酉',
        '迁移宫': '申',
        '交友宫': '未',
        '事业宫': '午',
        '官禄宫': '午',
        '田宅宫': '巳',
        '福德宫': '辰',
        '父母宫': '卯'
      };
      return palaceBranchMap[palaceName] || null;
    },

    // 获取地支的对冲地支
    getOppositeBranch(branch) {
      const oppositeMap = {
        '寅': '申', '申': '寅',
        '丑': '未', '未': '丑',
        '子': '午', '午': '子',
        '亥': '巳', '巳': '亥',
        '戌': '辰', '辰': '戌',
        '酉': '卯', '卯': '酉'
      };
      return oppositeMap[branch] || null;
    },

    // 获取地支的三合地支
    getSanHeBranches(branch) {
      const sanHeMap = {
        '寅': ['午', '戌'],
        '午': ['寅', '戌'],
        '戌': ['寅', '午'],
        '亥': ['卯', '未'],
        '卯': ['亥', '未'],
        '未': ['亥', '卯'],
        '申': ['子', '辰'],
        '子': ['申', '辰'],
        '辰': ['申', '子'],
        '巳': ['酉', '丑'],
        '酉': ['巳', '丑'],
        '丑': ['巳', '酉']
      };
      return sanHeMap[branch] || [];
    },

    // 获取地支的下一个地支（顺时针）
    getNextBranch(branch) {
      const branchOrder = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
      const currentIndex = branchOrder.indexOf(branch);
      if (currentIndex === -1) return null;
      return branchOrder[(currentIndex + 1) % 12];
    },

    // 获取地支的上一个地支（逆时针）
    getPrevBranch(branch) {
      const branchOrder = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
      const currentIndex = branchOrder.indexOf(branch);
      if (currentIndex === -1) return null;
      return branchOrder[(currentIndex - 1 + 12) % 12];
    },

    // 根据地支找到宫位索引
    findPalaceByBranch(branch) {
      if (!this._cells) return -1;
      
      for (let i = 0; i < this._cells.length; i++) {
        const cell = this._cells[i];
        if (!cell || cell.skip) continue;
        
        const cellBranch = cell.branch || this.getBranchByPalaceName(cell.name);
        if (cellBranch === branch) {
          return i;
        }
      }
      return -1;
    },

    // 找到点击的宫位
    findClickedPalace(x, y) {
      if (!this._cells) return -1;
      
      for (let i = 0; i < this._cells.length; i++) {
        const cell = this._cells[i];
        if (!cell || cell.skip) continue;
        
        if (x >= cell.x && x <= cell.x + cell.w && y >= cell.y && y <= cell.y + cell.h) {
          console.log(`🎯 找到点击的宫位 ${i}:`, cell);
          return i;
        }
      }
      
      console.log('🎯 未找到点击的宫位');
      return -1;
    },

    // 高亮宫位的三方四正关系
    highlightPalaceRelations(palaceIndex) {
      console.log('🔍 高亮宫位三方四正关系:', palaceIndex);
      
      try {
        // 引入三方四正关系计算工具
        const { getPalaceRelations } = require('../../utils/palace-relations');
        
        // 获取三方四正关系
        const relations = getPalaceRelations(palaceIndex);
        console.log('🔍 三方四正关系:', relations);
        
        if (relations.target !== null) {
          // 设置高亮宫位列表
          const highlighted = [relations.target];
          
          // 添加对宫（四正位）
          if (relations.opposite !== -1) {
            highlighted.push(relations.opposite);
          }
          
          // 添加三合宫（三方位）
          highlighted.push(...relations.trine.filter(i => i !== -1));
          
          console.log('🔍 高亮宫位列表:', highlighted);
          console.log('🔍 高亮状态将一直保持，直到手动清除');
          
          this.setData({
            selectedPalace: palaceIndex,
            highlightedPalaces: highlighted
          });
          
          // 重绘图表以显示高亮效果
          this.drawChart();
        }
      } catch (error) {
        console.error('❌ 计算三方四正关系失败:', error);
      }
    },

    // 清除高亮
    clearHighlight() {
      console.log('🧹 清除高亮');
      this.setData({
        selectedPalace: null,
        highlightedPalaces: []
      });
      this.drawChart();
    }
  }
});

