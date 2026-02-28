// results.js — display only
// Reads data from sessionStorage and populates the results page
// read data 
const results         = JSON.parse(sessionStorage.getItem('skinResults'));
const user            = JSON.parse(sessionStorage.getItem('skinUser'));
const recommendations = JSON.parse(sessionStorage.getItem('skinRecommendations')) || [];
const uploadedPhoto   = sessionStorage.getItem('skinUploadedPhoto')
                     || localStorage.getItem('skinUploadedPhoto');

// Expose results globally so email.js can access it
window.results = results;

// Redirect if no data  user landed here directly
if (!results || !user) {
  window.location.href = 'index.html';
}

// Shorthand for the website section
const website = results.website;

// header
document.getElementById('resultsTitle').textContent = 'Your Skin Analysis';
document.getElementById('overallScore').textContent = website.overallScore ?? '--';
document.getElementById('summary').textContent      = website.summary || 'No summary available.';

// score legend
// Highlight the row that matches the user's overall score
const overallScore = website.overallScore ?? 0;
document.querySelectorAll('.score-legend-row').forEach((row) => {
  const min = parseInt(row.dataset.min);
  const max = parseInt(row.dataset.max);
  if (overallScore >= min && overallScore <= max) {
    row.classList.add('is-active');
  }
});

// upload photo 
const uploadedPhotoEl   = document.getElementById('uploadedPhoto');
const uploadedPhotoWrap = document.getElementById('uploadedPhotoWrap');
if (uploadedPhotoEl && uploadedPhotoWrap) {
  if (uploadedPhoto) {
    uploadedPhotoEl.src = uploadedPhoto;
    sessionStorage.setItem('skinUploadedPhoto', uploadedPhoto);
  } else {
    uploadedPhotoWrap.classList.add('hidden');
  }
}

// metric bars 
function setMetric(barId, valId, value) {
  const barEl   = document.getElementById(barId);
  const valueEl = document.getElementById(valId);
  if (!barEl || !valueEl) return 0;

  const safeValue = Number.isFinite(Number(value))
    ? Math.max(0, Math.min(100, Number(value)))
    : 0;

  barEl.style.width   = safeValue + '%';
  valueEl.textContent = `${safeValue}%`;
  return safeValue;
}

// Higher = better (hydration, texture, pores)
// Thresholds match color tiers exactly:
//   >= 75  → is-healthy (green)   → positive note
//   60–74  → neutral              → neutral note
//   40–59  → is-priority (yellow) → mild concern note
//   < 40   → is-critical (red)    → urgent note
function getMetricNote(value) {
  if (value >= 75) return 'Balanced and healthy.';
  if (value >= 60) return 'Stable, with room to improve.';
  if (value >= 40) return 'Below average — worth addressing.';
  return 'Needs attention.';
}

// Lower = better (oil production, sensitivity, dark spots, fine lines, pigmentation)
// Thresholds match color tiers exactly:
//   <= 25  → is-healthy (green)   → positive note
//   26–45  → neutral              → neutral note
//   46–65  → is-priority (yellow) → mild concern note
//   > 65   → is-critical (red)    → urgent note
function getMetricNoteInverse(value) {
  if (value <= 25) return 'Balanced and healthy.';
  if (value <= 45) return 'Mild — currently manageable.';
  if (value <= 65) return 'Moderate — worth addressing.';
  return 'Elevated — prioritize this in your routine.';
}

// inverse: false → higher is better (hydration, texture, pores)
// inverse: true  → lower is better (oil, sensitivity, dark spots, fine lines, pigmentation)
const metricConfig = [
  { key: 'hydration',     barId: 'hydrationBar',     valId: 'hydrationVal',     noteId: 'hydrationNote',     cardId: 'metricCardHydration',     inverse: false },
  { key: 'texture',       barId: 'textureBar',       valId: 'textureVal',       noteId: 'textureNote',       cardId: 'metricCardTexture',       inverse: false },
  { key: 'darkSpots',     barId: 'darkSpotsBar',     valId: 'darkSpotsVal',     noteId: 'darkSpotsNote',     cardId: 'metricCardDarkSpots',     inverse: true  },
  { key: 'fineLines',     barId: 'fineLinesBar',     valId: 'fineLinesVal',     noteId: 'fineLinesNote',     cardId: 'metricCardFineLines',     inverse: true  },
  { key: 'pores',         barId: 'poresBar',         valId: 'poresVal',         noteId: 'poresNote',         cardId: 'metricCardPores',         inverse: false },
  { key: 'oilProduction', barId: 'oilProductionBar', valId: 'oilProductionVal', noteId: 'oilProductionNote', cardId: 'metricCardOilProduction', inverse: true  },
  { key: 'sensitivity',   barId: 'sensitivityBar',   valId: 'sensitivityVal',   noteId: 'sensitivityNote',   cardId: 'metricCardSensitivity',   inverse: true  },
  { key: 'pigmentation',  barId: 'pigmentationBar',  valId: 'pigmentationVal',  noteId: 'pigmentationNote',  cardId: 'metricCardPigmentation',  inverse: true  }
];

