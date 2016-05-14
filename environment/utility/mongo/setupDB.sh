#!/bin/bash

USER=$1
PWD=$2

echo exit | mongo admin --eval "db.createUser({user: 'admin',pwd: 'magacirce',roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]})" > /tmp/create_db_user.out
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

echo exit | mongo --username admin --password magacirce --authenticationDatabase admin DomusGuard --eval "db.createUser({user: 'domus',pwd: 'domus1',roles: [ { role: 'dbOwner', db: 'DomusGuard' } ]})" >> /tmp/create_db_user.out
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