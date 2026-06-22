import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchConnectionsAndRequests } from '../store/slices/matchesSlice';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import MatchesScreen from '../screens/MatchesScreen';
import SearchScreen from '../screens/SearchScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { Home, Heart, Search, MessageCircle, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { requests } = useAppSelector((state) => state.matches);
  const { rooms } = useAppSelector((state) => state.chat);
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchConnectionsAndRequests());
  }, [dispatch]);

  const pendingRequestsCount = requests?.length || 0;
  
  // Calculate total unread messages
  const currentUserId = userInfo?.id?.toString() || '';
  const unreadMessagesCount = rooms?.reduce((total, room) => {
    const count = room.unreadCounts?.[currentUserId] || 0;
    return total + count;
  }, 0) || 0;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E5E7EB',
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
          tabBarBadge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.primary, color: '#fff' }
        }}
      />
      <Tab.Screen
        name="Explore"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
          tabBarBadge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.primary, color: '#fff' }
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
