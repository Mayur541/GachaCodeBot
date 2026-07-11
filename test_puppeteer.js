const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function test() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.prydwen.gg/wuthering-waves/guides/codes/', { waitUntil: 'domcontentloaded' });
    const content = await page.content();
    console.log('Prydwen Content Length:', content.length);
    if (content.includes('Cloudflare')) {
      console.log('Prydwen Blocked!');
    } else {
      console.log('Prydwen Success!');
    }

    await page.goto('https://www.lootbar.com/blog/en/genshin-impact-codes.html', { waitUntil: 'domcontentloaded' });
    const lootbarContent = await page.content();
    console.log('Lootbar Content Length:', lootbarContent.length);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
}

test();
