
# Name of the role should match the name of the file
name "vagrant-test-box"

description "Install mongo-db"
default_attributes(
	"nodejs" => {
		"version" => "5.6.0",
		"checksum_linux_x64" => "6b10e446b5a1227673b87d840e9a500f5d2dbd2b806d96e2d81d634c3381a5f1"
	},
	"mongodb3" => {
		"config" => {
			"mongod" => {
					"security" => {
						"authorization" => "enabled"
					}
			}
		}
	}
)


run_list(
	"recipe[mongodb3]",
	"recipe[nodejs::install_from_binary]"
)