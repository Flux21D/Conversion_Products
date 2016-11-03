var path = require('path'); //File System
fs=require('fs'); //FileSystem
var argv=require('optimist').argv; //Arguments
var writetofile=require('./libs/writetofile'); //file writer
var readfile=require('./libs/readfile'); //file writer
var cheerio=require('cheerio');
var underscore=require('./libs/underscore.js'); //file writer
var cssParser = require('css-parse');

var input = argv.i;
var cssPath = input + '\\OEBPS\\css\\template.css';
var basecssPath = input + '\\OEBPS\\css\\base.min.css';

//fs.unlink(cssPath);
//fs.unlink(basecssPath);