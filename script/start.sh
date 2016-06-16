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
NODE_ENV=production;export NODE_ENV;

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


if [ $res -eq 0 ] ; then
	echo "Starting ${MODULE_NAME} service " >> ${LOG_MODULE} 
else
	echo "${MODULE_NAME} service already started with pid :$pid" >> ${LOG_MODULE}
	exit 0
fi


if [ ! -d ${LOG_DIR} ]; then
  mkdir ${LOG_DIR}
fi

echo " `/bin/date` " > ${LOG_MODULE}

nohup  node bin/www >> ${LOG_MODULE} &

pid=$!
echo " Service Started with pid $pid " >> ${LOG_MODULE}
echo $pid > ${DOMUS_HOME}/${MODULE_NAME}.pid


