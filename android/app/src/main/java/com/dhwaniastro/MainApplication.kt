package com.DhwaniAstro.app

import android.app.Application
import android.media.AudioAttributes
import android.os.Build
import android.util.Log
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.DhwaniAstro.app.callrecording.CallAudioMixerRecorderPackage
import com.DhwaniAstro.app.callrecording.CallRecordingAudioTap
import com.DhwaniAstro.app.callrecording.WebRtcPlayoutTeeInstaller
import com.DhwaniAstro.app.soundpool.RNSoundPoolPackage
import com.oney.WebRTCModule.WebRTCModuleOptions
import org.webrtc.audio.JavaAudioDeviceModule

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              add(RNSoundPoolPackage())
              add(CallAudioMixerRecorderPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(this.applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    configureWebRtcAudioForTwoWayRecording()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }

  /**
   * Install a WebRTC AudioDeviceModule that:
   * 1) Forwards live mic PCM into [CallRecordingAudioTap]
   * 2) On playout start, installs [TeeingAudioTrack] to tap decoded remote PCM
   *
   * Must run before the WebRTC native module is constructed.
   *
   * Note: org.jitsi:webrtc:124.0.0 has no AudioTrackSink API; playout tee is required.
   */
  private fun configureWebRtcAudioForTwoWayRecording() {
    try {
      val attrsBuilder =
          AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_VOICE_COMMUNICATION)
              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        attrsBuilder.setAllowedCapturePolicy(AudioAttributes.ALLOW_CAPTURE_BY_ALL)
      }

      val adm =
          JavaAudioDeviceModule.builder(this)
              .setEnableVolumeLogger(false)
              .setAudioAttributes(attrsBuilder.build())
              .setSamplesReadyCallback { samples ->
                CallRecordingAudioTap.getInstance().onMicSamples(samples)
              }
              .setAudioTrackStateCallback(
                  object : JavaAudioDeviceModule.AudioTrackStateCallback {
                    override fun onWebRtcAudioTrackStart() {
                      // Called on playout thread before write loop — safe swap point.
                      WebRtcPlayoutTeeInstaller.installIfNeeded()
                    }

                    override fun onWebRtcAudioTrackStop() {
                      WebRtcPlayoutTeeInstaller.markStopped()
                    }
                  },
              )
              .createAudioDeviceModule()

      WebRtcPlayoutTeeInstaller.bindAudioDeviceModule(adm)
      WebRTCModuleOptions.getInstance().audioDeviceModule = adm
      Log.i("MainApplication", "WebRTC ADM configured for digital two-way call recording")
    } catch (e: Exception) {
      Log.e("MainApplication", "Failed to configure WebRTC ADM for recording", e)
    }
  }
}
