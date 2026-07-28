import Foundation
import AVFoundation

@objc(RNSoundPool)
class RNSoundPool: NSObject {
  
  private var audioPlayers: [String: AVAudioPlayer] = [:]
  private var loopingPlayers: [String: AVAudioPlayer] = [:]
  
  override init() {
    super.init()
    setupAudioSession()
  }
  
  private func setupAudioSession() {
    do {
      try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
      try AVAudioSession.sharedInstance().setActive(true)
    } catch {
      print("RNSoundPool: Failed to setup audio session: \(error)")
    }
  }
  
  @objc
  func playSound(_ soundName: String, loop: Bool, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async { [weak self] in
      guard let self = self else { return }
      
      // Try to find the sound file
      var soundURL: URL?
      
      // Check in main bundle
      if let path = Bundle.main.path(forResource: soundName, ofType: "mp3") {
        soundURL = URL(fileURLWithPath: path)
      } else if let path = Bundle.main.path(forResource: soundName, ofType: "wav") {
        soundURL = URL(fileURLWithPath: path)
      }
      
      guard let url = soundURL else {
        print("RNSoundPool: Sound file not found: \(soundName)")
        resolve(false)
        return
      }
      
      do {
        let player = try AVAudioPlayer(contentsOf: url)
        player.volume = 1.0
        
        if loop {
          player.numberOfLoops = -1
          self.loopingPlayers[soundName] = player
        } else {
          player.numberOfLoops = 0
        }
        
        player.prepareToPlay()
        let success = player.play()
        
        if loop {
          self.audioPlayers[soundName] = player
        }
        
        print("RNSoundPool: Playing \(soundName), loop: \(loop), success: \(success)")
        resolve(success)
      } catch {
        print("RNSoundPool: Error playing sound: \(error)")
        resolve(false)
      }
    }
  }
  
  @objc
  func stopSound(_ soundName: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async { [weak self] in
      if let player = self?.audioPlayers[soundName] {
        player.stop()
        self?.audioPlayers.removeValue(forKey: soundName)
      }
      if let player = self?.loopingPlayers[soundName] {
        player.stop()
        self?.loopingPlayers.removeValue(forKey: soundName)
      }
      resolve(nil)
    }
  }
  
  @objc
  func stopAllSounds(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async { [weak self] in
      self?.audioPlayers.values.forEach { $0.stop() }
      self?.loopingPlayers.values.forEach { $0.stop() }
      self?.audioPlayers.removeAll()
      self?.loopingPlayers.removeAll()
      resolve(nil)
    }
  }
  
  @objc
  func preloadSound(_ soundName: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Preloading is handled automatically by AVAudioPlayer
    // Just verify the file exists
    DispatchQueue.main.async {
      if let path = Bundle.main.path(forResource: soundName, ofType: "mp3") {
        print("RNSoundPool: Sound file found for preload: \(soundName)")
        resolve(true)
      } else {
        print("RNSoundPool: Sound file not found for preload: \(soundName)")
        resolve(false)
      }
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

