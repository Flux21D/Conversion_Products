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
var paracssPath = input + '\\OEBPS\\css\\templatePara.css';
var prefix = 'NZ';

var paraTemplateContent = '.para{\r\nposition:absolute !important;white-space:pre;transform-origin:0 100%;-ms-transform-origin:0 100%;-webkit-transform-origin:0 100%;unicode-bidi:bidi-override;-moz-font-feature-settings:"liga" 0}\r\n' + '.para:after{content:\'\'}\r\n' + '.para span{position:relative;display:inline-block;unicode-bidi:bidi-override}\r\n';

fs.writeFileSync(paracssPath,paraTemplateContent);

mergingCSS(cssPath,basecssPath)
fontFace(cssPath);
fromDir(input, '.xhtml');

function mergingCSS(cssPath,basecssPath){
	basecssContent = readfile(basecssPath);
	cssContent = readfile(cssPath);
	UpdatedcssContent = cssContent + '\r\n' + basecssContent;
	fs.writeFileSync(cssPath,UpdatedcssContent);
}

function fontFace(cssPath){
	var tempCSS = readfile(cssPath);
	cssDom = cssParser(tempCSS);
	finalFontLevelCSS = '';
	cssDom.stylesheet.rules.forEach(function(e,j){
		try{
			if(e.type == 'font-face'){
				fontFaceProperties = '';
				fontFamilyProps = '';
				e.declarations.forEach(function(e1,l){
					if(e1.property == 'font-family'){
						var fontFamilyProperties = fontFamily(e1.value,cssDom);
						fontFamilyProps = fontFamilyProps + '\r\n' + '.' + e1.value + ' {\r\n' + fontFamilyProperties + '\r\n}';
					}
					fontFaceProperties = fontFaceProperties + '\r\n' + e1.property + ': ' + e1.value + ';';
				});
				finalFontLevelCSS = finalFontLevelCSS + '\r\n' + '@font-face{\r\n' + fontFaceProperties + '\r\n}' + fontFamilyProps;
			}
		}
		catch(e){}

	});
	fs.writeFileSync(cssPath.toString().replace('\\template.css','\\font.css'),finalFontLevelCSS);
}

function fontFamily(className,cssDom){
	var fontFamilyProperties = '';
	cssDom.stylesheet.rules.forEach(function(e,j){
		try{
			e.selectors.forEach(function(e2,k){
				if(e2 == '.' + className){
					e.declarations.forEach(function(e1,l){
						fontFamilyProperties = fontFamilyProperties + '\r\n' + e1.property + ': ' + e1.value + ';';
					});
				}
			});
		}
		catch(e){}

	});
	return fontFamilyProperties;
}

