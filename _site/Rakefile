ssh_user       = "frege"
local_site     = "_site" # typically called "_site"
rsync_delete   = false

## "build site" 
desc "builds the jekyll _site folder"
task :build do
  system "jekyll build"
  puts "## Building Jekyll Site ##"
end

## "fix image permissions"
desc "fixes image permissions"
task :chmod do
	system "chmod -R 774 /images"
	puts "## Fixing Permissions ##"
end

## "rake deploy" to deploy _site and _images to your server
desc "deploy Jekyll _site and _images to remote server via rsync"
task :deploy => :build do
  system "rsync -avze ssh #{"--delete" unless rsync_delete == false} #{local_site}/ #{ssh_user}:/var/www/jesse.sh/"
  puts "## Deploying _site via rsync ##"
end
