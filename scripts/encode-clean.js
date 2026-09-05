const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('ffmpeg-static');

const files = ['day-landscape', 'day-landscape-mobile', 'night-landscape', 'night-landscape-mobile'];

files.forEach(file => {
  const gifPath = path.join(process.cwd(), 'public/animations', file + '.gif');
  const mp4Path = path.join(process.cwd(), 'public/animations', file + '.mp4');
  const webpPath = path.join(process.cwd(), 'public/animations', file + '.webp');

  console.log('Processing:', file);
  try {
    // MP4 encoding via execFileSync (safe from shell escaping issues)
    execFileSync(ffmpeg, [
      '-y',
      '-i', gifPath,
      '-c:v', 'libx264',
      '-preset', 'slow',
      '-crf', '19',
      '-movflags', '+faststart',
      '-pix_fmt', 'yuv420p',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      mp4Path
    ], { stdio: 'inherit' });

    // WebP encoding via execFileSync
    execFileSync(ffmpeg, [
      '-y',
      '-i', gifPath,
      '-c:v', 'libwebp',
      '-lossless', '0',
      '-q:v', '85',
      '-preset', 'default',
      '-loop', '0',
      webpPath
    ], { stdio: 'inherit' });

    const gifSize = (fs.statSync(gifPath).size / (1024 * 1024)).toFixed(2);
    const mp4Size = (fs.statSync(mp4Path).size / (1024 * 1024)).toFixed(2);
    const webpSize = (fs.statSync(webpPath).size / (1024 * 1024)).toFixed(2);

    console.log(`SUCCESS ${file}: GIF ${gifSize}MB -> MP4 ${mp4Size}MB | WebP ${webpSize}MB`);
  } catch (err) {
    console.error('Error processing', file, err.message);
  }
});
