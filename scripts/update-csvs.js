const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const csvs = {
  ROBLOX: '1qAN8Eh4iPjO1aECiO1tclTXTLKfCka3StReywLJ3A58:0',
  MobileHD: '1qAN8Eh4iPjO1aECiO1tclTXTLKfCka3StReywLJ3A58:1165619838',
  Developer: '1qAN8Eh4iPjO1aECiO1tclTXTLKfCka3StReywLJ3A58:962693214',
  HangOutinaDiscoandChat: '1qAN8Eh4iPjO1aECiO1tclTXTLKfCka3StReywLJ3A58:1981780668',
  SpaceKnights: '1qAN8Eh4iPjO1aECiO1tclTXTLKfCka3StReywLJ3A58:816534120',
  SurviveTheDisasters: '1qAN8Eh4iPjO1aECiO1tclTXTLKfCka3StReywLJ3A58:2117257891',
  Internal: '1qAN8Eh4iPjO1aECiO1tclTXTLKfCka3StReywLJ3A58:1812577987',
  RobloxVN: '1qAN8Eh4iPjO1aECiO1tclTXTLKfCka3StReywLJ3A58:1729595258',
  Android: '1nTPDx9n4kfaprq0kZBzRVxshfbOdmw_V3SmvRYxSp0U:0',
  AndroidVN: '1nTPDx9n4kfaprq0kZBzRVxshfbOdmw_V3SmvRYxSp0U:2105890827',
};

function mkdirp(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);

    https.get(parsed, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirects
        return resolve(download(res.headers.location, dest));
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
      file.on('error', (err) => reject(err));
    }).on('error', (err) => reject(err));
  });
}

async function main() {
  const outDir = path.join(process.cwd(), 'csv');
  mkdirp(outDir);

  for (const [name, value] of Object.entries(csvs)) {
    const [sheet_id, gid] = value.split(':');
    const url = `https://docs.google.com/spreadsheets/d/${sheet_id}/export?format=csv&gid=${gid}`;
    const dest = path.join(outDir, `${name}.csv`);
    console.log(`Downloading ${name} from ${url}`);
    try {
      await download(url, dest);
      console.log(`Saved ${dest}`);
    } catch (err) {
      console.error(`Failed to download ${name}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  process.exit(0);
}

if (require.main === module) main();
