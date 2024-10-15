import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const AddPlayer = () => {
  const [player, setPlayer] = useState("");
  const [age, setAge] = useState("");
  const [price, setPrice] = useState("");
  const [captain, setCaptain] = useState("Yes");
  const [image, setImage] = useState("");

  const handleSavePlayer = () => {
    const playerData = {
      player,
      age,
      price,
      captain,
      image,
    };

    fetch("https://65451fd55a0b4b04436dad71.mockapi.io/Player", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerData),
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert("Success", "Player added successfully!");
        setPlayer("");
        setAge("");
        setPrice("");
        setCaptain("Yes");
        setImage("");
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to add player");
        console.error("Error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <Text style={styles.labelInput}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={player}
          onChangeText={(text) => setPlayer(text)}
        />
      </View>

      <View style={styles.label}>
        <Text style={styles.labelInput}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter age"
          keyboardType="numeric"
          value={age}
          onChangeText={(text) => setAge(text)}
        />
      </View>

      <View style={styles.label}>
        <Text style={styles.labelInput}>Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          keyboardType="numeric"
          value={price}
          onChangeText={(text) => setPrice(text)}
        />
      </View>

      <View style={styles.label}>
        <Text style={styles.labelInput}>Captain</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            style={styles.picker}
            selectedValue={captain}
            onValueChange={(itemValue) => setCaptain(itemValue)}
          >
            <Picker.Item label="Captain" value="Yes" />
            <Picker.Item label="Striker" value="No" />
          </Picker>
        </View>
      </View>

      <View style={styles.label}>
        <Text style={styles.labelInput}>Image</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter image url"
          value={image}
          onChangeText={(text) => setImage(text)}
        />
      </View>

      <View style={styles.buttonSave}>
        <TouchableOpacity style={styles.button} onPress={handleSavePlayer}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    width: "100%",
    gap: 10,
  },
  labelInput: { marginLeft: 2, fontSize: 18, fontWeight: "600" },
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
});

export default AddPlayer;
