export default ({ config }) => ({
  ...config,
  version: "1.0.0",
  platforms: ["android", "ios"],
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#F5F1E8"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.learnsmart.app"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#2D2D2D"
    },
    package: "com.learnsmart.app",
    versionCode: 1
  },
  plugins: [
    "expo-router",
    [
      "react-native-google-mobile-ads",
      {
        androidAppId: "ca-app-pub-3940256099942544~3347511713",
        iosAppId: "ca-app-pub-3940256099942544~1458002511"
      }
    ]
  ],
  scheme: "learnsmart",
  extra: {
    eas: {
      projectId: "e59be169-5d35-47b6-aca1-c1b2eb835a25"
    }
  }
});
