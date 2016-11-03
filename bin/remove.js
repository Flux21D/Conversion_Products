var path = require('path'); //File System
fs=require('fs'); //FileSystem
var argv=require('optimist').argv; //Arguments
var writetofile=require('./libs/writetofile'); //file writer
var readfile=require('./libs/readfile'); //file read
var cheerio=require('cheerio');
var underscore=require('./libs/underscore.js'); 
var ncp = require('ncp').ncp;
var copy = require('ncp');
var input = argv.i;


if (!fs.existsSync(input + '\\Report')){
    fs.mkdirSync(input + '\\Report');
}


fromDir(input);

function fromDir(startPath) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }
    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {}
		else{
			if(files[i] == 'mimetype'){}
			else{
				ncp(filename,input + '\\Report\\' + files[i], function (err) {
				 if (err) {
				   return console.error(err);
				 }
				});
				fs.unlink(filename);
			}
		}
    };
};