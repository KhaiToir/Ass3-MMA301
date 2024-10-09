import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, FlatList, Image, RefreshControl, TouchableOpacity } from "react-native";
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

  // Lấy danh sách cầu thủ yêu thích từ AsyncStorage
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

  // Dùng useFocusEffect để tải lại dữ liệu mỗi khi chuyển sang ProfileScreen
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

  // Hàm để thêm hoặc xóa cầu thủ khỏi danh sách yêu thích
  const toggleFavorite = async (playerId: string) => {
    const isFavorite = favoritePlayers.some((player) => player.id === playerId);

    // Cập nhật danh sách yêu thích
    const updatedFavorites = isFavorite
      ? favoritePlayers.filter((player) => player.id !== playerId)
      : [...favoritePlayers, favoritePlayers.find((player) => player.id === playerId)!];

    setFavoritePlayers(updatedFavorites);

    // Lưu lại danh sách yêu thích vào AsyncStorage
    try {
      const favoriteIds = updatedFavorites.map((player) => player.id);
      await AsyncStorage.setItem("favorites", JSON.stringify(favoriteIds));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
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

        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
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
      <Text style={styles.title}>Favorite Players</Text>
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
    fontSize: 20,
    fontWeight: "600",
  },
  noFavoritesText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfileScreen;
