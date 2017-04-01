import os
import sys

folder = input()
content = input()
saveFileTo = './savedFiles'
createFolderTo = os.path.join(saveFileTo,folder)

file1 = 'index.html'

writeFileHtml = open(os.path.join(createFolderTo,file1),'w')
writeFileHtml.write(content)

#readFileHtml = open(os.path.join(createFolderTo,file1),'r')
#htmlContent = readFileHtml.read()
#print(htmlContent)