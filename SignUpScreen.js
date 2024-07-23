import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { auth, firestore } from "./FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        // Display an alert for password mismatch
        alert("Passwords do not match. Please try again.");
        return;
      }

      // Create user with Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user information in Firestore
      const userDocRef = doc(firestore, "users", user.uid);

      // Use setDoc instead of updateDoc to create the document if it doesn't exist
      await setDoc(userDocRef, {
        username,
        email,
      });

      // Navigate to UserScreen and pass the username
      navigation.navigate("User", { username });
    } catch (error) {
      console.error(error.message);
      // Handle signup error (show message, etc.)
    }
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={require("./ImagesToDoList/signinImage.png")}
        style={styles.image}
      />

      <Text style={styles.smallText}>Hi There!</Text>

      <Text style={styles.title}>Let's Get Started</Text>

      <Text style={styles.label}>Your Username :</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Email :</Text>
      <TextInput
        style={styles.input}
        placeholder="hello@gmail.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password :</Text>
      <TextInput
        style={styles.input}
        placeholder="***************"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirm Password :</Text>
      <TextInput
        style={styles.input}
        placeholder="***************"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9dd7b",
    padding: 20,
  },
  image: {
    width: 392,
    height: 300,
    resizeMode: "cover",
    marginBottom: 0,
    marginTop: -120,
  },
  smallText: {
    fontSize: 16,
    color: "#4a4a4a",
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    color: "#373737",
    marginBottom: 16,
    marginTop: -2,
    fontWeight: "bold",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    fontSize: 14,
    color: "#4a4a4a",
    marginBottom: 1,
  },
  input: {
    height: 40,
    width: "83%",
    backgroundColor: "white",
    borderColor: "#373737",
    borderWidth: 1,
    borderRadius: 9,
    marginBottom: 6,
    paddingLeft: 15,
  },
  button: {
    width: "83%",
    height: 50,
    backgroundColor: "#FE5C4F",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#373737",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
