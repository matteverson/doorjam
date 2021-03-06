#!/usr/bin/env node

/*
  Running this script will add the last attempted login to the access list
*/

var fs = require('fs');

if(!fs.existsSync('failed_attempts')) {
    console.log("It appears that there have been no failed attempts (the failed_attempts file doesn't exist)");
    process.exit(1);
}

if(process.argv.length < 3) {
    console.log("Usage: "+process.argv[1]+" <name and contact info for new user>")
    process.exit(1);
}

var attempts = fs.readFileSync('failed_attempts', {encoding: 'utf8'}).split("\n");

var i, lastAttempt;
for(i=attempts.length-1; i >= 0; i--) {
    lastAttempt = attempts[i];
    if(lastAttempt.replace(/^\s+$/g, '').length > 4) {
        lastAttempt = JSON.parse(lastAttempt);
        break;
    }
} 

var comment = '# ' + process.argv.slice(2).join(' ') + " | added on " + new Date() + "\n";

var entry = comment + lastAttempt.code + "\n";

try {
    fs.appendFileSync('access_control_list', entry);
} catch(e) {
    console.log("Error: Hm. Are you sure you have permission to write to the access_control_list file?")
    process.exit(1);
}

console.log("Added: \n" + entry);
