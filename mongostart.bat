@echo off

setlocal
if exist "F:\MongoDB\Server\3.2\bin\mongod.exe" goto dHome
if exist "D:\MongoDB\Server\3.2\bin\mongod.exe" goto fHome

set "CURRENT_DIR=E:\mongodb-win32-i386-3.0.7\bin"
E:
cd "%CURRENT_DIR%"
echo "%CURRENT_DIR%"

if exist "%CURRENT_DIR%\mongod.exe" goto okHome
echo Can't find mongod.exe
goto end

:dHome

set "CURRENT_DIR=F:\MongoDB\Server\3.2\bin" 
F:
cd "%CURRENT_DIR%"
echo "%CURRENT_DIR%"

if exist "%CURRENT_DIR%\mongod.exe" goto okHome
echo Can't find mongod.exe
goto end

:fHome

set "CURRENT_DIR=D:\MongoDB\Server\3.2\bin"
F:
cd "%CURRENT_DIR%"
echo "%CURRENT_DIR%"

:okHome

if exist "D:\GitHub\Neural-Digits\data\" goto dData

set "EXECUTABLE=%CURRENT_DIR%\mongod.exe --dbpath E:\GitHub\Neural-Digits\data\"
goto okData

:dData
set "EXECUTABLE=%CURRENT_DIR%\mongod.exe --dbpath D:\GitHub\Neural-Digits\data\"

:okData
echo "%EXECUTABLE%"
call %EXECUTABLE%

:end