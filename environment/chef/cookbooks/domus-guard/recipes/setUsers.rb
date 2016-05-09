
user 'elios' do
  supports :manage_home => true
  comment 'Elios User'
  home '/home/'+node['elios']['user']
  shell '/bin/bash'
  password 'elios'
end

group node['elios']['group'] do
  action :modify
  members node['elios']['user']
  append true
end



directory node['elios']['install_directory'] do
  owner node['elios']['user']
  group node['elios']['group']
  mode '0777'
  action :create
end


bash "alias" do
  user node['elios']['user']
  group node['elios']['group']
  code <<-EOH
  cd /home/#{node['elios']['user']}

  export ELIOS_HOME=#{node['elios']['install_directory']}
  echo "export ELIOS_HOME=#{node['elios']['install_directory']}" >> .bashrc
  echo "alias elios='cd ${ELIOS_HOME}/Elios'" >> .bashrc 
  echo "alias log='cd ${ELIOS_HOME}/Elios/logs'" >> .bashrc
  echo "alias tomcat='cd ${ELIOS_HOME}/tomcat'" >> .bashrc
  EOH
  action :run
end