const metricValues = metricConfig.map((metric) => {
  const numericValue = setMetric(metric.barId, metric.valId, website[metric.key]);
  const noteEl = document.getElementById(metric.noteId);

  // Use the correct note function based on whether the metric is inverse
  if (noteEl) {
    noteEl.textContent = metric.inverse
      ? getMetricNoteInverse(numericValue)
      : getMetricNote(numericValue);
  }

  return { ...metric, value: numericValue };
});

// metric concern threshholds
// Each card is classified independently based on its actual value.

metricValues.forEach((metric) => {
  const card = document.getElementById(metric.cardId);
  if (!card) return;

  const v = metric.value;
  let tier = '';

  if (!metric.inverse) {
    // Normal: higher is better
    if      (v < 40)  tier = 'is-critical';
    else if (v < 60)  tier = 'is-priority';
    else if (v >= 75) tier = 'is-healthy';
  } else {
    // Inverse: lower is better
    if      (v > 65)  tier = 'is-critical';
    else if (v > 45)  tier = 'is-priority';
    else if (v <= 25) tier = 'is-healthy';
  }

  if (tier) card.classList.add(tier);
});

// ── CONCERNS ──
const concernsList = document.getElementById('concernsList');
(website.concerns || []).forEach((concern) => {
  const tag = document.createElement('span');
  tag.className   = 'tag';
  tag.textContent = concern;
  if (concernsList) concernsList.appendChild(tag);
});

// ── INGREDIENTS TO USE ──
// Names only on website — full benefit explanations go in the email
const ingredientsList = document.getElementById('ingredientsList');
(website.ingredientNames || []).forEach((name) => {
  const tag = document.createElement('span');
  tag.className   = 'tag good';
  tag.textContent = name;
  if (ingredientsList) ingredientsList.appendChild(tag);
});

// ── INGREDIENTS TO AVOID ──
// Names only on website — reasons go in the email
const avoidList = document.getElementById('avoidList');
(website.avoidNames || []).forEach((name) => {
  const tag = document.createElement('span');
  tag.className   = 'tag bad';
  tag.textContent = name;
  if (avoidList) avoidList.appendChild(tag);
});

// product recommendations
const productsList = document.getElementById('productsList');
recommendations.forEach((product) => {
  if (!productsList) return;

  const card = document.createElement('div');
  card.className = 'product-card';

  const fallbackSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260">` +
    `<rect width="100%" height="100%" fill="#eee8df"/>` +
    `<text x="50%" y="50%" text-anchor="middle" fill="#8a837b" font-size="18" font-family="DM Sans,Arial">Image unavailable</text>` +
    `</svg>`
  );

  const safeImage       = product.image || `data:image/svg+xml;charset=UTF-8,${fallbackSvg}`;
  const safeBrand       = product.brand || 'Recommended';
  const safeName        = product.name || 'Product';
  const safeCategory    = product.category || 'Skincare';
  const safeDescription = product.description || 'Suitable for your current skin profile.';
  const safeWebsite     = typeof product.website === 'string' && /^https?:\/\//i.test(product.website)
    ? product.website
    : '#';

  const img = document.createElement('img');
  img.className = 'product-img';
  img.alt = safeName;
  img.src = safeImage;

  const brand = document.createElement('div');
  brand.className = 'product-brand';
  brand.textContent = safeBrand;

  const name = document.createElement('div');
  name.className = 'product-name';
  name.textContent = safeName;

  const category = document.createElement('div');
  category.className = 'product-category';
  category.textContent = safeCategory;

  const description = document.createElement('div');
  description.className = 'product-desc';
  description.textContent = safeDescription;

  const link = document.createElement('a');
  link.className = 'product-link';
  link.textContent = 'View Product ->';
  link.href = safeWebsite;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  card.append(img, brand, name, category, description, link);

  img.onerror = function () {
    this.classList.add('is-fallback');
    this.src = `data:image/svg+xml;charset=UTF-8,${fallbackSvg}`;
  };

  productsList.appendChild(card);
});