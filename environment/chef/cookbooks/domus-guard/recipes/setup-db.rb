

Chef::Log.info("Setup DB")

execute "create-db-elios-script" do
  cwd node['elios']['app_name_link']+"/setup/oracle"
  command "cp schema.sql /tmp/schema_elios.sql; cat qrtz_tables_oracle.sql >> /tmp/schema_elios.sql"
  user 'root'
  group 'root' # required
  action :run
  not_if { ::File.exists?"/tmp/schema_elios.sql" }
end

execute "create-db-script" do
  cwd "/git/environment/setup/utility"
  command "chmod  777 *; ./transformDBScript.py /tmp/schema_elios.sql /tmp/elios_create_db.sql << EOF

 
 
 
 
 
 
 
 
 
 
 
 
 
Y

EOF"
  user 'root'
  group 'root' # required
  action :run
  not_if { ::File.exists?"/tmp/elios_create_db.sql" }
end

execute "create-procedures-script" do
  cwd "/git/environment/setup/utility"
  command "chmod  777 *; ./transformDBScript.py ../oracle/procedures.sql /tmp/elios_procedures.sql << EOF

 
 
 
 
 
 
 
 
 
 
 
 
 
Y

EOF"
  user 'root'
  group 'root' # required
  action :run
  not_if { ::File.exists?"/tmp/elios_procedures.sql" }
end

execute "create-insert_data-script" do
  cwd "/git/environment/setup/utility"
  command "./transformDBScript.py ../oracle/insert_data.sql /tmp/insert_data.sql << EOF

 
 
 
 
 
 
 
 
 
 
 
 
 
Y

EOF"
  user 'root'
  group 'root' # required
  action :run
  not_if { ::File.exists?"/tmp/insert_data.sql" }
end


execute "create-elios-db-user" do
  cwd "/git/environment/setup/utility"
  command "./createDBUser.sh #{node['elios']['dbuser']} #{node['elios']['dbpwd']} << EOF
EOF"
  user 'oracle'
  group 'dba' # required
  action :run
  not_if { ::File.exists?"/tmp/create_db_user.out" }
end



execute "install-elios-db" do
  cwd "/git/environment/setup/utility"
  command "./executeDBScript.sh elios_create_db << EOF
EOF"
  user 'oracle'
  group 'dba' # required
  action :run
  not_if { ::File.exists?"/tmp/elios_create_db.out" }
end

execute "insert-data-circe-db" do
  cwd "/git/environment/setup/utility"
  command "./executeDBScript.sh insert_data << EOF
EOF"
  user 'oracle'
  group 'dba' # required
  action :run
  not_if { ::File.exists?"/tmp/insert_data.out" }
end
