Pod::Spec.new do |s|
  s.name         = "RNSoundPool"
  s.version      = "1.0.0"
  s.summary      = "Native SoundPool implementation for React Native"
  s.description  = "A native module for playing sound effects using SoundPool on Android and AVAudioPlayer on iOS"
  s.homepage     = "https://github.com/example/RNSoundPool"
  s.license      = "MIT"
  s.author       = { "Developer" => "developer@example.com" }
  s.platform     = :ios, "13.0"
  s.source       = { :path => "." }
  s.source_files = "*.{h,m,swift}"
  s.requires_arc = true
  s.swift_version = "5.0"
  
  s.dependency "React-Core"
end

