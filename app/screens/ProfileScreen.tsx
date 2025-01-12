import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";

interface Player {
  player: string;
  age: number;
  image: string;
  price: number;
  captain: boolean;
  id: string;
}

const ProfileScreen = () => {
  const [favoritePlayers, setFavoritePlayers] = useState<Player[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavoritePlayers = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        const favoriteIds = JSON.parse(favorites);
        const response = await fetch(
          "https://65451fd55a0b4b04436dad71.mockapi.io/Player"
        );
        const allPlayers = await response.json();
        const favoritePlayerList = allPlayers.filter((player: Player) =>
          favoriteIds.includes(player.id)
        );
        setFavoritePlayers(favoritePlayerList);
      }
    } catch (error) {
      console.error("Error loading favorite players:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavoritePlayers();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavoritePlayers();
    setRefreshing(false);
  };

  const clearAllFavorites = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to clear all favorite players?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("favorites");
              setFavoritePlayers([]);
              loadFavoritePlayers(); // Gọi lại hàm load để cập nhật trạng thái
            } catch (error) {
              console.error("Error clearing favorites:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const removeFavorite = async (playerId: string) => {
    Alert.alert("Are you sure?", "Delete this player from the favorite list", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          const updatedFavorites = favoritePlayers.filter(
            (player) => player.id !== playerId
          );

          setFavoritePlayers(updatedFavorites);

          try {
            const favoriteIds = updatedFavorites.map((player) => player.id);
            await AsyncStorage.setItem(
              "favorites",
              JSON.stringify(favoriteIds)
            );
          } catch (error) {
            console.error("Error saving favorites:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };


  const renderItem = ({ item }: { item: Player }) => {
    const isFavorite = favoritePlayers.some((player) => player.id === item.id);

    return (
      <View style={styles.containerCard}>
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.nameIntro}>
            <Text style={styles.name}>{item.player}</Text>
            {item.captain ? (
              <Icon name="rebel" size={20} color="#1c1c89" />
            ) : null}
          </View>
        </View>

        <TouchableOpacity onPress={() => removeFavorite(item.id)}>
          <Icon
            name={isFavorite ? "heart" : "heart-o"}
            size={20}
            color="#cc5151"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Information player</Text>
        {favoritePlayers.length > 0 && (
          <TouchableOpacity onPress={clearAllFavorites} style={styles.button}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      {favoritePlayers.length > 0 ? (
        <FlatList
          data={favoritePlayers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={styles.noFavoritesText}>No favorite players found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  containerCard: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderColor: "#000000",
  },
  card: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
  },
  image: {
    width: 50,
    height: 50,
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
  title: {
    color: "#1c1c89",
    fontSize: 20,
    fontWeight: "600",
  },
  noFavoritesText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1c1c89",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    padding: 10,
    borderRadius: 10,
  },
  section: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ProfileScreen;
