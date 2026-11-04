############################################
# React Native Core
############################################
-keep class com.facebook.react.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.react.**

############################################
# Hermes
############################################
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.hermes.reactexecutor.** { *; }

############################################
# React Native Firebase
############################################
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

############################################
# Firebase Core + Crashlytics + Messaging
############################################
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

############################################
# Notifee
############################################
-keep class app.notifee.core.** { *; }
-dontwarn app.notifee.core.**

############################################
# MMKV
############################################
-keep class com.tencent.mmkv.** { *; }

############################################
# Razorpay
############################################
-keep class com.razorpay.** { *; }
-dontwarn com.razorpay.**

############################################
# WebRTC
############################################
-keep class org.webrtc.** { *; }
-dontwarn org.webrtc.**

############################################
# Agora Chat (react-native-agora-chat / Hyphenate)
# libext_sdk.so JNI_OnLoad calls FindClass("com/chatsdk/dispatch/ExtSdkDispatch")
# and then GetStaticMethodID. R8 treats that class as unused and removes it,
# so release startup aborts with "JNI DETECTED ERROR: java_class == null".
# libhyphenate.so likewise looks up com.hyphenate.chat.adapter.* by name.
############################################
-keep class com.chatsdk.** { *; }
-keep class com.hyphenate.** { *; }
-dontwarn com.chatsdk.**
-dontwarn com.hyphenate.**

############################################
# Lottie
############################################
-keep class com.airbnb.lottie.** { *; }
-dontwarn com.airbnb.lottie.**

############################################
# WebView JS Interface
############################################
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

############################################
# Vector Icons
############################################
-keep class com.oblador.vectoricons.** { *; }

############################################
# OkHttp
############################################
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**

############################################
# Gson
############################################
-keep class com.google.gson.** { *; }
-dontwarn com.google.gson.**

############################################
# react-native-blob-util
############################################
-keep class com.reactnativeblobsutil.** { *; }
-dontwarn com.reactnativeblobsutil.**

############################################
# Keep Annotations
############################################
-keepattributes *Annotation*

############################################
# Google Play In-App Updates
############################################
-keep class com.google.android.play.core.** { *; }
-dontwarn com.google.android.play.core.**
-keep class com.agastya.androidinappupdates.** { *; }