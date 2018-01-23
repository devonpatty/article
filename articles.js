/* útfæra greina virkni */
const path = require('path');
const express = require('express');
const helper = require('./helper.js');
const md = require('markdown-it')();
const router = express.Router();


router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static(path.join(__dirname, 'articles')));

router.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  const data = res.locals;
  let title, mark;
  for(let i = 0; i != data.length; i++) {
    if( data[i].data.slug === slug ) {
      title = data[i].data.title;
      mark = md.render(data[i].content);
    }
  }
  res.render('article', {
    title: title,
    content: mark
  });
});

module.exports = router;
