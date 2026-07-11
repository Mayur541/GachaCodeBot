require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

// Configuration
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const gamesConfig = [
  {
    name: 'Genshin Impact',
    url: 'https://www.lootbar.com/blog/en/genshin-impact-codes.html',
    color: '#32a852'
  },
  {
    name: 'Honkai: Star Rail',
    url: 'https://www.lootbar.com/blog/en/honkai-star-rail-codes.html',
    color: '#8b0000'
  },
  {
    name: 'Wuthering Waves',
    url: 'https://www.pcgamesn.com/wuthering-waves/codes',
    color: '#ffd700'
  },
  {
    name: 'Arknights: Endfield',
    url: 'https://www.prydwen.gg/arknights-endfield/guides/codes/',
    color: '#00008b'
  }
];

const CODE_REGEX = /[A-Z0-9]{8,15}/g;
const CODES_FILE = path.join(__dirname, 'codes.json');

// Initialize codes.json
if (!fs.existsSync(CODES_FILE)) {
  fs.writeFileSync(CODES_FILE, JSON.stringify([]));
}

let storedCodes = JSON.parse(fs.readFileSync(CODES_FILE, 'utf8'));

async function scrapeAndPost() {
  if (!DISCORD_TOKEN || !CHANNEL_ID) {
    console.error('Missing DISCORD_TOKEN or CHANNEL_ID');
    process.exit(1);
  }

  const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
  
  console.log('Logging into Discord...');
  await new Promise((resolve, reject) => {
    discordClient.once('clientReady', resolve);
    discordClient.login(DISCORD_TOKEN).catch(reject);
  });
  
  console.log(`Discord bot logged in as ${discordClient.user.tag}`);
  
  let channel = discordClient.channels.cache.get(CHANNEL_ID);
  
  // If the channel isn't cached, try fetching it directly
  if (!channel) {
    try {
      channel = await discordClient.channels.fetch(CHANNEL_ID);
    } catch (e) {
      console.error(`Failed to fetch channel with ID ${CHANNEL_ID}`, e);
    }
  }

  if (!channel) {
    console.error(`Channel with ID ${CHANNEL_ID} not found.`);
    process.exit(1);
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  let newCodesFound = false;

  for (const game of gamesConfig) {
    console.log(`Scraping ${game.name} from ${game.url}...`);
    try {
      await page.goto(game.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // Extract visible text rather than full HTML to reduce false positives
      const content = await page.evaluate(() => document.body.innerText);
      
      const foundCodes = content.match(CODE_REGEX) || [];
      const uniqueCodes = [...new Set(foundCodes)];
      
      for (const code of uniqueCodes) {
        // Skip obvious false positives (common uppercase words on gaming sites)
        const falsePositives = ['PRIVACY', 'POLICY', 'TERMS', 'SERVICE', 'CONTACT', 'ABOUT', 'TWITTER', 'DISCORD', 'FACEBOOK', 'YOUTUBE', 'REDDIT', 'DOWNLOAD', 'ANDROID', 'WINDOWS', 'APPLE', 'HOYOVERSE', 'GENSHIN', 'HONKAI', 'WUTHERING', 'WAVES'];
        if (falsePositives.includes(code)) continue;

        if (!storedCodes.includes(code)) {
          console.log(`New code found for ${game.name}: ${code}`);
          storedCodes.push(code);
          newCodesFound = true;
          
          const embed = new EmbedBuilder()
            .setTitle(`New Promo Code for ${game.name}!`)
            .setDescription(`**Code:** \`${code}\``)
            .setURL(game.url)
            .setColor(game.color)
            .setTimestamp()
            .setFooter({ text: 'Auto-scraped via GitHub Actions' });
            
          await channel.send({ embeds: [embed] });
          console.log(`Successfully announced code: ${code}`);
          // Sleep to avoid discord rate limits
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    } catch (err) {
      console.error(`Error scraping ${game.name}:`, err.message);
    }
  }

  await browser.close();

  if (newCodesFound) {
    fs.writeFileSync(CODES_FILE, JSON.stringify(storedCodes, null, 2));
    console.log('codes.json updated.');
  } else {
    console.log('No new codes found.');
  }

  discordClient.destroy();
  console.log('Finished successfully.');
  process.exit(0);
}

scrapeAndPost().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
