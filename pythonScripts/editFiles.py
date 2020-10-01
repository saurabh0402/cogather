import os
import sys

folder = input()
file1 = input()
content = input()
saveFileTo = './savedFiles'
createFolderTo = os.path.join(saveFileTo,folder)

writeFileHtml = open(os.path.join(createFolderTo,file1),'w')
content = content.split('`!')
content = '\n'.join(content)
writeFileHtml.write(content)

if file1 == 'index.html':
	writeFileHtml = open(os.path.join(createFolderTo,'op.html'),'w')
	content = '<!doctype html><html><head><link rel = "stylesheet" type = "text/css" href = "./main.css"></head><body>' + content + '<script src = "./main.js"></script></body></html>'
	writeFileHtml.write(content)



