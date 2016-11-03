var path = require('path'); //File System
fs=require('fs'); //FileSystem
var argv=require('optimist').argv; //Arguments
var writetofile=require('./libs/writetofile'); //file writer
var readfile=require('./libs/readfile'); //file writer
var cheerio=require('cheerio');
var underscore=require('./libs/underscore.js'); //file writer
var cssParser = require('css-parse');
var errorLog = 'HTML Name,Issue';
var imageClass = [];

var tempHTML = __dirname + '\\libs\\template.html';
var input = argv.i;
var output = argv.o;
var reportFolder = argv.r;
//var css = argv.c;
var css = 'template.css';
var cssFile = input + '\\'+css;

var tempContent = readfile(tempHTML);

fromDir(input,'.html');

fs.writeFileSync(reportFolder + '//classList.txt', imageClass.toString().replace(/,/g,'\n'));

function fromDir(startPath, filter) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }
    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
		
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {}
		else if (filename.indexOf(filter) >= 0) {
			if(files[i].toString().match('page')){
				contentConversion(filename,files[i]);
			}
			else{
				
			}
		}
		else {};
    };
};

function contentConversion(filePath,filename){
	var widthValue='';
	var heightValue='';
	
	var $ = cheerio.load(tempContent);
	var content = readfile(filePath);
	
	var $$ = cheerio.load(content);

	if($$('div[data-page-no]').find('img').attr('class')){
		var imgClassNames = $$('div[data-page-no]').find('img').attr('class').toString().split(' ');
		for(var i=0; i<imgClassNames.length; i++){
			if(imageClass.toString().indexOf(imgClassNames[i]) == -1){
				imageClass.push(imgClassNames[i]);
			}
		}
	}
	if($$('div[data-page-no]').children('div').attr('class')){
		var divClassNames = $$('div[data-page-no]').children('div').attr('class').toString().split(' ');
		for(var d=0; d<divClassNames.length; d++){
			if(imageClass.toString().indexOf(divClassNames[d]) == -1){
				imageClass.push(divClassNames[d]);
			}
		}
	}
	if($$('div[data-page-no]').attr('class')){
		var mainDivClassNames = $$('div[data-page-no]').attr('class').toString().split(' ');
		for(var m=0; m<mainDivClassNames.length; m++){
			if(imageClass.toString().indexOf(mainDivClassNames[m]) == -1){
				imageClass.push(mainDivClassNames[m]);
			}
		}
	}
	 var regex = /<span class="--__[A-z0-9]+"><\/span>/g;
	$('body').find('div#page-container').html(content.toString().replace(regex,''));
	var pageNumber = $('div[data-page-no]').attr('data-page-no');
	$('div[data-page-no]').removeAttr('data-page-no');
	$('body').find('div#page-container').attr('class','page' + pageNumber + 'Container');
	$('div').each(function (index,element){
		try{
			var varClass = $(this).attr('class');
			var updatedClass = varClass.toString().replace(/m[a-z0-9]+ /g,' ');
			$(this).attr('class',updatedClass);
		}
		catch(e){}
	});
	$('img').each(function(index,element){
		var imageName = $(this).attr('src');
		$(this).attr('src','../images/' + imageName);
	});
	 
	cssContent = readfile(cssFile);
	cssDom = cssParser(cssContent);
	
	cssDom.stylesheet.rules.forEach(function(e,j){
		try{
			e.selectors.forEach(function(e2,k){
				if(e2 == '.w0'){
					e.declarations.forEach(function(e1,l){
						if(e1.property == 'width'){
							widthValue = e1.value;
						}
					});
				}
				else if(e2 == '.h0'){
					e.declarations.forEach(function(e1,l){
						if(e1.property == 'height'){
							heightValue = e1.value;
						}
					});
				}
			});
		}
		catch(e){}
	});

	
	$('head').append('<meta name="viewport" content="width=' + parseInt(widthValue.toString().replace('px','')) + ', height=' + parseInt(heightValue.toString().replace('px','')) + '"/>\n');

	
	fs.writeFileSync(output + '\\' + filename.toString().replace('.html','.xhtml'),$.xml());
}