grunt.initConfig({
  // Arbitrary non-task-specific properties.
  ssh_user: 'jesseshawl@jshawl.com',
  local_site: '_site',
  rsync_delete: false,
  build: {
    // Builds the Jekyll Site
  },
  chmod: {
    // Fixes image Permissions
  deploy: {
  	// Deploys site to production server
  }
});