import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

interface Player {
  player: string;
  age: number;
  image: string;
  price: number;
  captain: boolean;
  id: string;
}

type RootStackParamList = {
  Home: undefined;
  PlayerDetail: { player: Player };
};

const HomeScreen = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favoritePlayers, setFavoritePlayers] = useState<string[]>([]);

  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Home">>();

  const fetchPlayers = async () => {
    try {
      const response = await fetch(
        "https://65451fd55a0b4b04436dad71.mockapi.io/Player"
      );
      const data = await response.json();
      setPlayers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const loadFavoritePlayers = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        setFavoritePlayers(JSON.parse(favorites));
      } else {
        setFavoritePlayers([]);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlayers();
      loadFavoritePlayers();
    }, [])
  );

  useEffect(() => {
    fetchPlayers();
    loadFavoritePlayers();
  }, []);

  const toggleFavorite = async (playerId: string) => {
    let updatedFavorites = [...favoritePlayers];

    if (favoritePlayers.includes(playerId)) {
      updatedFavorites = updatedFavorites.filter((id) => id !== playerId);
    } else {
      updatedFavorites.push(playerId);
    }

    setFavoritePlayers(updatedFavorites);

    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const deletePlayer = async (playerId: string) => {
    try {
      await fetch(
        `https://65451fd55a0b4b04436dad71.mockapi.io/Player/${playerId}`,
        {
          method: "DELETE",
        }
      );
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== playerId)
      );
      Alert.alert("Success", "Player deleted successfully!");
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlayers();
    setRefreshing(false);
  };

  const renderRightActions = (playerId: string) => (
    <TouchableOpacity
      onPress={() => deletePlayer(playerId)}
      style={styles.deleteButton}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Player }) => {
    const isFavorite = favoritePlayers.includes(item.id);

    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <TouchableOpacity
          onPress={() => navigation.navigate("PlayerDetail", { player: item })}
        >
          <View style={styles.containerCard}>
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.intro}>
                <View style={styles.nameIntro}>
                  <Text style={styles.name}>{item.player}</Text>
                  <View>
                    {item.captain ? (
                      <Icon name="rebel" size={20} color="#1c1c89" />
                    ) : null}
                  </View>
                </View>
                <Text style={styles.price}>Price: ${item.price}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Icon
                name={isFavorite ? "heart" : "heart-o"}
                size={20}
                color="#cc5151"
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={players}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  containerCard: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginLeft: 4,
    marginRight: 4,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    marginVertical: 10,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  nameIntro: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  intro: {
    display: "flex",
    flexDirection: "column",
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
  },
});

export default HomeScreen;
