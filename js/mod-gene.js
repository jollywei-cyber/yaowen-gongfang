/* ============================================================
   瑶纹工坊 · mod-gene.js —— 模块一：纹样图鉴 + 可控创作台
   ============================================================ */
(function(){
'use strict';
var A = window.App, GENES = window.GENES, GeneAPI = window.GeneAPI;

/* ============================================================
   视图 A：纹样图鉴（#/gene）
   ============================================================ */
var filter = { dim:'branch', val:'全部' };

function mountLibrary(root, params){
  var wrap = A.el('div', 'fadein');

  /* —— 模块头 —— */
  var head = A.el('div');
  head.innerHTML =
    '<div class="sec-title" style="margin-top:0">瑶纹数字基因库<small>高清素材数字化 · base64 内嵌 · 离线可用</small></div>' +
    '<p style="font-size:13.5px;color:var(--ink-2);line-height:1.9">纹样按三级分级管控：核心信仰 / 祭祀类纹样仅作展示，生活装饰类纹样开放可控创意。点击卡片查看文化释义。</p>';
  wrap.appendChild(head);

  var studioEntry = A.el('button', 'btn', '进入创作台 · 重组可创作纹样');
  studioEntry.style.cssText = 'width:100%;margin-top:14px';
  studioEntry.addEventListener('click', function(){ A.go('#/studio'); A.buzz(); });
  wrap.appendChild(studioEntry);

  /* —— 筛选器 —— */
  var box = A.el('div', 'gene-filter');
  box.style.marginTop = '18px';
  var dimRow = A.el('div', 'dim');
  dimRow.innerHTML = '<b>维度</b>';
  var seg = A.el('div', 'seg');
  [['branch','支系分类'],['theme','主题分类']].forEach(function(d){
    var b = A.el('button', filter.dim === d[0] ? 'on' : '', d[1]);
    b.addEventListener('click', function(){
      filter.dim = d[0]; filter.val = '全部';
      A.go('#/gene'); // 重挂载
    });
    seg.appendChild(b);
  });
  dimRow.appendChild(seg);
  box.appendChild(dimRow);

  var valRow = A.el('div', 'dim');
  valRow.innerHTML = '<b>分类</b>';
  var chips = A.el('div', 'chiprow');
  var vals = filter.dim === 'branch' ? GeneAPI.branches() : GeneAPI.themes();
  vals.forEach(function(v){
    var n = v === '全部' ? GENES.length :
      GeneAPI.countBy(function(g){ return filter.dim === 'branch' ? (v === '通用' ? g.branch === '通用' : g.branch === v) : g.theme === v; });
    var c = A.el('button', 'chip' + (filter.val === v ? ' on' : ''), A.esc(v) + '<span class="n">' + n + '</span>');
    c.addEventListener('click', function(){ filter.val = v; A.go('#/gene'); });
    chips.appendChild(c);
  });
  valRow.appendChild(chips);
  box.appendChild(valRow);
  wrap.appendChild(box);

  /* —— 卡片瀑布流 —— */
  var list = GENES.filter(function(g){
    if(filter.val === '全部') return true;
    return filter.dim === 'branch' ? g.branch === filter.val : g.theme === filter.val;
  });
  var count = A.el('div', 'gene-count', '共 ' + list.length + ' 款纹样 · ' +
    (filter.dim === 'branch' ? '按支系' : '按主题') + '：「' + filter.val + '」');
  wrap.appendChild(count);

  var masonry = A.el('div', 'masonry');
  list.forEach(function(g){
    var im = g.img;
    var ratio = im ? (im.w / im.h) : 1;
    var card = A.el('div', 'gcard');
    card.innerHTML =
      '<div class="thumb" style="aspect-ratio:' + ratio.toFixed(3) + '">' +
        GeneAPI.geneSVG(g, { attrs:'width="100%" height="100%" style="display:block;background:var(--cloth-3)"' }) +
        '<span class="lv tag ' + (g.level === 1 ? 'lv1' : 'lv2') + '">' + GeneAPI.LEVEL_TAGS[g.level] + '</span>' +
      '</div>' +
      '<div class="meta"><div class="nm">' + A.esc(g.name) + '</div>' +
      '<div class="sub"><span>' + A.esc(g.branch) + '</span><span>·</span><span>' + A.esc(g.theme) + '</span></div></div>';
    card.addEventListener('click', function(){ A.go('#/gene/detail?id=' + g.id); A.buzz(); });
    masonry.appendChild(card);
  });
  if(!list.length) masonry.appendChild(A.el('div', 'empty', '该分类下暂无纹样'));
  wrap.appendChild(masonry);

  wrap.appendChild(A.el('div', 'footnote',
    '注：支系归属按常见分布整理，用于检索演示；具体到村寨的使用差异，以地方志与传承人口述为准。' +
    '「传承人溯源」栏中缺失的信息均标注「待补充」，不做臆测填写。纹样图像经压缩优化后以 base64 形式内嵌，无外部请求。'));

  root.appendChild(wrap);
}

/* ============================================================
   视图 B：纹样详情（#/gene/detail?id=）
   ============================================================ */
function mountDetail(root, params){
  var g = GeneAPI.byId(params.id);
  if(!g){ A.go('#/gene'); return; }
  var wrap = A.el('div', 'fadein');

  var back = A.el('button', 'btn ghost sm', '← 返回图鉴');
  back.addEventListener('click', function(){ history.length > 1 ? history.back() : A.go('#/gene'); });
  wrap.appendChild(back);

  var hero = A.el('div', 'detail-hero');
  hero.style.marginTop = '14px';
  hero.innerHTML = GeneAPI.geneSVG(g, { attrs:'width="100%" height="100%" style="display:block;background:var(--cloth-3)"' });
  wrap.appendChild(hero);

  var body = A.el('div', 'detail-body');
  var lvCls = g.level === 1 ? 'lv1' : 'lv2';
  body.innerHTML =
    '<h1>' + A.esc(g.name) + '<span class="alias">' + A.esc(g.alias) + '</span>' +
    '<span class="tag ' + lvCls + '">' + GeneAPI.LEVEL_NAMES[g.level] + '</span></h1>' +
    '<dl class="kv">' +
    '<dt>文化寓意</dt><dd>' + A.esc(g.meaning) + '</dd>' +
    '<dt>使用场景</dt><dd>' + A.esc(g.usage) + '</dd>' +
    '<dt>所属支系</dt><dd><span class="tag plain">' + A.esc(g.branch) + '</span><span class="tag plain">' + A.esc(g.theme) + '</span></dd>' +
    '<dt>分级管控</dt><dd>' + (g.level === 1
      ? '核心保护级：仅开放浏览与文字解读，<b>禁止下载、编辑、二次创作</b>'
      : '创意限定级：开放重组与构图调整，<b>禁止篡改形态与寓意</b>') + '</dd>' +
    '<dt>传承人溯源</dt><dd>' + A.esc(g.origin) + ' <span class="tag lv3">待补充</span></dd>' +
    '</dl>';
  if(g.level === 1){
    var n = A.el('div', 'notice', '<b>文化合规提示：</b>' + A.esc(g.name) + '属核心信仰 / 祭祀类符号，按三级分级管控要求仅作展示，本应用不提供该纹样的下载、保存与二次编辑入口。');
    body.appendChild(n);
  }else{
    var n2 = A.el('div', 'notice ok', '<b>创意权限：</b>本纹样属生活装饰类，可在创作台中重组构图、更换画布形状（方形绣片 / 衣服 / 布袋子）；导出作品将自动附带溯源水印，仅限非商业性传播。');
    body.appendChild(n2);
  }
  var acts = A.el('div', 'detail-actions');
  if(g.level === 2){
    var b1 = A.el('button', 'btn', '进入创作台使用此纹样');
    b1.addEventListener('click', function(){ A.go('#/studio?gene=' + g.id); A.buzz(); });
    acts.appendChild(b1);
  }else{
    var b2 = A.el('button', 'btn', '仅展示纹样 · 创作功能已禁用');
    b2.disabled = true;
    acts.appendChild(b2);
  }
  body.appendChild(acts);
  wrap.appendChild(body);

  wrap.appendChild(A.el('div', 'footnote',
    '纹样以高清数字化图像存储与渲染（base64 内嵌、无外部请求）。创作台提供方形绣片、衣服、布袋子三种画布形状，纹样绣制于所选画布轮廓之内，导出作品自动附带溯源水印。'));

  root.appendChild(wrap);
}

/* ============================================================
   视图 C：创作台（#/studio）—— 可控式纹样创意生成
   ============================================================ */
var S = null;

/* ---------- 画布形状（生活中常用载体；路径为 400x400 场景坐标） ---------- */
var CANVAS_SHAPES = [
  { id:'patch', name:'方形绣片',
    path:'M36,12 H364 A24,24 0 0 1 388,36 V364 A24,24 0 0 1 364,388 H36 A24,24 0 0 1 12,364 V36 A24,24 0 0 1 36,12 Z',
    detail:'',
    safe:{ x0:36, y0:36, x1:364, y1:364 } },
  { id:'cloth', name:'衣服',
    path:'M140,72 L96,88 L56,128 L92,168 L116,144 L116,336 L284,336 L284,144 L308,168 L344,128 L304,88 L260,72 C244,108 156,108 140,72 Z',
    detail:'',
    safe:{ x0:132, y0:172, x1:268, y1:308 } },
  { id:'bag', name:'布袋子',
    path:'M120,96 C136,72 264,72 280,96 C312,144 312,232 288,288 C264,336 232,352 200,352 C168,352 136,336 112,288 C88,232 88,144 120,96 Z',
    detail:'M104,128 C160,110 240,110 296,128 M172,120 L158,168 M228,120 L242,168',
    safe:{ x0:136, y0:140, x1:264, y1:292 } }
];
function shapeById(id){
  for(var i = 0; i < CANVAS_SHAPES.length; i++) if(CANVAS_SHAPES[i].id === id) return CANVAS_SHAPES[i];
  return CANVAS_SHAPES[0];
}
var BENCH = '#E7DEC9';   // 工作台底色，与 CSS --bench 保持一致
var FABRIC = '#F8F3E6';  // 画布织物色，与 CSS --fabric 保持一致
var EDGE = '#9C8D72';    // 画布轮廓线，与 CSS --edge 保持一致
/* 注意：画布层的颜色用 SVG 表示属性内联（而非 CSS 类）——导出时场景被序列化为
   独立 SVG data-URI，外部样式表不跟随，依赖 CSS 类会回落成默认黑色填充。 */

function freshState(){
  return {
    items:[], uid:0, sel:null,
    shape:'patch',           // 画布形状
    symMode:'none',          // none | x | y | xy
    checkPass:false,
    drag:null                // 拖拽中的素材信息
  };
}
var SCENE = 400; // 场景逻辑尺寸

function mountStudio(root, params){
  S = freshState();
  var wrap = A.el('div', 'studio fadein');

  /* —— 画布舞台 —— */
  var stageWrap = A.el('div', 'stage-wrap');
  var stage = A.el('div', 'stage');
  stage.id = 'stage';
  var scene = document.createElementNS(A.SVGNS, 'svg');
  scene.setAttribute('class', 'scene');
  scene.setAttribute('viewBox', '0 0 ' + SCENE + ' ' + SCENE);
  scene.id = 'scene';
  var hint = A.el('div', 'hint', '<div>从下方<b>素材栏</b>拖拽纹样到画布<br>单指拖动 · 双指缩放旋转 · 桌面端支持滚轮缩放<br>纹样绣制于画布轮廓之内</div>');
  stage.appendChild(scene); stage.appendChild(hint);
  stageWrap.appendChild(stage);
  wrap.appendChild(stageWrap);

  /* —— 素材栏（仅「可创作」纹样） —— */
  var matbar = A.el('div', 'matbar');
  matbar.id = 'matbar';
  GeneAPI.creative().forEach(function(g){
    var m = A.el('div', 'mat', GeneAPI.geneSVGInner(g) + '<div class="mn">' + A.esc(g.name) + '</div>');
    m.dataset.gene = g.id;
    m.addEventListener('pointerdown', function(e){ startMatDrag(e, m, g); });
    matbar.appendChild(m);
  });
  wrap.appendChild(matbar);

  /* —— 控制面板区 —— */
  var grid = A.el('div', 'studio-grid');

  /* 画布形状（方形绣片 / 衣服 / 布袋子——生活中常用载体） */
  var shapePanel = A.el('div', 'studio-panel');
  shapePanel.innerHTML = '<h3>画布形状 <small>选择绣制载体</small></h3>';
  var shapeRow = A.el('div', 'shape-row');
  CANVAS_SHAPES.forEach(function(sh){
    var b = A.el('button', 'shape' + (sh.id === S.shape ? ' on' : ''));
    b.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><g transform="scale(.25)">' +
      '<path d="' + sh.path + '"/></g></svg>' + A.esc(sh.name);
    b.addEventListener('click', function(){
      if(S.shape === sh.id) return;
      S.shape = sh.id;
      /* 已有纹样收进新画布的安全区，避免遗落在轮廓之外 */
      S.items.forEach(function(it){
        it.x = A.clamp(it.x, sh.safe.x0, sh.safe.x1);
        it.y = A.clamp(it.y, sh.safe.y0, sh.safe.y1);
      });
      shapeRow.querySelectorAll('.shape').forEach(function(x){ x.classList.remove('on'); });
      b.classList.add('on');
      renderScene();
      A.toast('已切换画布：「' + sh.name + '」');
      A.buzz();
    });
    shapeRow.appendChild(b);
  });
  shapePanel.appendChild(shapeRow);
  var shapeTip = A.el('p', 'costume-tip', '纹样绣制在画布轮廓之内，超出部分自动裁去；拖动纹样时其中心被限制在织物区域内。');
  shapeTip.style.marginTop = '10px';
  shapePanel.appendChild(shapeTip);
  grid.appendChild(shapePanel);

  /* 对称构图 */
  var symPanel = A.el('div', 'studio-panel');
  symPanel.innerHTML = '<h3>传统对称构图 <small>辅助线 + 镜像吸附</small></h3>';
  var symRow = A.el('div', 'sym-row');
  [['none','关闭'],['x','左右对称'],['y','上下对称'],['xy','四方对称']].forEach(function(m){
    var b = A.el('button', 'chip' + (S.symMode === m[0] ? ' on' : ''), m[1]);
    b.addEventListener('click', function(){
      S.symMode = m[0];
      symRow.querySelectorAll('.chip').forEach(function(x){ x.classList.remove('on'); });
      b.classList.add('on');
      renderScene();
      A.toast(m[0] === 'none' ? '已关闭对称辅助线' : '已开启' + m[1] + '：新放入的纹样将自动镜像');
    });
    symRow.appendChild(b);
  });
  symPanel.appendChild(symRow);
  var symTip = A.el('p', 'costume-tip', '瑶绣讲究「对折绣」：以中轴线对折绷布，左右（或上下）纹样严格成双。开启后拖入画布的纹样会自动生成镜像副本，成组移动与删除。');
  symTip.style.marginTop = '10px';
  symPanel.appendChild(symTip);
  grid.appendChild(symPanel);

  /* 已放置纹样 */
  var layerPanel = A.el('div', 'studio-panel');
  layerPanel.innerHTML = '<h3>画布纹样 <small>点击选中，拖拽调整</small></h3>';
  var layerList = A.el('div');
  layerList.id = 'layerList';
  layerPanel.appendChild(layerList);
  grid.appendChild(layerPanel);

  /* 合规校验 + 导出 */
  var chkPanel = A.el('div', 'studio-panel');
  chkPanel.innerHTML = '<h3>文化合规校验 <small>导出前必须通过</small></h3>';
  var report = A.el('div', 'check-report');
  report.id = 'checkReport';
  report.innerHTML = '<span style="color:var(--ink-2)">尚未校验。点击「校验」检测纹样组合是否存在文化符号误用。</span>';
  chkPanel.appendChild(report);
  var btnRow = A.el('div');
  btnRow.style.cssText = 'display:flex;gap:10px;margin-top:12px';
  var btnChk = A.el('button', 'btn ghost', '校验');
  var btnExp = A.el('button', 'btn', '导出 PNG');
  btnExp.id = 'btnExport';
  btnExp.disabled = true;
  btnChk.addEventListener('click', runCheck);
  btnExp.addEventListener('click', exportPNG);
  btnRow.appendChild(btnChk); btnRow.appendChild(btnExp);
  chkPanel.appendChild(btnRow);
  grid.appendChild(chkPanel);

  wrap.appendChild(grid);

  wrap.appendChild(A.el('div', 'footnote',
    '创作台仅收录「二级 · 创意限定级」纹样；一级核心保护纹样（盘王印）在任何路径下均不可进入创作流程。' +
    '导出图片右下角自动附带「瑶族传统纹样衍生」溯源水印。'));

  root.appendChild(wrap);

  /* —— 若由详情页跳入并指定纹样 —— */
  if(params.gene){
    var g0 = GeneAPI.byId(params.gene);
    if(g0 && g0.level === 2){
      placeItem(g0.id, SCENE / 2, SCENE / 2, -18);
      A.toast('已放入「' + g0.name + '」，可继续拖入其他纹样重组');
    }
  }

  bindStage(stage, scene, hint);
  renderScene(); renderLayers();

  /* —— 键盘删除（桌面端） —— */
  wrap.addEventListener('keydown', function(e){
    if((e.key === 'Delete' || e.key === 'Backspace') && S.sel != null){
      removeItem(S.sel); e.preventDefault();
    }
  });
}

/* ---------- 场景渲染 ---------- */
function renderScene(){
  var scene = document.getElementById('scene');
  if(!scene || !S) return;
  var ns = A.SVGNS;
  var sh = shapeById(S.shape);
  scene.innerHTML = '';

  /* 画布层：织物底 + 轮廓线（+ 布袋子束口细节）——颜色内联为表示属性 */
  var layer = document.createElementNS(ns, 'g');
  layer.setAttribute('class', 'canvas-layer');
  layer.innerHTML = '<path class="canvas-fill" d="' + sh.path + '" fill="' + FABRIC + '"/>' +
    '<path class="canvas-edge" d="' + sh.path + '" fill="none" stroke="' + EDGE + '" stroke-width="2.4" stroke-linejoin="round"/>' +
    (sh.detail ? '<path class="canvas-detail" d="' + sh.detail + '" fill="none" stroke="' + EDGE + '" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>' : '');
  scene.appendChild(layer);

  /* 裁剪区：纹样只绣在画布轮廓内 */
  var clip = document.createElementNS(ns, 'clipPath');
  clip.id = 'sceneClip';
  clip.innerHTML = '<path d="' + sh.path + '"/>';
  scene.appendChild(clip);

  var body = document.createElementNS(ns, 'g');
  body.setAttribute('clip-path', 'url(#sceneClip)');

  /* 对称辅助线 */
  if(S.symMode !== 'none'){
    var gl = document.createElementNS(ns, 'g');
    if(S.symMode === 'x' || S.symMode === 'xy')
      gl.innerHTML = '<line class="sym-guide" x1="200" y1="0" x2="200" y2="400"/>';
    if(S.symMode === 'y' || S.symMode === 'xy')
      gl.innerHTML += '<line class="sym-guide" x1="0" y1="200" x2="400" y2="200"/>';
    if(S.symMode === 'xy')
      gl.innerHTML += '<line class="sym-guide" x1="0" y1="0" x2="400" y2="400" stroke-dasharray="2 6"/>';
    body.appendChild(gl);
  }

  /* 纹样（含镜像） */
  S.items.forEach(function(it){
    var g = GeneAPI.byId(it.geneId);
    if(!g) return;
    var mirrors = [];
    if(it.sym === 'x' || it.sym === 'xy') mirrors.push([SCENE - it.x, it.y, -1, 1]);
    if(it.sym === 'y' || it.sym === 'xy') mirrors.push([it.x, SCENE - it.y, 1, -1]);
    if(it.sym === 'xy') mirrors.push([SCENE - it.x, SCENE - it.y, -1, -1]);
    var all = [[it.x, it.y, 1, 1, true]].concat(mirrors.map(function(m){ return [m[0], m[1], m[2], m[3], false]; }));
    all.forEach(function(t){
      var node = document.createElementNS(ns, 'g');
      node.setAttribute('class', 'item');
      node.dataset.uid = t[4] ? it.uid : '';
      node.setAttribute('transform',
        'translate(' + t[0] + ' ' + t[1] + ') scale(' + t[2] + ' ' + t[3] + ') rotate(' + it.rot + ') scale(' + it.scale + ') translate(-50,-50)');
      node.innerHTML = GeneAPI.geneSVGInner(g);
      if(!t[4]) node.style.pointerEvents = 'none';
      body.appendChild(node);
    });
  });
  scene.appendChild(body);

  /* 选中环（置于裁剪组之外，保证始终完整可见） */
  if(S.sel != null){
    var it = S.items.filter(function(x){ return x.uid === S.sel; })[0];
    if(it){
      var ring = document.createElementNS(ns, 'g');
      ring.setAttribute('transform', 'translate(' + it.x + ' ' + it.y + ')');
      var r = 53 * it.scale;
      ring.innerHTML = '<rect class="sel-ring" x="' + (-r) + '" y="' + (-r) + '" width="' + (2*r) + '" height="' + (2*r) + '" rx="6"/>';
      scene.appendChild(ring);
    }
  }
}

/* ---------- 图层列表 ---------- */
function renderLayers(){
  var box = document.getElementById('layerList');
  if(!box) return;
  box.innerHTML = '';
  if(!S.items.length){
    box.innerHTML = '<div style="font-size:13px;color:var(--ink-2);padding:6px 2px">画布还是空的——从素材栏拖一个纹样进来吧。</div>';
    return;
  }
  S.items.forEach(function(it){
    var g = GeneAPI.byId(it.geneId);
    var row = A.el('div', 'layer-item' + (S.sel === it.uid ? ' on' : ''));
    row.innerHTML = '<span class="li-nm">' + A.esc(g.name) + (it.sym !== 'none' ? ' <small style="color:var(--ink-2)">镜像组</small>' : '') + '</span>' +
      '<span style="color:var(--ink-2);font-size:12px">' + Math.round(it.scale * 100) + '%</span>';
    var del = A.el('button', 'li-del', '✕');
    del.addEventListener('click', function(e){ e.stopPropagation(); removeItem(it.uid); });
    row.appendChild(del);
    row.addEventListener('click', function(){ S.sel = it.uid; renderScene(); renderLayers(); });
    box.appendChild(row);
  });
}

/* ---------- 增删 ---------- */
function placeItem(geneId, x, y, rot){
  var sh = shapeById(S.shape);
  var it = { uid:++S.uid, geneId:geneId,
    x:A.clamp(x, sh.safe.x0, sh.safe.x1), y:A.clamp(y, sh.safe.y0, sh.safe.y1),
    rot:rot || 0, scale:.62, sym:S.symMode };
  S.items.push(it);
  /* 放入时不自动选中：画布上不出现虚线框，需要调整时点击纹样即可 */
  invalidate(); renderScene(); renderLayers();
  return it;
}
function removeItem(uid){
  S.items = S.items.filter(function(x){ return x.uid !== uid; });
  if(S.sel === uid) S.sel = null;
  invalidate(); renderScene(); renderLayers();
}
function invalidate(){
  S.checkPass = false;
  var btnExp = document.getElementById('btnExport');
  if(btnExp) btnExp.disabled = true;
  var report = document.getElementById('checkReport');
  if(report) report.innerHTML = '<span style="color:var(--ink-2)">构图已修改，请重新校验后再导出。</span>';
}

/* ---------- 合规校验 ---------- */
var ANIMALS = ['matou'];
function normRot(r){ r = ((r % 360) + 360) % 360; return r; }
function runCheck(){
  var errs = [], warns = [];
  if(!S.items.length){
    errs.push('画布为空：请先放入至少一个纹样再校验。');
  }
  /* 规则 1：一级纹样禁入（理论不可达，防御性校验） */
  S.items.forEach(function(it){
    var g = GeneAPI.byId(it.geneId);
    if(g.level !== 2) errs.push('检测到一级保护纹样「' + g.name + '」：核心信仰符号禁止进入创作组合。');
  });
  /* 规则 2：动物纹占比与数量 */
  var totalArea = 0, animalArea = 0, animalN = 0;
  S.items.forEach(function(it){
    var a = it.scale * it.scale;
    totalArea += a;
    if(ANIMALS.indexOf(it.geneId) >= 0){ animalArea += a; animalN++; }
  });
  if(totalArea > 0 && animalArea / totalArea > .55)
    warns.push('动物纹（马头纹 / 鹿纹）面积占比 ' + Math.round(animalArea / totalArea * 100) + '%，超过半数。瑶绣传统中动物纹多作辅助纹样，建议缩小或减少。');
  if(animalN > 4)
    warns.push('动物纹数量为 ' + animalN + ' 个，偏多。传统构图常以花草几何纹为主纹、动物纹作点缀。');
  /* 规则 3：动物纹倒置 */
  S.items.forEach(function(it){
    if(ANIMALS.indexOf(it.geneId) < 0) return;
    var r = normRot(it.rot), g = GeneAPI.byId(it.geneId);
    if(r > 165 && r < 195) errs.push('「' + g.name + '」呈倒置状态（' + Math.round(it.rot) + '°）：瑶绣传统中动物纹忌倒置，请调整为正面向。');
  });
  /* 规则 4：万字纹锦地用量 */
  var wanziN = S.items.filter(function(it){ return it.geneId === 'wanzi'; }).length;
  if(wanziN > 3) warns.push('万字纹出现 ' + wanziN + ' 次。万字纹传统上多作锦地辅助纹，大量重复会削弱主次层次。');
  /* 规则 5：单一纹样满铺 */
  if(S.items.length === 1 && S.items[0].scale > 1.6)
    warns.push('仅一个纹样且放得很大。瑶绣重「主纹 + 辅纹」的层次搭配，可尝试加入辅助纹样。');

  var report = document.getElementById('checkReport');
  var html = '';
  if(!errs.length){
    html += '<div class="ok-line">✓ 校验通过：未检测到文化符号误用。</div>';
    S.checkPass = true;
  }else{
    html += '<div class="err-line">✗ 校验未通过，请修正以下问题：</div>';
    errs.forEach(function(e){ html += '<div class="err-line">· ' + A.esc(e) + '</div>'; });
    S.checkPass = false;
  }
  if(warns.length){
    html += '<div class="warn-line" style="margin-top:6px">⚠ 建议关注（不拦截导出）：</div>';
    warns.forEach(function(w){ html += '<div class="warn-line">· ' + A.esc(w) + '</div>'; });
  }
  report.innerHTML = html;
  var btnExp = document.getElementById('btnExport');
  if(btnExp) btnExp.disabled = !S.checkPass;
  A.toast(S.checkPass ? '校验通过，导出已解锁' : '校验未通过：存在 ' + errs.length + ' 项问题', S.checkPass ? '' : 'err');
  A.buzz(S.checkPass ? 10 : 30);
}

/* ---------- 导出 PNG ---------- */
function exportPNG(){
  if(!S.checkPass){ A.toast('请先通过文化合规校验', 'warn'); return; }
  A.loading(true, '正在生成 PNG…', 40);
  var scene = document.getElementById('scene');
  var clone = scene.cloneNode(true);
  clone.setAttribute('xmlns', A.SVGNS);
  clone.setAttribute('width', SCENE); clone.setAttribute('height', SCENE);
  /* 剔除 UI 辅助元素：选中环与对称辅助线不属于作品本身 */
  clone.querySelectorAll('.sel-ring, .sym-guide').forEach(function(n){ n.remove(); });
  /* 背景（工作台底色；画布轮廓线已随场景克隆） */
  var bg = document.createElementNS(A.SVGNS, 'rect');
  bg.setAttribute('x', 0); bg.setAttribute('y', 0);
  bg.setAttribute('width', SCENE); bg.setAttribute('height', SCENE);
  bg.setAttribute('fill', BENCH);
  clone.insertBefore(bg, clone.firstChild);
  var svgStr = new XMLSerializer().serializeToString(clone);

  GeneAPI.svgToImage(svgStr).then(function(img){
    var SIZE = 1000, canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = BENCH; ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    /* 溯源水印 */
    var pad = SIZE * .045;
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(43,38,32,.62)';
    ctx.font = '600 ' + Math.round(SIZE * .026) + 'px "Noto Serif SC","Songti SC","SimSun",serif';
    ctx.fillText('瑶族传统纹样衍生 · 瑶纹工坊', SIZE - pad, SIZE - pad - SIZE * .02);
    ctx.font = '400 ' + Math.round(SIZE * .017) + 'px "Noto Sans SC","Microsoft YaHei",sans-serif';
    ctx.fillStyle = 'rgba(43,38,32,.45)';
    var d = new Date();
    ctx.fillText(d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'),
      SIZE - pad, SIZE - pad + SIZE * .008);
    A.loading(true, '正在生成 PNG…', 85);
    canvas.toBlob(function(blob){
      A.loading(false);
      var name = '瑶纹衍生_' + d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0') +
        '_' + String(d.getHours()).padStart(2,'0') + String(d.getMinutes()).padStart(2,'0') + '.png';
      A.download(blob, name);
      var url = URL.createObjectURL(blob);
      var body = A.el('div');
      body.innerHTML = '<img class="export-img" src="' + url + '" alt="导出预览">' +
        '<p style="font-size:13px;color:var(--ink-2);margin-top:12px;line-height:1.8">桌面端已自动下载；移动端（微信 / QQ 浏览器）若未触发下载，可<b>长按上方图片保存</b>。导出文件已内嵌溯源水印。</p>';
      A.modal({ title:'导出成功 · 已附溯源水印', body:body, actions:[
        { label:'完成' }, { label:'再次下载', cls:'', fn:function(){ A.download(blob, name); } }
      ]});
    }, 'image/png');
  }).catch(function(){
    A.loading(false);
    A.toast('生成失败，请重试', 'err');
  });
}

/* ---------- 舞台交互：拖拽 / 手势 ---------- */
function bindStage(stage, scene, hint){
  var pointers = new Map();
  var dragItem = null, lastP = null, pinch0 = null;

  function toScene(e){
    var pt = scene.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(scene.getScreenCTM().inverse());
  }

  stage.addEventListener('pointerdown', function(e){
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x:e.clientX, y:e.clientY });
    var node = e.target.closest('.item');
    if(node && node.dataset.uid){
      var uid = parseInt(node.dataset.uid, 10);
      S.sel = uid; renderScene(); renderLayers();
      dragItem = S.items.filter(function(x){ return x.uid === uid; })[0];
      lastP = { x:e.clientX, y:e.clientY };
    }else{
      if(S.sel != null){ S.sel = null; renderScene(); renderLayers(); }
      dragItem = null;
    }
    if(pointers.size === 2 && dragItem){
      var pts = Array.from(pointers.values());
      pinch0 = { d:Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), a:Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x), s:dragItem.scale, r:dragItem.rot };
    }
    e.preventDefault();
  });

  stage.addEventListener('pointermove', function(e){
    if(!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x:e.clientX, y:e.clientY });
    if(!dragItem) return;
    if(pointers.size === 1){
      var dx = e.clientX - lastP.x, dy = e.clientY - lastP.y;
      lastP = { x:e.clientX, y:e.clientY };
      var k = SCENE / stage.clientWidth;
      var sh = shapeById(S.shape);
      dragItem.x = A.clamp(dragItem.x + dx * k, sh.safe.x0, sh.safe.x1);
      dragItem.y = A.clamp(dragItem.y + dy * k, sh.safe.y0, sh.safe.y1);
      renderScene();
    }else if(pointers.size === 2 && pinch0){
      var pts = Array.from(pointers.values());
      var d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      var a = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
      dragItem.scale = A.clamp(pinch0.s * (d / Math.max(pinch0.d, 1)), .15, 2.6);
      dragItem.rot = pinch0.r + (a - pinch0.a) * 180 / Math.PI;
      renderScene(); renderLayers();
    }
    e.preventDefault();
  });

  function endPointer(e){
    pointers.delete(e.pointerId);
    if(pointers.size < 2) pinch0 = null;
    if(pointers.size === 0) dragItem = null;
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);

  /* 桌面端：滚轮缩放选中纹样 */
  stage.addEventListener('wheel', function(e){
    if(S.sel == null) return;
    e.preventDefault();
    var it = S.items.filter(function(x){ return x.uid === S.sel; })[0];
    if(!it) return;
    it.scale = A.clamp(it.scale * (e.deltaY < 0 ? 1.06 : .94), .15, 2.6);
    renderScene(); renderLayers();
  }, { passive:false });

  if(hint) new MutationObserver(function(){
    hint.style.display = S.items.length ? 'none' : '';
  }).observe(scene, { childList:true });
  hint.style.display = S.items.length ? 'none' : '';
}

