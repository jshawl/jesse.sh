debug = :true
css_dir = "css"
sass_dir = "scss"

require 'autoprefixer-rails'
require 'csso'

on_stylesheet_saved do |file|
  css = File.read(file)
  File.open(file,'w') do |io|
    if debug == :true
      io << AutoprefixerRails.process(css)
    else
      io << Csso.optimize(AutoprefixerRails.process(css))
    end
  end
end
