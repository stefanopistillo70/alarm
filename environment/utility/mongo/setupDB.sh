#!/bin/bash

USER=$1
PWD=$2

echo exit | mongo < createUsers.js > /tmp/create_db_user.out
nerror=`grep -i error /tmp/create_db_user.out | wc -l`
if [ "$nerror" = "0" ]; then
	echo OK
else
	echo ERRORs found in file /tmp/create_db_user.out
	echo ------------ BEGIN file ------------------
	cat /tmp/create_db_user.out
	echo ------------  END file -------------------
	exit 1
fi