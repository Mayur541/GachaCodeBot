const url = 'https://rsshub.app/reddit/search/Genshin_Impact/title:code%20OR%20title:livestream/new';

fetch(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
})
.then(res => {
  console.log('Status:', res.status);
})
.catch(err => console.error(err));
