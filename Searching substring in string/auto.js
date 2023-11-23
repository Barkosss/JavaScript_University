const fs = require('fs');

module.exports.run = async(stringFile, substringFile) => {
    const string = fs.readFileSync(stringFile, 'utf8');
    const substring = fs.readFileSync(substringFile, 'utf8');

    
}