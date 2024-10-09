import { Fullscreen } from "lucide-react";
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput } from "react-native";

const PlayerDetailScreen = ({ route }: any) => {
  const { player } = route.params;

  const [playerData, setPlayerData] = useState({
    name: player.player,
    age: player.age.toString(),
    price: player.price.toString(),
    captain: player.captain ? "Yes" : "No",
  });

  return (
    <View style={styles.container}>
      <Image source={{ uri: player.image }} style={styles.image} />

      <Text style={styles.title}>Information player</Text>

      <TextInput
        style={styles.input}
        value={playerData.name}
        onChangeText={(text) => setPlayerData({ ...playerData, name: text })}
        placeholder="Name"
      />

      <TextInput
        style={styles.input}
        value={playerData.age}
        onChangeText={(text) => setPlayerData({ ...playerData, age: text })}
        placeholder="Age"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={playerData.price}
        onChangeText={(text) => setPlayerData({ ...playerData, price: text })}
        placeholder="Price"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={playerData.captain}
        onChangeText={(text) => setPlayerData({ ...playerData, captain: text })}
        placeholder="Captain (Yes/No)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  title: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    fontSize: 20,
    fontWeight: "600",
  },
});

export default PlayerDetailScreen;
