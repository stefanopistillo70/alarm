

Chef::Log.info("Setup DB")

execute "setup-db-users" do
  cwd "../../../../utility/mongo"
  command "./setupDB.sh << EOF
EOF"
  user node['domusguard']['user']
  group node['domusguard']['user']
  action :run
  not_if { ::File.exists?"/tmp/create_db_user.out" }
end

