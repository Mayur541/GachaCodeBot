const url = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.prydwen.gg/wuthering-waves/guides/codes/');

fetch(url)
.then(res => res.json())
.then(data => {
  console.log('Status:', data.status);
  console.log('Length:', data.contents.length);
  if (data.contents.includes('Cloudflare')) {
    console.log('Blocked by Cloudflare');
  } else {
    console.log('Success!');
  }
})
.catch(err => console.error(err));
