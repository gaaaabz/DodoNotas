import { Stack } from "expo-router";
import '../src/services/i18n' 
import { registrarPermissao } from "../src/services/notificationService";
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Layout() {
  
  useEffect(() => {
  registrarPermissao();
}, []);
  return <Stack screenOptions = {{ headerShown: false }} />;
}