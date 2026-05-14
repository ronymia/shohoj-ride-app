// app.config.js — Dynamic Expo config that reads secrets from environment variables.
// This replaces the static app.json so that API keys are NEVER committed to the repo.
// See: https://docs.expo.dev/workflow/configuration/#using-app-config-js

export default {
  expo: {
    name: "Shohoj Ride",
    slug: "shohoj-ride-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "shohoj-ride-app",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.shohoj.ride",
      config: {
        // Reads from .env at build time — never hardcoded
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
      },
    },
    android: {
      package: "com.shohoj.ride",
      config: {
        googleMaps: {
          // Reads from .env at build time — never hardcoded
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
        },
      },
      adaptiveIcon: {
        backgroundColor: "#ffffff",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "server",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "@clerk/expo",
      "expo-router",
      [
        "@stripe/stripe-react-native",
        {
          merchantIdentifier: "merchant.com.shohoj.ride",
          enableGooglePay: true,
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash.png",
          imageWidth: 250,
          resizeMode: "contain",
          backgroundColor: "#021848",
          dark: {
            backgroundColor: "#021848",
          },
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        },
      ],
      [
        "expo-local-authentication",
        {
          faceIDPermission: "Allow $(PRODUCT_NAME) to use Face ID.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
