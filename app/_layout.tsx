import { Stack } from "expo-router";
import "./global.css"
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://9a4e174e56b0d36f33ac6c2326919ca0@o4510664628699136.ingest.de.sentry.io/4510664648491088',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Evita que la pantalla de carga se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });
  // Ocultamos la pantalla de carga cuando las fuentes estén listas
  useEffect(() => {
    if (error) {
      throw error;
    }

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Si las fuentes no han cargado, no mostramos nada
  if (!fontsLoaded && !error) {
    return null;
  }
  return <Stack screenOptions={{headerShown: false}}/>;
});