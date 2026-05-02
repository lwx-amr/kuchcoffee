import fs from 'node:fs';
import path from 'node:path';

const outPath = path.resolve('docs/kuchcoffee-flavored-coffee-import.csv');

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

const products = [
  {
    handle: 'caramel-flavored',
    title: 'Caramel Flavored',
    type: 'Flavored Coffee',
    tags: ['flavored-coffee', 'caramel'],
    basePrice: 22,
    description:
      '<p>Smooth medium-roast beans infused with buttery caramel sweetness for a dessert-style cup.</p>',
    imageSrc: 'https://cdn.shopify.com/s/files/1/0973/7630/5522/files/download_4.png?v=1777722839',
  },
  {
    handle: 'hazelnut-flavored',
    title: 'Hazelnut Flavored',
    type: 'Flavored Coffee',
    tags: ['flavored-coffee', 'hazelnut'],
    basePrice: 22,
    description:
      '<p>Roasted hazelnut aroma with a nutty, lightly sweet finish - a classic flavored profile.</p>',
    imageSrc: 'https://cdn.shopify.com/s/files/1/0973/7630/5522/files/download_4.png?v=1777722839',
  },
  {
    handle: 'chocolate-flavored',
    title: 'Chocolate Flavored',
    type: 'Flavored Coffee',
    tags: ['flavored-coffee', 'chocolate'],
    basePrice: 22,
    description:
      '<p>Rich cocoa notes layered over a medium roast, like a mocha without the syrup.</p>',
    imageSrc: 'https://cdn.shopify.com/s/files/1/0973/7630/5522/files/download_5.png?v=1777722988',
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

const rows = [];
for (const product of products) {
  addBeanRows(product, rows);
}

const csv = [
  headers.join(','),
  ...rows.map((row) => headers.map((header) => escapeCsv(row[header] ?? '')).join(',')),
].join('\n');

fs.writeFileSync(outPath, csv);
console.log(`Wrote ${rows.length} rows to ${outPath}`);
