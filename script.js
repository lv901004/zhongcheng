/* ============================================
   玉林市中程装饰 · 前台 JS
   核心变化：从 data.json 动态读取内容
   ============================================ */


let siteData = {};
let contactData = {};
let casesData = [];
let servicesData = [];
let brandsData = [];

// ========== 页面加载 ==========
document.addEventListener('DOMContentLoaded', async function () {
  // 1. 加载数据（加时间戳防止浏览器缓存，保证每次都读最新数据）
  try {
    const res = await fetch('/api/data?t=' + Date.now());
    const json = await res.json();
    siteData = json.site || {};
    contactData = json.contact || {};
    casesData = json.cases || [];
    servicesData = json.services || [];
    brandsData = json.brands || [];
  } catch(e) {
    // 服务器不可用时直接读取静态文件
    try {
      const res2 = await fetch('data.json?t=' + Date.now());
      const json2 = await res2.json();
      siteData = json2.site || {};
      contactData = json2.contact || {};
      casesData = json2.cases || [];
      servicesData = json2.services || [];
      brandsData = json2.brands || [];
    } catch(e2) {
      console.warn('数据加载失败');
    }
  }

  // 2. 初始化交互（先初始化弹窗函数，卡片渲染时会用到）
  initNavbar();
  initCounters();
  initFadeIn();
  initModal();

  // 3. 填充数据到页面（initModal 必须在 initCases 之前执行）
  initSiteData();
  initCases();
  initServices();
  initBrands();
  initContact();
});

// ========== 填充网站基础信息 ==========
function initSiteData() {
  const s = siteData;
  if (s.companyName) {
    document.title = s.companyName + ' - 万磊涂料玉林总代理 · 东方雨虹防水 · 三棵树';
  }
  // 公司 Logo
  if (s.logo) {
    var navLogoIcon = document.getElementById('navLogoIcon');
    if (navLogoIcon) {
      navLogoIcon.innerHTML = '<img src="' + s.logo + '" alt="logo" style="width:32px;height:32px;object-fit:contain;" />';
    }
  }
  if (s.shortName) {
    var navBrand = document.getElementById('navBrand');
    if (navBrand) navBrand.textContent = s.shortName;
  }
  var heroBadge = document.querySelector('.hero-badge');
  if (heroBadge && s.heroBadge) heroBadge.textContent = s.heroBadge;
  var heroTitle = document.querySelector('.hero-title');
  if (heroTitle && s.companyName) heroTitle.textContent = s.companyName;
  var heroSlogan = document.querySelector('.hero-sub');
  if (heroSlogan && s.slogan) heroSlogan.textContent = s.slogan;
  var heroSubSlogan = document.querySelector('.hero-desc');
  if (heroSubSlogan && s.subSlogan) heroSubSlogan.textContent = s.subSlogan;
  var statYears = document.getElementById('statYears');
  if (statYears && s.statsYears) statYears.textContent = s.statsYears;
  var statTeam = document.getElementById('statTeam');
  if (statTeam && s.statsTeam) statTeam.textContent = s.statsTeam;
  var statBrands = document.getElementById('statBrands');
  if (statBrands && s.statsBrands) statBrands.textContent = s.statsBrands;
  var aboutTitle = document.querySelector('.about-title');
  if (aboutTitle && s.aboutTitle) aboutTitle.textContent = s.aboutTitle;
  var aboutDesc = document.querySelector('.about-desc');
  if (aboutDesc && s.aboutDesc) aboutDesc.textContent = s.aboutDesc;
  var aboutIntro = document.querySelector('.about-intro');
  if (aboutIntro && s.aboutIntro) aboutIntro.innerHTML = '<p>' + s.aboutIntro + '</p>';
  var aboutYear = document.querySelector('.about-year span');
  if (aboutYear && s.founded) aboutYear.textContent = s.founded.replace(/\D/g, '');
  var aboutTeam = document.getElementById('aboutTeam');
  if (aboutTeam && s.statsTeam) aboutTeam.textContent = s.statsTeam;
  var footerName = document.getElementById('footerName');
  if (footerName && s.companyName) footerName.textContent = s.companyName;
  var footerCopy = document.getElementById('footerCopy');
  if (footerCopy) footerCopy.textContent = s.shortName || s.companyName;
  var footerSlogan = document.getElementById('footerSlogan');
  if (footerSlogan && s.heroBadge) footerSlogan.textContent = s.heroBadge.replace(/🏆\s*/g, '');
}

// ========== 渲染工程案例 ==========
function initCases() {
  const grid = document.getElementById('casesGrid');
  if (!casesData.length) {
    grid.innerHTML = '<p style="text-align:center;color:#aaa;padding:2rem">暂无工程案例</p>';
    return;
  }

  const html = casesData.map(item => `
    <div class="case-card" data-id="${item.id}" id="card_${item.id}" onclick="_openCaseDetail('${item.id}')">
      <div class="case-img-placeholder">
        <span>${item.emoji || '📸'}</span>
        <div class="case-overlay">
          <div class="case-tag">${item.tag || ''}</div>
          <div class="case-view-hint">点击查看详情 →</div>
        </div>
      </div>
      <div class="case-info">
        <h3>${item.title || ''}</h3>
        <p>${item.description || ''}</p>
        <div class="case-meta">
          <span>🏗 ${item.type || ''}</span>
          <span>${item.year || ''}</span>
          <span class="case-view-link">查看详情 →</span>
        </div>
      </div>
    </div>
  `).join('');

  // 加上CTA卡
  grid.innerHTML = html + `
    <div class="case-card cta-card">
      <div class="case-cta">
        <div class="case-cta-icon">📞</div>
        <h3>查看更多案例</h3>
        <p>我们拥有更多大型工程案例，欢迎来电咨询</p>
        <a href="#" onclick="contactCta();return false" class="btn btn-primary">立即致电咨询</a>
      </div>
    </div>
  `;
}

