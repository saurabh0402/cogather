import os
import sys

folder = 'AISqZ'
saveFileTo = '../savedFiles'
createFolderTo = os.path.join(saveFileTo,folder)

file1 = 'index.html'
readFileHtml = open(os.path.join(createFolderTo,file1),'r')
htmlContent = readFileHtml.read()
print(htmlContent)

writeFileHtml = open(os.path.join(createFolderTo,file1),'a')

content = input()

writeFileHtml.write(content)
writeFileHtml.write('hello there again\n')