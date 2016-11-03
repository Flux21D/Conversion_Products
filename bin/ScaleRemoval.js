var path = require('path'); //File System
fs=require('fs'); //FileSystem
var argv=require('optimist').argv; //Arguments
var writetofile=require('./libs/writetofile'); //file writer
var readfile=require('./libs/readfile'); //file writer
var cheerio=require('cheerio');
var underscore=require('./libs/underscore.js'); //file writer
var cssParser = require('css-parse');
var errorLog = 'HTML Name,Issue';
//var input = 'D:\\Dinesh\\EDIGITA\\input\\Converted_File\\template.css';
//var output = 'D:\\Dinesh\\EDIGITA\\input\\Converted_File\\output\\template.css';

var input = argv.i;
var output = argv.o;
var classFile = argv.c;
var reportFolder = argv.r;


var cssContent = readfile(input);
cssContent = cssContent.toString().replace(/src\:url\(/g,'src:url(../font/');
cssContent = cssContent.toString().replace(/format\(".*?"\)/g,'');
cssContent = cssContent.toString().replace(/{word-spacing:/g,' span{margin-right:');

//span:first-child {
  //  background-color: lime;
//}


cssDom = cssParser(cssContent);

var textContent = readfile(classFile);
var className = textContent.toString().split('\n');
cssDom.stylesheet.rules.forEach(function(e,j){
	try{
		e.selectors.forEach(function(e2,k){
			var classNameFound = false;

			for(var c=0; c<className.length; c++){
				if(e2 == '.' + className[c]){
					classNameFound = true;
				}
			}
			//if(e2 == '.pf' || e2 == '.w0' || e2 == '.h0' || e2 == '.pc' || e2 == '.pc9' || e2 == '.c' || e2 == '.x0' || e2 == '.y0' || e2 == '.w1' || e2 == '.h1' || e2.toString().match(/^\.w[0-9]+/g)){}
			if(classNameFound){}
			else{
				if(e2.toString().match(/^\.\_/g)){
					e.declarations.forEach(function(e1,l){
							if(e1.property == 'bottom' || e1.property == 'left'){}
							else{
								if(e1.value.toString().match('px')){
									var newValue1 = e1.value.toString().replace('px','') * 0.75;
									var newValue = parseFloat(e1.value.toString().replace('px','')) - parseFloat(newValue1);
									cssContent = cssContent.toString().replace(e1.property + ':' + e1.value,e1.property + ':' + newValue + 'px');
								}
								else if(e1.value.toString().match('pt')){
									var newValue = e1.value.toString().replace('pt','') * 0.75;
									var newValue = parseFloat(e1.value.toString().replace('pt','')) - parseFloat(newValue1);
									cssContent = cssContent.toString().replace(e1.property + ':' + e1.value,e1.property + ':' + newValue + 'pt');
								}
							}
					});
				}
				else{
					e.declarations.forEach(function(e1,l){
							if(e1.property == 'bottom' || e1.property == 'left' || e1.property == 'margin-left'){}
							else{
								if(e1.value.toString().match('px')){
									var newValue1 = e1.value.toString().replace('px','') * 0.75;
									var newValue = parseFloat(e1.value.toString().replace('px','')) - parseFloat(newValue1);
									cssContent = cssContent.toString().replace(e1.property + ':' + e1.value,e1.property + ':' + newValue + 'px');
								}
								else if(e1.value.toString().match('pt')){
									var newValue = e1.value.toString().replace('pt','') * 0.75;
									var newValue = parseFloat(e1.value.toString().replace('pt','')) - parseFloat(newValue1);
									cssContent = cssContent.toString().replace(e1.property + ':' + e1.value,e1.property + ':' + newValue + 'pt');
								}
							}
					});
				}
			}
		});
	}
	catch(e){}
});



fs.writeFileSync(output,cssContent);