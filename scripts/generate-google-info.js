const fs = require('fs');
const path = require('path');

const plistPath = path.resolve(__dirname, '..', 'GoogleService-Info.plist');
const outPathDir = path.resolve(__dirname, '..', 'src', 'common');
const outPath = path.join(outPathDir, 'google-info.json');

function extractBundleId(plistContent) {
  const keyRegex = /<key>\s*BUNDLE_ID\s*<\/key>\s*<string>(.*?)<\/string>/s;
  const m = plistContent.match(keyRegex);
  return m ? m[1].trim() : null;
}

try {
  const content = fs.readFileSync(plistPath, { encoding: 'utf8' });
  const bundleId = extractBundleId(content);
  if (!bundleId) {
    console.error('BUNDLE_ID not found in', plistPath);
    process.exitCode = 1;
  } else {
    if (!fs.existsSync(outPathDir)) fs.mkdirSync(outPathDir, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify({ bundleId }, null, 2), { encoding: 'utf8' });
    console.log('Wrote', outPath, 'bundleId=', bundleId);
  }
} catch (err) {
  console.error('Error generating google-info:', err.message || err);
  process.exitCode = 1;
}
