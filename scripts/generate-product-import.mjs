import fs from 'node:fs';
import path from 'node:path';

const outPath = path.resolve('docs/kuchcoffee-products-import.csv');

const headers = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Type',
  'Tags',
  'Published',
  'Option1 Name',
  'Option1 Value',
  'Option2 Name',
  'Option2 Value',
  'Option3 Name',
  'Option3 Value',
  'Variant SKU',
  'Variant Grams',
  'Variant Inventory Tracker',
  'Variant Inventory Qty',
  'Variant Inventory Policy',
  'Variant Fulfillment Service',
  'Variant Price',
  'Variant Compare At Price',
  'Image Src',
  'Image Position',
  'Variant Requires Shipping',
  'Variant Taxable',
  'Gift Card',
  'Status',
];

const sizes = [
  { label: '125 GM', grams: 125, delta: 0 },
  { label: '250 GM', grams: 250, delta: 4 },
  { label: '500 GM', grams: 500, delta: 10 },
  { label: '1K', grams: 1000, delta: 22 },
];

const roasts = ['Light', 'Medium', 'Dark'];
const turkishTypes = ['Plain', 'Hawaij (Spiced)'];
const grindLevels = [
  'whole bean',
  'Non pressurized espresso',
  'pressurized espresso fine Manual',
  'pressurized espresso regular De Longi',
  'moka pot',
  'american',
  'filter',
  'french press',
  'cold brew',
];

const inventory = 30;
const vendor = 'KuchCoffee';

const images = {
  espressoA: 'https://cdn.shopify.com/s/files/1/0973/7630/5522/files/download_2.png?v=1776943673',
  espressoB: 'https://cdn.shopify.com/s/files/1/0973/7630/5522/files/download_1.png?v=1776943672',
  turkish: 'https://cdn.shopify.com/s/files/1/0973/7630/5522/files/download_3.png?v=1776943672',
  bundle: 'https://cdn.shopify.com/s/files/1/0973/7630/5522/files/WhatsApp_Image_2026-04-23_at_1.30.30_PM.jpg?v=1776943844',
};

const products = [
  {
    handle: 'grand-bazaar-blend',
    imageSrc: images.turkish,
    title: 'Grand Bazaar Blend',
    type: 'Turkish Coffee',
    tags: ['best-selling', 'turkish-coffee', 'Best Seller'],
    basePrice: 18,
    description:
      '<p>A rich Turkish-style house blend with cocoa depth, warm spice, and a syrupy finish.</p>',
    kind: 'turkish',
  },
  {
    handle: 'cardamom-blend',
    imageSrc: images.turkish,
    title: 'Cardamom Blend',
    type: 'Turkish Coffee',
    tags: ['turkish-coffee'],
    basePrice: 20,
    description:
      '<p>Traditional Turkish coffee roasted for finjan service with cardamom-led warmth and a soft finish.</p>',
    kind: 'turkish',
  },
  {
    handle: 'dark-roast-fincan',
    imageSrc: images.turkish,
    title: 'Dark Roast Fincan',
    type: 'Turkish Coffee',
    tags: ['turkish-coffee', 'New'],
    basePrice: 22,
    description:
      '<p>Deeply roasted Turkish coffee for customers who want a denser cup and darker bittersweet notes.</p>',
    kind: 'turkish',
  },
  {
    handle: 'dark-roast-espresso',
    imageSrc: images.espressoA,
    title: 'Dark Roast Espresso',
    type: 'Espresso Beans',
    tags: ['espresso-beans', 'best-selling'],
    basePrice: 20,
    description:
      '<p>Chocolate-forward espresso beans roasted for balance in milk drinks and straight shots.</p>',
    kind: 'espresso',
  },
  {
    handle: 'milk-and-sugar-blend',
    imageSrc: images.espressoB,
    title: 'Milk & Sugar Blend',
    type: 'Espresso Beans',
    tags: ['espresso-beans', 'Popular'],
    basePrice: 21,
    description:
      '<p>A sweeter espresso profile built for cappuccino, flat white, and other milk-based drinks.</p>',
    kind: 'espresso',
  },
  {
    handle: 'house-espresso-reserve',
    imageSrc: images.espressoB,
    title: 'House Espresso Reserve',
    type: 'Espresso Beans',
    tags: ['espresso-beans'],
    basePrice: 24,
    description:
      '<p>Our higher-intensity espresso roast with heavier body, caramel sweetness, and longer finish.</p>',
    kind: 'espresso',
  },
  {
    handle: 'ethiopia-yirgacheffe',
    imageSrc: images.espressoA,
    title: 'Ethiopia Yirgacheffe',
    type: 'Single Origin',
    tags: ['single-origin', 'best-selling', 'New'],
    basePrice: 24,
    description:
      '<p>Floral and citrus-led Ethiopian single origin with jasmine aroma and a clean finish.</p>',
    kind: 'single-origin',
  },
  {
    handle: 'colombia-huila',
    imageSrc: images.espressoA,
    title: 'Colombia Huila',
    type: 'Single Origin',
    tags: ['single-origin'],
    basePrice: 22,
    description:
      '<p>Balanced Colombian lot with stone fruit sweetness, soft acidity, and a rounded body.</p>',
    kind: 'single-origin',
  },
  {
    handle: 'kenya-aa',
    imageSrc: images.espressoB,
    title: 'Kenya AA',
    type: 'Single Origin',
    tags: ['single-origin'],
    basePrice: 26,
    description:
      '<p>Structured Kenyan cup with blackcurrant brightness, sweetness, and a long clean finish.</p>',
    kind: 'single-origin',
  },
  {
    handle: 'hario-v60',
    title: 'Hario V60',
    type: 'Equipment',
    tags: ['equipment'],
    basePrice: 34,
    description:
      '<p>Classic cone dripper for bright, clean pour-over coffee at home or in the studio.</p>',
    kind: 'simple',
  },
  {
    handle: 'portafilter-58mm',
    title: 'Portafilter 58mm',
    type: 'Equipment',
    tags: ['equipment'],
    basePrice: 48,
    description:
      '<p>58mm portafilter for home espresso setups that need a clean, reliable replacement.</p>',
    kind: 'simple',
  },
  {
    handle: 'hand-grinder',
    title: 'Hand Grinder',
    type: 'Equipment',
    tags: ['equipment', 'Popular'],
    basePrice: 65,
    description:
      '<p>Manual burr grinder with enough range for espresso, filter, French press, and travel brewing.</p>',
    kind: 'simple',
  },
  {
    handle: 'starter-ritual',
    imageSrc: images.bundle,
    title: 'Starter Ritual',
    type: 'Package',
    tags: ['packages', 'bundle', 'Most Popular'],
    basePrice: 55,
    compareAt: 72,
    description:
      '<p>Bundle shell product: V60 + 250g single origin + brew guide.</p>',
    kind: 'simple',
  },
  {
    handle: 'the-espresso-set',
    imageSrc: images.bundle,
    title: 'The Espresso Set',
    type: 'Package',
    tags: ['packages', 'bundle'],
    basePrice: 64,
    compareAt: 85,
    description:
      '<p>Bundle shell product: portafilter + 500g espresso beans.</p>',
    kind: 'simple',
  },
  {
    handle: 'turkish-journey',
    imageSrc: images.bundle,
    title: 'Turkish Journey',
    type: 'Package',
    tags: ['packages', 'bundle', 'New'],
    basePrice: 46,
    compareAt: 60,
    description:
      '<p>Bundle shell product: three Turkish blends + cezve pot.</p>',
    kind: 'simple',
  },
  {
    handle: 'full-brew-kit',
    imageSrc: images.bundle,
    title: 'Full Brew Kit',
    type: 'Package',
    tags: ['packages', 'bundle', 'Best Value'],
    basePrice: 99,
    compareAt: 130,
    description:
      '<p>Bundle shell product: grinder + V60 + two single origin bags.</p>',
    kind: 'simple',
  },
];

