var fs = require('fs-extra');
var path = require('path');

try {
  fs.copySync(path.join(__dirname, '/ui-core/dist'), path.join(__dirname, '/views'));
  console.log('UI dist folder moved');
} catch(e) {
  console.error('Error while moving dist folder' + e);
}
