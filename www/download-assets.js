#!/usr/bin/env node
/**
 * Magic Scroll — Asset Downloader
 * Run once after setting up your server:  node download-assets.js
 *
 * Downloads Google Fonts woff2 files into ./fonts/
 * so Magic Scroll works fully offline without any internet dependency.
 *
 * Requirements: Node.js 18+ (built-in fetch) or Node 14–17 with node-fetch.
 * Run from the same directory as Magic_Scroll_v0_9_9_2.html.
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

const FONTS_DIR = path.join(__dirname, 'fonts');

// Google Fonts CSS endpoint — same query as the app's @import
const GOOGLE_FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=Playfair+Display:ital,wght@0,400;0,700;1,400' +
  '&family=IM+Fell+English:ital@0;1&display=swap';

// Friendly names for the downloaded files
const FILENAME_MAP = {
  'Courier Prime': 'courier-prime',
  'Playfair Display': 'playfair-display',
  'IM Fell English': 'im-fell-english',
};

function get(urlStr) {
  return new Promise(function(resolve, reject) {
    var parsed = url.parse(urlStr);
    var mod = parsed.protocol === 'https:' ? https : http;
    var options = {
      hostname: parsed.hostname,
      path: parsed.path,
      headers: {
        // Pretend to be a modern browser so Google returns woff2 (not woff)
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
                      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    mod.get(options, function(res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(get(res.headers.location));
        return;
      }
      var chunks = [];
      res.on('data', function(c) { chunks.push(c); });
      res.on('end', function() { resolve(Buffer.concat(chunks)); });
      res.on('error', reject);
    }).on('error', reject);
  });
}

function filenameFor(family, style, weight) {
  var base = (FILENAME_MAP[family] || family.toLowerCase().replace(/ /g, '-'));
  return base + '-' + weight + (style === 'italic' ? 'italic' : '') + '.woff2';
}

async function main() {
  console.log('Magic Scroll — Font Downloader\n');

  // 1. Create fonts/ directory
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR);
    console.log('Created fonts/');
  }

  // 2. Fetch the Google Fonts CSS
  console.log('Fetching Google Fonts CSS...');
  var cssBuffer = await get(GOOGLE_FONTS_CSS);
  var css = cssBuffer.toString('utf8');

  // 3. Parse @font-face blocks
  var fontFaceBlocks = css.match(/@font-face\s*\{[^}]+\}/g) || [];
  console.log('Found', fontFaceBlocks.length, 'font-face blocks\n');

  var localFontFaceCSS = '';
  var downloadCount = 0;

  for (var block of fontFaceBlocks) {
    var familyMatch = block.match(/font-family:\s*['"]?([^'";]+)/);
    var styleMatch  = block.match(/font-style:\s*(normal|italic)/);
    var weightMatch = block.match(/font-weight:\s*(\d+)/);
    var srcMatch    = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);

    if (!familyMatch || !srcMatch) continue;

    var family = familyMatch[1].trim();
    var style  = (styleMatch  && styleMatch[1])  || 'normal';
    var weight = (weightMatch && weightMatch[1]) || '400';
    var woff2url = srcMatch[1];
    var filename = filenameFor(family, style, weight);
    var dest     = path.join(FONTS_DIR, filename);

    // Download if not already cached
    if (!fs.existsSync(dest)) {
      process.stdout.write('  Downloading ' + filename + '... ');
      try {
        var data = await get(woff2url);
        fs.writeFileSync(dest, data);
        console.log('(' + Math.round(data.length / 1024) + ' KB)');
        downloadCount++;
      } catch(e) {
        console.log('FAILED:', e.message);
        continue;
      }
    } else {
      console.log('  Skipping ' + filename + ' (already exists)');
    }

    // Build local @font-face rule
    localFontFaceCSS +=
      '@font-face {\n' +
      '  font-family: \'' + family + '\';\n' +
      '  font-style: '  + style  + ';\n' +
      '  font-weight: ' + weight + ';\n' +
      '  font-display: swap;\n' +
      '  src: url(\'fonts/' + filename + '\') format(\'woff2\');\n' +
      '}\n';
  }

  // 4. Write fonts/fonts.css — the HTML can @import this instead of Google CDN
  var fontsCSS = path.join(__dirname, 'fonts', 'fonts.css');
  fs.writeFileSync(fontsCSS, localFontFaceCSS);
  console.log('\nWrote fonts/fonts.css (' + fontFaceBlocks.length + ' @font-face rules)');

  // 5. Patch the HTML file to use local fonts
  var htmlFile = path.join(__dirname, 'MagicScrollv0.9.9.6.html');
  if (fs.existsSync(htmlFile)) {
    var html = fs.readFileSync(htmlFile, 'utf8');
    var OLD_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Courier+Prime";
    if (html.includes(OLD_IMPORT)) {
      var importEnd = html.indexOf("display=swap');") + "display=swap');".length;
      var importStart = html.indexOf(OLD_IMPORT);
      html = html.slice(0, importStart) +
             "@import url('fonts/fonts.css');" +
             html.slice(importEnd);
      fs.writeFileSync(htmlFile, html);
      console.log('Patched MagicScrollv0.9.9.6.html to use local fonts');
    } else {
      console.log('HTML already uses local fonts or @import not found');
    }
  }

  console.log('\n✓ Done! Downloaded', downloadCount, 'font files.');
  console.log('  Your Magic Scroll is now fully self-contained for fonts.');
  console.log('\nNext steps:');
  console.log('  - Add theme images (parchment.jpg, dark.jpg, green.jpg, session.jpg)');
  console.log('  - Add soundfont: MagicScrollSoundfont/MagicScrollSoundfont.sf2');
  console.log('  - Deploy all files to your HTTPS host');
}

main().catch(function(e) {
  console.error('Error:', e.message);
  process.exit(1);
});
