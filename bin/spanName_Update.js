var path = require('path'); //File System
fs=require('fs'); //FileSystem
var argv=require('optimist').argv; //Arguments
var writetofile=require('./libs/writetofile'); //file writer
var readfile=require('./libs/readfile'); //file writer
var cheerio=require('cheerio');
var underscore=require('./libs/underscore.js'); //file writer
var cssParser = require('css-parse');
var errorLog = 'HTML Name,Issue';
var csvReport = 'FileName,Words,StartTime,EndTime';

var input = argv.i;
var reportFolder = argv.r;
//var input = 'D:\\Dinesh\\PDF_ePub3\\output';

fromDir(input,'.xhtml');

function fromDir(startPath, filter) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }
    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
			fromDir(filename, filter)
		}
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

	var content = readfile(filePath);
	var $ = cheerio.load(content);
	
	var para = "";
	$('body').children('div#page-container').children('div').children('div').find('div').each(function (index,element){
		if(index > ($('body').children('div#page-container').children('div').children('div').find('div').length - 1)){}
		else{
			try{
				if($(this).find('span').length == 0){
					var str = $(this).text();
					var words = str.match(/\w+/g);
					var line = "";
					for(var w=0; w<words.length; w++){
						csvReport = csvReport + '\n' + filename + ',' + words[w] + ',' + '' + ',' + '';
						line = line + words[w] + ' ';
					}
					$(this).html(wrapWords(str));
				}
				else{
					$(this).find('span').each(function (index,element){
						var str = $(this).text();
						var words = str.match(/\w+/g);
						var line = "";
						for(var w=0; w<words.length; w++){
							csvReport = csvReport + '\n' + filename + ',' + words[w] + ',' + '' + ',' + '';
							line = line + words[w] + ' ';
						}
						$(this).html(wrapWords(str));
					});
					for(var i=0; i<$(this).contents().length; i++){
						var str = $(this).contents()[i].data;
						var words = str.match(/\w+/g);
						var line = "";
						for(var w=0; w<words.length; w++){
							csvReport = csvReport + '\n' + filename + ',' + words[w] + ',' + '' + ',' + '';
							line = line + words[w] + ' ';
						}
						$(this).html($(this).html().toString().replace(str,wrapWords(str)));
					}
				}
				para = para + line;
			}
			catch(e){}
			$(this).html($(this).html().toString().replace("<\/span>\.",".<\/span>"));
			$(this).html($(this).html().toString().replace("<\/span>,",",<\/span>"));
			$(this).html($(this).html().toString().replace("<\/span>\?","?<\/span>"));
			$(this).html($(this).html().toString().replace("<\/span>\-","-<\/span>"));
			$(this).html($(this).html().toString().replace("<\/span>\/","/<\/span>"));
			$(this).html($(this).html().toString().replace("<\/span>\:",":<\/span>"));
			$(this).html($(this).html().toString().replace("<\/span>;",";<\/span>"));
			$(this).html($(this).html().toString().replace("<\/span>_","_<\/span>"));
			$(this).html($(this).html().toString().replace("<\/span>”","”<\/span>"));
		}
	});
	function wrapWords(str, tmpl) {
		return str.replace(/\w+/g, tmpl || '<span data-name="$&">$&</span>');
	}
	$('div.pi').remove();
	fs.writeFileSync(filePath,$.xml());
	fs.writeFileSync(reportFolder + '\\WordLevelCSVReport.csv',csvReport);
	fs.writeFileSync(reportFolder + '\\' + filename.toString().replace(/\.xhtml/g,'.txt'),para);

}