// ========== 渲染产品服务 ==========
function initServices() {
  const grid = document.getElementById('servicesGrid');
  if (!servicesData.length) return;

  const html = servicesData.map(item => `
    <div class="service-card ${item.featured ? 'featured' : ''}" onclick="openServiceDetail('${item.id}')" style="cursor:pointer">
      <div class="service-icon">${item.icon || '🛠️'}</div>
      <h3>${item.title || ''}</h3>
      <p>${item.desc || ''}</p>
      <ul class="service-tags">
        ${(item.tags || []).map(t => `<li>${t}</li>`).join('')}
      </ul>
      <div class="service-view-hint">点击查看详情 →</div>
    </div>
  `).join('');

  grid.innerHTML = html;
}

// ========== 渲染合作品牌 ==========
function initBrands() {
  const grid = document.getElementById('brandsGrid');
  if (!brandsData.length) return;

  const html = brandsData.map(item => `
    <div class="brand-card ${item.featured ? 'featured-brand' : ''}" onclick="openBrandDetail('${item.id}')" style="cursor:pointer">
      ${item.featured && item.badge ? `<div class="brand-badge">${item.badge}</div>` : ''}
      <div class="brand-body">
        <div class="brand-media">
          ${item.logo ? `<img src="${item.logo}" alt="${item.name}" class="brand-logo-img" />` :
            item.images && item.images.length > 0 ? `
              <div class="brand-img-wrap">
                <img src="${item.images[0]}" alt="${item.name}" />
                ${item.images.length > 1 ? `<div class="brand-img-hint">+${item.images.length - 1}</div>` : ''}
              </div>` :
              `<div class="brand-logo-text">${item.name || ''}</div>`}
        </div>
        <div class="brand-info">
          <div class="brand-name">${item.name || ''}</div>
          ${item.sub ? `<div class="brand-sub">${item.sub}</div>` : ''}
          <p class="brand-desc">${item.cardDesc || ''}</p>
        </div>
      </div>
      <div class="brand-card-cta">${item.featured ? '点击查看品牌介绍 →' : '点击查看详情 →'}</div>
    </div>
  `).join('');

  grid.innerHTML = html;
}

// ========== 填充联系方式 ==========
function initContact() {
  var addrEl = document.getElementById('contactAddress');
  if (!addrEl) return;

  var addr = contactData.address || addrEl.textContent || '广西玉林市玉州区兴隆路23号';
  var encoded = encodeURIComponent(addr);
  // 电脑/手机统一直接打开高德地图网页版，一步到位
  addrEl.innerHTML = '<a href="https://www.amap.com/search?query=' + encoded + '" target="_blank" style="color:#1565c0">' + addr + ' <span style="font-size:.85em;opacity:.7">📍 导航</span></a>';

  var phoneDisplay = contactData.phoneDisplay || contactData.phone;
  if (phoneDisplay) {
    var phoneEl = document.getElementById('contactPhone');
    if (phoneEl) phoneEl.textContent = phoneDisplay;
  }
  var emailEl = document.getElementById('contactEmail');
  if (emailEl && contactData.email) emailEl.textContent = contactData.email;
  var hoursEl = document.getElementById('contactHours');
  if (hoursEl && contactData.workHours) hoursEl.textContent = contactData.workHours;
  var wechatEl = document.getElementById('contactWechat');
  var wechatItem = document.getElementById('contactWechatItem');
  if (wechatEl) {
    wechatEl.innerHTML = '<span style="font-size:1.1em">👉</span> 点击扫码添加微信，快速获取报价';
    wechatEl.title = '点击查看微信二维码';
    if (wechatItem) wechatItem.style.display = '';
  }
}

