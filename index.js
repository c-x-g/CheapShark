const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');
const axios = require('axios');
const slugify = require('slugify');

const Search = require('./src/model/Search');
const IsDirEmpty = require('./src/model/Reader');

const tempBanners = fs.readFileSync(`${__dirname}/src/templates/banners.html`, 'utf-8');

const search = new Search('');

// express configurations
const express = require('express');
const app = express();
const serverPort = 8000;

async function downloadImage(url, img_name) {
  const local = path.resolve(__dirname, 'banners', img_name);
  const writer = fs.createWriteStream(local);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

const controlSearch = async () => {
  let html;

  if (fs.existsSync(`${__dirname}/banners/img_links.txt`)) {
    html = fs.readFileSync(`${__dirname}/banners/img_links.txt`, 'utf-8');
  } else {
    let img;
    html = '';

    try {
      await search.getStores();
    } catch (err) {
      console.log('Something went wrong!!');
    }

    for (let i = 0; i < search.result.length; i++) {
      img = slugify(`${search.result[i].storeName}.png`, { lower: true });
      await downloadImage(`https://www.cheapshark.com${search.result[i].images.banner}`, img);
      html += `<img src="http://localhost:8000/banners/${img}"><br/>`;
    }
    fs.writeFileSync(`${__dirname}/banners/img_links.txt`, html, 'utf-8');
  }

  return html;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    search.getDeals();

    res.end(tempBanners);
    // controlSearch()
    //   .then((value) => tempBanners.replace('{%TESTING%}', value))
    //   .then((value) => res.end(value));
  } else if (/\.(jpg|jpeg|png|gif)$/i.test(pathname)) {
    fs.readFile(`${__dirname}${pathname}`, (err, data) => {
      res.writeHead(200, { 'Content-type': 'image/png' });
      res.end(data);
    });

    // URL NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

// server.listen(8000, '127.0.0.1', () => {
//   console.log('Listening to requests on port 8000');
// });

app.listen(serverPort, () => {
  console.log('Server running on port 8000');
});

app.get('/url', (req, res, next) => {
  let json = {
    userId: 'joe123',
    name: 'Joe',
    address: 'billy123',
  };

  res.json(json);
});
