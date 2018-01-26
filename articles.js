/* útfæra greina virkni */
const path = require('path');
const express = require('express');
const md = require('markdown-it')();

const router = express.Router();


router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static(path.join(__dirname, 'articles')));

/* a check function - to check if the path match any data of slugs */
function check(arr, slug) {
  let boo = false;
  for(let i = 0; i !== arr.length; i += 1) {
    if( arr[i].data.slug === slug) {
      boo = true;
      console.log("iterate: ", boo);
      break;
    }
  }
  return boo;
}

router.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  const data = res.locals;
  let title;
  let mark;
  let boo = check(data, slug);
  if(boo) {
    for (let i = 0; i !== data.length; i += 1) {
      if (data[i].data.slug === slug) {
        title = data[i].data.title;
        mark = md.render(data[i].content);
        return res.render('article', {
            title: title,
            content: mark,
        });
      }
    }
  } else {
    return res.render('error', {
      title: "Fannst ekki",
      error: "Síða fannst ekki"
    });
  }
});

module.exports = router;
