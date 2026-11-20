const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '..', 'public', 'assets', 'robotic', 'tour', 'flyers');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const flyers = [
  { file: 'element-house.jpg', title: 'ELEMENT HOUSE', date: '17 JUL 2025', city: 'LUANDA, ANGOLA', venue: 'CIRCUS LUANDA' },
  { file: 'untamed.jpg', title: 'UNTAMED', date: '19 JUL 2025', city: 'JOHANNESBURG, SA', venue: 'THE GROUND' },
  { file: 'feel-good.jpg', title: 'FEEL GOOD SERIES', date: '25 JUL 2025', city: 'CAPE TOWN, SA', venue: 'CABO BEACH CLUB' },
  { file: 'circuit-summer.jpg', title: 'CIRCUIT SUMMER', date: '26 JUL 2025', city: 'MAPUTO, MOZAMBIQUE', venue: 'POLANA SERENA' },
  { file: 'nairobi-nights-1.jpg', title: 'NAIROBI NIGHTS I', date: '01 AUG 2025', city: 'NAIROBI, KENYA', venue: 'TBC' },
  { file: 'nairobi-nights-2.jpg', title: 'NAIROBI NIGHTS II', date: '02 AUG 2025', city: 'NAIROBI, KENYA', venue: 'TBC' },
  { file: 'nairobi-nights-3.jpg', title: 'NAIROBI NIGHTS III', date: '03 AUG 2025', city: 'NAIROBI, KENYA', venue: 'TBC' },
  { file: 'garden-of-house.jpg', title: 'GARDEN OF HOUSE', date: '09 AUG 2025', city: 'BULAWAYO, ZIMBABWE', venue: 'GARDEN OF HOUSE' },
  { file: 'shimza-friends-durban.jpg', title: 'SHIMZA &amp; FRIENDS', date: '05 SEP 2025', city: 'DURBAN, SA', venue: 'SHIMZA &amp; FRIENDS' }
];

async function generate() {
  for (const f of flyers) {
    const svg = `
    <svg width="400" height="520" viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e2430"/>
          <stop offset="50%" stop-color="#12161f"/>
          <stop offset="100%" stop-color="#181d26"/>
        </linearGradient>
        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="50%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
        <radialGradient id="silverGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="rgba(203, 213, 225, 0.18)"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
      </defs>
      <rect width="400" height="520" fill="url(#bgGrad)"/>
      <rect width="400" height="520" fill="url(#silverGlow)"/>
      
      <rect x="16" y="16" width="368" height="488" rx="8" fill="none" stroke="rgba(203, 213, 225, 0.35)" stroke-width="1.5"/>
      <rect x="22" y="22" width="356" height="476" rx="6" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
      
      <text x="200" y="55" font-family="Arial, sans-serif" font-size="11" font-weight="800" fill="#94a3b8" letter-spacing="5" text-anchor="middle">ROBOTIC LIVE</text>
      <line x1="120" y1="70" x2="280" y2="70" stroke="rgba(203, 213, 225, 0.3)" stroke-width="1"/>
      
      <circle cx="200" cy="180" r="58" fill="none" stroke="rgba(203, 213, 225, 0.25)" stroke-width="1.5"/>
      <circle cx="200" cy="180" r="46" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(203, 213, 225, 0.45)" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="200" y="187" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="url(#silverGrad)" letter-spacing="3" text-anchor="middle">TOUR</text>
      
      <text x="200" y="295" font-family="Arial, sans-serif" font-size="21" font-weight="800" fill="#f8fafc" letter-spacing="1.5" text-anchor="middle">${f.title}</text>
      <text x="200" y="330" font-family="Arial, sans-serif" font-size="13" font-weight="500" fill="#94a3b8" letter-spacing="1.5" text-anchor="middle">${f.venue}</text>
      
      <line x1="140" y1="360" x2="260" y2="360" stroke="rgba(203, 213, 225, 0.3)" stroke-width="1"/>
      
      <text x="200" y="405" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="url(#silverGrad)" letter-spacing="3" text-anchor="middle">${f.date}</text>
      <text x="200" y="440" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" letter-spacing="2" text-anchor="middle">${f.city}</text>
      
      <text x="200" y="480" font-family="Arial, sans-serif" font-size="9" font-weight="700" fill="#64748b" letter-spacing="3" text-anchor="middle">OFFICIAL TOUR FLYER</text>
    </svg>`;

    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toFile(path.join(dir, f.file));
    console.log('Created ' + f.file);
  }
}

generate().then(() => console.log('All flyers created successfully!')).catch(console.error);
