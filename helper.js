const fs = require('fs');
const gm = require('gray-matter');
const md = require('markdown-it')();
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);

async function read(file) {
  const conFs = await readFileAsync(file);
  const conGm = await gm(conFs);
  return conGm;
}

function write(content) {
  const res = md.render(content);
  return res;
}

function getKey(object) {
  const obj = Object.getOwnPropertyNames(object);
  return obj[0];
}

function sort(arr) {
  arr.sort((a, b) => {
    const c = new Date(a.data.date);
    const d = new Date(b.data.date);
    // change this for oldest-to-newest
    return d - c;
  });
}

function formatDate(string) {
  const temp = new Date(string);
  const date = temp.getDate();
  const month = temp.getMonth() + 1;
  const year = temp.getFullYear();
  const dmy = `${date}.${month}.${year}`;
  return dmy;
}

module.exports = {
  read,
  write,
  getKey,
  sort,
  formatDate,
};
