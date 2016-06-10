

Chef::Log.info("Setup tar")


bash 'setup' do
	environment "HOME" => node['domusguard']['install_directory']
	cwd ::File.dirname(node['domusguard']['src_filepath'])
	code <<-EOH
	echo "PATH -> #{node['domusguard']['src_filepath']}"
	cd #{node['domusguard']['src_filepath']}
	pwd
	rm -rf #{node['domusguard']['install_directory']}/webapp
	rm -rf #{node['domusguard']['install_directory']}/controller
	cp -r #{node['domusguard']['src_filepath']}/webapp #{node['domusguard']['install_directory']}/webapp
	cp -r #{node['domusguard']['src_filepath']}/controller #{node['domusguard']['install_directory']}/controller
	
	cd #{node['domusguard']['install_directory']}/webapp
	rm -rf ./node_modules
	npm install 
	cd #{node['domusguard']['install_directory']}/controller
	rm -rf ./node_modules
	npm install
	
	EOH
	user node['domusguard']['user']
	group node['domusguard']['user']
	action :run

end


template "/etc/init.d/domus-web" do
  source   "production/domus-web.erb"
  mode     '0644'
  owner    'root'
  group    'root'
end



