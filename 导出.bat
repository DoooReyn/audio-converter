set project=\\Desktop-1ebjls7\resource_other\sound

set output=%~dp0%sound

echo %output%

xcopy %output% %project% /S /Y

pause