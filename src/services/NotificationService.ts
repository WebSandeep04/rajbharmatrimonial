import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import api from './api';
import * as RootNavigation from '../navigation/RootNavigation'; // We will need to create this

export class NotificationService {
  /**
   * Request permissions and retrieve FCM token
   */
  static async requestUserPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      await this.getFcmToken();
    }
  }

  /**
   * Fetch token and send to backend
   */
  static async getFcmToken() {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('Your Firebase Token is:', fcmToken);
        // Send to backend
        await api.post('/fcm-token', { fcm_token: fcmToken }).catch(err => {
           console.log('Failed to send token to backend:', err);
        });
      }
    } catch (error) {
      console.log('Failed to get FCM token', error);
    }
  }

  /**
   * Initialize handlers for foreground, background, and quit states
   */
  static initialize() {
    // 1. App in Foreground
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      await this.displayLocalNotification(remoteMessage);
    });

    // 2. App in Background (tapped from notification tray)
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification);
      this.handleNotificationTap(remoteMessage);
    });

    // 3. App Completely Killed (tapped from notification tray)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage.notification);
          setTimeout(() => {
             this.handleNotificationTap(remoteMessage);
          }, 1000); // Give app time to mount
        }
      });
      
    // Listen to Notifee foreground events (when user taps the foreground banner)
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification) {
         // Create a fake remoteMessage to reuse handleNotificationTap
         const remoteMessage = { data: detail.notification.data };
         this.handleNotificationTap(remoteMessage as any);
      }
    });
  }

  /**
   * Handle navigation when a notification is tapped
   */
  static handleNotificationTap(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    if (remoteMessage?.data?.type === 'chat') {
      const userId = remoteMessage.data.userId;
      if (userId) {
        // Navigate to ChatScreen
        RootNavigation.navigate('ChatScreen', { userId: Number(userId) });
      }
    } else if (remoteMessage?.data?.type === 'match') {
      // Navigate to Matches tab or User Profile
      const userId = remoteMessage.data.userId;
      if (userId) {
        RootNavigation.navigate('UserProfile', { userId: Number(userId) });
      } else {
        RootNavigation.navigate('Matches');
      }
    }
  }

  /**
   * Display a high-priority local notification via Notifee
   */
  static async displayLocalNotification(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'New Notification',
      body: remoteMessage.notification?.body || '',
      data: remoteMessage.data,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  }
}

// Background handler (this must be registered in index.js!)
export const registerBackgroundHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    // Notifee or Firebase will automatically show the system tray notification if it contains a `notification` payload.
  });
};

// --- Database Notification API Methods ---

export const fetchNotifications = async (page = 1) => {
  try {
    const response = await api.get(`/notifications?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markNotificationAsRead = async (id: string | number) => {
  try {
    const response = await api.post(`/notifications/${id}/mark-read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.post('/notifications/mark-all-read');
    return response.data;
  } catch (error) {
    throw error;
  }
};
