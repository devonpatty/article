const express = require('express');
const path = require('path');
const helper = require('./helper.js');
const route = require('./articles.js');

const app = express();

const hostname = 'localhost';
const port = 3000;

/* hardcoded path */
const mdArray = [
  { title: './articles/batman-ipsum.md' },
  { title: './articles/corporate-ipsum.md' },
  { title: './articles/deloren-ipsum.md' },
  { title: './articles/lorem-ipsum.md' },
];

/* read files and convert into object in res.locals */
async function initMiddleWare(req, res, next) {
  const artArr = [];
  for (let i = 0; i !== mdArray.length; i += 1) {
    const result = await helper.read(mdArray[i].title);
    artArr.push(result);
  }
  res.locals = artArr;
  next();
}

/* sort the array-list based on the time newest-to-oldest */
function sortMiddleware(req, res, next) {
  helper.sort(res.locals);
  next();
}


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'articles')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(initMiddleWare);
app.use(sortMiddleware);

app.use('/articles/', route);

// initialize the articles list
app.get('/', initMiddleWare, sortMiddleware, (req, res) => {
  const data = res.locals;
  res.render('main', {
    title: 'Greinalisti',
    props: data,
  });
});

app.listen(port, hostname);
