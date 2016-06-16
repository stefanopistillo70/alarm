
user node['domusguard']['user'] do
  supports :manage_home => true
  comment 'User'
  home '/home/'+node['domusguard']['user']
  shell '/bin/bash'
  password node['domusguard']['pwd']
end

group node['domusguard']['group'] do
  action :modify
  members node['domusguard']['user']
  append true
end



directory node['domusguard']['install_directory'] do
  owner node['domusguard']['user']
  group node['domusguard']['group']
  mode '0777'
  action :create
end

directory node['domusguard']['install_directory']+'/certs' do
  owner node['domusguard']['user']
  group node['domusguard']['group']
  mode '0777'
  action :create
end


bash "alias" do
  user node['domusguard']['user']
  group node['domusguard']['group']
  code <<-EOH
  cd /home/#{node['domusguard']['user']}

  export DOMUS_HOME=#{node['domusguard']['install_directory']}
  echo "export DOMUS_HOME=#{node['domusguard']['install_directory']}" >> .bashrc
  echo "alias domus='cd ${DOMUS_HOME}/Domus'" >> .bashrc 
  echo "alias log='cd ${DOMUS_HOME}/Domus/logs'" >> .bashrc
  echo "alias tomcat='cd ${DOMUS_HOME}/tomcat'" >> .bashrc
  EOH
  action :run
end

