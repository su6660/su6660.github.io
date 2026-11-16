// 跑步运动分析报告 - 图表初始化
(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  var baseText = { color: ink, fontFamily: 'Outfit, PingFang SC, Microsoft YaHei, sans-serif' };

  // --- Chart 1: 心率五区间 ---
  var zoneColors = [accent + '4d', accent + '80', accent, accent2 + 'cc', accent2];
  var chartHr = echarts.init(document.getElementById('chart-hr'), null, { renderer: 'svg' });
  chartHr.setOption({
    animation: false,
    textStyle: baseText,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: function (ps) {
        var p = ps[0];
        var info = [
          '恢复区：极易强度，主动恢复、热身放松',
          '燃脂区：轻松跑强度，可全程交谈，有氧基础',
          '有氧区：马拉松配速附近，提升有氧能力',
          '阈值区：乳酸阈值强度，提升耐力上限',
          '无氧区：最大摄氧量强度，短间歇冲刺'
        ];
        return '<b>' + p.name + '</b><br/>' + p.value + '% HRmax<br/>' + info[p.dataIndex];
      }
    },
    grid: { left: 10, right: 40, top: 10, bottom: 10, containLabel: true },
    xAxis: {
      type: 'value', max: 100, name: '% HRmax',
      nameTextStyle: { color: muted },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule } }
    },
    yAxis: {
      type: 'category',
      data: ['Z5 无氧区', 'Z4 阈值区', 'Z3 有氧区', 'Z2 燃脂区', 'Z1 恢复区'],
      axisLabel: { color: ink, fontWeight: 600 },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      barWidth: 26,
      data: [
        { value: 10, itemStyle: { color: zoneColors[4] } },
        { value: 10, itemStyle: { color: zoneColors[3] } },
        { value: 10, itemStyle: { color: zoneColors[2] } },
        { value: 10, itemStyle: { color: zoneColors[1] } },
        { value: 10, itemStyle: { color: zoneColors[0] } }
      ],
      label: {
        show: true, position: 'right', color: ink, fontWeight: 600,
        formatter: function (p) {
          return ['90–100%', '80–90%', '70–80%', '60–70%', '50–60%'][p.dataIndex];
        }
      }
    }]
  });
  window.addEventListener('resize', function () { chartHr.resize(); });

  // --- Chart 2: 能量消耗 ---
  var chartEnergy = echarts.init(document.getElementById('chart-energy'), null, { renderer: 'svg' });
  chartEnergy.setOption({
    animation: false,
    textStyle: baseText,
    color: [accent, accent2],
    tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
    legend: { bottom: 0, textStyle: { color: ink } },
    grid: { left: 10, right: 20, top: 40, bottom: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: ['步行\n6 km/h', '轻松跑\n8 km/h', '慢跑\n10 km/h', '中速跑\n12 km/h', '快速跑\n14.5 km/h'],
      axisLabel: { color: ink, interval: 0, lineHeight: 16 },
      axisLine: { lineStyle: { color: rule } }
    },
    yAxis: {
      type: 'value', name: 'kcal / 30 分钟',
      nameTextStyle: { color: muted },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule } }
    },
    series: [
      { name: '体重 60 kg', type: 'bar', barWidth: 18, data: [105, 235, 295, 370, 445] },
      { name: '体重 75 kg', type: 'bar', barWidth: 18, data: [130, 295, 370, 465, 555] }
    ]
  });
  window.addEventListener('resize', function () { chartEnergy.resize(); });

  // --- Chart 3: 常见损伤分布 ---
  var chartInjury = echarts.init(document.getElementById('chart-injury'), null, { renderer: 'svg' });
  chartInjury.setOption({
    animation: false,
    textStyle: baseText,
    tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' }, formatter: '{b}<br/>约占跑步相关损伤的 {c}%' },
    grid: { left: 10, right: 40, top: 10, bottom: 10, containLabel: true },
    xAxis: {
      type: 'value', name: '%', nameTextStyle: { color: muted },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule } }
    },
    yAxis: {
      type: 'category',
      data: ['应力性骨折', '髂胫束综合征', '跟腱病变', '足底筋膜炎', '胫骨应力综合征', '髌股疼痛综合征（跑步膝）'],
      axisLabel: { color: ink },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      barWidth: 18,
      data: [
        { value: 6, itemStyle: { color: accent2 + '99' } },
        { value: 8, itemStyle: { color: accent2 + '99' } },
        { value: 11, itemStyle: { color: accent + 'bb' } },
        { value: 10, itemStyle: { color: accent + 'bb' } },
        { value: 17, itemStyle: { color: accent } },
        { value: 25, itemStyle: { color: accent2 } }
      ],
      label: { show: true, position: 'right', color: ink, fontWeight: 600, formatter: '{c}%' }
    }]
  });
  window.addEventListener('resize', function () { chartInjury.resize(); });

  // --- Chart 4: 新手 8 周起步计划 ---
  var chartPlan = echarts.init(document.getElementById('chart-plan'), null, { renderer: 'svg' });
  chartPlan.setOption({
    animation: false,
    textStyle: baseText,
    tooltip: { trigger: 'axis', appendToBody: true },
    grid: { left: 10, right: 30, top: 40, bottom: 30, containLabel: true },
    xAxis: {
      type: 'category',
      data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
      axisLabel: { color: ink },
      axisLine: { lineStyle: { color: rule } },
      boundaryGap: false
    },
    yAxis: {
      type: 'value', name: '每周累计跑步时间（分钟）',
      nameTextStyle: { color: muted },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule } }
    },
    series: [{
      name: '跑步时间',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [27, 36, 45, 45, 60, 70, 80, 90],
      lineStyle: { width: 3, color: accent },
      itemStyle: { color: accent },
      areaStyle: { color: accent, opacity: 0.12 },
      label: { show: true, position: 'top', color: muted, fontSize: 11 },
      markLine: {
        symbol: 'none',
        data: [{ yAxis: 90, label: { formatter: '目标：连续跑 30 分钟', color: accent2, position: 'insideEndTop' }, lineStyle: { color: accent2, type: 'dashed' } }]
      }
    }]
  });
  window.addEventListener('resize', function () { chartPlan.resize(); });

  // --- Chart 5: 80/20 强度分布 ---
  var chart8020 = echarts.init(document.getElementById('chart-8020'), null, { renderer: 'svg' });
  chart8020.setOption({
    animation: false,
    textStyle: baseText,
    tooltip: { appendToBody: true, formatter: '{b}：{c}%（{d}%）' },
    legend: { bottom: 0, textStyle: { color: ink } },
    series: [{
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['50%', '44%'],
      label: { color: ink, formatter: '{b}\n{c}%' },
      labelLine: { lineStyle: { color: muted } },
      itemStyle: { borderColor: '#ffffff', borderWidth: 2 },
      data: [
        { name: '低强度有氧（Z1–Z2）', value: 80, itemStyle: { color: accent } },
        { name: '中等强度（Z3）', value: 12, itemStyle: { color: accent2 } },
        { name: '高强度（Z4–Z5）', value: 8, itemStyle: { color: muted } }
      ]
    }]
  });
  window.addEventListener('resize', function () { chart8020.resize(); });
})();
