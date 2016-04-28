@echo off

setlocal
if exist "D:\GitHub\Neural-Digits\app.js" goto dHome

E:
cd "GitHub\Neural-Digits"
set "CURRENT_DIR=%cd%"
echo "%CURRENT_DIR%"

goto okHome

:dHome

D:
cd "GitHub\Neural-Digits"
set "CURRENT_DIR=%cd%"
echo "%CURRENT_DIR%"


:okHome

set "EXECUTABLE=nodemon start"
echo "%EXECUTABLE%"
call %EXECUTABLE%

:end