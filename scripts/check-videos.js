const { execSync } = require('child_process');
const path = require('path');
const dir = path.join(__dirname, '../public/assets/robotic/gallery');

const items = [
  'im1.jpeg', 'im2.mp4', 'im3.jpg', 'im4.mp4', 'im5.jpg',
  'im6.webp', 'im7.jpeg', 'im8.mp4', 'im9.jpg', 'im10.webp',
  'im11.jpeg', 'im12.mp4', 'im13.JPG', 'im14.webp', 'im15.webp',
  'im16.jpeg', 'im17.jpg', 'im18.jpg', 'im19.jpg', 'im20.JPG'
];

for (const v of ['im2.mp4', 'im4.mp4', 'im8.mp4', 'im12.mp4']) {
  const p = path.join(dir, v);
  const dur = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${p}"`).toString().trim();
  const res = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${p}"`).toString().trim();
  console.log(v, 'duration:', dur, 'res:', res);
}
