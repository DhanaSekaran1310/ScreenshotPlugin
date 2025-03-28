require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ScreenshotPlugin"
  s.version          = '1.0.0'
  s.summary          = 'A custom React Native plugin'
  s.homepage         = 'https://github.com/yourusername/react-native-custom-plugin'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Dhanasekaran_S' => 'dhana@gmail.com' }
  s.source           = { :git => 'https://github.com/dhana/react-native-custom-plugin.git', :tag => '1.0.0' }
  s.platforms        = { :ios => '11.0' }
  s.source_files     = 'ios/**/*.{h,m,swift}'

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.dependency 'React'

# Use install_modules_dependencies helper to install the dependencies if React Native version >=0.71.0.
# See https://github.com/facebook/react-native/blob/febf6b7f33fdb4904669f99d795eba4c0f95d7bf/scripts/cocoapods/new_architecture.rb#L79.
if respond_to?(:install_modules_dependencies, true)
  install_modules_dependencies(s)
else
  s.dependency "React-Core"
end
end
