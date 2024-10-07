import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const PlayerDetailScreen = ({ route }: any) => {
  const { player } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: player.image }} style={styles.image} />
      <Text style={styles.name}>{player.player}</Text>
      <Text>Age: {player.old}</Text>
      <Text>Price: ${player.price}</Text>
      <Text>Caption: {player.caption ? "Yes" : "No"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default PlayerDetailScreen;
