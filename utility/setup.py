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
	
	print 'Insert parameters ( use <RETURN> for default, <SPACE> for blank value) \n'

	googleClientID = "clientid"
	googleClientID = getRawParam('Password [' + googleClientID + '] :', googleClientID)
	result.append(googleClientID)

	print 'Insert parameters ( use <RETURN> for default, <SPACE> for blank value) \n'

	googleClientSecret = "googleClientSecret"
	googleClientSecret = getRawParam('Password [' + googleClientSecret + '] :', googleClientSecret)
	result.append(googleClientSecret)


	print 'Insert parameters ( use <RETURN> for default, <SPACE> for blank value) \n'

	googleClientCallbackUrl = "googleClientCallbackUrl"
	googleClientCallbackUrl = getRawParam('Password [' + googleClientCallbackUrl + '] :', googleClientCallbackUrl)
	result.append(googleClientCallbackUrl)


	print 'Insert parameters ( use <RETURN> for default, <SPACE> for blank value) \n'

	googleClientGCM = "googleClientGCM"
	googleClientGCM = getRawParam('Password [' + googleClientGCM + '] :', googleClientGCM)
	result.append(googleClientGCM)
	
	print '\n\n'
	print 'Defined Values: \n'
	print 'Password :' + secret
	print '\n\n'
	print '\n\n'
	print 'Defined Values: \n'
	print 'Google Client ID :' + googleClientID
	print '\n\n'
	print '\n\n'
	print 'Defined Values: \n'
	print 'Google Client Secret :' + googleClientSecret
	print '\n\n'
	print '\n\n'
	print 'Defined Values: \n'
	print 'Google Client Callback Url :' + googleClientCallbackUrl
	print '\n\n'
	print '\n\n'
	print 'Defined Values: \n'
	print 'Google Client GCM :' + googleClientGCM
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
# Substitute SECRET string in file
#
####################################
def replaceSecret(sFileIn, sFileOut, secret):

	sOldSecret = '#SECRET#'
	sNewSecret = secret

	replaceStringFile(sFileIn, sFileOut, sOldSecret, sNewSecret)
	

####################################
#
# Substitute GOOGLE_CLIENT_ID string in file
#
####################################
def replaceGoogleClientID(sFileIn, sFileOut, googleClientID):

	sOldGoogleClientID = '#GOOGLE_CLIENT_ID#'
	sNewGoogleClientID = googleClientID

	replaceStringFile(sFileIn, sFileOut, sOldGoogleClientID, sNewGoogleClientID)


####################################
#
# Substitute GOOGLE_CLIENT_SECRET string in file
#
####################################
def replaceGoogleClientSecret(sFileIn, sFileOut, googleClientSecret):

	sOldGoogleClientSecret = '#GOOGLE_CLIENT_SECRET#'
	sNewGoogleClientSecret = googleClientSecret

	replaceStringFile(sFileIn, sFileOut, sOldGoogleClientSecret, sNewGoogleClientSecret)



####################################
#
# Substitute GOOGLE_CLIENT_CALLBACK_URL string in file
#
####################################
def replaceGoogleClientCallbackUrl(sFileIn, sFileOut, googleClientCallbackUrl):

	sOldGoogleClientCallbackUrl = '#GOOGLE_CLIENT_CALLBACK_URL#'
	sNewGoogleClientCallbackUrl = googleClientCallbackUrl

	replaceStringFile(sFileIn, sFileOut, sOldGoogleClientCallbackUrl, sNewGoogleClientCallbackUrl)

	
####################################
#
# Substitute GOOGLE_CLIENT_GCM string in file
#
####################################
def replaceGoogleClientGCM(sFileIn, sFileOut, googleClientGCM):

	sOldGoogleClientGCM = '#GOOGLE_CLIENT_GCM#'
	sNewGoogleClientGCM = googleClientGCM

	replaceStringFile(sFileIn, sFileOut, sOldGoogleClientGCM, sNewGoogleClientGCM)
	

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
	googleClientID = readParams[1];
	googleClientSecret = readParams[2];
	googleClientCallbackUrl = readParams[3];
	googleClientGCM = readParams[4];
	
	replaceSecret(sFileTemp1, sFileTemp2, secret)
	copyFile(sFileTemp2,sFileTemp1);
	
	replaceGoogleClientID(sFileTemp1, sFileTemp2, googleClientID)
	copyFile(sFileTemp2,sFileTemp1);
	
	replaceGoogleClientSecret(sFileTemp1, sFileTemp2, googleClientSecret)
	copyFile(sFileTemp2,sFileTemp1);

	replaceGoogleClientCallbackUrl(sFileTemp1, sFileTemp2, googleClientCallbackUrl)
	copyFile(sFileTemp2,sFileTemp1);
	
	replaceGoogleClientGCM(sFileTemp1, sFileTemp2, googleClientGCM)
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

