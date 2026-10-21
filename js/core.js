/* ============================================================
   瑶纹工坊 · core.js —— 应用骨架：路由 / 导航 / Toast / 弹窗 / 工具
   ============================================================ */
(function(){
'use strict';

/* ---------- 错误捕获（供无头环境冒烟测试） ---------- */
var errlog = document.getElementById('errlog');
function logErr(kind, msg){
  try{ errlog.textContent += '\n[' + kind + '] ' + msg; }catch(e){}
}
window.addEventListener('error', function(e){ logErr('error', (e.message||'') + ' @ ' + (e.filename||'') + ':' + (e.lineno||0)); });
window.addEventListener('unhandledrejection', function(e){ logErr('rejection', String(e.reason && e.reason.message || e.reason)); });

/* ---------- DOM 工具 ---------- */
function el(tag, cls, html){
  var d = document.createElement(tag);
  if(cls) d.className = cls;
  if(html != null) d.innerHTML = html;
  return d;
}
function svgEl(tag, attrs){
  var s = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if(attrs) for(var k in attrs) s.setAttribute(k, attrs[k]);
  return s;
}
function clamp(v, a, b){ return v < a ? a : (v > b ? b : v); }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }

/* ---------- 色彩工具（HSL 明度偏移，锁定色相饱和度比例） ---------- */
function hexToRgb(hex){
  hex = hex.replace('#','');
  if(hex.length === 3) hex = hex.split('').map(function(c){ return c+c; }).join('');
  var n = parseInt(hex, 16);
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
}
function rgbToHsl(r, g, b){
  r/=255; g/=255; b/=255;
  var mx = Math.max(r,g,b), mn = Math.min(r,g,b), h = 0, s = 0, l = (mx+mn)/2;
  if(mx !== mn){
    var d = mx - mn;
    s = l > .5 ? d/(2-mx-mn) : d/(mx+mn);
    if(mx === r) h = (g-b)/d + (g < b ? 6 : 0);
    else if(mx === g) h = (b-r)/d + 2;
    else h = (r-g)/d + 4;
    h /= 6;
  }
  return { h:h*360, s:s*100, l:l*100 };
}
function hslToHex(h, s, l){
  h = ((h % 360) + 360) % 360 / 360; s /= 100; l /= 100;
  function f(n){
    var k = (n + h*12) % 12;
    return l - s * Math.min(l, 1-l) * Math.max(-1, Math.min(k-3, 9-k, 1));
  }
  var to = function(v){ var x = Math.round(v*255).toString(16); return x.length < 2 ? '0'+x : x; };
  return '#' + to(f(0)) + to(f(8)) + to(f(4));
}
function shiftL(hex, delta){
  var c = hexToRgb(hex), hsl = rgbToHsl(c.r, c.g, c.b);
  return hslToHex(hsl.h, hsl.s, clamp(hsl.l + delta, 4, 97));
}

/* ---------- Toast ---------- */
var toastWrap = document.getElementById('toastWrap');
function toast(msg, type, ms){
  type = type || ''; ms = ms || 2400;
  var t = el('div', 'toast ' + type, esc(msg));
  toastWrap.appendChild(t);
  setTimeout(function(){
    t.style.transition = 'opacity .3s, transform .3s';
    t.style.opacity = '0'; t.style.transform = 'translateY(6px)';
    setTimeout(function(){ t.remove(); }, 320);
  }, ms);
}

/* ---------- 加载态 ---------- */
var loadingBox = document.getElementById('loading'),
    loadingText = document.getElementById('loadingText'),
    loadingBar = document.getElementById('loadingBar');
function loading(on, text, pct){
  loadingBox.hidden = !on;
  if(text) loadingText.textContent = text;
  if(pct != null) loadingBar.style.width = clamp(pct, 0, 100) + '%';
}

/* ---------- 弹窗 ---------- */
var modalWrap = document.getElementById('modalWrap');
function modal(opts){
  // opts: {title, body(html|Node), actions:[{label, cls, fn}], onClose}
  modalWrap.innerHTML = '';
  var box = el('div', 'modal');
  var h = el('h2', null, esc(opts.title || ''));
  box.appendChild(h);
  if(typeof opts.body === 'string') box.appendChild(el('div', null, opts.body));
  else if(opts.body) box.appendChild(opts.body);
  var foot = el('div', 'modal-foot');
  (opts.actions || [{label:'知道了'}]).forEach(function(a){
    var b = el('button', 'btn ' + (a.cls || 'ghost'), esc(a.label));
    b.addEventListener('click', function(){
      if(a.fn) a.fn();
      closeModal();
    });
    foot.appendChild(b);
  });
  box.appendChild(foot);
  modalWrap.appendChild(box);
  modalWrap.hidden = false;
  modalWrap.onclick = function(e){ if(e.target === modalWrap){ closeModal(); if(opts.onClose) opts.onClose(); } };
  return box;
}
function closeModal(){ modalWrap.hidden = true; modalWrap.innerHTML = ''; }

/* ---------- 下载 ---------- */
function download(blob, filename){
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
}

/* ---------- 轻触感反馈（静默降级） ---------- */
function buzz(ms){ try{ navigator.vibrate && navigator.vibrate(ms || 8); }catch(e){} }

/* ---------- 路由骨架 ---------- */
var NAV = [
  { route:'#/gene',     label:'纹样基因库', title:'纹样基因库',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 2.5 19.5 7v10L12 21.5 4.5 17V7z"/><path d="M12 7.5 15.8 10v4L12 16.5 8.2 14v-4z"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>' },
  { route:'#/studio',   label:'纹样创作台', title:'纹样创作台 · 可控生成',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M8 8h3v3H8zM13 13h3v3h-3z" fill="currentColor" stroke="none"/><path d="M11 11l2 2"/></svg>' }
];
var modules = {};        // 路由 -> 模块实现
var current = null;      // 当前激活的模块实例
var viewEl = document.getElementById('view'),
    pageTitle = document.getElementById('pageTitle'),
    sideNav = document.getElementById('sideNav'),
    tabbar = document.getElementById('tabbar');

function register(route, impl){ modules[route] = impl; }

function parseHash(){
  var h = location.hash || '#/gene';
  var qi = h.indexOf('?');
  var path = qi > 0 ? h.slice(0, qi) : h;
  var query = {};
  if(qi > 0){
    h.slice(qi+1).split('&').forEach(function(kv){
      var p = kv.split('=');
      if(p[0]) query[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
    });
  }
  return { path:path, query:query };
}

var currentKey = '';
function route(force){
  var p = parseHash();
  var path = p.path;
  // 归一化：子路由归属
  var impl = null, params = p.query;
  if(path.indexOf('#/gene') === 0) impl = modules['#/gene'];
  else if(path.indexOf('#/studio') === 0){ impl = modules['#/studio']; }
  if(!impl){ location.hash = '#/gene'; return; }
  var key = path + '|' + JSON.stringify(params);
  if(!force && key === currentKey) return;   // 同一视图不重复挂载
  currentKey = key;

  // 导航高亮
  var active = '#/gene';
  if(path.indexOf('#/studio') === 0) active = '#/studio';
  Array.prototype.forEach.call(sideNav.children, function(b){
    b.classList.toggle('on', b.dataset.route === active);
  });
  Array.prototype.forEach.call(tabbar.children, function(b){
    b.classList.toggle('on', b.dataset.route === active);
  });
  var nav = NAV.filter(function(n){ return n.route === active; })[0];
  pageTitle.textContent = (impl.subtitle && impl.subtitle(path, params)) || (nav && nav.title) || '瑶纹工坊';

  if(current && current.leave) current.leave();
  viewEl.innerHTML = '';
  viewEl.classList.remove('slidein'); void viewEl.offsetWidth; viewEl.classList.add('slidein');
  current = impl;
  if(impl.mount) impl.mount(viewEl, params, path);
  viewEl.scrollTop = 0;
}

function go(hash){ if(location.hash === hash) route(true); else location.hash = hash; }

/* ---------- 构建导航 ---------- */
NAV.forEach(function(n){
  var sb = el('button', 'sidebtn', '<span class="nav-ico">' + n.icon + '</span><span>' + n.label + '</span>');
  sb.dataset.route = n.route;
  sb.addEventListener('click', function(){ go(n.route); buzz(); });
  sideNav.appendChild(sb);

  var tb = el('button', 'tabbtn', n.icon + '<span>' + n.label + '</span><i class="tabdot"></i>');
  tb.dataset.route = n.route;
  tb.addEventListener('click', function(){ go(n.route); buzz(); });
  tabbar.appendChild(tb);
});
window.addEventListener('hashchange', route);

/* ---------- 导出命名空间 ---------- */
window.App = {
  el:el, svgEl:svgEl, clamp:clamp, lerp:lerp, esc:esc,
  hexToRgb:hexToRgb, rgbToHsl:rgbToHsl, hslToHex:hslToHex, shiftL:shiftL,
  toast:toast, loading:loading, modal:modal, closeModal:closeModal,
  download:download, buzz:buzz,
  register:register, go:go, parseHash:parseHash,
  SVGNS:'http://www.w3.org/2000/svg',
  logErr:logErr
};

/* 启动：等待模块注册完成（DOMContentLoaded 时所有同步脚本已执行） */
if(!location.hash) location.hash = '#/gene';
if(document.readyState === 'loading') window.addEventListener('DOMContentLoaded', function(){ route(true); });
else route(true);
})();
