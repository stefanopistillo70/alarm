#!/usr/bin/python

import fileinput
import sys
import getopt
import shutil



####################################
#
# Read value from keyboard
#
####################################
def getRawParam(msg, defaultValue):
	ret = defaultValue
	readValue = raw_input(msg)
	if readValue == ' ':
		ret = ''
	else:
		if readValue != '':
			ret = readValue
	return ret


####################################
#
# Read  parameters from keyboard 
#
####################################
def readParameters():

	result = []
	
	print 'Insert parameters ( use <RETURN> for default, <SPACE> for blank value) \n'

	secret = "secret"
	secret = getRawParam('Password [' + secret + '] :', secret)
	result.append(secret)
	
	print '\n\n'
	print 'Defined Values: \n'
	print 'Password :' + secret
	print '\n\n'
	readValue = raw_input('Do you want continue ? : (Y/n) ')
	if readValue != 'Y':
		sys.exit()
		
	return result


####################################
#
# Substitute string in file
#
####################################
def replaceStringFile(sfileIn, sfileOut, sOld, sNew):
	
	fout = open(sfileOut, 'w')
	
	for line in fileinput.FileInput(sfileIn):
		if sOld in line:
			line=line.replace(sOld,sNew)
		
		fout.write(line)
		

####################################
#
# Substitute DBUSER string in file
#
####################################
def replaceSecret(sFileIn, sFileOut, secret):

	sOldSecret = '#SECRET#'
	sNewSecret = secret

	replaceStringFile(sFileIn, sFileOut, sOldSecret, sNewSecret)
	
	

####################################
#
# Copy file
#
####################################
def copyFile(sFileIn, sFileOut):

	fIn = open(sFileIn, 'r')
	fOut =  open(sFileOut, 'w')
	shutil.copyfileobj(fIn, fOut)
	

####################################
#
# Create a file in /tmp containing 
# substituted Script
#
####################################	
def replaceFile(sFileIn, sFileOut, readParams):

	
	sFileTemp1='/tmp/setup.tmp1'
	sFileTemp2='/tmp/setup.tmp2'
	
	copyFile(sFileIn,sFileTemp1);
	
	secret = readParams[0];
	
	replaceSecret(sFileTemp1, sFileTemp2, secret)
	copyFile(sFileTemp2,sFileTemp1);
	
	#copyFile(sFileTemp1,sFileIn);
	
		

####################################
#
# Main
#
####################################

def main(argv=None): 

	if argv is None:
		argv = sys.argv
				
	sFileIn="../environment/chef/cookbooks/domus-guard/attributes/default.rb"
	sFileOut="../environment/chef/cookbooks/domus-guard/attributes/default.rb"

	readParams = readParameters()
	replaceFile(sFileIn, sFileOut, readParams)
	
	
		
if __name__ == "__main__":
    main()

