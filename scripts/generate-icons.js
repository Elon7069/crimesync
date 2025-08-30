const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create placeholder icons (you should replace these with your actual icon)
iconSizes.forEach(size => {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <path d="M${size * 0.3} ${size * 0.25} L${size * 0.5} ${size * 0.1} L${size * 0.7} ${size * 0.25} L${size * 0.7} ${size * 0.6} C${size * 0.7} ${size * 0.7} ${size * 0.6} ${size * 0.8} ${size * 0.5} ${size * 0.8} C${size * 0.4} ${size * 0.8} ${size * 0.3} ${size * 0.7} ${size * 0.3} ${size * 0.6} Z" fill="white"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.15}" fill="white"/>
</svg>`;

  const filePath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created ${filePath}`);
});

console.log('\nIcon generation complete!');
console.log('Note: These are placeholder SVG icons. You should replace them with your actual app icon.');
console.log('You can convert them to PNG using online tools or image editing software.');
console.log('For production, use high-quality PNG icons with transparent backgrounds.');
