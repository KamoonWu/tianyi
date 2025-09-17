// 导入字段优化系统模块
const { getPalaceFieldData, drawPalaceField, PALACE_FIELD_STRUCTURE } = require('../../utils/palace-field-optimization.js');

Component({
  properties: {
    palaces: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        console.log('🔍 palaces属性观察者触发');
        console.log('🔍 旧值:', oldVal);
        console.log('🔍 新值:', newVal);
        console.log('🔍 数据类型:', typeof newVal);
        console.log('🔍 数组长度:', newVal ? newVal.length : 0);
        
        if (newVal && newVal.length > 0) {
          console.log('✅ 检测到新的宫位数据，准备重绘');
          this.drawChart();
        }
      }
    },
    center: {
      type: Object,
      value: null,
      observer: function(newVal, oldVal) {
        console.log('🔍 center属性观察者触发:', newVal);
      }
    },
    fortune: {
      type: Object,
      value: null,
      observer: function(newVal, oldVal) {
        console.log('🔍 fortune属性观察者触发:', newVal);
      }
    },
    flowYear: {
      type: Object,
      value: null,
      observer: function(newVal, oldVal) {
        console.log('🔍 flowYear属性观察者触发');
        console.log('🔍 旧值:', oldVal);
        console.log('🔍 新值:', newVal);
        
        if (newVal) {
          console.log('✅ 检测到新的流年数据，准备重绘');
          this.drawChart();
        }
      }
    }
  },

  data: {
    selectedPalace: null, // 当前选中的宫位
    highlightedPalaces: [] // 高亮的宫位列表（包括三方四正）
  },

  lifetimes: {
    attached() {
      console.log('排盘组件已挂载');
      this.drawChart();
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

    orderPalacesForLayout(list) {
      // 紫微斗数标准十二宫布局（4x4网格，中间4格合并，周围12格按传统排列）：
      // 顶行：命宫 | 兄弟宫 | 夫妻宫 | 子女宫
      // 中行：财帛宫 | [中宫合并区域] | 迁移宫
      // 中行：疾厄宫 | [用户信息] | 交友宫  
      // 底行：事业宫 | 田宅宫 | 福德宫 | 父母宫
      const layoutOrder = [
        '命宫','兄弟宫','夫妻宫','子女宫',
        '财帛宫','','','迁移宫',
        '疾厄宫','','','交友宫',
        '事业宫','田宅宫','福德宫','父母宫'
      ];
      
      console.log('排盘组件接收到的宫位数据:', list);
      
      const byName = {};
      (list || []).forEach((p) => {
        const key = this.normalizePalaceName(p.name || p.label);
        byName[key] = p;
        console.log(`映射宫位: ${p.name} -> ${key}`);
      });
      
      const result = layoutOrder.map((k) => {
        if (k === '') {
          return { name: '', stars: '', isEmpty: true };
        } else {
          const palace = byName[k];
        if (palace) {
            console.log(`找到宫位 ${k}:`, palace);
            return palace;
          } else {
            console.log(`未找到宫位 ${k}，创建空宫位`);
            return { name: k, stars: '', isEmpty: true };
          }
        }
      });
      
      console.log('布局后的宫位数据:', result);
      return result;
    },

    drawChart() {
      console.log('🎨 排盘组件开始绘制...');
      console.log('🎨 当前组件数据:', {
        palaces: this.data.palaces,
        center: this.data.center,
        fortune: this.data.fortune
      });
      
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
        
        // 调试信息
        console.log('宫格布局信息:', {
          width, height, padding, gap,
          cellW, cellH, w, h,
          totalWidth: padding * 2 + cols * w + (cols - 1) * gap,
          totalHeight: padding * 2 + rows * h + (rows - 1) * gap
        });

        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;

        const fontSmall = 10;
        const fontNormal = 12;
        const fontMedium = 14; // Added for new layout
        const colors = {
          main: '#7c3aed',
          aux: '#2563eb',
          misc: '#ea580c',
          shensha: '#16a34a',
          other: '#111827',
          title: '#374151',
          line: 'rgba(239,68,68,0.35)',
          hua: '#dc2626',
          border: '#d1d5db'
        };

        // 根据指定布局顺序重排
        const data = this.orderPalacesForLayout(this.data.palaces || []);
        this._layoutData = data;
        this._cells = [];
        
        // 修复宫位索引映射
        let palaceIndex = 0; // 宫位索引计数器
        
        for (let r = 0; r < rows; r += 1) {
          for (let c = 0; c < cols; c += 1) {
            const idx = r * cols + c;
            const x = padding + c * (w + gap);
            const y = padding + r * (h + gap);
            
            // 检查是否是中间4个格子（需要合并）
            const isCenter = (r === 1 || r === 2) && (c === 1 || c === 2);
            
            if (isCenter) {
              if (r === 1 && c === 1) {
                console.log('🔍 开始绘制中宫区域');
                // 绘制合并后的中宫区域
                const centerW = w * 2 + gap;
                const centerH = h * 2 + gap;
                
                // 中宫背景色
                ctx.fillStyle = 'rgba(147, 197, 253, 0.1)';
                ctx.fillRect(x, y, centerW, centerH);
                
                // 中宫边框
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, centerW, centerH);
                
                this._cells[idx] = { x, y, w: centerW, h: centerH, isCenter: true, skip: true };
                
                // 用户信息
                const center = this.data.center || {};
                
                // 中宫标题
                ctx.fillStyle = '#1e40af';
                ctx.font = `${fontNormal}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText('个人信息', x + centerW / 2, y + 20);
                ctx.textAlign = 'left';
                
                // 直接在这里绘制个人信息内容
                console.log('🔍 中宫绘制 - center数据:', center);
                console.log('🔍 中宫绘制 - center.name:', center.name);
                console.log('🔍 中宫绘制 - center.fiveElements:', center.fiveElements);
                console.log('🔍 中宫绘制 - 条件判断:', !!(center && (center.name || center.fiveElements)));
                
                // 简化条件判断，只要有center数据就绘制
                if (center && Object.keys(center).length > 0) {
                  const contentX = x + 16;
                  const contentY = y + 50;
                  const lineHeight = 16;
                  let currentY = contentY;
                  
                  ctx.font = '8px sans-serif';
                  
                  // 第一行：姓名和五行局
                  ctx.fillStyle = '#1e293b';
                  ctx.font = '8px sans-serif';
                  ctx.fillText(`${center.name || '—'} ${center.fiveElements || '—'}`, contentX, currentY);
                  currentY += lineHeight;
                  
                  // 第二行：真太阳时
                  ctx.fillStyle = '#64748b';
                  ctx.fillText(`真太阳时：${center.trueSolarTime || '—'}`, contentX, currentY);
                  currentY += lineHeight;
                  
                  // 第三行：钟表时间
                  ctx.fillStyle = '#64748b';
                  ctx.fillText(`钟表时间：${center.clockTime || '—'}`, contentX, currentY);
                  currentY += lineHeight;
                  
                  // 第四行：农历时间
                  ctx.fillStyle = '#64748b';
                  ctx.fillText(`${center.lunarTime || '—'}`, contentX, currentY);
                  currentY += lineHeight;
                  
                  // 第五行：命主、身主、子斗
                  ctx.fillStyle = '#1e293b';
                  ctx.fillText(`命主：${center.lifeMaster || '—'} 身主：${center.bodyMaster || '—'} 子斗：${center.ziDou || '—'}`, contentX, currentY);
                  currentY += lineHeight + 4;
                  
                  // 四柱信息
                  if (center.solarTermPillars && center.solarTermPillars.length > 0) {
                    ctx.fillStyle = '#64748b';
                    ctx.fillText('节气四柱：', contentX, currentY);
                    currentY += 12;
                    
                    let pillarX = contentX + 8;
                    center.solarTermPillars.forEach((pillar) => {
                      ctx.fillStyle = '#1e293b';
                      ctx.fillText(pillar.heavenlyStem || '—', pillarX, currentY);
                      ctx.fillText(pillar.earthlyBranch || '—', pillarX, currentY + 10);
                      pillarX += 20;
                    });
                    currentY += 20;
                  }
                  
                  if (center.nonSolarTermPillars && center.nonSolarTermPillars.length > 0) {
                    ctx.fillStyle = '#64748b';
                    ctx.fillText('非节气四柱：', contentX, currentY);
                    currentY += 12;
                    
                    let pillarX = contentX + 8;
                    center.nonSolarTermPillars.forEach((pillar) => {
                    ctx.fillStyle = '#1e293b';
                      ctx.fillText(pillar.heavenlyStem || '—', pillarX, currentY);
                      ctx.fillText(pillar.earthlyBranch || '—', pillarX, currentY + 10);
                      pillarX += 20;
                    });
                  }
                } else {
                  // 如果没有center数据，显示默认信息
                  const contentX = x + 16;
                  const contentY = y + 50;
                  const lineHeight = 16;
                  let currentY = contentY;
                  
                  ctx.font = '8px sans-serif';
                  ctx.fillStyle = '#64748b';
                  ctx.fillText('请设置个人信息', contentX, currentY);
                }
              }
              // 其他中间格子不绘制，但记录位置信息
              this._cells[idx] = { x, y, w, h, isCenter: true, skip: true };
            } else {
              // 正常绘制12个宫位格子
              ctx.strokeStyle = colors.border;
              ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y, w, h);
              
              // 获取宫位信息
              const palaceInfo = this.getPalaceInfo(idx);
              this._cells[idx] = { 
                x, y, w, h, 
                name: palaceInfo.name,
                branch: palaceInfo.branch
              };

              // 宫名 - 已移除左上角宫名显示
            const title = this.normalizePalaceName((data[idx] && data[idx].name) || '');
              if (title && !data[idx].isEmpty) {
                // ctx.fillStyle = colors.title;
                // ctx.font = `${fontSmall}px sans-serif`;
                // ctx.fillText(title, x + 8, y + 16); // 左上角宫名已移除

                // 注释掉原有的星曜绘制代码，避免重复绘制和覆盖问题
                // 星曜显示（按照截图样式优化）
                /*
            const names = ((data[idx] && data[idx].starNames) || String((data[idx] && data[idx].stars) || '').split(/\s+/)).filter(Boolean);
                console.log(`宫位 ${title} 的星曜数据:`, {
                  name: title,
                  starNames: data[idx]?.starNames,
                  stars: data[idx]?.stars,
                  parsedNames: names
                });
                
            const { classifyStars } = require('../../utils/stars-catalog');
            const groups = classifyStars(names);
                console.log(`宫位 ${title} 的星曜分类:`, groups);
                
                let currentY = y + 28; // 从宫名下方开始，调整起始位置
                const lineHeight = 14;
                const maxLines = Math.floor((h - 40) / lineHeight); // 计算可显示的最大行数，留出更多空间
                
                // 主星（紫色，左侧显示）
                if (groups.main.length > 0) {
                  ctx.fillStyle = colors.main;
                  ctx.font = `${fontSmall}px sans-serif`;
                  const mainText = groups.main.join(' ');
                  ctx.fillText(mainText, x + 8, currentY); // 调整左边距
                  currentY += lineHeight;
                }
                
                // 辅星（蓝色，左侧显示）
                if (groups.aux.length > 0) {
                  ctx.fillStyle = colors.aux;
                  ctx.font = `${fontSmall}px sans-serif`;
                  const auxText = groups.aux.join(' ');
                  ctx.fillText(auxText, x + 8, currentY); // 调整左边距
                  currentY += lineHeight;
                }
                
                // 杂曜（橙色，左侧显示）
                if (groups.misc.length > 0) {
                  ctx.fillStyle = colors.misc;
                  ctx.font = `${fontSmall}px sans-serif`;
                  for (let i = 0; i < Math.min(groups.misc.length, maxLines - Math.floor(currentY - y) / lineHeight); i++) {
                    ctx.fillText(groups.misc[i], x + 8, currentY); // 调整左边距
                    currentY += lineHeight;
                  }
                }
                
                // 神煞（绿色，左侧显示）
                if (groups.shensha.length > 0) {
                  ctx.fillStyle = colors.shensha;
                  ctx.font = `${fontSmall}px sans-serif`;
                  for (let i = 0; i < Math.min(groups.misc.length, maxLines - Math.floor(currentY - y) / lineHeight); i++) {
                    ctx.fillText(groups.shensha[i], x + 8, currentY); // 调整左边距
                    currentY += lineHeight;
                  }
                }
                
                // 运限星（蓝色，左侧显示）
                if (groups.fortune.length > 0) {
                  ctx.fillStyle = colors.aux;
                  ctx.font = `${fontSmall}px sans-serif`;
                  for (let i = 0; i < Math.min(groups.fortune.length, maxLines - Math.floor(currentY - y) / lineHeight); i++) {
                    ctx.fillText(groups.fortune[i], x + 8, currentY); // 调整左边距
                    currentY += lineHeight;
                  }
                }
                
                // 四化星（红色，右上角显示）
                if (groups.fourHua.length > 0) {
                  ctx.fillStyle = colors.hua;
                  ctx.font = `${fontSmall}px sans-serif`;
                  ctx.textAlign = 'right';
                  ctx.fillText(groups.fourHua.join(' '), x + w - 8, y + 16); // 调整位置，确保在线框内
        ctx.textAlign = 'left';
                }
                
                // 其他星曜（左侧显示）
                if (groups.other.length > 0) {
                  ctx.fillStyle = colors.other;
                  ctx.font = `${fontSmall}px sans-serif`;
                  for (let i = 0; i < Math.min(groups.other.length, maxLines - Math.floor(currentY - y) / lineHeight); i++) {
                    ctx.fillText(groups.other[i], x + 8, currentY); // 调整左边距
                    currentY += lineHeight;
                  }
                }
                */

                // 四化标记（右上角，红色）
            const huaText = (data[idx] && data[idx].hua) || '';
            if (huaText) {
              ctx.fillStyle = colors.hua;
              ctx.font = `${fontSmall}px sans-serif`;
                  ctx.textAlign = 'right';
                  ctx.fillText(huaText, x + w - 8, y + 16); // 调整位置，确保在线框内
                  ctx.textAlign = 'left';
                }
                
                // 运限信息（如果有的话）
                const fortune = this.data.fortune || {};
                if (fortune.currentPalace === title) {
                  // 绘制运限标记
                  ctx.fillStyle = '#fbbf24';
                  ctx.font = `${fontSmall}px sans-serif`;
                  ctx.textAlign = 'center';
                  ctx.fillText('流年', x + w / 2, y + h - 8);
                  ctx.textAlign = 'left';
                }
              }
            }
          }
        }

        // 绘制宫位
        for (let i = 0; i < this._cells.length; i++) {
          const cell = this._cells[i];
          if (!cell || cell.skip) continue;
          
          const { x, y, w, h } = cell;
          
          // 检查是否需要高亮
          const isHighlighted = this.data.highlightedPalaces.includes(i);
          
          console.log(`🔍 开始绘制宫位 ${i}: ${cell.name} (${cell.branch})`);
          console.log(`  位置: (${x}, ${y}), 尺寸: ${w}x${h}`);
          console.log(`  高亮状态: ${isHighlighted}`);
          console.log(`  高亮数组: [${this.data.highlightedPalaces.join(', ')}]`);
          
          // 绘制宫位背景
          if (isHighlighted) {
            // 高亮背景：透明（不填充颜色）
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // 保持白色背景
            ctx.fillRect(x, y, w, h);
          } else {
            // 普通背景：白色
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(x, y, w, h);
          }
          
          // 绘制宫位边框
          if (isHighlighted) {
            // 高亮边框：深黄色，最细线条
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 1; // 最细边框
          } else {
            // 普通边框：灰色，最细线条
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1; // 最细边框
          }
          ctx.strokeRect(x, y, w, h);
          
          // 先绘制一个简单的测试文本，确保Canvas能正常工作
          console.log(`🔍 绘制测试文本到宫位 ${i}`);
          ctx.fillStyle = '#ff0000'; // 红色
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`测试${i}`, x + w / 2, y + h / 2);
          console.log(`✅ 测试文本绘制完成`);
          
          // 使用新的字段优化系统绘制宫位内容
          try {
            console.log(`🔍 宫位 ${i} 开始使用字段优化系统`);
            
            // 检查数据数组
            console.log(`🔍 数据数组长度: ${data.length}`);
            console.log(`🔍 当前索引 ${i} 的数据:`, data[i]);
            
            console.log(`✅ 字段优化系统模块加载成功`);
            console.log(`✅ 可用字段:`, Object.keys(PALACE_FIELD_STRUCTURE));
            
            // 获取宫位数据 - 使用循环变量i而不是未定义的idx
            const palaceData = data[i] || {};
            const flowYearData = this.properties.flowYear?.currentFlowYear || null;
            
            console.log(`🔍 宫位 ${i} 数据:`, palaceData);
            console.log(`🔍 流年数据:`, flowYearData);
            
            const fieldData = getPalaceFieldData(palaceData, flowYearData);
            console.log(`🔍 宫位 ${i} 字段数据:`, fieldData);
            
            // 绘制各个字段
            let drawnFields = 0;
            Object.keys(PALACE_FIELD_STRUCTURE).forEach(fieldKey => {
              const fieldConfig = PALACE_FIELD_STRUCTURE[fieldKey];
              const fieldValue = fieldData[fieldKey];
              
              if (fieldValue) {
                console.log(`🔍 绘制字段 ${fieldKey}:`, fieldValue);
                
                // 调整坐标到当前宫位
                const adjustedConfig = {
                  ...fieldConfig,
                  x: x + fieldConfig.x,
                  y: y + fieldConfig.y
                };
                
                console.log(`🔍 调整后的配置:`, adjustedConfig);
                drawPalaceField(ctx, fieldValue, adjustedConfig, isHighlighted);
                drawnFields++;
              }
            });
            
            console.log(`✅ 宫位 ${i} 字段优化系统绘制完成，共绘制 ${drawnFields} 个字段`);
            
          } catch (error) {
            console.error(`❌ 宫位 ${i} 使用字段优化系统失败，回退到原始绘制方法:`, error);
            console.error(`❌ 错误堆栈:`, error.stack);
            
            // 回退到原始绘制方法
            this.drawPalaceContentFallback(ctx, cell, x, y, w, h, isHighlighted);
          }
        }

        // 连线功能已移除

        // 运限盘功能已移除

        // 三方四正连线（根据选中宫位绘制）
        const { getSanFangSiZheng, getPalaceIndex } = require('../../utils/palace-lines');
        const selectedPalace = this.data.selectedPalace;
        if (selectedPalace) {
          const targetIdx = getPalaceIndex(selectedPalace);
          const sfsz = getSanFangSiZheng(selectedPalace);
          const drawLine = (a, b, color = colors.line) => {
            const ca = this._cells[a];
            const cb = this._cells[b];
            if (!ca || !cb || ca.skip || cb.skip) return;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(ca.x + ca.w / 2, ca.y + ca.h / 2);
            ctx.lineTo(cb.x + cb.w / 2, cb.y + cb.h / 2);
            ctx.stroke();
            ctx.setLineDash([]);
          };
          if (targetIdx >= 0) {
            // 高亮选中宫位
            const selectedCell = this._cells[targetIdx];
            if (selectedCell && !selectedCell.skip) {
              ctx.strokeStyle = '#ef4444';
              ctx.lineWidth = 3;
              ctx.strokeRect(selectedCell.x + 2, selectedCell.y + 2, selectedCell.w - 4, selectedCell.h - 4);
            }
            // 绘制三方四正连线
            sfsz.forEach((palaceName) => {
              const idx = getPalaceIndex(palaceName);
              if (idx >= 0 && idx !== targetIdx) {
                drawLine(targetIdx, idx);
                // 高亮相关宫位
                const relatedCell = this._cells[idx];
                if (relatedCell && !relatedCell.skip) {
                  ctx.strokeStyle = '#f59e0b';
                  ctx.lineWidth = 2;
                  ctx.strokeRect(relatedCell.x + 2, relatedCell.y + 2, relatedCell.w - 4, relatedCell.h - 4);
                }
              }
            });
          }
        }
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

    // 获取宫位信息
    getPalaceInfo(palaceIndex) {
      // 直接使用布局数据获取宫位信息
      if (this._layoutData && this._layoutData[palaceIndex]) {
        const palaceData = this._layoutData[palaceIndex];
        if (!palaceData.isEmpty) {
          return {
            name: palaceData.name || `宫位${palaceIndex}`,
            branch: palaceData.branch || ''
          };
        }
      }
      
      // 备用方案：返回默认信息
      return {
        name: `宫位${palaceIndex}`,
        branch: ''
      };
    },

    // 获取宫位数据
    getPalaceData(palaceIndex) {
      // 直接使用布局数据获取宫位信息
      if (this._layoutData && this._layoutData[palaceIndex]) {
        const palaceData = this._layoutData[palaceIndex];
        if (!palaceData.isEmpty) {
          return {
            name: palaceData.name || `宫位${palaceIndex}`,
            branch: palaceData.branch || '',
            index: palaceIndex,
            stars: palaceData.stars || '',
            hua: palaceData.hua || ''
          };
        }
      }
      
      // 备用方案：从组件数据获取
      if (this.data.palaces && this.data.palaces[palaceIndex]) {
        return this.data.palaces[palaceIndex];
      }
      
      // 最后备用方案：返回基本信息
      return {
        name: `宫位${palaceIndex}`,
        index: palaceIndex
      };
    },

    // 高亮宫位的三方四正关系
    getThreeSidesFourZheng(palaceIndex) {
      console.log('🔍 计算宫位', palaceIndex, '的三方四正');
      
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

    // 根据用户需求重新设计三方四正关系
    getOppositePalaceIndex(palaceIndex) {
      // 根据用户反馈：点击测试12时，应该高亮测试1、3、11
      const oppositeMap = {
        0: 6,   // 命宫(0) ↔ 迁移宫(6)
        1: 7,   // 兄弟宫(1) ↔ 交友宫(7)
        2: 12,  // 夫妻宫(2) ↔ 事业宫(12)
        3: 13,  // 子女宫(3) ↔ 田宅宫(13)
        4: 14,  // 财帛宫(4) ↔ 福德宫(14)
        6: 0,   // 迁移宫(6) ↔ 命宫(0)
        7: 1,   // 交友宫(7) ↔ 兄弟宫(1)
        8: 15,  // 疾厄宫(8) ↔ 父母宫(15)
        12: 1,  // 事业宫(12) ↔ 兄弟宫(1) - 用户指定
        13: 3,  // 田宅宫(13) ↔ 子女宫(3)
        14: 4,  // 福德宫(14) ↔ 财帛宫(4)
        15: 8   // 父母宫(15) ↔ 疾厄宫(8)
      };
      return oppositeMap[palaceIndex] || -1;
    },

    // 根据用户需求重新设计三合关系
    getSanHePalaceIndices(palaceIndex) {
      // 根据用户反馈：点击测试12时，应该高亮测试1、3、11
      const sanHeMap = {
        0: [4, 12],   // 命宫(0)：财帛宫(4)、事业宫(12)
        1: [7, 15],   // 兄弟宫(1)：交友宫(7)、父母宫(15)
        2: [6, 14],   // 夫妻宫(2)：迁移宫(6)、福德宫(14)
        3: [7, 15],   // 子女宫(3)：交友宫(7)、父母宫(15)
        4: [0, 12],   // 财帛宫(4)：命宫(0)、事业宫(12)
        6: [2, 14],   // 迁移宫(6)：夫妻宫(2)、福德宫(14)
        7: [1, 15],   // 交友宫(7)：兄弟宫(1)、父母宫(15)
        8: [1, 13],   // 疾厄宫(8)：兄弟宫(1)、田宅宫(13)
        12: [3, 7],   // 事业宫(12)：子女宫(3)、交友宫(7) - 用户指定
        13: [1, 8],   // 田宅宫(13)：兄弟宫(1)、疾厄宫(8)
        14: [2, 6],   // 福德宫(14)：夫妻宫(2)、迁移宫(6)
        15: [1, 7]    // 父母宫(15)：兄弟宫(1)、交友宫(7)
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
      // 顺时针顺序（基于实际布局）
      const nextMap = {
        0: 1,   // 命宫 → 兄弟宫
        1: 2,   // 兄弟宫 → 夫妻宫
        2: 3,   // 夫妻宫 → 子女宫
        3: 6,   // 子女宫 → 迁移宫
        4: 0,   // 财帛宫 → 命宫
        6: 7,   // 迁移宫 → 交友宫
        7: 8,   // 交友宫 → 疾厄宫
        8: 11, // 疾厄宫 → 交友宫
        11: 12, // 交友宫 → 事业宫
        12: 13, // 事业宫 → 田宅宫
        13: 14, // 田宅宫 → 福德宫
        14: 15, // 福德宫 → 父母宫
        15: 4   // 父母宫 → 财帛宫
      };
      
      const nextIndex = nextMap[palaceIndex];
      if (nextIndex !== undefined && nextIndex < this._cells.length && !this._cells[nextIndex]?.skip) {
        return nextIndex;
      }
      return -1;
    },

    // 根据4x4网格布局获取上一个宫位索引
    getPrevPalaceIndex(palaceIndex) {
      // 逆时针顺序（基于实际布局）
      const prevMap = {
        0: 4,   // 命宫 ← 财帛宫
        1: 0,   // 兄弟宫 ← 命宫
        2: 1,   // 夫妻宫 ← 兄弟宫
        3: 2,   // 子女宫 ← 夫妻宫
        4: 15,  // 财帛宫 ← 父母宫
        6: 3,   // 迁移宫 ← 子女宫
        7: 6,   // 交友宫 ← 迁移宫
        8: 7,   // 疾厄宫 ← 交友宫
        11: 8,  // 交友宫 ← 疾厄宫
        12: 11, // 事业宫 ← 交友宫
        13: 12, // 田宅宫 ← 事业宫
        14: 13, // 福德宫 ← 田宅宫
        15: 14  // 父母宫 ← 福德宫
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

