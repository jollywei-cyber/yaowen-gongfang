/* ============================================================
   瑶纹工坊 · genes.js —— 瑶绣纹样数字基因库（素材图驱动版）
   纹样图像来自 Kaguya 提供的「*素材图.png」，经优化后以 base64
   data URI 存于 gene-images.js（长边限 720px；扁平图案 PNG 128 色
   量化，照片类 JPEG q82）。
   分级：1=核心保护级（仅展示） 2=创意限定级（可创作）
   注：鹿纹、皇帝印两个纹样已按需求移除。
   ============================================================ */
(function(){
'use strict';

/* ---------- 纹样基因定义（图像 + 文化元数据） ---------- */
var GENES = [
{
  id:'panwang', name:'盘王印', alias:'盘瓠纹', level:1,
  branch:'盘瑶', theme:'信仰祭祀',
  tags:['始祖图腾','严格对称','龙角花'],
  meaning:'瑶族始祖盘瓠（盘王）的图腾印记。外框龙角花取「龙犬护主」之意，中心眼珠子纹象征始祖睁眼看护后代子孙，整体左右严格对称，体现瑶族对始祖的敬畏与族群秩序的认同。',
  usage:'传统用于盘王神像挂毯、盘王节祭祀帐幔、族中长者寿服饰物等庄重场合，是支系身份与祭祀资格的双重标记。',
  origin:'瑶绣技艺以母传女、婆传媳的口传心授方式在家族内传承。本纹样的具体传承谱系与地方口述资料正在整理中（待补充）。'
},
{
  id:'bajiao', name:'八角花纹', alias:'太阳纹', level:2,
  branch:'通用', theme:'几何装饰',
  tags:['最高频通用纹样','光明丰收'],
  meaning:'正方形基底延展成八角，原型为太阳，是瑶绣中出现频率最高的通用纹样，寓意光明与丰收。八角之「八」谐音「发」，亦含生活兴旺之意。',
  usage:'广泛用于被面、帐沿、妇女围裙、童帽镶边等日常织物，可作主纹居中，亦可作单位纹样连续排布。',
  origin:'瑶绣技艺以母传女、婆传媳的口传心授方式在家族内传承。本纹样的具体传承谱系与地方口述资料正在整理中（待补充）。'
},
{
  id:'shanchuan', name:'山川纹', alias:'锯齿纹', level:2,
  branch:'过山瑶', theme:'自然生活',
  tags:['山居记忆','迁徙叙事'],
  meaning:'连续锯齿状线条形似山峦起伏，承载瑶族山居与迁徙的记忆。「过山瑶」一支历史上辗转山林，纹样中的层层山脊既是生活环境写照，也是民族迁徙史的图像叙事。',
  usage:'传统用于绑腿、背带边缘、头帕镶边，多以数行连续排布，行数多少暗含支系与节庆规格。',
  origin:'瑶绣技艺以母传女、婆传媳的口传心授方式在家族内传承。本纹样的具体传承谱系与地方口述资料正在整理中（待补充）。'
},
{
  id:'doufu', name:'豆腐格纹', level:2,
  branch:'平地瑶', theme:'几何装饰',
  tags:['生活意象','富足'],
  meaning:'方格交错的几何纹样，形似切块的豆腐，源自日常生活场景，象征富足安稳。瑶乡「豆腐千斤」古话以格纹记之，是生活祈愿的直接转译。',
  usage:'多用于围裙、腰带、桌围等家居织物，常作满地纹与其他主纹相衬。',
  origin:'瑶绣技艺以母传女、婆传媳的口传心授方式在家族内传承。本纹样的具体传承谱系与地方口述资料正在整理中（待补充）。'
},
{
  id:'wanzi', name:'万字纹', alias:'万字符', level:2,
  branch:'通用', theme:'几何装饰',
  tags:['吉祥永生','辅助纹样'],
  meaning:'「卍」字形结构，寓意吉祥永生。佛教艺术东传后与本土信仰融合，成为瑶绣最常见的辅助纹样，常围绕主纹一圈作「万字锦地」，取绵延不断之意。',
  usage:'多用于帐沿、被面锦地、衣缘连续装饰，与八角花、花草纹等主纹配套使用。',
  origin:'瑶绣技艺以母传女、婆传媳的口传心授方式在家族内传承。本纹样的具体传承谱系与地方口述资料正在整理中（待补充）。'
},
{
  id:'huacao', name:'花草纹', level:2,
  branch:'通用', theme:'自然生活',
  tags:['自然崇拜','几何抽象'],
  meaning:'以几何手法抽象表现的折枝花卉，花叶多作菱形、三角形等规整形态，体现瑶族「万物有灵」的自然崇拜与程式化的造型法则。',
  usage:'常见于妇女服饰胸襟、袖口、背带心等位置，常与鸟兽纹搭配构成「花鸟」叙事画面。',
  origin:'瑶绣技艺以母传女、婆传媳的口传心授方式在家族内传承。本纹样的具体传承谱系与地方口述资料正在整理中（待补充）。'
},
{
  id:'matou', name:'马头纹', level:2,
  branch:'过山瑶', theme:'自然生活',
  tags:['动物纹','抽象几何'],
  meaning:'几何抽象化的马头造型，马在瑶族农耕与运输生活中地位重要，马头纹寄托六畜兴旺、行程顺利的愿望，造型上强调正脸威严之态。',
  usage:'多见于背带、童帽、马具配饰；传统上动物纹多作辅助纹样，不作满地主纹。',
  origin:'瑶绣技艺以母传女、婆传媳的口传心授方式在家族内传承。本纹样的具体传承谱系与地方口述资料正在整理中（待补充）。'
}
];

/* 绑定素材图（gene-images.js 先于本文件加载） */
GENES.forEach(function(g){
  var im = window.GENE_IMAGES && window.GENE_IMAGES[g.id];
  g.img = im || null;
});

/* ---------- SVG 生成 API（图像驱动） ---------- */
var SVGNS = 'http://www.w3.org/2000/svg';
var XLINK = 'http://www.w3.org/1999/xlink';
function geneSVG(gene, opts){
  opts = opts || {};
  if(!gene.img) return '<svg xmlns="' + SVGNS + '" viewBox="0 0 100 100"></svg>';
  var vb = opts.viewBox || ('0 0 ' + gene.img.w + ' ' + gene.img.h);
  return '<svg xmlns="' + SVGNS + '" xmlns:xlink="' + XLINK + '" viewBox="' + vb + '" ' + (opts.attrs || '') +
    ' preserveAspectRatio="xMidYMid meet">' +
    '<image x="0" y="0" width="' + gene.img.w + '" height="' + gene.img.h + '" preserveAspectRatio="xMidYMid meet" href="' + gene.img.src + '" xlink:href="' + gene.img.src + '"/>' +
    '</svg>';
}
/* 场景 / 素材栏用：把图像归一化进 100x100 居中盒（保持宽高比，供变换与导出） */
function geneSVGInner(gene){
  if(!gene.img) return '';
  var im = gene.img, s = 100 / Math.max(im.w, im.h);
  var w = im.w * s, h = im.h * s;
  return '<g transform="translate(' + ((100 - w) / 2).toFixed(2) + ',' + ((100 - h) / 2).toFixed(2) + ')">' +
    '<image x="0" y="0" width="' + w.toFixed(2) + '" height="' + h.toFixed(2) + '" preserveAspectRatio="xMidYMid meet" href="' + im.src + '" xlink:href="' + im.src + '"/></g>';
}

/* SVG 字符串 -> Image（供导出栅格化） */
var imgCache = {};
function svgToImage(svg){
  return new Promise(function(res, rej){
    var key = svg;
    if(imgCache[key]){ var cached = imgCache[key]; if(cached.complete) res(cached); else cached.onload = function(){ res(cached); }; return; }
    var img = new Image();
    img.onload = function(){ res(img); };
    img.onerror = function(){ rej(new Error('svg rasterize failed')); };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    imgCache[key] = img;
  });
}

var LEVEL_NAMES = { 1:'一级 · 核心保护级', 2:'二级 · 创意限定级' };
var LEVEL_TAGS  = { 1:'仅展示', 2:'可创作' };

function byId(id){ for(var i = 0; i < GENES.length; i++) if(GENES[i].id === id) return GENES[i]; return null; }
function creative(){ return GENES.filter(function(g){ return g.level === 2; }); }
function branches(){
  var b = ['通用'];
  ['盘瑶','过山瑶','平地瑶'].forEach(function(x){ if(GENES.some(function(g){ return g.branch === x; })) b.push(x); });
  return b;
}
function themes(){ return ['信仰祭祀','自然生活','几何装饰']; }
function countBy(fn){ return GENES.filter(fn).length; }

window.GENES = GENES;
window.GeneAPI = {
  LEVEL_NAMES:LEVEL_NAMES, LEVEL_TAGS:LEVEL_TAGS,
  geneSVG:geneSVG, geneSVGInner:geneSVGInner, svgToImage:svgToImage,
  byId:byId, creative:creative,
  branches:branches, themes:themes, countBy:countBy
};
})();
