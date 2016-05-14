

Chef::Log.info("Setup DB")

execute "setup-db-users" do
  command "cd #{node['domusguard']['src_filepath']}/environment/utility/mongo; ./setupDB.sh << EOF
EOF"
  user node['domusguard']['user']
  group node['domusguard']['user']
  action :run
  not_if { ::File.exists?"/tmp/create_db_user.out" }
end

