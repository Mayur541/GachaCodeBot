const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function checkPCGamesN() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.pcgamesn.com/wuthering-waves/codes', { waitUntil: 'domcontentloaded' });
  
  const content = await page.evaluate(() => document.body.innerText);
  
  const regex = /[A-Z0-9]{8,15}/g;
  console.log("----- Matched Codes -----");
  const codes = content.match(regex) || [];
  console.log([...new Set(codes)]);
  
  await browser.close();
}
checkPCGamesN();
