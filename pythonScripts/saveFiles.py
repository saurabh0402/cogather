import zipfile, os

folder = input()
saveFileTo = './savedFiles'
createFolderTo = os.path.join(saveFileTo,folder)
abs_src = os.path.abspath(createFolderTo)

newZip = zipfile.ZipFile(os.path.join(createFolderTo, folder + '.zip'), 'w', zipfile.ZIP_DEFLATED)

absname1 = os.path.abspath(os.path.join(createFolderTo,'index.html'))
absname2 = os.path.abspath(os.path.join(createFolderTo,'main.css'))
absname3 = os.path.abspath(os.path.join(createFolderTo,'main.js'))

arcname1 = absname1[len(abs_src) + 1:]
arcname2 = absname2[len(abs_src) + 1:]
arcname3 = absname3[len(abs_src) + 1:]

#print('zipping %s as %s ' % (absname,arcname))
newZip.write(absname1, arcname1)
newZip.write(absname2, arcname2)
newZip.write(absname3, arcname3)


newZip.close()