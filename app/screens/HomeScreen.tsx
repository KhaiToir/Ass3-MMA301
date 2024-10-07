import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface Player {
  player: string;
  old: number;
  image: string;
  price: number;
  caption: boolean;
  id: string;
}

type RootStackParamList = {
  Home: undefined;
  PlayerDetail: { player: Player };
};

const HomeScreen = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchPlayers();
  }, []);

  const renderItem = ({ item }: { item: Player }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("PlayerDetail", { player: item })}
    >
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.intro}>
          <Text style={styles.name}>{item.player}</Text>
          <Text>Age: {item.old}</Text>
          <Text>Price: ${item.price}</Text>
          <Text>Caption: {item.caption ? "Yes" : "No"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={players}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    display: "flex",
    gap: 20,
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  intro: {
    display: "flex",
    flexDirection: "column",
  },
});

export default HomeScreen;
