const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function checkIGN() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.ign.com/wikis/wuthering-waves/Codes', { waitUntil: 'domcontentloaded' });
  
  console.log("Waiting 3 seconds...");
  await new Promise(r => setTimeout(r, 3000));

  const content = await page.evaluate(() => document.body.innerText);
  console.log("----- Content Snippet -----");
  console.log(content.substring(0, 500));
  
  const regex = /[A-Z0-9]{8,15}/g;
  console.log("----- Matched Codes -----");
  const codes = content.match(regex);
  console.log([...new Set(codes)]);
  
  await browser.close();
}
checkIGN();
