// assets/charts.js — AI 辅助教师作业批改可行性落地方案
(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var danger = style.getPropertyValue('--danger').trim();

  var FONT = "'InstrumentSans','PingFang SC','Microsoft YaHei',sans-serif";

  // ---------- Mermaid ----------
  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      securityLevel: 'loose',
      fontFamily: FONT,
      flowchart: { curve: 'basis', htmlLabels: true, nodeSpacing: 40, rankSpacing: 48 },
      themeVariables: {
        fontFamily: FONT,
        fontSize: '14px',
        primaryColor: '#eef3fb',
        primaryTextColor: ink,
        primaryBorderColor: accent,
        secondaryColor: '#e7f5f0',
        secondaryTextColor: ink,
        secondaryBorderColor: accent2,
        tertiaryColor: '#ffffff',
        tertiaryTextColor: ink,
        tertiaryBorderColor: rule,
        lineColor: muted,
        textColor: ink,
        background: bg2,
        clusterBkg: '#f8fafe',
        clusterBorder: rule,
        edgeLabelBackground: '#ffffff'
      }
    });
  }

  var charts = [];

  function baseTooltip() {
    return {
      appendToBody: true,
      backgroundColor: '#ffffff',
      borderColor: rule,
      borderWidth: 1,
      textStyle: { color: ink, fontFamily: FONT, fontSize: 12 },
      extraCssText: 'box-shadow:0 8px 24px rgba(36,86,214,.12);border-radius:10px;padding:10px 12px;'
    };
  }

  function axisLabelStyle() {
    return { color: muted, fontFamily: FONT, fontSize: 12 };
  }

  // ================= Chart 1: AI 与人工评分一致性 =================
  (function () {
    var el = document.getElementById('chart-agreement');
    if (!el) return;
    var chart = echarts.init(el, null, { renderer: 'svg' });
    var names = ['跨研究一致性\n区间下限', 'GPT-4 作文评分\nQWK', '人工评分者之间\nQWK（基准）', 'o1 与教师评分\nSpearman', '跨研究一致性\n区间上限'];
    var values = [0.30, 0.551, 0.605, 0.74, 0.80];
    var colors = [muted, accent2, muted, accent, muted];
    chart.setOption({
      animation: false,
      tooltip: Object.assign(baseTooltip(), {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (p) {
          return p[0].name.replace('\n', ' ') + '<br/>一致性系数：<b>' + p[0].value.toFixed(3) + '</b>';
        }
      }),
      grid: { left: 8, right: 24, top: 28, bottom: 12, containLabel: true },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: Object.assign(axisLabelStyle(), { lineHeight: 16, interval: 0 }),
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        interval: 0.2,
        name: '一致性系数',
        nameTextStyle: { color: muted, fontFamily: FONT, fontSize: 11, align: 'left' },
        axisLabel: axisLabelStyle(),
        splitLine: { lineStyle: { color: rule, type: 'dashed' } },
        axisLine: { show: false }
      },
      series: [{
        type: 'bar',
        data: values.map(function (v, i) {
          return { value: v, itemStyle: { color: colors[i], borderRadius: [6, 6, 0, 0] } };
        }),
        barWidth: '46%',
        label: {
          show: true,
          position: 'top',
          formatter: function (p) { return p.value.toFixed(p.value < 1 ? 3 : 2); },
          color: ink,
          fontWeight: 700,
          fontFamily: FONT,
          fontSize: 12
        }
      }]
    });
    charts.push(chart);
  })();

  // ================= Chart 2: 知识点掌握度热力图（示意数据） =================
  (function () {
    var el = document.getElementById('chart-heatmap');
    if (!el) return;
    var chart = echarts.init(el, null, { renderer: 'svg' });
    var weeks = ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周'];
    var points = ['有理数运算', '整式加减', '一元一次方程', '移项与合并同类项', '几何图形初步', '平行线的性质', '数据统计初步', '应用题建模'];
    var matrix = [
      [86, 88, 91, 92, 94, 95],
      [72, 78, 83, 86, 88, 91],
      [58, 66, 72, 79, 84, 88],
      [52, 61, 70, 76, 83, 87],
      [80, 82, 85, 87, 89, 90],
      [64, 69, 75, 80, 84, 88],
      [88, 90, 91, 93, 94, 95],
      [46, 54, 62, 68, 74, 80]
    ];
    var data = [];
    for (var y = 0; y < points.length; y++) {
      for (var x = 0; x < weeks.length; x++) {
        data.push([x, y, matrix[y][x]]);
      }
    }
    chart.setOption({
      animation: false,
      tooltip: Object.assign(baseTooltip(), {
        position: 'top',
        formatter: function (p) {
          return weeks[p.value[0]] + ' · ' + points[p.value[1]] + '<br/>班级掌握度：<b>' + p.value[2] + '%</b>';
        }
      }),
      grid: { left: 8, right: 16, top: 36, bottom: 64, containLabel: true },
      xAxis: {
        type: 'category',
        data: weeks,
        splitArea: { show: false },
        axisLabel: axisLabelStyle(),
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'category',
        data: points,
        splitArea: { show: false },
        axisLabel: axisLabelStyle(),
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      visualMap: {
        type: 'continuous',
        min: 40,
        max: 100,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: 6,
        itemWidth: 14,
        itemHeight: 120,
        textStyle: { color: muted, fontFamily: FONT, fontSize: 11 },
        inRange: { color: [bg2, '#bfe3d6', accent2, accent] }
      },
      series: [{
        type: 'heatmap',
        data: data,
        label: {
          show: true,
          formatter: function (p) { return p.value[2]; },
          color: ink,
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 700
        },
        itemStyle: { borderColor: '#ffffff', borderWidth: 2, borderRadius: 5 },
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(36,86,214,.35)' } }
      }]
    });
    charts.push(chart);
  })();

  // ================= Chart 3: 三阶段实施路线 =================
  (function () {
    var el = document.getElementById('chart-roadmap');
    if (!el) return;
    var chart = echarts.init(el, null, { renderer: 'svg' });
    var tasks = [
      { name: '阶段一 · 环境部署与合规备案', start: 1, len: 3, stage: 1 },
      { name: '阶段一 · 知识点与题型梳理', start: 2, len: 5, stage: 1 },
      { name: '阶段一 · 客观题批改 + 统计看板上线', start: 5, len: 4, stage: 1 },
      { name: '阶段一 · 主观题影子模式运行', start: 6, len: 4, stage: 1 },
      { name: '阶段一 · 试点评估与阈值校准', start: 9, len: 4, stage: 1 },
      { name: '阶段二 · 评分点（rubric）全面结构化', start: 13, len: 8, stage: 2 },
      { name: '阶段二 · 双评与置信度路由上线', start: 17, len: 10, stage: 2 },
      { name: '阶段二 · 知识点图谱与错因体系扩展', start: 17, len: 12, stage: 2 },
      { name: '阶段二 · 评语生成与教师风格库上线', start: 21, len: 10, stage: 2 },
      { name: '阶段二 · 月度一致率监控与季度校准会', start: 13, len: 24, stage: 2 },
      { name: '阶段三 · 教师培训与制度落地', start: 37, len: 8, stage: 3 },
      { name: '阶段三 · 分学科分批上线', start: 41, len: 20, stage: 3 },
      { name: '阶段三 · 全科常态化运行与年度审计', start: 57, len: 24, stage: 3 }
    ];
    var stageColor = { 1: accent2, 2: accent, 3: '#7f93ad' };
    var yNames = [], placeholder = [], dur = [];
    tasks.forEach(function (t) {
      yNames.unshift(t.name);
      placeholder.unshift(t.start - 1);
      dur.unshift({ value: t.len, itemStyle: { color: stageColor[t.stage], borderRadius: 6 } });
    });
    chart.setOption({
      animation: false,
      tooltip: Object.assign(baseTooltip(), {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (p) {
          var idx = p[0].dataIndex;
          var t = tasks[tasks.length - 1 - idx];
          return t.name + '<br/>第 ' + t.start + ' 周 — 第 ' + (t.start + t.len - 1) + ' 周（共 ' + t.len + ' 周）';
        }
      }),
      grid: { left: 8, right: 30, top: 24, bottom: 34, containLabel: true },
      xAxis: {
        type: 'value',
        min: 0,
        max: 81,
        interval: 10,
        axisLabel: Object.assign(axisLabelStyle(), {
          formatter: function (v) { return v === 0 ? '启动' : v + '周'; }
        }),
        splitLine: { lineStyle: { color: rule, type: 'dashed' } },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'category',
        data: yNames,
        axisLabel: Object.assign(axisLabelStyle(), { fontSize: 11.5 }),
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      series: [
        {
          name: 'placeholder',
          type: 'bar',
          stack: 'total',
          silent: true,
          itemStyle: { color: 'transparent' },
          data: placeholder,
          barWidth: 16
        },
        {
          name: '周期',
          type: 'bar',
          stack: 'total',
          data: dur,
          barWidth: 16,
          label: {
            show: true,
            position: 'right',
            formatter: function (p) { return tasks[tasks.length - 1 - p.dataIndex].len + ' 周'; },
            color: muted,
            fontFamily: FONT,
            fontSize: 10.5
          }
        }
      ]
    });
    charts.push(chart);
  })();

  // ================= Chart 4: 风险矩阵 =================
  (function () {
    var el = document.getElementById('chart-risk');
    if (!el) return;
    var chart = echarts.init(el, null, { renderer: 'svg' });
    var risks = [
      { name: '数据泄露 / 合规违规', x: 4.2, y: 4.8, s: 36 },
      { name: '主观题评分偏差与跨档误判', x: 4.0, y: 4.4, s: 34 },
      { name: '教师抵触、使用率低', x: 3.4, y: 3.9, s: 28 },
      { name: '过度依赖 AI 弱化教师判断', x: 2.7, y: 4.3, s: 26 },
      { name: '手写识别失败率偏高', x: 3.8, y: 3.0, s: 25 },
      { name: '模型幻觉产生错误评语', x: 3.0, y: 3.9, s: 23 },
      { name: '与现有教学流程冲突', x: 3.0, y: 2.7, s: 19 },
      { name: '算力与运维成本超支', x: 2.4, y: 2.5, s: 16 }
    ];
    function riskColor(r) {
      var score = (r.x + r.y) / 2;
      if (score >= 3.9) return danger;
      if (score >= 3.2) return accent;
      return accent2;
    }
    chart.setOption({
      animation: false,
      tooltip: Object.assign(baseTooltip(), {
        formatter: function (p) {
          var r = p.data.meta;
          return '<b>' + r.name + '</b><br/>发生可能性：' + r.x + ' / 5<br/>影响程度：' + r.y + ' / 5';
        }
      }),
      grid: { left: 8, right: 40, top: 28, bottom: 40, containLabel: true },
      xAxis: {
        type: 'value',
        min: 1,
        max: 5,
        interval: 1,
        name: '发生可能性 →',
        nameLocation: 'middle',
        nameGap: 28,
        nameTextStyle: { color: muted, fontFamily: FONT, fontSize: 11 },
        axisLabel: axisLabelStyle(),
        splitLine: { lineStyle: { color: rule, type: 'dashed' } },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        min: 1,
        max: 5,
        interval: 1,
        name: '影响程度 →',
        nameTextStyle: { color: muted, fontFamily: FONT, fontSize: 11 },
        axisLabel: axisLabelStyle(),
        splitLine: { lineStyle: { color: rule, type: 'dashed' } },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: [{
        type: 'scatter',
        symbolSize: function (d) { return d[2]; },
        data: risks.map(function (r) {
          return {
            value: [r.x, r.y],
            meta: r,
            itemStyle: { color: riskColor(r) + 'cc', borderColor: riskColor(r), borderWidth: 1.5 }
          };
        }),
        label: {
          show: true,
          formatter: function (p) { return p.data.meta.name; },
          position: 'right',
          color: ink,
          fontFamily: FONT,
          fontSize: 11
        },
        labelLayout: { hideOverlap: true },
        markArea: {
          silent: true,
          itemStyle: { color: 'rgba(191,58,28,0.05)' },
          label: {
            show: true,
            position: 'insideTopRight',
            color: danger,
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 700,
            formatter: '优先处置区'
          },
          data: [[{ xAxis: 3, yAxis: 3 }, { xAxis: 5, yAxis: 5 }]]
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: rule, type: 'dashed' },
          label: { show: false },
          data: [{ xAxis: 3 }, { yAxis: 3 }]
        }
      }]
    });
    charts.push(chart);
  })();

  // ================= Chart 5: 批改耗时结构对比 =================
  (function () {
    var el = document.getElementById('chart-workload');
    if (!el) return;
    var chart = echarts.init(el, null, { renderer: 'svg' });
    var cats = ['AI 辅助后', '现状'];
    chart.setOption({
      animation: false,
      tooltip: Object.assign(baseTooltip(), {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (p) {
          var total = p.reduce(function (a, b) { return a + b.value; }, 0);
          var lines = p.map(function (d) {
            return d.marker + d.seriesName + '：<b>' + d.value + '</b> 分钟';
          });
          return '<b>' + p[0].name + '</b><br/>' + lines.join('<br/>') + '<br/>合计：<b>' + total + '</b> 分钟';
        }
      }),
      legend: {
        top: 0,
        textStyle: { color: muted, fontFamily: FONT, fontSize: 11.5 },
        itemWidth: 12,
        itemHeight: 10
      },
      grid: { left: 8, right: 40, top: 40, bottom: 12, containLabel: true },
      xAxis: {
        type: 'value',
        name: '分钟',
        nameTextStyle: { color: muted, fontFamily: FONT, fontSize: 11 },
        axisLabel: axisLabelStyle(),
        splitLine: { lineStyle: { color: rule, type: 'dashed' } },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'category',
        data: cats,
        axisLabel: Object.assign(axisLabelStyle(), { fontWeight: 700, color: ink }),
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      series: [
        { name: '客观题判分', type: 'bar', stack: 'total', barWidth: 34, data: [5, 45], itemStyle: { color: accent2 } },
        { name: '主观题评分', type: 'bar', stack: 'total', data: [90, 180], itemStyle: { color: accent } },
        { name: '评语撰写', type: 'bar', stack: 'total', data: [20, 45], itemStyle: { color: accent + '99' } },
        { name: '学情统计与讲评准备', type: 'bar', stack: 'total', data: [10, 30], itemStyle: { color: accent2 + '99', borderRadius: [0, 6, 6, 0] } },
        {
          name: '合计',
          type: 'bar',
          stack: 'total',
          data: [0, 0],
          silent: true,
          itemStyle: { color: 'transparent' },
          label: {
            show: true,
            position: 'right',
            formatter: function (p) { return p.dataIndex === 0 ? '合计 125 分钟' : '合计 300 分钟'; },
            color: ink,
            fontWeight: 700,
            fontFamily: FONT,
            fontSize: 12
          }
        }
      ]
    });
    charts.push(chart);
  })();

  // ================= Chart 6: 三维度价值预期 =================
  (function () {
    var el = document.getElementById('chart-value');
    if (!el) return;
    var chart = echarts.init(el, null, { renderer: 'svg' });
    chart.setOption({
      animation: false,
      tooltip: Object.assign(baseTooltip(), {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (p) {
          return '<b>' + p[0].name + '</b><br/>' + p.map(function (d) {
            return d.marker + d.seriesName + '：<b>' + d.value + '%</b>';
          }).join('<br/>');
        }
      }),
      legend: {
        top: 0,
        textStyle: { color: muted, fontFamily: FONT, fontSize: 11.5 },
        itemWidth: 12,
        itemHeight: 10
      },
      grid: { left: 8, right: 24, top: 44, bottom: 12, containLabel: true },
      xAxis: {
        type: 'category',
        data: ['批改效率提升', '反馈及时性提升', '教学数据沉淀提升'],
        axisLabel: Object.assign(axisLabelStyle(), { fontWeight: 700, color: ink }),
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        max: 100,
        name: '相对现状的提升幅度（%）',
        nameTextStyle: { color: muted, fontFamily: FONT, fontSize: 11 },
        axisLabel: Object.assign(axisLabelStyle(), { formatter: '{value}%' }),
        splitLine: { lineStyle: { color: rule, type: 'dashed' } },
        axisLine: { show: false }
      },
      series: [
        {
          name: '保守情景',
          type: 'bar',
          barWidth: 18,
          data: [35, 42, 60],
          itemStyle: { color: accent + '66', borderRadius: [5, 5, 0, 0] }
        },
        {
          name: '中性情景（测算基准）',
          type: 'bar',
          barWidth: 18,
          data: [58, 65, 85],
          itemStyle: { color: accent, borderRadius: [5, 5, 0, 0] },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: ink,
            fontWeight: 700,
            fontFamily: FONT,
            fontSize: 11
          }
        },
        {
          name: '乐观情景',
          type: 'bar',
          barWidth: 18,
          data: [70, 78, 95],
          itemStyle: { color: accent2, borderRadius: [5, 5, 0, 0] }
        }
      ]
    });
    charts.push(chart);
  })();

  window.addEventListener('resize', function () {
    charts.forEach(function (c) { c.resize(); });
  });
})();
