
Chef::Log.info("Setup certs")

node.default["domusguard"]["ssl_cert"]["source"] = "self-signed"
node.default["domusguard"]["ssl_key"]["source"] = "self-signed"

certMongo = ssl_certificate 'mongodb' do
  namespace node['mongodb'] # optional but recommended
  common_name 'mongodb'
  country 'IT'
  city 'Rome'
end
# you can now use the #cert_path and #key_path methods to use in your
# web/mail/ftp service configurations
log "Mongodb certificate is here: #{certMongo.cert_path}"
log "Mongodb private key is here: #{certMongo.key_path}"


certDomus = ssl_certificate 'domusguard' do
  namespace node['domusguard'] # optional but recommended
  common_name 'www.domusguard.com'
  country 'IT'
  city 'Rome'
  key_path node['domusguard']['install_directory']+'/certs/domus.key'
  cert_path node['domusguard']['install_directory']+'/certs/domus.pem'
end
# you can now use the #cert_path and #key_path methods to use in your
# web/mail/ftp service configurations
log "DomusGuard certificate is here: #{certDomus.cert_path}"
log "DomusGuard private key is here: #{certDomus.key_path}"



bash 'setup-certs' do
	code <<-EOH
	cd /etc/ssl
	cat private/mongodb.key certs/mongodb.pem > mongodb.pem
	
	cd #{node['domusguard']['install_directory']}/certs
	chown #{node['domusguard']['user']}:#{node['domusguard']['group']} *
	
	EOH
	action :run

end


