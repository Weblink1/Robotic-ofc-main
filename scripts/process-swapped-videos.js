const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = 'C:/Users/TAPIWA MOFFAT/OneDrive - Botswana Accountancy College/Robotic web/Public/assests/robotoc ofc images';
const galleryDir = path.join(__dirname, '../public/assets/robotic/gallery');

const rootIm2 = path.join(rootDir, 'im2.mp4');
const rootIm12 = path.join(rootDir, 'im12.mp4');

const siteIm2 = path.join(galleryDir, 'im2.mp4');
const siteIm12 = path.join(galleryDir, 'im12.mp4');
const siteIm2Orig = path.join(galleryDir, 'im2-orig.mp4');
const siteIm12Orig = path.join(galleryDir, 'im12-orig.mp4');

console.log('Copying root originals into gallery folder...');
fs.copyFileSync(rootIm2, siteIm2Orig);
fs.copyFileSync(rootIm12, siteIm12Orig);

console.log('Processing new im2.mp4 (from swapped root im2)...');
// rootIm2 was previously im12: needs crop at 00:00:02, crop=in_w*0.72:in_h*0.72:in_w*0.04:in_h*0.22, 8s loop
execSync(`ffmpeg -y -ss 00:00:02 -i "${siteIm2Orig}" -t 8 -vf "crop=in_w*0.72:in_h*0.72:in_w*0.04:in_h*0.22,scale=720:1280" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k "${siteIm2}"`);

console.log('Processing new im12.mp4 (from swapped root im12)...');
// rootIm12 was previously im2: needs crop at 00:00:01, crop=in_w*0.72:in_h*0.72:in_w*0.03:in_h*0.14, 8s loop
execSync(`ffmpeg -y -ss 00:00:01 -i "${siteIm12Orig}" -t 8 -vf "crop=in_w*0.72:in_h*0.72:in_w*0.03:in_h*0.14,scale=720:1280" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k "${siteIm12}"`);

console.log('Done processing swapped videos.');
