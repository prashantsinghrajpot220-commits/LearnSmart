# AdMob Setup Guide for LearnSmart

This document explains how to set up and configure Google AdMob for the LearnSmart application.

## 1. Prerequisites
- A Google AdMob account.
- An app created in the AdMob console (one for Android and one for iOS).

## 2. Get Your Credentials

### AdMob App ID
1. Log in to the [AdMob console](https://apps.admob.com/).
2. Go to **Apps** > **All apps**.
3. Copy the **App ID** for both Android and iOS.
   - Format: `ca-app-pub-xxxxxxxxxxxxxxxx~xxxxxxxxxx`

### Ad Unit IDs
1. In the AdMob console, select your app.
2. Go to **Ad units** > **Add ad unit**.
3. Create a **Banner** ad unit for the Lesson View.
4. Create another **Banner** ad unit for the Quiz View.
5. Copy the **Ad unit IDs**.
   - Format: `ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx`

## 3. Configuration

### Step 1: Update `app.json`
Update the `react-native-google-mobile-ads` plugin configuration in `app.json` with your real App IDs:

```json
"plugins": [
  "expo-router",
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "YOUR_ANDROID_APP_ID",
      "iosAppId": "YOUR_IOS_APP_ID"
    }
  ]
]
```

### Step 2: Environment Variables
Create a `.env` file in the root of the project (copy from `.env.example`) and add your Ad Unit IDs using the `EXPO_PUBLIC_` prefix so Expo can load them:

```env
EXPO_PUBLIC_ADMOB_BANNER_LESSON_ID=ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx
EXPO_PUBLIC_ADMOB_BANNER_QUIZ_ID=ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx
```

*Note: Expo automatically loads environment variables prefixed with `EXPO_PUBLIC_` into `process.env`.*

## 4. Testing

### Using Test IDs
During development, the app is configured to use Google's official test ad unit IDs. This prevents policy violations and invalid clicks.

- **Banner Android/iOS**: `ca-app-pub-3940256099942544/6300978111`

### Verifying on Mobile
1. Ensure you are using a physical device or a simulator with Google Play Services.
2. The ads should appear at the bottom of the Lesson screen and after completing a Quiz.

## 5. Implementation Details

- **Component**: `components/AdContainer.tsx`
- **Config**: `config/adConfig.ts`
- **SDK**: `react-native-google-mobile-ads`

### Handling Errors
The `AdContainer` component handles loading errors gracefully. If an ad fails to load, it will display a subtle placeholder instead of breaking the UI.

### Privacy & Consent
For production, ensure you implement a consent flow (UMD/GDPR) as required by Google's policies. This implementation uses `requestNonPersonalizedAdsOnly: true` by default as a baseline.
