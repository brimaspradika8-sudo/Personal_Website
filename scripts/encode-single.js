const { execSync } = require('child_process');
const path = require('path');
const ffmpeg = require('ffmpeg-static');

const file = 'night-landscape-mobile';
const gifPath = path.join(process.cwd(), 'public/animations', file + '.gif');
const mp4Path = path.join(process.cwd(), 'public/animations', file + '.mp4');
const webpPath = path.join(process.cwd(), 'public/animations', file + '.webp');

try {
  console.log('Encoding MP4...');
  execSync(`"${ffmpeg}" -y -i "${gifPath}" -c:v libx264 -preset fast -crf 18 -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${mp4Path}"`);
  console.log('MP4 done.');
} catch (e) {
  console.error('MP4 error:', e.message);
}

try {
  console.log('Encoding WebP...');
  execSync(`"${ffmpeg}" -y -i "${gifPath}" -c:v libwebp -lossless 0 -q:v 85 -preset default -loop 0 "${webpPath}"`);
  console.log('WebP done.');
} catch (e) {
  console.error('WebP error:', e.message);
}
