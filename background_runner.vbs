Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' Command to run: npm run dev
' We wrap it in cmd /c to handle the redirection to log file
' WindowStyle 0 = Hide
' WaitOnReturn = False (Don't wait for it to finish)
WshShell.Run "cmd /c npm run dev > bluecaller.log 2>&1", 0, False
