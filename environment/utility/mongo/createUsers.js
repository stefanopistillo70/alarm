
use admin
db.createUser(
	{
		user: "domusAdmin",
		pwd: "magacirce",
		roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
	}
)