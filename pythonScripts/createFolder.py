import os
import sys
import string
import random

def randomFolderName(size=5, chars=string.ascii_uppercase + string.ascii_lowercase):
	x=1
	name=''
	for x in range(size):
		name+=(random.choice(chars))
	return name

cwd = os.getcwd()
folder = randomFolderName()
saveFileTo = './savedFiles'
createFolderTo = os.path.join(saveFileTo,folder)

try:
	while(os.stat(folder)):
		folder = randomFolderName()
except:
	print(folder)
	os.makedirs(createFolderTo)

file1 = 'index.html'
file2 = 'main.css'
file3 = 'main.js'
fileHTML = open(os.path.join(createFolderTo,file1),'w')
fileCSS = open(os.path.join(createFolderTo,file2),'w')
fileJS = open(os.path.join(createFolderTo,file3),'w')
sys.stdout = fileHTML
sys.stdout = fileCSS
sys.stdout = fileJS
