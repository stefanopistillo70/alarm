#! /bin/bash

if [ "$#" -ne 1 ]; then
	echo "Illegal number of parameters"
	echo "Usage: start.sh <module_name>"
	exit 1;
fi

MODULE_NAME=$1
DOMUS_HOME=/opt/domus
LOG_DIR=${DOMUS_HOME}/logs
LOG_MODULE=${LOG_DIR}/${MODULE_NAME}.out

cd ${DOMUS_HOME}/${MODULE_NAME}
if [ $? -ne 0 ]; then
	echo "Error no module ${MODULE_NAME} defined."
	exit 1;
fi

if [ -f ${DOMUS_HOME}/${MODULE_NAME}.pid ];
then
	pid=`/bin/cat ${DOMUS_HOME}/${MODULE_NAME}.pid` 
	res=`/bin/ps -ef | /bin/grep $pid | /bin/grep -v grep | /usr/bin/wc -l`
else
   res=0
fi


if [ $res -ne 0 ] ; then
	echo "Stopping ${MODULE_NAME} service with $pid" >> ${LOG_MODULE} 
	kill -15 $pid
else
	echo "${MODULE_NAME} service already stopped " >> ${LOG_MODULE}
	exit 0
fi



