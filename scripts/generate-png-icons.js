const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple text-based icon using Canvas-like approach
// Since we can't use Canvas in Node.js directly, we'll create a simple SVG that looks like a PNG
iconSizes.forEach(size => {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  
  <!-- Shield icon -->
  <path d="M${size * 0.3} ${size * 0.25} L${size * 0.5} ${size * 0.1} L${size * 0.7} ${size * 0.25} L${size * 0.7} ${size * 0.6} C${size * 0.7} ${size * 0.7} ${size * 0.6} ${size * 0.8} ${size * 0.5} ${size * 0.8} C${size * 0.4} ${size * 0.8} ${size * 0.3} ${size * 0.7} ${size * 0.3} ${size * 0.6} Z" 
        fill="white" filter="url(#shadow)"/>
  
  <!-- CrimeSync text -->
  <text x="${size * 0.5}" y="${size * 0.55}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.12}" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="white" 
        filter="url(#shadow)">
    Crime
  </text>
  <text x="${size * 0.5}" y="${size * 0.7}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.12}" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="white" 
        filter="url(#shadow)">
    Sync
  </text>
  
  <!-- Safety indicator -->
  <circle cx="${size * 0.5}" cy="${size * 0.85}" r="${size * 0.08}" fill="#10b981" opacity="0.9"/>
  <text x="${size * 0.5}" y="${size * 0.89}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.06}" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="white">
    ✓
  </text>
</svg>`;

  const filePath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created ${filePath}`);
});

console.log('\nSVG icon generation complete!');
console.log('Note: These are SVG icons with CrimeSync branding.');
console.log('For production PWA, you should convert these to PNG format.');
console.log('You can use online SVG to PNG converters or image editing software.');
console.log('The icons include:');
console.log('- CrimeSync text branding');
console.log('- Shield icon representing safety');
console.log('- Green checkmark for security');
console.log('- Professional gradient background');