/* ---------- 素材拖拽入画布 ---------- */
function startMatDrag(e, matEl, gene){
  e.preventDefault();
  var ghost = A.el('div', 'drag-ghost', GeneAPI.geneSVGInner(gene));
  document.body.appendChild(ghost);
  var startX = e.clientX, startY = e.clientY, moved = false;

  function move(ev){
    if(Math.hypot(ev.clientX - startX, ev.clientY - startY) > 7) moved = true;
    ghost.style.left = ev.clientX + 'px';
    ghost.style.top = ev.clientY + 'px';
    matEl.classList.add('dragging');
  }
  function up(ev){
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', up);
    ghost.remove(); matEl.classList.remove('dragging');
    var stage = document.getElementById('stage');
    var r = stage.getBoundingClientRect();
    if(moved && ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom){
      var x = (ev.clientX - r.left) / r.width * SCENE;
      var y = (ev.clientY - r.top) / r.height * SCENE;
      placeItem(gene.id, x, y, 0);
      A.toast('已放入「' + gene.name + '」');
      A.buzz();
    }else if(!moved){
      placeItem(gene.id, SCENE / 2, SCENE / 2, (Math.random() * 24 - 12) | 0);
      A.toast('已放入「' + gene.name + '」到画布中心');
      A.buzz();
    }
  }
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up);
  move(e);
}

/* ---------- 注册 ---------- */
A.register('#/gene', {
  mount:function(root, params, path){
    if(path.indexOf('#/gene/detail') === 0) mountDetail(root, params);
    else mountLibrary(root, params);
  },
  subtitle:function(path){
    if(path.indexOf('#/gene/detail') === 0) return '纹样详情';
    return '纹样基因库';
  },
  leave:function(){ S = null; }
});
A.register('#/studio', {
  mount:mountStudio,
  subtitle:function(){ return '纹样创作台 · 可控生成'; },
  leave:function(){ S = null; }
});
})();
