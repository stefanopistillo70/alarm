
Chef::Log.info("Setup cert")

cert = ssl_certificate 'webapp1' do
  namespace node['webapp1'] # optional but recommended
end
# you can now use the #cert_path and #key_path methods to use in your
# web/mail/ftp service configurations
log "WebApp1 certificate is here: #{cert.cert_path}"
log "WebApp1 private key is here: #{cert.key_path}"