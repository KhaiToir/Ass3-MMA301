import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PlayerDetailScreen = ({ route }: any) => {
  const { player } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [favoritePlayers, setFavoritePlayers] = useState<string[]>([]);

  const loadFavoritePlayers = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        setFavoritePlayers(JSON.parse(favorites));
      }
    } catch (error) {
      console.error("Error loading favorite players:", error);
    }
  };

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    loadFavoritePlayers();
  }, []);

  const isFavorite = favoritePlayers.includes(player.id);

  const toggleFavorite = async () => {
    let updatedFavorites = [...favoritePlayers];

    if (isFavorite) {
      // Xóa cầu thủ khỏi danh sách yêu thích
      updatedFavorites = updatedFavorites.filter((id) => id !== player.id);
    } else {
      // Thêm cầu thủ vào danh sách yêu thích
      updatedFavorites.push(player.id);
    }

    setFavoritePlayers(updatedFavorites);

    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `https://65451fd55a0b4b04436dad71.mockapi.io/Player/${player.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            player: playerData.player,
            age: Number(playerData.age),
            price: Number(playerData.price),
            captain: playerData.captain === "Yes",
            image: playerData.image,
          }),
        }
      );

      if (response.ok) {
        const updatedPlayer = await response.json();
        setIsEditing(false);
      } else {
        console.error("Failed to update player");
      }
    } catch (error) {
      console.error("Error while updating player:", error);
    }
  };

  const [playerData, setPlayerData] = useState({
    player: player.player,
    image: player.image,
    age: player.age.toString(),
    price: player.price.toString(),
    captain: player.captain ? "Yes" : "No",
  });

  // Hàm làm mới dữ liệu khi kéo xuống
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const response = await fetch(
        `https://65451fd55a0b4b04436dad71.mockapi.io/Player/${player.id}`
      );
      if (response.ok) {
        const refreshedPlayer = await response.json();
        setPlayerData({
          player: refreshedPlayer.player,
          image: refreshedPlayer.image,
          age: refreshedPlayer.age.toString(),
          price: refreshedPlayer.price.toString(),
          captain: refreshedPlayer.captain ? "Yes" : "No",
        });
      }
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }

    setRefreshing(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Image source={{ uri: player.image }} style={styles.image} />

        <View style={styles.section}>
          <View style={styles.sectionInformation}>
            <Text style={styles.title}>Information player</Text>
            <TouchableOpacity onPress={toggleFavorite}>
              <Icon
                name={isFavorite ? "heart" : "heart-o"}
                size={20}
                color={isFavorite ? "#cc5151" : "#000"}
              />
            </TouchableOpacity>
          </View>
          {isEditing ? (
            <TouchableOpacity onPress={handleCancel} style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleUpdate} style={styles.button}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.label}>
          <Text style={styles.labelInput}>Name</Text>
          <TextInput
            editable={isEditing}
            style={styles.input}
            value={playerData.player}
            onChangeText={(text) =>
              setPlayerData({ ...playerData, player: text })
            }
            placeholder="Name"
          />
        </View>

        <View style={styles.label}>
          <Text style={styles.labelInput}>Age</Text>
          <TextInput
            editable={isEditing}
            style={styles.input}
            value={playerData.age}
            onChangeText={(numeric) =>
              setPlayerData({ ...playerData, age: numeric })
            }
            placeholder="Age"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.label}>
          <Text style={styles.labelInput}>Price</Text>
          <TextInput
            editable={isEditing}
            style={styles.input}
            value={playerData.price}
            onChangeText={(numeric) =>
              setPlayerData({ ...playerData, price: numeric })
            }
            placeholder="Price"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.label}>
          <Text style={styles.labelInput}>Captain</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={playerData.captain}
              onValueChange={(itemValue) =>
                setPlayerData({ ...playerData, captain: itemValue })
              }
              style={styles.picker}
              enabled={isEditing}
            >
              <Picker.Item label="Captain" value="Yes" />
              <Picker.Item label="Striker" value="No" />
            </Picker>
          </View>
        </View>

        {isEditing && (
          <>
            <View style={styles.label}>
              <Text style={styles.labelInput}>Image</Text>
              <TextInput
                style={styles.input}
                value={playerData.image}
                onChangeText={(text) =>
                  setPlayerData({ ...playerData, image: text })
                }
                placeholder="Image URL"
              />
            </View>
            <View style={styles.buttonSave}>
              <TouchableOpacity onPress={handleSave} style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    padding: 20,
  },
  label: {
    width: "100%",
    gap: 10,
  },
  labelInput: { marginLeft: 2, fontSize: 18, fontWeight: "600" },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 30,
    borderColor: "#1c1c89",
    borderWidth: 2,
  },
  input: {
    height: 40,
    paddingStart: 20,
    paddingEnd: 20,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000000",
    marginBottom: 15,
  },
  pickerWrapper: {
    height: 40,
    borderColor: "#ccc",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
  },
  picker: {
    width: "100%",
    color: "#000000",
  },
  title: {
    color: "#1c1c89",
    fontSize: 20,
    fontWeight: "600",
  },
  section: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonSave: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
  },
  sectionInformation: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default PlayerDetailScreen;
