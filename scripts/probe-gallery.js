const { execSync } = require('child_process');
const path = require('path');
const dir = path.join(__dirname, '../public/assets/robotic/gallery');

const items = [
  { id: 1, file: 'im1.jpeg', type: 'image' },
  { id: 2, file: 'im2.mp4', type: 'video' },
  { id: 3, file: 'im3.jpg', type: 'image' },
  { id: 4, file: 'im4.mp4', type: 'video' },
  { id: 5, file: 'im5.jpg', type: 'image' },
  { id: 6, file: 'im6.webp', type: 'image' },
  { id: 7, file: 'im7.jpeg', type: 'image' },
  { id: 8, file: 'im8.mp4', type: 'video' },
  { id: 9, file: 'im9.jpg', type: 'image' },
  { id: 10, file: 'im10.webp', type: 'image' },
  { id: 11, file: 'im11.jpeg', type: 'image' },
  { id: 12, file: 'im12.mp4', type: 'video' },
  { id: 13, file: 'im13.JPG', type: 'image' },
  { id: 14, file: 'im14.webp', type: 'image' },
  { id: 15, file: 'im15.webp', type: 'image' },
  { id: 16, file: 'im16.jpeg', type: 'image' },
  { id: 17, file: 'im17.jpg', type: 'image' },
  { id: 18, file: 'im18.jpg', type: 'image' },
  { id: 19, file: 'im19.jpg', type: 'image' },
  { id: 20, file: 'im20.JPG', type: 'image' }
];

const results = [];
for (const item of items) {
  const filePath = path.join(dir, item.file);
  const probe = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${filePath}"`).toString().trim();
  const [w, h] = probe.split('x').map(Number);
  const aspect = w / h;
  
  // Target heights
  let desktopH = 380;
  let mobileH = 340;
  
  if (item.type === 'video') {
    desktopH = 390;
    mobileH = 345;
  } else if (aspect >= 1.3) { // landscape
    desktopH = 295;
    mobileH = 255;
  } else if (Math.abs(aspect - 1.0) < 0.05) { // square
    desktopH = 335;
    mobileH = 295;
  } else if (aspect <= 0.6) { // tall vertical (9:16)
    desktopH = 385;
    mobileH = 340;
  }

  const desktopW = Math.round(desktopH * aspect);
  const mobileW = Math.round(mobileH * aspect);

  results.push({
    ...item,
    width: w,
    height: h,
    aspect: Number(aspect.toFixed(3)),
    aspectRatio: `${w} / ${h}`,
    widthClass: `w-[${mobileW}px] sm:w-[${desktopW}px]`,
    heightClass: `h-[${mobileH}px] sm:h-[${desktopH}px]`,
    desktopW,
    desktopH,
    mobileW,
    mobileH
  });
}

console.log(JSON.stringify(results, null, 2));
