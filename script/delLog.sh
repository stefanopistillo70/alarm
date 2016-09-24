#!/bin/bash


PER_LOG_FILESYS=10;

DOMUS_HOME=/opt/domus
LOG_DIR=${DOMUS_HOME}/logs


find ${LOG_DIR} -name "*.log" -mtime +$PER_LOG_FILESYS -type f -exec rm {} \;


echo ' '
echo `date`
echo ' '

exit
