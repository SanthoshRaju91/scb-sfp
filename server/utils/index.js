import shell from 'shelljs';
import fs from 'fs';
import path from 'path';

module.exports = {

  /**
  * Function to construct Git URL
  * @method constructGitURL
  * @param url
  * @param username
  * @param password
  */

  constructGitURL(url, username, password) {
      let encodedPassword = encodeURIComponent(password);
      encodedPassword = encodedPassword.replace(/!/g, '%21');

      let index = url.indexOf('//');
      let protocol = url.substr(0, index);
      let git = url.slice(index + 2);

      return `${protocol}//${username}:${encodedPassword}@${git}`;
  },

  /**
  * Function to read file using fs
  * @method readFile
  * @param path
  * @param encoding
  */

  readFileSync(filePath, encoding) {
    let data = fs.readFileSync(path.resolve(filePath), encoding);
    return data;
  },

  /**
  * Function to read file with promise
  * @method readFile
  * @param path
  * @param encoding
  */
  readFile(filePath, encoding) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(filePath), encoding, (err, data) => {
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  },

  /**
  * Function to write a file with promise
  * @method writeFile
  * @param path
  * @param data
  * @param encoding
  */
  writeFile(filePath, data, encoding) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path.resolve(filePath), data, encoding, (err) => {
        if(err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  },

  /**
  * Roll back files
  * @method rollBackFile
  * @param exisitng  - existing file name
  * @param backup - back up file name
  */
  rollBackFile(existing, backup) {
    shell.rm('-rf', path.resolve(existing));
    shell.exec(`mv ${backup} ${existing}`);
  },

  /**
  * Function to create file back up
  * @method createFileBackup
  * @param filename - filename with path to create a backup
  */
  createFileBackup(filename) {
    shell.exec(`mv ${filename} ${filename}.bak`);
  },

  /**
  * Function to delete back up file
  * @method deleteBackup
  * @param filename - with path
  */
  deleteBackup(filename) {
    shell.rm('-rf', `${filename}`);
  }
}
