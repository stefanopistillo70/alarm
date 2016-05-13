
use admin
db.createUser(
	{
		user: "domusAdmin",
		pwd: "magacirce",
		roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
	}
)

db.createUser(
	{
		user: "domus",
		pwd: "domus1",
		roles: [ { role: "dbOwner", db: "DomusGuard" } ]
	}
)

db.createUser(
	{
		user: "domus4",
		pwd: "domus1",
		roles: [ { role: "dbOwner", db: "DomusGuard" } ]
	}
)