// 打开地图（手机用scheme调起/自动跳转地图，电脑直接开网页）
function openMapNav(encodedAddr) {
  var addr = decodeURIComponent(encodedAddr);
  var encoded = encodeURIComponent(addr);
  var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  if (isMobile) {
    // 手机：弹出地图选择器
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;';
    overlay.innerHTML = `
      <div style="width:100%;background:#fff;border-radius:16px 16px 0 0;padding:20px 16px 40px;font-family:sans-serif;">
        <div style="text-align:center;font-size:15px;color:#333;margin-bottom:20px;font-weight:600">选择地图打开</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <button onclick="openMapNav.doOpen('qq', ${JSON.stringify(addr)})" style="border:1px solid #eee;border-radius:12px;padding:14px 8px;background:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 1px 4px rgba(0,0,0,.06);">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHJ4PSIzIiBmaWxsPSIjZmZmIj48L3JlY3Q+PHN0eWxlPmsuY3NzIHtmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxMnB4O30gLmNzcyB7ZmlsbDogIzMzNzt9PC9zdHlsZT48dGV4dCB4PSIxMCIgeT0iMTQiIGNsYXNzPSJjc3MiPk7H0s3H0rXTvc7U0s3S1I7H09LOx9PC90ZXh0Pjwvc3ZnPg==" width="28" height="28" style="border-radius:6px;">
            <span style="font-size:13px;color:#333;">腾讯地图</span>
          </button>
          <button onclick="openMapNav.doOpen('amap', ${JSON.stringify(addr)})" style="border:1px solid #eee;border-radius:12px;padding:14px 8px;background:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 1px 4px rgba(0,0,0,.06);">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHJ4PSIzIiBmaWxsPSIjNzc3Ij48L3JlY3Q+PHRleHQgeD0iMTAiIHk9IjE0IiBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiA4cHggZm9udC13ZWlnaHQ6IDYwMDsiIGNsYXNzPSJjc3MiPue1zuO1zunV0tPOx93P1dHTy8PDs8LX19vH09fX29vX19vb29vb29/b29/b29vb29vb29/b29vb29vb29/b29vb29vb29/b29vb29vb29/b29vb29vb29vb29vb29/b29vb29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b28/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/b29/PC9zdHlsZT48dGV4dCB4PSIxMCIgeT0iMTQiIGNsYXNzPSJjc3MiPke0scHS2LHVyNDOz7fI0tHJ3tLPtdnR1dTO0tHN3dnZ0t7S0LnH38nH2NXH0sOxxN/Ry8+7w9rR0c/R2sG5xMnCysbKzcbK18LP08XK3cfK2MfH08nS0cfJ08jPz8XHz8HFz9LGydDIy9fFzMnH09DK1s7FzNTP18/SzNHT0MrN1c/W1c3R09PQz9bX1NXQ09LP29nV19HW09HT09fV2NjY29jX29jZ3NnZ3drc29vd29ve3N7e39/b3d7e3+Df4d/f4ODh4eLh4uLj4+Tk5OXm5+jp6err6+zs7e3t7u/w8PHx8vLy8/P09PX29vf39/j5+fr6+/v8/P39/f3+AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==" width="28" height="28" style="border-radius:6px;">
            <span style="font-size:13px;color:#333;">高德地图</span>
          </button>
          <button onclick="openMapNav.doOpen('apple', ${JSON.stringify(addr)})" style="border:1px solid #eee;border-radius:12px;padding:14px 8px;background:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 1px 4px rgba(0,0,0,.06);">
            <div style="width:28px;height:28px;background:#007AFF;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff;font-weight:bold;">🍎</div>
            <span style="font-size:13px;color:#333;">苹果地图</span>
          </button>
          <button onclick="openMapNav.doOpen('web', ${JSON.stringify(addr)})" style="border:1px solid #eee;border-radius:12px;padding:14px 8px;background:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 1px 4px rgba(0,0,0,.06);">
            <div style="width:28px;height:28px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;">🌐</div>
            <span style="font-size:13px;color:#333;">网页版</span>
          </button>
        </div>
        <button onclick="openMapNav.close()" style="margin-top:16px;width:100%;border:none;border-radius:10px;padding:13px;background:#f5f5f5;color:#666;font-size:14px;cursor:pointer;">取消</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) openMapNav.close();
    });
  } else {
    // 电脑：直接打开腾讯地图网页版
    window.open('https://map.qq.com/maps/search?q=' + encoded, '_blank');
  }
}

// 地图选择器打开后，用户点击了某个地图
openMapNav.doOpen = function(type, addr) {
  var encoded = encodeURIComponent(addr);
  var urls = {
    qq:    'https://map.qq.com/?searchQuery=' + encoded + '&city=玉林',
    amap:  'https://www.amap.com/search?query=' + encoded,
    apple: 'https://maps.apple.com/?q=' + encoded,
    web:   'https://www.google.com/maps/search/' + encoded
  };
  window.open(urls[type] || urls.web, '_blank');
  openMapNav.close();
};

// 关闭地图选择器
openMapNav.close = function() {
  var overlays = document.querySelectorAll('[style*="z-index:99999"]');
  overlays.forEach(function(el) { el.remove(); });
};

// ========== 导航栏 ==========
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  });

  navToggle.addEventListener('click', () => navLinksContainer.classList.toggle('open'));
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinksContainer.classList.remove('open'));
  });

  function updateActiveNav() {
    const sections = ['home', 'about', 'cases', 'services', 'brands', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 100) current = id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
}

// ========== 数字滚动动画 ==========
function initCounters() {
  function animateCounter(el, target) {
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = start + (el.dataset.suffix || '');
      if (start >= target) clearInterval(timer);
    }, 16);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.stat-num, .card-sm-num').forEach(num => {
          const text = num.textContent;
          const val = parseInt(text.replace(/\D/g, ''));
          if (val && !num.dataset.animated) {
            num.dataset.animated = '1';
            num.dataset.suffix = text.includes('+') ? '+' : '';
            animateCounter(num, val);
          }
        });
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.adv-card, .service-card, .brand-card, .hero-stats, .about-visual').forEach(el => observer.observe(el));
}

// ========== 入场动画 ==========
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.adv-card, .service-card, .brand-card, .contact-item, .case-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    // 注意：不设 pointer-events，透明卡片仍然可以点击
    observer.observe(el);
  });
}

// ========== 图片预览器（支持切换/拖动/滚轮缩放/双指缩放） ==========
var _gState = {}; // 避免全局污染，用闭包替代

function _openGallery(pages, startIdx) {
  if (document.getElementById('_galleryOverlay')) document.getElementById('_galleryOverlay').remove();

  // 重置缩放/平移状态
  var imgScale = 1;
  var imgX = 0, imgY = 0;
  var minScale = 0.5, maxScale = 5;
  var isDragging = false;
  var dragStartX = 0, dragStartY = 0;
  var wasDragged = false; // 区分拖动和点击
  var lastTouchDist = 0;
  var idx = startIdx || 0;

  var overlay = document.createElement('div');
  overlay.id = '_galleryOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.95);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none;touch-action:none';

  function updateTransform() {
    var img = document.getElementById('_galleryImg');
    if (img) img.style.transform = 'translate(' + imgX + 'px,' + imgY + 'px) scale(' + imgScale + ')';
  }

  function resetView() {
    imgScale = 1; imgX = 0; imgY = 0;
    updateTransform();
  }

  // 以鼠标光标位置为中心缩放
  function applyScaleAt(newScale, mouseX, mouseY) {
    imgScale = Math.max(minScale, Math.min(maxScale, newScale));
    imgX = mouseX - (mouseX - imgX) * (newScale / imgScale);
    imgY = mouseY - (mouseY - imgY) * (newScale / imgScale);
    updateTransform();
  }

  function changeSlide(newIdx) {
    idx = newIdx;
    window._galleryIdx = newIdx;
    var img = document.getElementById('_galleryImg');
    if (img) img.src = pages[newIdx];
    // 重置缩放状态
    resetView();
    // 更新缩略图高亮
    overlay.querySelectorAll('img[data-gi]').forEach(function(th, j) {
      th.style.border = '2px solid ' + (j === newIdx ? '#fff' : 'transparent');
      th.style.opacity = j === newIdx ? '1' : '0.6';
    });
    // 更新计数
    var counter = document.getElementById('_galleryCounter');
    if (counter) counter.textContent = (newIdx + 1) + ' / ' + pages.length;
  }

  window._galleryPages = pages;
  window._galleryIdx = idx;

  overlay.innerHTML =
    '<div style="position:absolute;top:0;left:0;right:0;bottom:80px;display:flex;align-items:center;justify-content:center;overflow:hidden" id="_galleryStage">' +
      '<img id="_galleryImg" src="' + pages[idx] + '" style="max-width:95vw;max-height:90vh;cursor:grab;transition:transform .1s ease-out" draggable="false" />' +
    '</div>' +
    '<div style="position:absolute;bottom:10px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:0 10px">' +
      (pages.length > 1 ? '<button id="_galleryPrev" style="background:rgba(255,255,255,.15);border:none;color:#fff;font-size:20px;width:40px;height:40px;border-radius:50%;cursor:pointer;line-height:1;flex-shrink:0">‹</button>' : '') +
      pages.map(function(p, i) {
        return '<img src="' + p + '" data-gi="' + i + '" style="width:50px;height:50px;object-fit:cover;border-radius:4px;border:2px solid ' + (i===idx?'#fff':'transparent') + ';cursor:pointer;opacity:' + (i===idx?'1':'0.6') + ';flex-shrink:0" />';
      }).join('') +
      (pages.length > 1 ? '<button id="_galleryNext" style="background:rgba(255,255,255,.15);border:none;color:#fff;font-size:20px;width:40px;height:40px;border-radius:50%;cursor:pointer;line-height:1;flex-shrink:0">›</button>' : '') +
    '</div>' +
    '<div id="_galleryClose" style="position:absolute;top:12px;right:16px;font-size:28px;color:#fff;cursor:pointer;background:rgba(255,255,255,.1);width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center">✕</div>' +
    '<div id="_galleryCounter" style="position:absolute;bottom:62px;color:#aaa;font-size:13px;text-align:center;left:0;right:0">' + (idx+1) + ' / ' + pages.length + '</div>' +
    '<div style="position:absolute;top:12px;left:16px;color:#fff;background:rgba(255,255,255,.1);padding:4px 10px;border-radius:12px;font-size:12px;cursor:pointer" id="_galleryResetBtn">重置视图</div>';

  document.body.appendChild(overlay);

  var img = document.getElementById('_galleryImg');
  var stage = document.getElementById('_galleryStage');

  window._galleryChange = changeSlide;

  // ---- 缩略图点击 ----
  overlay.querySelectorAll('img[data-gi]').forEach(function(th) {
    th.addEventListener('click', function(e) {
      e.stopPropagation();
      changeSlide(parseInt(this.getAttribute('data-gi')));
    });
  });

  // ---- 关闭 ----
  document.getElementById('_galleryClose').addEventListener('click', function() { overlay.remove(); });
  overlay.addEventListener('click', function(e) {
    // 如果是拖动后释放的 click，不关闭
    if (wasDragged) return;
    if (e.target === overlay || e.target === stage || e.target === img) {
      overlay.remove();
    }
  });

  // ---- 重置视图按钮 ----
  document.getElementById('_galleryResetBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    resetView();
  });

  // ---- 箭头切换 ----
  var prevBtn = document.getElementById('_galleryPrev');
  var nextBtn = document.getElementById('_galleryNext');
  if (prevBtn) prevBtn.addEventListener('click', function(e) { e.stopPropagation(); changeSlide((idx - 1 + pages.length) % pages.length); });
  if (nextBtn) nextBtn.addEventListener('click', function(e) { e.stopPropagation(); changeSlide((idx + 1) % pages.length); });

  // ---- 键盘切换 ----
  document.addEventListener('keydown', function escGallery(e) {
    if (!document.getElementById('_galleryOverlay')) { document.removeEventListener('keydown', escGallery); return; }
    if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', escGallery); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); changeSlide((idx - 1 + pages.length) % pages.length); }
    if (e.key === 'ArrowRight') { e.preventDefault(); changeSlide((idx + 1) % pages.length); }
    if (e.key === '+' || e.key === '=') { e.preventDefault(); applyScaleAt(imgScale + 0.3, window.innerWidth / 2, window.innerHeight / 2); }
    if (e.key === '-') { e.preventDefault(); applyScaleAt(imgScale - 0.3, window.innerWidth / 2, window.innerHeight / 2); }
    if (e.key === '0') { e.preventDefault(); resetView(); }
  });

  // ---- 鼠标滚轮缩放（以鼠标光标位置为中心） ----
  stage.addEventListener('wheel', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var mouseX = e.clientX;
    var mouseY = e.clientY;
    var delta = e.deltaY || e.detail;
    var factor = delta < 0 ? 1.12 : 0.89;
    applyScaleAt(imgScale * factor, mouseX, mouseY);
  }, { passive: false });

  // ---- 鼠标拖动平移（任何时候都可以拖） ----
  img.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    e.preventDefault();
    isDragging = true;
    wasDragged = false; // 重置
    dragStartX = e.clientX - imgX;
    dragStartY = e.clientY - imgY;
    img.style.cursor = 'grabbing';
    img.style.transition = 'none';
  });
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    wasDragged = true; // 一旦移动过就标记为拖动
    imgX = e.clientX - dragStartX;
    imgY = e.clientY - dragStartY;
    updateTransform();
  });
  document.addEventListener('mouseup', function() {
    if (!isDragging) return;
    isDragging = false;
    img.style.cursor = 'grab';
    img.style.transition = 'transform .1s ease-out';
    // 延迟清 wasDragged，等 click 事件先判断
    setTimeout(function() { wasDragged = false; }, 10);
  });

  // ---- 双指缩放 + 滑动切换（手机端） ----
  var touchStartX = 0, touchStartY = 0, touchImgX = 0, touchImgY = 0;

  overlay.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      // 单指：记录起始位置用于滑动切换
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchImgX = imgX; touchImgY = imgY;
      isDragging = true;
      img.style.transition = 'none';
    } else if (e.touches.length === 2) {
      // 双指：记录两指距离用于缩放
      isDragging = false;
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist = Math.sqrt(dx * dx + dy * dy);
      e.preventDefault();
    }
  }, { passive: false });

  overlay.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1 && isDragging) {
      imgX = touchImgX + (e.touches[0].clientX - touchStartX);
      imgY = touchImgY + (e.touches[0].clientY - touchStartY);
      updateTransform();
    } else if (e.touches.length === 2) {
      e.preventDefault();
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (lastTouchDist > 0) {
        // 以两指中点为中心缩放
        var cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        var cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        applyScaleAt(imgScale * (dist / lastTouchDist), cx, cy);
      }
      lastTouchDist = dist;
    }
  }, { passive: false });

  overlay.addEventListener('touchend', function(e) {
    if (e.touches.length === 0) {
      isDragging = false;
      img.style.transition = 'transform .1s ease-out';
      // 判断是否为横向滑动切换
      if (Math.abs(e.changedTouches[0].clientX - touchStartX) > 50 && Math.abs(e.changedTouches[0].clientY - touchStartY) < 30) {
        var dir = e.changedTouches[0].clientX - touchStartX;
        if (dir < 0) {
          changeSlide((idx + 1) % pages.length);
        } else {
          changeSlide((idx - 1 + pages.length) % pages.length);
        }
      }
    }
  }, { passive: true });

  // 初始化缩放基准
  resetView();
}

// ========== 点击案例主图打开图库 ==========
function _zoomImg(src) {
  // 找到当前案例的所有图片
  var caseData = casesData.find(function(c) {
    return src && c.pages && c.pages.indexOf(src) !== -1;
  });
  if (caseData && caseData.pages && caseData.pages.length > 0) {
    var startIdx = caseData.pages.indexOf(src);
    _openGallery(caseData.pages, startIdx);
  } else {
    _openGallery([src], 0);
  }
}


// ========== 联系选择弹窗（手机底部弹窗，电脑居中浮窗） ==========
function contactCta() {
  var phone = contactData.phone || '19148031345';
  var phoneDisplay = contactData.phoneDisplay || phone;
  var wechatId = contactData.wechat || '';
  var wechatQR = contactData.wechatQR || '';
  var siteName = siteData.shortName || '中程装饰';
  var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  if (document.getElementById('_contactCtaBox')) document.getElementById('_contactCtaBox').remove();
  if (document.getElementById('_contactCtaMask')) document.getElementById('_contactCtaMask').remove();

  var mask = document.createElement('div');
  mask.id = '_contactCtaMask';

  var box = document.createElement('div');
  box.id = '_contactCtaBox';

  if (isMobile) {
    // 手机：底部弹窗
    mask.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:999998';
    box.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#fff;border-radius:20px 20px 0 0;padding:20px 0;z-index:999999;padding-bottom:calc(env(safe-area-inset-bottom) + 20px)';

    var wechatBtn = '';
    if (wechatId) {
      if (wechatQR) {
        wechatBtn = '<div class="cta-opt-item" onclick="showWechatQR()">' +
          '<div class="cta-opt-icon" style="background:#07c160">💬</div>' +
          '<div class="cta-opt-text">' +
            '<div class="cta-opt-title">添加微信</div>' +
            '<div class="cta-opt-sub">' + wechatId + '</div>' +
          '</div>' +
          '<div class="cta-opt-arrow">›</div>' +
        '</div>';
      } else {
        wechatBtn = '<div class="cta-opt-item" onclick="copyWechat()">' +
          '<div class="cta-opt-icon" style="background:#07c160">💬</div>' +
          '<div class="cta-opt-text">' +
            '<div class="cta-opt-title">添加微信</div>' +
            '<div class="cta-opt-sub">点击复制微信号</div>' +
          '</div>' +
          '<div class="cta-opt-arrow">›</div>' +
        '</div>';
      }
    }

    box.innerHTML =
      '<div class="cta-sheet-handle"></div>' +
      '<div class="cta-sheet-title">联系 · ' + siteName + '</div>' +
      '<div class="cta-sheet-body">' +
        '<a href="tel:' + phone + '" class="cta-opt-item">' +
          '<div class="cta-opt-icon" style="background:#1d6fd8">📞</div>' +
          '<div class="cta-opt-text">' +
            '<div class="cta-opt-title">拨打电话</div>' +
            '<div class="cta-opt-sub">' + phoneDisplay + '</div>' +
          '</div>' +
          '<div class="cta-opt-arrow">›</div>' +
        '</a>' +
        wechatBtn +
      '</div>' +
      '<button class="cta-sheet-cancel" onclick="closeContactCta()">取消</button>';
    mask.addEventListener('click', closeContactCta);
  } else {
    // 电脑：居中浮窗
    mask.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);z-index:999998';
    box.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:16px;padding:28px 24px;z-index:999999;min-width:300px;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:sans-serif;text-align:center';
    var wechatA = wechatId
      ? '<a href="#" onclick="copyWechat();return false" style="display:flex;align-items:center;gap:12px;background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:14px 16px;text-decoration:none;margin-bottom:10px;transition:background .15s">' +
          '<span style="font-size:26px">💬</span>' +
          '<div style="text-align:left;flex:1"><div style="font-size:14px;font-weight:600;color:#16a34a">添加微信</div><div style="font-size:13px;color:#64748b">' + wechatId + '</div></div>' +
          '<span style="color:#86efac;font-size:18px">›</span>' +
        '</a>'
      : '';
    box.innerHTML =
      '<div style="font-size:18px;font-weight:600;margin-bottom:4px;color:#222">选择联系方式</div>' +
      '<div style="font-size:13px;color:#999;margin-bottom:20px">联系 · ' + siteName + '</div>' +
      '<a href="tel:' + phone + '" style="display:flex;align-items:center;gap:12px;background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:12px;padding:14px 16px;text-decoration:none;margin-bottom:10px;transition:background .15s">' +
        '<span style="font-size:26px">📞</span>' +
        '<div style="text-align:left;flex:1"><div style="font-size:14px;font-weight:600;color:#1d4ed8">拨打电话</div><div style="font-size:13px;color:#64748b">' + phoneDisplay + '</div></div>' +
        '<span style="color:#93c5fd;font-size:18px">›</span>' +
      '</a>' +
      wechatA +
      '<button onclick="closeContactCta()" style="margin-top:10px;background:none;border:none;color:#94a3b8;font-size:13px;cursor:pointer;padding:8px 16px;border-radius:8px">取消</button>';
    mask.addEventListener('click', closeContactCta);
  }

  document.body.appendChild(mask);
  document.body.appendChild(box);
}

function closeContactCta() {
  var box = document.getElementById('_contactCtaBox');
  var mask = document.getElementById('_contactCtaMask');
  if (box) box.remove();
  if (mask) mask.remove();
}

function showWechatQR() {
  closeContactCta();
  var wechatQR = contactData.wechatQR || '';
  var wechatId = contactData.wechat || '';

  if (document.getElementById('_wechatQRMask')) document.getElementById('_wechatQRMask').remove();
  if (document.getElementById('_wechatQRBox')) document.getElementById('_wechatQRBox').remove();

  var mask = document.createElement('div');
  mask.id = '_wechatQRMask';
  mask.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:999998';
  mask.addEventListener('click', closeWechatQR);

  var box = document.createElement('div');
  box.id = '_wechatQRBox';
  var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  if (wechatQR) {
    // 有二维码：显示大图
    var qrSize = isMobile ? '240px' : '280px';
    box.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:20px;padding:28px 24px;z-index:999999;max-width:340px;width:calc(100% - 40px);text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)';
    box.innerHTML =
      '<div style="font-size:18px;font-weight:700;color:#111;margin-bottom:4px">扫码添加微信</div>' +
      '<div style="font-size:13px;color:#6b7280;margin-bottom:16px">长按识别二维码，快速获取报价</div>' +
      '<img src="' + wechatQR + '" alt="微信二维码" style="width:' + qrSize + ';height:' + qrSize + ';border-radius:12px;border:1px solid #e5e7eb;display:block;margin:0 auto 16px" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'\'">' +
      '<div style="display:none;font-size:13px;color:#9ca3af;margin-bottom:12px">图片加载失败</div>' +
      (wechatId ? '<div style="font-size:14px;color:#374151;margin-bottom:4px">微信号：<strong>' + wechatId + '</strong></div>' : '') +
      '<div style="font-size:12px;color:#9ca3af;margin-bottom:16px">' + (wechatId ? '或复制微信号添加' : '请在后台设置微信二维码') + '</div>' +
      (wechatId ? '<button onclick="copyWechat()" style="padding:10px 28px;background:#07c160;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">复制微信号</button><br>' : '') +
      '<button onclick="closeWechatQR()" style="margin-top:10px;background:none;border:none;color:#9ca3af;font-size:13px;cursor:pointer;padding:6px 16px">关闭</button>';
  } else {
    // 无二维码：显示提示
    box.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:20px;padding:32px 24px;z-index:999999;max-width:300px;width:calc(100% - 40px);text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)';
    box.innerHTML =
      '<div style="font-size:40px;margin-bottom:12px">💬</div>' +
      '<div style="font-size:16px;font-weight:600;color:#111;margin-bottom:8px">微信咨询</div>' +
      '<div style="font-size:13px;color:#6b7280;margin-bottom:16px;line-height:1.6">' + (wechatId ? '微信号：<strong>' + wechatId + '</strong>' : '请在后台设置微信号') + '</div>' +
      (wechatId ? '<button onclick="copyWechat()" style="padding:12px 28px;background:#07c160;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;width:100%;margin-bottom:8px">复制微信号</button>' : '') +
      '<button onclick="closeWechatQR()" style="background:#f3f4f6;border:none;border-radius:10px;font-size:14px;color:#374151;cursor:pointer;width:100%;padding:12px' + (wechatId ? '' : ';margin-top:0') + '">关闭</button>';
  }

  document.body.appendChild(mask);
  document.body.appendChild(box);
}

function closeWechatQR() {
  var box = document.getElementById('_wechatQRBox');
  var mask = document.getElementById('_wechatQRMask');
  if (box) box.remove();
  if (mask) mask.remove();
}

function copyWechat() {
  closeContactCta();
  var wechatId = contactData.wechat || '';
  var phone = contactData.phone || '19148031345';
  if (wechatId) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(wechatId).then(function() {
        showToast('微信号已复制：' + wechatId);
      }).catch(function() {
        window.prompt('长按复制微信号：', wechatId);
      });
    } else {
      window.prompt('长按复制微信号：', wechatId);
    }
  } else {
    showToast('暂无微信号，请直接致电：' + phone);
  }
}

function showToast(msg) {
  var t = document.getElementById('_toastMsg');
  if (t) t.remove();
  var el = document.createElement('div');
  el.id = '_toastMsg';
  el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.82);color:#fff;padding:12px 24px;border-radius:24px;font-size:14px;z-index:9999999;white-space:nowrap;max-width:90vw;overflow:hidden;text-overflow:ellipsis';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 2800);
}

// ========== 详情弹窗 ==========
function initModal() {
  const modal = document.getElementById('detailModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  window._openCaseDetail = function(id) {
    const data = casesData.find(c => c.id === id);
    if (!data) return;

    let dotsHtml = '';
    if (data.pages && data.pages.length > 1) {
      dotsHtml = data.pages.map((_, i) =>
        `<span class="slide-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`
      ).join('');
    }
    modalBody.innerHTML = `
      <div class="modal-case-header">
        <div class="modal-case-tag">${data.tag || ''}</div>
        <h2 class="modal-case-title">${data.title || ''}</h2>
        <p class="modal-case-desc">${data.description || ''}</p>
        <div class="modal-case-meta">
          ${data.year ? `<span>📅 ${data.year}</span>` : ''}
          ${data.type ? `<span>🏗 ${data.type}</span>` : ''}
          ${data.brand ? `<span>🏆 ${data.brand}</span>` : ''}
        </div>
      </div>
      ${data.pages && data.pages.length > 0 ? `
      <div class="modal-gallery" id="modalGallery">
        <div class="gallery-main" id="galleryMain" onclick="_zoomImg(this.querySelector('img').src)" style="cursor:zoom-in">
          <img src="${data.pages[0]}" alt="${data.title}" class="gallery-img active" />
        </div>
        ${data.pages.length > 1 ? `
        <div class="gallery-thumbs">
          ${data.pages.map((src, i) => `
            <div class="thumb-item ${i === 0 ? 'active' : ''}" data-idx="${i}">
              <img src="${src}" alt="图片${i+1}" />
            </div>
          `).join('')}
        </div>
        <div class="gallery-dots">${dotsHtml}</div>
        ` : ''}
      </div>
      ` : '<p class="modal-no-img">暂无实景图片，欢迎来电咨询获取更多案例</p>'}
      <div class="modal-cta">
        <a href="#" onclick="contactCta();return false" class="btn btn-primary">📞 致电咨询：${contactData.phoneDisplay || contactData.phone || '191-4803-1345'}</a>
      </div>
    `;

    if (data.pages && data.pages.length > 1) {
      const thumbs = modalBody.querySelectorAll('.thumb-item');
      const dots = modalBody.querySelectorAll('.slide-dot');
      const mainImg = modalBody.querySelector('.gallery-img');
      if (!mainImg) return;

      function setSlide(idx) {
        mainImg.src = data.pages[idx];
        mainImg.classList.add('fade-in');
        setTimeout(() => mainImg.classList.remove('fade-in'), 300);
        thumbs.forEach(t => t.classList.toggle('active', parseInt(t.dataset.idx) === idx));
        dots.forEach(d => d.classList.toggle('active', parseInt(d.dataset.idx) === idx));
      }
      thumbs.forEach(t => t.addEventListener('click', () => setSlide(parseInt(t.dataset.idx))));
      dots.forEach(d => d.addEventListener('click', () => setSlide(parseInt(d.dataset.idx))));
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.openServiceDetail = function(id) {
    const data = servicesData.find(s => s.id === id);
    if (!data) return;

    let galleryHtml = '';
    if (data.images && data.images.length > 0) {
      galleryHtml = `
        <div class="modal-gallery" id="modalGallery">
          <div class="gallery-main" id="galleryMain" onclick="_zoomServiceImg(this.querySelector('img').src, '${id}')" style="cursor:zoom-in">
            <img src="${data.images[0]}" alt="${data.title}" class="gallery-img active" />
          </div>
          ${data.images.length > 1 ? `
          <div class="gallery-thumbs">
            ${data.images.map((src, i) => `
              <div class="thumb-item ${i === 0 ? 'active' : ''}" data-idx="${i}" onclick="event.stopPropagation();setServiceSlide('${id}', ${i})">
                <img src="${src}" alt="图片${i+1}" />
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      `;
    } else {
      galleryHtml = '<p class="modal-no-img">暂无效果图</p>';
    }

    modalBody.innerHTML = `
      <div class="modal-case-header">
        <div class="modal-case-tag">${data.icon || '🛠️'} 服务</div>
        <h2 class="modal-case-title">${data.title || ''}</h2>
        <p class="modal-case-desc">${data.desc || ''}</p>
      </div>
      ${galleryHtml}
      ${data.tags && data.tags.length > 0 ? `
      <div class="modal-brand-section">
        <h4>服务标签</h4>
        <div class="modal-brand-products">
          ${data.tags.map(t => `<span class="product-tag">${t}</span>`).join('')}
        </div>
      </div>
      ` : ''}
      <div class="modal-cta">
        <a href="#" onclick="contactCta();return false" class="btn btn-primary">📞 致电咨询：${contactData.phoneDisplay || contactData.phone || '191-4803-1345'}</a>
      </div>
    `;

    // 存储图片数据供切换使用
    window._serviceGalleryData = { images: data.images || [], id: id };

    if (data.images && data.images.length > 1) {
      window.setServiceSlide = function(svcId, idx) {
        if (window._serviceGalleryData && window._serviceGalleryData.id === svcId) {
          const mainImg = modalBody.querySelector('.gallery-img');
          const thumbs = modalBody.querySelectorAll('.thumb-item');
          if (mainImg && window._serviceGalleryData.images[idx]) {
            mainImg.src = window._serviceGalleryData.images[idx];
            mainImg.classList.add('fade-in');
            setTimeout(() => mainImg.classList.remove('fade-in'), 300);
          }
          thumbs.forEach(t => t.classList.toggle('active', parseInt(t.dataset.idx) === idx));
        }
      };

      window._zoomServiceImg = function(src, svcId) {
        if (window._serviceGalleryData && window._serviceGalleryData.images) {
          var idx = window._serviceGalleryData.images.indexOf(src);
          if (idx === -1) idx = 0;
          _openGallery(window._serviceGalleryData.images, idx);
        }
      };
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.openBrandDetail = function(id) {
    const data = brandsData.find(b => b.id === id);
    if (!data) return;

    let galleryHtml = '';
    if (data.images && data.images.length > 0) {
      galleryHtml = `
        <div class="modal-gallery" id="modalGallery">
          <div class="gallery-main" id="galleryMain" onclick="_zoomBrandImg(this.querySelector('img').src, '${id}')" style="cursor:zoom-in">
            <img src="${data.images[0]}" alt="${data.name}" class="gallery-img active" />
          </div>
          ${data.images.length > 1 ? `
          <div class="gallery-thumbs">
            ${data.images.map((src, i) => `
              <div class="thumb-item ${i === 0 ? 'active' : ''}" data-idx="${i}" onclick="event.stopPropagation();setBrandSlide('${id}', ${i})">
                <img src="${src}" alt="图片${i+1}" />
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="modal-brand-header">
        ${data.logo ? `<img src="${data.logo}" alt="${data.name}" class="modal-brand-logo-img" />` : `<div class="modal-brand-logo">${data.name || ''}</div>`}
        <div class="modal-brand-title-wrap">
          <h2 class="modal-brand-title">${data.name || ''}</h2>
          <div class="modal-brand-badge">${data.badge || ''}</div>
        </div>
      </div>
      ${galleryHtml}
      <div class="modal-brand-body">
        <div class="modal-brand-section">
          <h4>品牌简介</h4>
          <p>${data.intro || ''}</p>
        </div>
        <div class="modal-brand-section">
          <h4>主营产品</h4>
          <div class="modal-brand-products">
            ${(data.products || []).map(p => `<span class="product-tag">${p}</span>`).join('')}
          </div>
        </div>
        ${data.features ? `
        <div class="modal-brand-section">
          <h4>品牌优势</h4>
          <div class="modal-brand-features">
            ${(data.features || []).map(f => `
              <div class="brand-feature-item">
                <span class="feature-icon">✓</span>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>
      <div class="modal-cta">
        <a href="#" onclick="contactCta();return false" class="btn btn-primary">📞 咨询${data.name || ''}产品价格</a>
      </div>
    `;

    // 存储图片数据供切换使用
    window._brandGalleryData = { images: data.images || [], id: id };

    if (data.images && data.images.length > 1) {
      window.setBrandSlide = function(brandId, idx) {
        if (window._brandGalleryData && window._brandGalleryData.id === brandId) {
          const mainImg = modalBody.querySelector('.gallery-img');
          const thumbs = modalBody.querySelectorAll('.thumb-item');
          if (mainImg && window._brandGalleryData.images[idx]) {
            mainImg.src = window._brandGalleryData.images[idx];
            mainImg.classList.add('fade-in');
            setTimeout(() => mainImg.classList.remove('fade-in'), 300);
          }
          thumbs.forEach(t => t.classList.toggle('active', parseInt(t.dataset.idx) === idx));
        }
      };

      window._zoomBrandImg = function(src, brandId) {
        if (window._brandGalleryData && window._brandGalleryData.images) {
          var idx = window._brandGalleryData.images.indexOf(src);
          if (idx === -1) idx = 0;
          _openGallery(window._brandGalleryData.images, idx);
        }
      };
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---- 案例卡片事件委托（替代内联 onclick，更可靠）----
  document.addEventListener('click', function(e) {
    var card = e.target.closest('.case-card[data-id]');
    if (card && card.classList.contains('cta-card')) return;  // 排除 CTA 卡
    if (card) {
      var id = card.getAttribute('data-id');
      window.openCaseDetail(id);
    }
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// ========== 表单提交（追加到 data.json 的 inquiries 数组） ==========
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const inquiry = {
    name: form.name.value,
    phone: form.phone.value,
    type: form.type ? form.type.value : '',
    message: form.message ? form.message.value : '',
    time: new Date().toLocaleString('zh-CN')
  };

  try {
    // 读取当前数据，追加询盘，写回服务器
    const res = await fetch('/api/data');
    const currentData = await res.json();
    if (!currentData.inquiries) currentData.inquiries = [];
    currentData.inquiries.unshift(inquiry);
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentData)
    });
  } catch(err) {
    console.warn('询盘保存失败（离线模式）', err);
  }

  const success = document.getElementById('formSuccess');
  form.style.display = 'none';
  success.style.display = 'block';
}

// 表单提交绑定
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', handleSubmit);
});
