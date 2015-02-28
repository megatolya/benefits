@echo off
setlocal

rem Kills all firefox.exe processes, executes grunt firefox to make a new build and runs browser with specified version with newly built extension.

set user_version=%~1
set firefox_flags=%~2
set action=kill
set max_counter=15
set counter=0

if "%firefox_flags%" == "" set firefox_flags=-purgecaches -no-remote -jsconsole

if not "%user_version%" == "" goto main

:welcome
echo(
set /p user_version=Enter Mozilla Firefox version:
set user_Version=%user_version:"=%
echo(

if "%user_version%" == "" goto welcome

:main

<nul (set/p dummy=Closing firefox.exe process)

:search
set /a "counter=counter+1"
if %counter% GEQ %max_counter% echo( && echo( && echo ERROR: Script execution failed. Timed-out. && exit /b 1

tasklist | find /i "firefox.exe" >nul 2>&1
set notfound=%errorlevel%

if "%action%" == "kill" (
  if %notfound% EQU 0 (
    call :kill
  ) else (
    set action=wait
  )
) else (
  if %notfound% GTR 0 echo( && goto build
)

timeout /t 1 >nul && <nul (set/p dummy=.)
goto search

:build
echo(
echo Starting build...
echo(

grunt firefox && echo( && echo Starting browser with flags: %firefox_flags% && "%programFiles(x86)%\Mozilla Firefox %user_version%\firefox.exe" %firefox_flags%

goto :EOF

:kill
taskkill /im "firefox.exe" /t >nul 2>&1
goto :EOF

endlocal
goto :EOF
