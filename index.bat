@ECHO OFF
setlocal enabledelayedexpansion
for %%f in (%1\*.pdf) do (
  xcopy /s/e "%%f" %~dp0
  mkdir "%~dp0output\%%~nf"
  mkdir "%~dp0output\%%~nf\input"
  
  %~dp0pdf2htmlEX.exe --dest-dir "output\%%~nf\input" --embed cijfo --bg-format jpg --split-pages 1 --page-filename "page%%03d.html" --css-filename template.css "%%~nf.pdf"
  
  echo "------------- PDF to HTML Generated -------------"
  
  mkdir "%~dp0output\%%~nf\output"
  mkdir "%~dp0output\%%~nf\report"
  
  %~dp0exe\node.exe %~dp0bin\copy.js -o "%~dp0output\%%~nf\output"
  %~dp0exe\node.exe %~dp0bin\header_Update.js -i "%~dp0output\%%~nf\input" -o "%~dp0output\%%~nf\output\OEBPS\html" -r "%~dp0output\%%~nf\report"
  %~dp0exe\node.exe %~dp0bin\ScaleRemoval.js -i "%~dp0output\%%~nf\input\template.css" -o "%~dp0output\%%~nf\output\OEBPS\css\template.css" -c "%~dp0output\%%~nf\report\classList.txt"
  %~dp0exe\node.exe %~dp0bin\filesCopy.js -i "%~dp0output\%%~nf\input" -o "%~dp0output\%%~nf\output"
  %~dp0exe\node.exe %~dp0bin\navHTMLCreation.js -i "%~dp0output\%%~nf\output" -o "%~dp0output\%%~nf\output\OEBPS" -r "%~dp0output\%%~nf\report"
  %~dp0exe\node.exe %~dp0bin\opf.js -i "%~dp0output\%%~nf\output" -e "%~dp0output\%%~nf\report"
  %~dp0exe\node.exe %~dp0bin\cssCleanup.js -i "%~dp0output\%%~nf\output"
  %~dp0exe\node.exe %~dp0bin\removeCssFile.js -i "%~dp0output\%%~nf\output"  

  echo "------------- Post Process Done -------------"
  
  del "%~dp0%%~nf.pdf"
  
  echo "------------- %~dp0%%~nf.pdf PDF file has been removed -------------"
  
  %~dp0exe\node.exe %~dp0bin\spanName_Update.js -i "%~dp0output\%%~nf\output"  -r "%~dp0output\%%~nf\report"
  
  echo "----------- Span Name Updated -----------"
)