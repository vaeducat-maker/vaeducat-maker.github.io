# Sõnatreener Õpe — Android Test
Android WebView wrapper for https://edukass.ee/games/kiire-sonatreener/.
Package: ee.edukass.sonatreener.safe. Android 8+. Requires internet.
No address bar, no opening external URLs, no JavaScript bridge. Internet permission only.
Test Family Link: allow Sõnatreener Õpe unlimited time while keeping Chrome time-limited.
This is an experiment: WebView may still be affected by Chrome limits on some devices.
Build: gradle assembleDebug with JDK 17, Android SDK 35. Temporary debug signature means later updates may require uninstalling the test app and losing its local data. Use a private signing key for a permanent release.
