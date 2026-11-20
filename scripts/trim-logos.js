const sharp = require('sharp');
const fs = require('fs');

async function trimLogos() {
  console.log('Trimming Book Robotic logo...');
  await sharp('public/assets/robotic/logo/BOOK ROBOTIC LOG.png')
    .trim()
    .toFile('public/assets/robotic/logo/book-robotic-clean.png');

  console.log('Trimming Listen Now logo...');
  await sharp('public/assets/robotic/logo/Listen Now Logo.png')
    .trim()
    .toFile('public/assets/robotic/logo/listen-now-clean.png');

  const meta1 = await sharp('public/assets/robotic/logo/book-robotic-clean.png').metadata();
  console.log('book-robotic-clean meta:', meta1.width, 'x', meta1.height);

  const meta2 = await sharp('public/assets/robotic/logo/listen-now-clean.png').metadata();
  console.log('listen-now-clean meta:', meta2.width, 'x', meta2.height);
}

trimLogos().catch(console.error);
