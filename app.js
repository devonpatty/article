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
async function sortMiddleware(req, res, next) {
  await helper.sort(res.locals);
  next();
}

function catchErrors(fn) {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
}

function notFoundHandler(req, res, next) {
  res.status(404);
  res.render('error', {
    title: 'Fannst ekki',
    error: 'Fannst ekki síða',
  });
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', {
    title: 'Villa',
    error: 'Villa kom upp!',
  });
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'articles')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(initMiddleWare);
app.use(sortMiddleware);


// initialize the articles list
app.get('/', catchErrors(initMiddleWare), catchErrors(sortMiddleware), (req, res) => {
  const data = res.locals;
  res.render('main', {
    title: 'Greinasafnið',
    props: data,
  });
});

app.use('/articles', route);
app.use('/articles/:slug', route);

app.use('*', notFoundHandler);
app.use(errorHandler);

app.listen(port, hostname);