//Reading a input Directory
function fromDir(htmlPath, htmlFilter) {
    if (!fs.existsSync(htmlPath)) {
        console.log("no dir ", htmlPath);
        return;
    }
	
    var htmlFiles = fs.readdirSync(htmlPath);
	for (var i = 0; i < htmlFiles.length; i++) {
        htmlFileName = path.join(htmlPath, htmlFiles[i]);
        var stat = fs.lstatSync(htmlFileName);
        if (stat.isDirectory()) {
            fromDir(htmlFileName, htmlFilter); //recurse
        } else if (htmlFileName.indexOf(htmlFilter) >= 0) {
			if(htmlFiles[i].toString().match('nav')){}
			else{
				cssRead(htmlFileName,htmlFiles[i]);
			}
		} else {};
    };
};
function cssRead(htmlFile, filename){
	var finalCSSContent = '';
	var content = readfile(htmlFile);
	var matchedArray = content.toString().match(/<span class="_ _[0-9A-z]+"\/>/g);
	if(matchedArray){
		for(var z=0; z<matchedArray.length; z++){
			content = content.toString().replace(matchedArray[z],matchedArray[z].toString().replace('\/>','>') + ' ' + '</span>');
		}
	}
	var $ = cheerio.load(content);
	$('head').find('link').each(function (ind,ele){
		if($(this).attr('rel')){
			if($(this).attr('href').toString().match('base.min.css')){
				$(this).attr('href','../css/templatePara.css');				
			}
			else{
				cssLink = $(this).attr('href');
				$(this).attr('href',cssLink.toString().replace('template.css',filename.toString().replace(/\.xhtml/g,'.css')));
				rootPath = htmlFile.toString().replace('\\html\\' + filename,'');
				var cssFile = rootPath + '\\' + cssLink.toString().replace('../','').replace(/\//g,'\\');
				$('body').find('div#page-container').find('div').each(function (index,element){
					var divClassArray = [];
					for(var i=0; i<$(this).attr('class').split(' ').length; i++){
						if($(this).attr('class').split(' ')[i] != 'para'){
							divClassArray.push($(this).attr('class').split(' ')[i]);
						}
					}
					$(this).attr('class','para ' + prefix + '_paraLineStyle'  + (index+1));
					var uniqueDivClassNames = divClassArray.filter( onlyUnique );
					var LineStyles = cssCleanup(cssFile,uniqueDivClassNames,htmlFileName);
					finalCSSContent = finalCSSContent + '\r\n' + '.' + prefix + '_paraLineStyle'  + (index+1) + ' {\r\n' + LineStyles + '\r\n}'
				});
				$('body').find('div#page-container').find('img').each(function (index,element){
					var imgClassArray = [];
					for(var i=0; i<$(this).attr('class').split(' ').length; i++){
						imgClassArray.push($(this).attr('class').split(' ')[i]);
					}
					$(this).attr('class',prefix + '_imageContainer'  + (index+1));
					var uniqueImageClassNames = imgClassArray.filter( onlyUnique );
					var imageStyles = cssCleanup(cssFile,uniqueImageClassNames,htmlFileName);
					finalCSSContent = finalCSSContent + '\r\n' + '.' + prefix  + '_imageContainer'  + (index+1) + ' {\r\n' + imageStyles + '\r\n}'
				});
				$('body').find('div#page-container').find('span').each(function (index,element){
					var spanClassArray = [];
					for(var i=0; i<$(this).attr('class').split(' ').length; i++){
						spanClassArray.push($(this).attr('class').split(' ')[i]);
					}
					$(this).attr('class',prefix + '_wordStyle'  + (index+1));
					var uniqueSpanClassNames = spanClassArray.filter( onlyUnique );
					var spanStyles = cssCleanup(cssFile,uniqueSpanClassNames,htmlFileName);
					finalCSSContent = finalCSSContent + '\r\n' + '.' + prefix + '_wordStyle'  + (index+1) + ' {\r\n' + spanStyles + '\r\n}'
				});
			}
		}
	});
	$('head').append('<link rel="stylesheet" href="../css/font.css"/>');
	fs.writeFileSync(htmlFile,$.xml());
	fs.writeFileSync(htmlFile.toString().replace('\\html\\','\\css\\').replace(/\.xhtml/g,'.css'),finalCSSContent);
}
function cssCleanup(cssFile,classNamesArray,htmlFileName,newClassName){
	var cssFileName = cssFile.toString().substr(cssFile.toString().lastIndexOf('\\'));
	var cssRootPath = cssFile.toString().replace(cssFileName,'');
	var cssContent = readfile(cssFile);
	cssDom = cssParser(cssContent);
	var finalCSSContent = '';
	cssProperty = '';
	cssDom.stylesheet.rules.forEach(function(e,j){
		try{
			e.selectors.forEach(function(e2,k){
				for(var i=0; i<classNamesArray.length; i++){
					if(e2 == '.' + classNamesArray[i]){
						e.declarations.forEach(function(e1,l){
							cssProperty = cssProperty + '\r\n' + e1.property + ': ' + e1.value + ';';
						});
						finalCSSContent = finalCSSContent + '\r\n' + cssProperty;
					}
				}
			});
		}
		catch(e){}
	});
	return cssProperty;
}
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}