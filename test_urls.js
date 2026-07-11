const urls = [
  'https://www.lootbar.com/blog/en/genshin-impact-codes.html',
  'https://www.lootbar.com/blog/en/honkai-star-rail-codes.html',
  'https://www.lootbar.com/blog/en/wuthering-waves-codes.html',
  'https://www.lootbar.com/blog/en/arknights-endfield-codes.html'
];

async function check() {
  for (const url of urls) {
    const res = await fetch(url);
    console.log(url, res.status);
  }
}
check();
