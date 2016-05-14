

db.createUser(
	{
		user: "domus",
		pwd: "domus1",
		roles: [ { role: "dbOwner", db: "DomusGuard" } ]
	}
)