use admin;
db.createUser(
	{
		user: "admin",
		pwd: "magacirce",
		roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
	}
);