function escapeCsv(value) {
  const stringValue = value == null ? '' : String(value);
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }
  return stringValue;
}

function rowForBase(product) {
  return {
    Handle: product.handle,
    Title: product.title,
    'Body (HTML)': product.description,
    Vendor: vendor,
    Type: product.type,
    Tags: product.tags.join(', '),
    Published: 'TRUE',
    'Image Src': product.imageSrc || '',
    'Image Position': product.imageSrc ? '1' : '',
    'Variant Inventory Tracker': 'shopify',
    'Variant Inventory Qty': String(inventory),
    'Variant Inventory Policy': 'deny',
    'Variant Fulfillment Service': 'manual',
    'Variant Requires Shipping': 'TRUE',
    'Variant Taxable': 'TRUE',
    'Gift Card': 'FALSE',
    Status: 'active',
  };
}

function addTurkishRows(product, rows) {
  for (const size of sizes) {
    for (const roast of roasts) {
      for (const type of turkishTypes) {
        rows.push({
          ...rowForBase(product),
          'Option1 Name': 'Size',
          'Option1 Value': size.label,
          'Option2 Name': 'Roast',
          'Option2 Value': roast,
          'Option3 Name': 'Type',
          'Option3 Value': type,
          'Variant SKU': `${product.handle}-${size.label}-${roast}-${type}`
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll(/[()]/g, ''),
          'Variant Grams': String(size.grams),
          'Variant Price': (product.basePrice + size.delta).toFixed(2),
          'Variant Compare At Price': '',
        });
      }
    }
  }
}

function addBeanRows(product, rows) {
  for (const size of sizes) {
    for (const grind of grindLevels) {
      rows.push({
        ...rowForBase(product),
        'Option1 Name': 'Size',
        'Option1 Value': size.label,
        'Option2 Name': 'Grind Level',
        'Option2 Value': grind,
        'Option3 Name': '',
        'Option3 Value': '',
        'Variant SKU': `${product.handle}-${size.label}-${grind}`
          .toLowerCase()
          .replaceAll(' ', '-')
          .replaceAll(/[()]/g, ''),
        'Variant Grams': String(size.grams),
        'Variant Price': (product.basePrice + size.delta).toFixed(2),
        'Variant Compare At Price': '',
      });
    }
  }
}

function addSimpleRow(product, rows) {
  rows.push({
    ...rowForBase(product),
    'Option1 Name': 'Title',
    'Option1 Value': 'Default Title',
    'Option2 Name': '',
    'Option2 Value': '',
    'Option3 Name': '',
    'Option3 Value': '',
    'Variant SKU': `${product.handle}-default`,
    'Variant Grams': '0',
    'Variant Price': product.basePrice.toFixed(2),
    'Variant Compare At Price': product.compareAt ? product.compareAt.toFixed(2) : '',
  });
}

const rows = [];

for (const product of products) {
  if (product.kind === 'turkish') {
    addTurkishRows(product, rows);
  } else if (product.kind === 'espresso' || product.kind === 'single-origin') {
    addBeanRows(product, rows);
  } else {
    addSimpleRow(product, rows);
  }
}

const csv = [
  headers.join(','),
  ...rows.map((row) => headers.map((header) => escapeCsv(row[header] ?? '')).join(',')),
].join('\n');

fs.writeFileSync(outPath, csv);
console.log(`Wrote ${rows.length} rows to ${outPath}`);
