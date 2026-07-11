const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function checkPrydwen() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.prydwen.gg/wuthering-waves/guides/codes/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  console.log("Waiting 5 seconds for React...");
  await new Promise(r => setTimeout(r, 5000));

  const content = await page.evaluate(() => document.body.innerText);
  console.log("----- Content Snippet -----");
  console.log(content.substring(0, 500));
  
  const regex = /[A-Z0-9]{8,15}/g;
  console.log("----- Matched Codes -----");
  console.log(content.match(regex));
  
  await browser.close();
}
checkPrydwen();
