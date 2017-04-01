import zipfile, os

folder = input()
saveFileTo = './savedFiles'
createFolderTo = os.path.join(saveFileTo,folder)

newZip = zipfile.ZipFile(os.path.join(createFolderTo,'new.zip'), 'a')
for filenames in os.walk(createFolderTo):
	for i in filenames[2]:
		newZip.write(os.path.join(createFolderTo,i), compress_type=zipfile.ZIP_DEFLATED)
newZip.close()