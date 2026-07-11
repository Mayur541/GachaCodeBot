const url = 'https://www.ign.com/wikis/wuthering-waves/Wuthering_Waves_Codes';

fetch(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
})
.then(res => {
  console.log('IGN Status:', res.status);
})
.catch(err => console.error(err));
