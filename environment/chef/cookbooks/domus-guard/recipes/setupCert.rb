
Chef::Log.info("Setup tomcat cert")


# Tomcat
bash "cert-tomcat" do
  user node['elios']['user']
  group node['elios']['group']
  code <<-EOH
  if [ -f "#{node['elios']['install_directory']}/tomcat/catalina.pid" ]
  then
     PID=`cat #{node['elios']['install_directory']}/tomcat/catalina.pid`
     kill -9 $PID
  fi
  
  mkdir /home/elios/certs
  cd /home/elios/certs
  cp /tmp/KeyStore.jks .
  cp /tmp/TrustKeyStore.jks .
   
  cp /tmp/server.xml #{node['elios']['install_directory']}/tomcat/conf
  #{node['elios']['install_directory']}/tomcat/bin/startup.sh
  EOH
  action :run
end