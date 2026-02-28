// seedProducts.js
// Run once to populate MongoDB with real Algerian skincare products.
// Usage: node seedProducts.js
// Make sure your .env file is present with MONGODB_URI before running.

import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';

const products = [

  // ─── BIOLILA ───────────────────────────────────────────────────────────────

  {
    name: 'Gel Nettoyant',
    brand: 'Biolila',
    category: 'Cleanser',
    description: 'A gentle daily cleansing gel that removes impurities and excess oil while preserving the skin\'s natural moisture barrier. Suitable for all skin types.',
    image: 'https://biolila.com/storage/product/7FKVQUxTJOKL1Onf6qWgOcGsW.webp',
    website: 'https://biolila.com/shop/1-Gel%20nettoyant',
    concerns: ['acne', 'oiliness', 'pores'],
    skinTypes: ['oily', 'combination', 'all']
  },
  {
    name: 'Cleansing Oil – Huile Nettoyante et Démaquillante',
    brand: 'Biolila',
    category: 'Cleansing Oil',
    description: 'A dual-action cleansing oil that dissolves makeup and sunscreen while nourishing the skin. Leaves the skin soft, clean, and comfortable.',
    image: 'https://biolila.com/storage/product/Xg2oYzJIBJEGr7D2p82iurp5U.webp',
    website: 'https://biolila.com/shop/2-Cleansing%20Oil%20180ML%20%E2%80%93%20Huile%20nettoyante%20et%20d%C3%A9maquillante',
    concerns: ['dryness', 'sensitivity'],
    skinTypes: ['dry', 'sensitive', 'normal', 'all']
  },
  {
    name: 'Toner – Riz & Arbre à Thé',
    brand: 'Biolila',
    category: 'Toner',
    description: 'A balancing toner formulated with rice extract and tea tree oil. Tightens pores, controls oil, and preps skin for the next steps of your routine.',
    image: 'https://biolila.com/storage/product/iIO5q6fB2BFLU5CYWyl0QYrsf.webp',
    website: 'https://biolila.com/shop/3-Toner%20180ML%20%E2%80%93%20Riz%20&%20Arbre%20%C3%A0%20Th%C3%A9',
    concerns: ['pores', 'oiliness', 'acne'],
    skinTypes: ['oily', 'combination']
  },
  {
    name: 'Écran Solaire SPF 50+',
    brand: 'Biolila',
    category: 'Sunscreen',
    description: 'A lightweight SPF 50+ sunscreen that protects against UVA and UVB rays without leaving a white cast. Essential for preventing dark spots and premature aging.',
    image: 'https://biolila.com/storage/product/mT79KNEoi2HUqCwX18iwavOCi.webp',
    website: 'https://biolila.com/shop/4-%C3%89cran%20Solaire%20SPF%2050+',
    concerns: ['dark spots', 'pigmentation', 'fine lines', 'sensitivity'],
    skinTypes: ['all']
  },
  {
    name: 'Crème de Jour Hydratante',
    brand: 'Biolila',
    category: 'Moisturizer',
    description: 'A light daily moisturizer that delivers lasting hydration throughout the day. Absorbs quickly and creates a smooth base under makeup.',
    image: 'https://biolila.com/storage/product/BiXgbQVhh3G2GfmVVh0MNGekz.webp',
    website: 'https://biolila.com/shop/9-Cr%C3%A8me%20de%20jour%20Hydratante%2050Ml',
    concerns: ['dryness', 'dullness'],
    skinTypes: ['dry', 'normal', 'combination', 'all']
  },
  {
    name: 'Crème de Nuit Nourrissante',
    brand: 'Biolila',
    category: 'Night Cream',
    description: 'A rich nourishing night cream that works overnight to restore the skin barrier, deeply hydrate, and support skin repair while you sleep.',
    image: 'https://biolila.com/storage/product/DT8UbtjM00jduJ4jf4Rqw30w7.webp',
    website: 'https://biolila.com/shop/10-Cr%C3%A8me%20de%20nuit%20Nourissante%2050Ml',
    concerns: ['dryness', 'fine lines', 'dullness'],
    skinTypes: ['dry', 'normal', 'all']
  },

  // ─── LABORATOIRES VENUS ────────────────────────────────────────────────────

  {
    name: 'Viderm Gel Nettoyant Purifiant',
    brand: 'Laboratoires Venus',
    category: 'Cleanser',
    description: 'A purifying cleansing gel from the Viderm dermal range. Designed to deeply cleanse congested pores, reduce excess sebum, and leave skin clear and refreshed.',
    image: 'https://laboratoiresvenus.com/wp-content/uploads/2025/05/3D_Gel-Nettoyant-300x300.png',
    website: 'https://laboratoiresvenus.com/en/product-category/dermique/gel-nettoyant/',
    concerns: ['acne', 'oiliness', 'pores'],
    skinTypes: ['oily', 'combination']
  },
  {
    name: 'Viderm Purifiant P+ Soin Anti-Imperfections',
    brand: 'Laboratoires Venus',
    category: 'Treatment',
    description: 'A targeted anti-imperfection treatment from the Viderm purifying range. Reduces active breakouts, prevents new blemishes, and helps even out skin tone.',
    image: 'https://laboratoiresvenus.com/wp-content/uploads/2025/05/3D_Creme-Anti-Acne-300x300.png',
    website: 'https://laboratoiresvenus.com/en/product-category/dermique/viderm-purifiant-p/',
    concerns: ['acne', 'pores', 'oiliness'],
    skinTypes: ['oily', 'combination']
  },
  {
    name: 'Viderm Anti-Age A+ Soin Hydratant',
    brand: 'Laboratoires Venus',
    category: 'Anti-Age Moisturizer',
    description: 'An anti-aging moisturizing treatment designed to reduce visible fine lines and restore firmness. Enriched with active ingredients that promote skin renewal.',
    image: 'https://laboratoiresvenus.com/wp-content/uploads/2025/05/3D_Creme-Anti-Age-300x300.png',
    website: 'https://laboratoiresvenus.com/en/product-category/dermique/viderm-anti-age-a/',
    concerns: ['fine lines', 'dullness', 'dryness'],
    skinTypes: ['dry', 'normal', 'all']
  },
  {
    name: 'Lingettes Micellaires Démaquillantes à l\'Eau de Rose',
    brand: 'Laboratoires Venus',
    category: 'Makeup Remover',
    description: 'Gentle micellar cleansing wipes infused with rose water. Remove makeup, SPF and daily impurities in one step without irritating sensitive skin.',
    image: 'https://laboratoiresvenus.com/wp-content/uploads/2023/11/lingette2.602-02-300x300.png',
    website: 'https://laboratoiresvenus.com/en/product-category/dermique/lingette-demaquillante/',
    concerns: ['sensitivity', 'dullness'],
    skinTypes: ['sensitive', 'normal', 'all']
  },

  // ─── AZUL COSMÉTIQUE ───────────────────────────────────────────────────────

  {
    name: 'Azemmur – Savon SAF à l\'Huile d\'Olive',
    brand: 'Azul Cosmétique',
    category: 'Cleanser',
    description: 'A cold-process 100% olive oil soap for sensitive skin. Free from harsh detergents, it gently cleanses while maintaining the skin\'s natural lipid barrier.',
    image: 'https://www.azul-cosmetique.com/cdn/shop/files/savonsaponifieafroidal_huiled_olive-AzulCosmetique.webp?v=1763823066&width=1024',
    website: 'https://www.azul-cosmetique.com/products/azemmur-savon-saf-huile-dolive',
    concerns: ['sensitivity', 'dryness'],
    skinTypes: ['sensitive', 'dry', 'normal', 'all']
  },
  {
    name: 'Huile de Pépins de Figue de Barbarie',
    brand: 'Azul Cosmétique',
    category: 'Face Oil',
    description: 'A premium prickly pear seed oil rich in Vitamin E and essential fatty acids. Visibly reduces fine lines, brightens dark spots, and deeply nourishes mature or dry skin.',
    image: 'https://www.azul-cosmetique.com/cdn/shop/files/huile_de_pepins_de_figue_de_barbarie-2.webp?v=1731962762&width=1024',
    website: 'https://www.azul-cosmetique.com/products/huile-de-pepins-de-figue-de-barbarie-bio',
    concerns: ['fine lines', 'dark spots', 'dryness', 'dullness'],
    skinTypes: ['dry', 'normal', 'combination', 'all']
  },
  {
    name: 'Thala – Rituel Hydratant Visage',
    brand: 'Azul Cosmétique',
    category: 'Moisturizer',
    description: 'A traditional Berber-inspired hydrating face cream enriched with natural botanical extracts. Restores suppleness, relieves tightness, and leaves skin visibly plumped.',
    image: 'https://www.azul-cosmetique.com/cdn/shop/files/Rituelsberberes-AzulCosmetique.webp?v=1763823066&width=1024',
    website: 'https://www.azul-cosmetique.com/products/thala-rituel-hydratant-visage-50ml-copie',
    concerns: ['dryness', 'dullness', 'sensitivity'],
    skinTypes: ['dry', 'sensitive', 'normal']
  },
  {
    name: 'Azar – Rituel Nettoyant et Démaquillant',
    brand: 'Azul Cosmétique',
    category: 'Cleansing Oil',
    description: 'A plant-based cleansing and makeup remover ritual formulated with cold-pressed vegetable oils. Melts away impurities and leaves skin soft and balanced.',
    image: 'https://www.azul-cosmetique.com/cdn/shop/files/PS.webp?v=1763823066&width=2048',
    website: 'https://www.azul-cosmetique.com/products/azar-rituel-nettoyant-et-demaquillant-aux-huiles-vegetales-100ml-copie',
    concerns: ['sensitivity', 'dryness', 'dullness'],
    skinTypes: ['sensitive', 'dry', 'normal', 'all']
  },
  {
    name: 'Rituel Anti-Imperfections – Huile de Lentisque',
    brand: 'Azul Cosmétique',
    category: 'Treatment',
    description: 'A targeted treatment using mastic tree oil, known for its antibacterial and anti-inflammatory properties. Calms active breakouts and reduces post-acne marks.',
    image: 'https://www.azul-cosmetique.com/cdn/shop/files/Kardoune_2_1x1_375fc5b6-673c-4cee-8e23-772243a99374.jpg?v=1731332950&width=1024',
    website: 'https://www.azul-cosmetique.com/products/rituel-anti-imperfections-huile-de-lentisque-pistachier-30ml-copie',
    concerns: ['acne', 'dark spots', 'pores'],
    skinTypes: ['oily', 'combination']
  },

  // ─── TOUCHÉ LAB ────────────────────────────────────────────────────────────

  {
    name: 'Gel Nettoyant Purifiant Visage',
    brand: 'Touché Lab',
    category: 'Cleanser',
    description: 'A science-backed purifying face gel that removes excess oil, unclogs pores, and leaves skin visibly clearer. Formulated for oily and acne-prone skin types.',
    image: 'https://www.touchelab.com/cdn/shop/files/2_e5cfdce6-a00e-4d4e-ba8e-250f36e77a7e.jpg?crop=center&height=1080&v=1769615656&width=1080',
    website: 'https://www.touchelab.com/products/gel-nettoyant-purifiant-visage-ad',
    concerns: ['acne', 'oiliness', 'pores'],
    skinTypes: ['oily', 'combination']
  },
  {
    name: 'Sérum Niacinamide 10% + Zinc 1%',
    brand: 'Touché Lab',
    category: 'Serum',
    description: 'A high-potency niacinamide serum that regulates sebum, minimizes pores, reduces redness, and fades post-acne hyperpigmentation with consistent use.',
    image: 'https://www.touchelab.com/cdn/shop/files/Nicinamide-zinc_2.png?crop=center&height=1080&v=1744639102&width=1080',
    website: 'https://www.touchelab.com/products/serum-niacinamide-10-zinc-1',
    concerns: ['acne', 'pores', 'oiliness', 'dark spots', 'redness'],
    skinTypes: ['oily', 'combination', 'all']
  },
  {
    name: 'Acide Salicylique',
    brand: 'Touché Lab',
    category: 'Exfoliant',
    description: 'A BHA exfoliant with salicylic acid that penetrates deep into pores to dissolve congestion, smooth skin texture, and prevent future breakouts.',
    image: 'https://www.touchelab.com/cdn/shop/files/anti-imperfctions_2.png?crop=center&height=1080&v=1744639560&width=1080',
    website: 'https://www.touchelab.com/products/acide-salicylique',
    concerns: ['acne', 'pores', 'texture', 'oiliness'],
    skinTypes: ['oily', 'combination']
  },
  {
    name: 'Anti Acné',
    brand: 'Touché Lab',
    category: 'Treatment',
    description: 'A targeted anti-acne formula designed to calm active breakouts, reduce inflammation, and prevent future blemishes. Gentle enough for daily use.',
    image: 'https://www.touchelab.com/cdn/shop/files/1_87581144-4130-4f63-92d0-64ab12114d09.jpg?crop=center&height=1080&v=1769610730&width=1080',
    website: 'https://www.touchelab.com/products/anti-acne',
    concerns: ['acne', 'redness', 'sensitivity'],
    skinTypes: ['oily', 'combination', 'sensitive']
  },

  // ─── BELNCO ────────────────────────────────────────────────────────────────

  {
    name: 'Tinted Serum SPF 30',
    brand: 'Belnco',
    category: 'Tinted Sunscreen',
    description: 'A lightweight tinted serum with SPF 30 that provides sun protection while evening out skin tone. Combines skincare and light coverage in one step.',
    image: 'https://belnco.com/cdn/shop/files/serum-teinte-1.png?v=1757877178&width=1080',
    website: 'https://belnco.com/products/tinted-serum-spf-30',
    concerns: ['dark spots', 'pigmentation', 'dullness'],
    skinTypes: ['all']
  },
  {
    name: 'Clarifying Serum',
    brand: 'Belnco',
    category: 'Serum',
    description: 'A clarifying serum formulated to fade hyperpigmentation, even skin tone, and reduce post-inflammatory dark marks. Clinically developed for visible results.',
    image: 'https://belnco.com/cdn/shop/files/CL-1.png?v=1759155783&width=1080',
    website: 'https://belnco.com/products/clarififying-serum',
    concerns: ['dark spots', 'pigmentation', 'dullness'],
    skinTypes: ['all', 'combination', 'normal']
  },
  {
    name: 'Centella Serum SPF 30',
    brand: 'Belnco',
    category: 'Serum + SPF',
    description: 'A calming serum with centella asiatica and SPF 30 that soothes irritated skin, strengthens the skin barrier, and protects against UV damage simultaneously.',
    image: 'https://belnco.com/cdn/shop/files/C0.png?v=1759155581&width=1080',
    website: 'https://belnco.com/products/centella-serum-spf-30',
    concerns: ['sensitivity', 'redness', 'dark spots'],
    skinTypes: ['sensitive', 'combination', 'all']
  },
  {
    name: 'Retinol Complex Serum',
    brand: 'Belnco',
    category: 'Serum',
    description: 'An advanced retinol serum that accelerates cell turnover, smooths fine lines, and refines skin texture. Formulated to minimize irritation for first-time retinol users.',
    image: 'https://belnco.com/cdn/shop/files/R0.png?v=1759056932&width=1080',
    website: 'https://belnco.com/products/retinol-complex-serum',
    concerns: ['fine lines', 'texture', 'dullness', 'pigmentation'],
    skinTypes: ['normal', 'combination', 'all']
  },
  {
    name: 'Rich Moisturizer',
    brand: 'Belnco',
    category: 'Moisturizer',
    description: 'A deeply nourishing moisturizer with a rich texture that restores the skin barrier, relieves dryness, and leaves skin supple and comfortable for 24 hours.',
    image: 'https://belnco.com/cdn/shop/files/Rich-moisturizer-3_5fbb1f01-978e-46f3-9c19-0c309ea7f475.png?v=1763288022&width=1080',
    website: 'https://belnco.com/products/rich-moisturizer',
    concerns: ['dryness', 'sensitivity', 'fine lines'],
    skinTypes: ['dry', 'sensitive', 'normal']
  },
  {
    name: '100% Pure Prickly Pear Oil',
    brand: 'Belnco',
    category: 'Face Oil',
    description: 'Cold-pressed 100% pure prickly pear seed oil, one of the most potent anti-aging face oils available. Absorbs quickly and visibly reduces fine lines and dark spots.',
    image: 'https://belnco.com/cdn/shop/files/pure-prickly-pear-oil.png?v=1759058389&width=1080',
    website: 'https://belnco.com/products/100-pure-prickly-pear-oil',
    concerns: ['fine lines', 'dark spots', 'dryness', 'dullness'],
    skinTypes: ['dry', 'normal', 'combination', 'all']
  },

  // ─── BEAUTY & BIO ──────────────────────────────────────────────────────────

  {
    name: 'Safia – Crème Hydratante pour Peaux Sèches',
    brand: 'Beauty & Bio',
    category: 'Moisturizer',
    description: 'A rich hydrating cream specially formulated for dry skin. Deeply moisturizes, soothes discomfort, and restores softness to skin that feels tight or rough.',
    image: 'https://beautyandbio.net/wp-content/uploads/2022/06/Safia-Crème-hydratante-pour-les-peaux-sèches-595x824.png',
    website: 'https://beautyandbio.net/produit/safia-creme-hydratante-pour-les-peaux-seches/',
    concerns: ['dryness', 'sensitivity', 'dullness'],
    skinTypes: ['dry', 'sensitive']
  },
  {
    name: 'Mujer – Crème Anti Âge',
    brand: 'Beauty & Bio',
    category: 'Anti-Age Cream',
    description: 'An anti-aging day cream that firms and plumps the skin, reduces the appearance of fine lines, and provides lasting hydration for a more youthful complexion.',
    image: 'https://beautyandbio.net/wp-content/uploads/2022/05/MUJER-Creme-anti-age-739x1024-1-595x824.jpeg',
    website: 'https://beautyandbio.net/produit/mujer-creme-anti-age/',
    concerns: ['fine lines', 'dryness', 'dullness'],
    skinTypes: ['dry', 'normal', 'all']
  },

  // ─── BIOTANYS ──────────────────────────────────────────────────────────────

  {
    name: 'Toner à la Niacinamide',
    brand: 'Biotanys',
    category: 'Toner',
    description: 'A niacinamide-enriched toner that balances skin pH, tightens pores, reduces redness, and preps skin to better absorb serums and moisturizers.',
    image: 'https://biotanys.com/wp-content/uploads/2025/07/IMG_5225-300x297.jpeg',
    website: 'https://biotanys.com/produit/toner-a-la-niacinamide/',
    concerns: ['pores', 'redness', 'oiliness', 'acne'],
    skinTypes: ['oily', 'combination', 'all']
  },
  {
    name: 'Gel Nettoyant à l\'Huile Essentielle d\'Arbre à Thé',
    brand: 'Biotanys',
    category: 'Cleanser',
    description: 'A purifying cleansing gel with tea tree essential oil. Antibacterial and balancing, it cleanses congested skin and helps prevent breakouts without over-drying.',
    image: 'https://biotanys.com/wp-content/uploads/2023/07/IMG_8182-300x300.jpeg',
    website: 'https://biotanys.com/produit/gel-nettoyant-visage-a-lhuile-essentielle-darbre-a-the/',
    concerns: ['acne', 'oiliness', 'pores'],
    skinTypes: ['oily', 'combination']
  },
  {
    name: 'Sérum Visage à la Vitamine C',
    brand: 'Biotanys',
    category: 'Serum',
    description: 'A brightening vitamin C face serum that fades dark spots, evens out pigmentation, and adds a radiant glow. Also provides antioxidant protection against environmental damage.',
    image: 'https://biotanys.com/wp-content/uploads/2022/03/3-1000x1000-jaune-1-300x300.jpg',
    website: 'https://biotanys.com/produit/serum-visage-a-la-vitamine-c/',
    concerns: ['dark spots', 'pigmentation', 'dullness'],
    skinTypes: ['all', 'normal', 'combination']
  },
  {
    name: 'Sérum Visage Équilibrant & Correcteur',
    brand: 'Biotanys',
    category: 'Serum',
    description: 'A balancing and correcting serum designed for combination and oily skin. Regulates sebum, reduces shine, and corrects uneven texture and skin tone.',
    image: 'https://biotanys.com/wp-content/uploads/2022/03/3-1000x1000-bleu-300x300.jpg',
    website: 'https://biotanys.com/produit/serum-visage-equilibrant-correcteur/',
    concerns: ['oiliness', 'pores', 'texture', 'acne'],
    skinTypes: ['oily', 'combination']
  },
  {
    name: 'Eau Micellaire de Rose',
    brand: 'Biotanys',
    category: 'Micellar Water',
    description: 'A gentle rose micellar water that removes makeup and impurities without rinsing. Infused with rose water for a soothing and toning effect on sensitive skin.',
    image: 'https://biotanys.com/wp-content/uploads/2022/03/eau-Micelaire1-1000-10002-1-300x300.jpg',
    website: 'https://biotanys.com/produit/eau-micellaire-de-rose/',
    concerns: ['sensitivity', 'dullness'],
    skinTypes: ['sensitive', 'normal', 'all']
  },
  {
    name: 'Sérum Anti-Age',
    brand: 'Biotanys',
    category: 'Anti-Age Serum',
    description: 'A concentrated anti-aging serum with natural active ingredients that targets fine lines, loss of firmness, and uneven skin tone. Formulated by a pharmacist-cosmetologist.',
    image: 'https://biotanys.com/wp-content/uploads/2022/03/3-1000x1000-rose-1-300x300.jpg',
    website: 'https://biotanys.com/produit/serum-anti-age/',
    concerns: ['fine lines', 'dullness', 'pigmentation', 'dryness'],
    skinTypes: ['dry', 'normal', 'all']
  },

  // ─── FLORÉ DZ ──────────────────────────────────────────────────────────────

  {
    name: 'Crème Protectrice SPF 50',
    brand: 'Floré',
    category: 'Sunscreen',
    description: 'A protective SPF 50 day cream that shields skin from UV damage, prevents dark spots from deepening, and keeps skin hydrated throughout the day.',
    image: 'https://floredz.com/cdn/shop/files/SPF50.jpg?v=1751382570&width=533',
    website: 'https://floredz.com/products/flore-spf-50',
    concerns: ['dark spots', 'pigmentation', 'fine lines'],
    skinTypes: ['all']
  },
  {
    name: 'Gel Nettoyant',
    brand: 'Floré',
    category: 'Cleanser',
    description: 'A daily facial cleansing gel that effectively removes impurities and excess oil while being gentle enough for everyday use. Leaves skin refreshed and balanced.',
    image: 'https://floredz.com/cdn/shop/files/Gel_nettoyant.jpg?v=1743266481&width=533',
    website: 'https://floredz.com/products/gel-nettoyant',
    concerns: ['oiliness', 'acne', 'pores'],
    skinTypes: ['oily', 'combination', 'all']
  },
  {
    name: 'Crème Hydratante à l\'Acide Hyaluronique',
    brand: 'Floré',
    category: 'Moisturizer',
    description: 'A hyaluronic acid-enriched moisturizer that intensely hydrates and plumps the skin. Lightweight formula suitable for daily use, morning and night.',
    image: 'https://floredz.com/cdn/shop/files/cremehydratante.jpg?v=1743302922&width=533',
    website: 'https://floredz.com/products/acide-hyaluronique',
    concerns: ['dryness', 'fine lines', 'dullness'],
    skinTypes: ['dry', 'normal', 'combination', 'all']
  },
  {
    name: 'Sérum Visage',
    brand: 'Floré',
    category: 'Serum',
    description: 'A multi-tasking face serum that targets multiple skin concerns at once — brightening, hydrating, and smoothing in one lightweight formula.',
    image: 'https://floredz.com/cdn/shop/files/serum_5b75370a-d3bb-4fe1-bcd7-a8e8fddcd1f3.jpg?v=1743307838&width=533',
    website: 'https://floredz.com/products/serum',
    concerns: ['dullness', 'dark spots', 'dryness', 'texture'],
    skinTypes: ['all', 'normal', 'combination']
  },

  // ─── NATURA PRO LAB ────────────────────────────────────────────────────────

  {
    name: 'BB Crème Whitening H2O',
    brand: 'Natura Pro',
    category: 'BB Cream',
    description: 'A multifunctional BB cream that whitens, illuminates, and unifies the skin tone. Corrects imperfections, provides SPF 15 protection, and delivers 24-hour hydration for a firm, radiant complexion.',
    image: 'https://www.naturaprolab.com/wp-content/uploads/2021/05/bb-cream1-300x263.jpg',
    website: 'https://www.naturaprolab.com/produit/bb-creme/',
    concerns: ['dark spots', 'pigmentation', 'dullness'],
    skinTypes: ['all', 'normal', 'combination']
  },
  {
    name: 'Crème Visage au Miel',
    brand: 'Natura Pro',
    category: 'Moisturizer',
    description: 'A nourishing honey face cream that deeply moisturizes, soothes, and repairs the skin. Honey\'s natural antibacterial and humectant properties make it ideal for dry and reactive skin.',
    image: 'https://www.naturaprolab.com/wp-content/uploads/2021/07/creme-visage-miel-300x300.png',
    website: 'https://www.naturaprolab.com/produit/creme-visage-miel/',
    concerns: ['dryness', 'sensitivity', 'dullness'],
    skinTypes: ['dry', 'sensitive', 'normal']
  },
  {
    name: 'Soin Solaire Visage',
    brand: 'Natura Pro',
    category: 'Sunscreen',
    description: 'A facial sun care product that protects against UV damage while maintaining the skin\'s comfort and hydration. Formulated to prevent dark spots and premature skin aging.',
    image: 'https://www.naturaprolab.com/wp-content/uploads/2021/07/soin-solaire-300x300.png',
    website: 'https://www.naturaprolab.com/categorie-produit/soin-de-la-peau/soin-solaire/',
    concerns: ['dark spots', 'pigmentation', 'fine lines'],
    skinTypes: ['all']
  },
  {
    name: 'Lotion Crème Éclaircissante',
    brand: 'Natura Pro',
    category: 'Treatment',
    description: 'A brightening lotion-cream enriched with natural extracts that balance the skin tone and improve its radiance. Targets uneven pigmentation for a more luminous complexion.',
    image: 'https://www.naturaprolab.com/wp-content/uploads/2021/07/lotion-eclaircissante-300x300.png',
    website: 'https://www.naturaprolab.com/categorie-produit/soin-de-la-peau/soin-du-visage/',
    concerns: ['dark spots', 'pigmentation', 'dullness'],
    skinTypes: ['all', 'normal', 'combination']
  },

  // ─── BIONNEX ───────────────────────────────────────────────────────────────
  // Made in Sweden, distributed in Algeria. 6 skincare series: RENSADERM
  // (oily/acne), PERFEDERM (dry), PREVENTIVA (sun), PIGMENTIA (brightening),
  // THE NORDEA (concentrated serums).

  // — THE NORDEA series ———————————————————————————————————————————————————————

  {
    name: 'The Nordea Niacinamide 10% + Hyaluronic Acid Serum',
    brand: 'Bionnex',
    category: 'Serum',
    description: 'An advanced Vitamin B3 serum combining Niacinamide 10% and Hyaluronic Acid 2%. Tightens pores, reduces dark spots and redness, evens skin tone, and deeply hydrates. Clinically tested on all skin types including sensitive.',
    image: 'https://int.bionnex.com/cdn/shop/files/org0006_1024x.jpg?v=1764161625',
    website: 'https://int.bionnex.com/fr/products/niacinamide-10-serum',
    concerns: ['pores', 'dark spots', 'redness', 'oiliness', 'pigmentation'],
    skinTypes: ['all', 'oily', 'combination', 'sensitive']
  },
  {
    name: 'The Nordea Salicylic Acid 2% + Island Lichen Serum',
    brand: 'Bionnex',
    category: 'Exfoliant Serum',
    description: 'A dermatologically formulated BHA serum with salicylic acid and Nordic island lichen extract. Purifies pores, dissolves dead skin cells, and visibly improves clarity for acne-prone skin.',
    image: 'https://int.bionnex.com/cdn/shop/files/org0007_1024x.jpg?v=1764161700',
    website: 'https://int.bionnex.com/fr/products/bionnex-the-nordea-salicylic-acid-2-island-lichen-cleanser',
    concerns: ['acne', 'pores', 'texture', 'oiliness'],
    skinTypes: ['oily', 'combination', 'acne-prone']
  },
  {
    name: 'The Nordea Hyaluronic Acid 2% + Arctic Algae + B5 Serum',
    brand: 'Bionnex',
    category: 'Serum',
    description: 'A deep hydration serum with Nordic Arctic algae, hyaluronic acid, and vitamin B5. Maintains moisture levels, fights fine lines, balances skin tone, and provides antioxidant protection against environmental damage.',
    image: 'https://int.bionnex.com/cdn/shop/files/108_1x1.png?v=1763453656',
    website: 'https://int.bionnex.com/fr/products/bionnex-hyaluronic-acid-2-arctic-algae-b5-serum',
    concerns: ['dryness', 'fine lines', 'dullness', 'sensitivity'],
    skinTypes: ['dry', 'normal', 'sensitive', 'all']
  },
  {
    name: 'The Nordea Retinol 1% Serum',
    brand: 'Bionnex',
    category: 'Serum',
    description: 'A concentrated retinol serum that accelerates cell renewal, reduces blemishes, corrects uneven texture and age spots, and boosts collagen production. Apply evenings after water-based serums.',
    image: 'https://int.bionnex.com/cdn/shop/files/110_1x1.png?v=1763453767',
    website: 'https://int.bionnex.com/fr/products/bionnex-the-nordea-retinol-1-serum',
    concerns: ['fine lines', 'texture', 'dark spots', 'pigmentation', 'dullness'],
    skinTypes: ['normal', 'combination', 'all']
  },

  // — RENSADERM series (oily & acne-prone) ———————————————————————————————————

  {
    name: 'Rensaderm Revitalizing Toner – Oily & Acne-Prone Skin',
    brand: 'Bionnex',
    category: 'Toner',
    description: 'A purifying revitalizing toner for oily and acne-prone skin. Removes makeup and impurities, deeply cleanses, balances sebum without over-drying, and soothes with Nordic Empetrum nigrum extract.',
    image: 'https://int.bionnex.com/cdn/shop/files/113_1x1.png?v=1763453911',
    website: 'https://int.bionnex.com/fr/collections/rensaderm',
    concerns: ['acne', 'oiliness', 'pores', 'redness'],
    skinTypes: ['oily', 'combination']
  },
  {
    name: 'Rensaderm Sebum Control Moisturizing Cream',
    brand: 'Bionnex',
    category: 'Moisturizer',
    description: 'A repairing moisturizer for oily and acne-prone skin. Controls sebum, purifies, maintains the skin\'s natural moisture balance, and nourishes with high-antioxidant Nordic Empetrum nigrum extract.',
    image: 'https://int.bionnex.com/cdn/shop/files/113_1x1.png?v=1763453912',
    website: 'https://int.bionnex.com/fr/products/bionnex-rensaderm-repairing-sebum-control-for-oily-and-acne-prone-skin',
    concerns: ['oiliness', 'acne', 'pores', 'sensitivity'],
    skinTypes: ['oily', 'combination']
  },

  // — PERFEDERM series (dry skin) ————————————————————————————————————————————

  {
    name: 'Perfederm Moisturizing Face Cream – Dry & Atopy-Prone Skin',
    brand: 'Bionnex',
    category: 'Moisturizer',
    description: 'A barrier-repairing face cream for dry, very dry, and atopic-prone skin. The Tetra Complex CX19 formula with rapeseed oil, sunflower oil, and brown seaweed extract deeply nourishes, maintains moisture balance, and protects against environmental irritants.',
    image: 'https://int.bionnex.com/cdn/shop/files/org0024_1024x.jpg?v=1764162957',
    website: 'https://int.bionnex.com/fr/products/bionnex-perfederm-ultra-moisturizing-face-cream',
    concerns: ['dryness', 'sensitivity', 'fine lines'],
    skinTypes: ['dry', 'sensitive']
  },

  // — PREVENTIVA series (sun protection) ————————————————————————————————————

  {
    name: 'Preventiva Dry Touch Sunscreen Fluid SPF 50+',
    brand: 'Bionnex',
    category: 'Sunscreen',
    description: 'A matte-finish SPF 50+ sunscreen fluid offering full UVA, UVB, and blue light protection. Light, non-oily, non-sticky texture ideal for oily and combination skin. Saskatoon Berry extract provides antioxidant support.',
    image: 'https://int.bionnex.com/cdn/shop/files/org0037_1024x.jpg?v=1764164212',
    website: 'https://int.bionnex.com/fr/products/bionnex-preventiva-dry-touch-sunscreen-fluid-spf-50',
    concerns: ['dark spots', 'pigmentation', 'fine lines', 'oiliness'],
    skinTypes: ['oily', 'combination', 'all']
  },
  {
    name: 'Preventiva Tinted Sunscreen Cream SPF 50+',
    brand: 'Bionnex',
    category: 'Tinted Sunscreen',
    description: 'A tinted SPF 50+ sunscreen that protects against UVA, UVB, and blue light while concealing skin discoloration, visible capillaries, and sun spots. Provides a natural, smooth, even-toned finish for all skin types.',
    image: 'https://int.bionnex.com/cdn/shop/files/org0039_1024x.jpg?v=1764164399',
    website: 'https://int.bionnex.com/fr/products/bionnex-preventiva-tinted-sunscreen-cream-spf-50',
    concerns: ['dark spots', 'pigmentation', 'dullness'],
    skinTypes: ['all', 'combination', 'normal']
  },

  // — PIGMENTIA series (brightening & anti-dark spots) ———————————————————————

  {
    name: 'Pigmentia Brightening Foaming Gel',
    brand: 'Bionnex',
    category: 'Cleanser',
    description: 'A brightening foaming cleansing gel designed for hyperpigmentation-prone skin. Gently purifies while targeting dull and uneven skin tone with each cleanse.',
    image: 'https://int.bionnex.com/cdn/shop/files/Bionnex_Pigmentia_Foaming_Gel_250_ml-spray_Pump_1_600x.png?v=1753786586',
    website: 'https://int.bionnex.com/fr/products/bionnex-pigmentia-brightening-foaming-gel',
    concerns: ['dark spots', 'pigmentation', 'dullness', 'oiliness'],
    skinTypes: ['all', 'combination', 'normal']
  },
  {
    name: 'Pigmentia Brightening Cream SPF 30+ – Face & Neck',
    brand: 'Bionnex',
    category: 'Treatment',
    description: 'A brightening day cream with SPF 30+ that targets dark spots and hyperpigmentation on the face and neck. Provides sun protection while actively working to even out skin tone.',
    image: 'https://int.bionnex.com/cdn/shop/files/org0018_600x.jpg?v=1764162604',
    website: 'https://int.bionnex.com/fr/products/bionnex-whitening-cream-spf-30-face-neck',
    concerns: ['dark spots', 'pigmentation', 'fine lines'],
    skinTypes: ['all', 'normal', 'combination']
  },
  {
    name: 'Pigmentia Brightening & Repairing Night Serum',
    brand: 'Bionnex',
    category: 'Night Serum',
    description: 'An overnight brightening serum with arbutin, niacinamide, and Lumiskin to block melanin production. Curcuma longa and Vitamin C provide antioxidant repair while you sleep, fading existing dark spots and preventing new ones.',
    image: 'https://int.bionnex.com/cdn/shop/files/org0020_600x.jpg?v=1764162719',
    website: 'https://int.bionnex.com/fr/products/bionnex-whitening-night-repair-serum',
    concerns: ['dark spots', 'pigmentation', 'dullness', 'fine lines'],
    skinTypes: ['all', 'normal', 'combination', 'sensitive']
  },
  {
    name: 'Pigmentia Eye Contour Cream',
    brand: 'Bionnex',
    category: 'Eye Cream',
    description: 'A targeted brightening eye contour cream that reduces the appearance of dark circles and hyperpigmentation around the delicate eye area, for a more rested and luminous look.',
    image: 'https://int.bionnex.com/cdn/shop/files/org0019_600x.jpg?v=1764162660',
    website: 'https://int.bionnex.com/fr/products/bionnex-whitexpert-eye-contour-cream',
    concerns: ['dark spots', 'pigmentation', 'fine lines', 'dullness'],
    skinTypes: ['all']
  }

];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected');

    await Product.deleteMany({});
    console.log('✓ Existing products cleared');

    const inserted = await Product.insertMany(products);
    console.log(`✓ ${inserted.length} products inserted successfully`);

    console.log('\nProducts by brand:');
    const brands = [...new Set(products.map(p => p.brand))];
    brands.forEach(brand => {
      const count = products.filter(p => p.brand === brand).length;
      console.log(`  ${brand}: ${count} products`);
    });

  } catch (err) {
    console.error('✗ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

seed();