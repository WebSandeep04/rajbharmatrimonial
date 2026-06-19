import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Briefcase } from 'lucide-react-native';
import api from '../services/api';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

import TopAppBar from '../components/home/TopAppBar';

const MatchesScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');
  
  const [connections, setConnections] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [connRes, reqRes] = await Promise.all([
        api.get('/connections'),
        api.get('/connections/pending')
      ]);
      setConnections(connRes.data);
      setRequests(reqRes.data.received);
    } catch (err) {
      console.error('Failed to fetch connections data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (connectionId: number, action: 'accept' | 'reject') => {
    try {
      await api.post(`/connections/${connectionId}/respond`, { action });
      fetchData(); // Refresh lists
    } catch (err) {
      console.error(`Failed to ${action} request`, err);
    }
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
            <TouchableOpacity style={styles.acceptBtn} onPress={() => handleRespond(item.id, 'accept')}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} onPress={() => handleRespond(item.id, 'reject')}>
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

      {loading ? (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cardContent: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    ...typography.h3,
    fontSize: 18,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 6,
  },
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  requestImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 12,
  },
  requestContent: {
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  acceptText: {
    color: '#FFF',
    fontWeight: '600',
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  rejectText: {
    color: colors.textDark,
    fontWeight: '600',
  },
  exploreBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  exploreBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  chatIconBtn: {
    backgroundColor: colors.secondary || '#D4A373',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chatIconText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  }
});

export default MatchesScreen;
