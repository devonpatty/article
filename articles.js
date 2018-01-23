/* útfæra greina virkni */
const path = require('path');
const express = require('express');
const md = require('markdown-it')();

const router = express.Router();


router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static(path.join(__dirname, 'articles')));

router.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  const data = res.locals;
  let title;
  let mark;
  for (let i = 0; i !== data.length; i += 1) {
    if (data[i].data.slug === slug) {
      title = data[i].data.title;
      mark = md.render(data[i].content);
    }
  }
  res.render('article', {
    title,
    content: mark,
  });
});

module.exports = router;
