const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

const resolveFileFromId = (id, importer) => {
  id = id.replace(/^[\/\\]+/, '');
  let match;
  // console.log('load', id, match);
  if (match = id.match(/^ipfs:\/+([a-z0-9]+)((?:\/?[^\/\?]*)*)(\?\.(.+))?$/i)) {
    return `https://ipfs.webaverse.com/ipfs/${match[1]}${match[2]}`;
  } else {
    return null;
  }
};
module.exports.resolveFileFromId = resolveFileFromId;
const fetchFileFromId = async (id, importer, encoding = null) => {
  if (/^https?:\/\//.test(id)) {
    const res = await fetch(id)
    if (encoding === 'utf8') {
      return await res.text();
    } else {
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return buffer;
    }
  } else {
    return await new Promise((accept, reject) => {
      const p = path.resolve(path.dirname(importer), id.replace(/^[\/\\]+/, ''));
      // console.log('read dir', {id, importer, p});
      fs.readFile(p, encoding, (err, d) => {
        if (!err) {
          accept(d);
        } else {
          if (err.code === 'ENOENT') {
            accept(null);
          } else {
            reject(err);
          }
        }
      });
    });
  }
};
module.exports.fetchFileFromId = fetchFileFromId;