var path = require('path'); //File System
fs=require('fs'); //FileSystem
var argv=require('optimist').argv; //Arguments
var writetofile=require('./libs/writetofile'); //file writer
var readfile=require('./libs/readfile'); //file writer
var cheerio=require('cheerio');
var underscore=require('./libs/underscore.js'); //UnderScore
var ncp = require('ncp').ncp;
var copy = require('ncp');

var input = argv.i;
var output = argv.o;

fromDir(input);

function fromDir(startPath){

	if(!fs.existsSync(startPath)){
		console.log('no Dir ',startPath);
		exit(0);
	}
	
	var files = fs.readdirSync(startPath);
	for(var f=0; f<files.length; f++){
	
		var filename = path.join(startPath,files[f]);
		var stat = fs.lstatSync(filename);
		if(stat.isDirectory()){}
		else{
			if(filename.indexOf('base.min.css')>=0){
				copyFile(filename,output+'\\OEBPS\\css\\'+files[f]);
			}
			else if(filename.indexOf('.jpg')>=0 || filename.indexOf('.png')>=0 || filename.indexOf('.jpeg')>=0){
				copyFile(filename,output+'\\OEBPS\\images\\'+files[f]);
			}
			else if(filename.indexOf('.ttf')>=0 || filename.indexOf('.otf')>=0 || filename.indexOf('.woff')>=0){
				copyFile(filename,output+'\\OEBPS\\font\\'+files[f]);
			}
		}
	}
}

function copyFile(inputPath,outputPath){
	var inputContent = readfile(inputPath);
	fs.writeFileSync(outputPath, inputContent);
	ncp(inputPath,outputPath, function (err) {
	 if (err) {
	   return console.error(inputPath + '\n' + err);
	 }
	});

}