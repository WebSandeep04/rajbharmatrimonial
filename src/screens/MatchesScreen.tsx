import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MapPin, Briefcase } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { styles } from '../styles/MatchesScreenStyles';
import TopAppBar from '../components/home/TopAppBar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchConnectionsAndRequests, respondToRequest } from '../store/slices/matchesSlice';

const MatchesScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');
  
  const { connections, requests, loadingConnections, actionLoading } = useAppSelector(state => state.matches);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchConnectionsAndRequests());
    }, [dispatch])
  );

  const handleRespond = (connectionId: number, action: 'accept' | 'reject') => {
    dispatch(respondToRequest({ connectionId, action }));
  };

  const renderConnectionCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
    >
      <Image source={{ uri: item.profile_photo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        
        {item.city && (
          <View style={styles.detailRow}>
            <MapPin size={14} color={colors.textLight} />
            <Text style={styles.detailText}>{item.city.name}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity 
        style={styles.chatIconBtn}
        onPress={() => navigation.navigate('Chat', { 
          targetUser: { id: item.id, name: item.name, avatar: item.profile_photo } 
        })}
      >
        <Text style={styles.chatIconText}>Chat</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderRequestCard = ({ item }: { item: any }) => {
    const sender = item.sender;
    return (
      <View style={styles.requestCard}>
        <Image source={{ uri: sender.profile_photo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }} style={styles.requestImage} />
        <View style={styles.requestContent}>
          <Text style={styles.name}>{sender.name}</Text>
          {sender.city && (
            <View style={styles.detailRow}>
              <MapPin size={14} color={colors.textLight} />
              <Text style={styles.detailText}>{sender.city.name}</Text>
            </View>
          )}
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.acceptBtn, actionLoading && { opacity: 0.5 }]} 
              onPress={() => handleRespond(item.id, 'accept')}
              disabled={actionLoading}
            >
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.rejectBtn, actionLoading && { opacity: 0.5 }]} 
              onPress={() => handleRespond(item.id, 'reject')}
              disabled={actionLoading}
            >
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopAppBar />
      <View style={styles.header}>
        <Text style={typography.h2}>Connections</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'connections' && styles.activeTab]}
          onPress={() => setActiveTab('connections')}
        >
          <Text style={[styles.tabText, activeTab === 'connections' && styles.activeTabText]}>
            My Connections ({connections.length > 99 ? '99+' : connections.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests ({requests.length > 99 ? '99+' : requests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loadingConnections ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : activeTab === 'connections' ? (
        connections.length > 0 ? (
          <FlatList
            data={connections}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderConnectionCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.centerContainer}>
            <Text style={{ color: colors.textLight }}>You have no connections yet.</Text>
            <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate('Search')}>
              <Text style={styles.exploreBtnText}>Explore Matches</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        requests.length > 0 ? (
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRequestCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.centerContainer}>
            <Text style={{ color: colors.textLight }}>No pending requests.</Text>
          </View>
        )
      )}
    </View>
  );
};

export default MatchesScreen;
