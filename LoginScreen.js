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
import { auth } from "./FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Sign in with Firebase authentication
      await signInWithEmailAndPassword(auth, email, password);

      // If login is successful, navigate to UserScreen
      const user = auth.currentUser;
      navigation.navigate("User", { username: user.displayName || user.email });
    } catch (error) {
      console.error(error.message);

      // Handle login error (show message, etc.)
      if (error.code === "auth/user-not-found") {
        // Display an alert for user not found
        alert("User not found. Please check your email or sign up.");
      } else if (error.code === "auth/wrong-password") {
        // Display an alert for wrong password
        alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        // Display an alert for invalid email format
        alert("Invalid email format. Please enter a valid email address.");
      } else if (error.code === "auth/invalid-login-credentials") {
        // Display an alert for invalid login credentials
        alert(
          "Invalid login credentials. Please check your email and password."
        );
      } else {
        // For other errors, you might want to handle them differently
        alert("An error occurred during login. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={require("./ImagesToDoList/loginImage.png")}
        style={styles.image}
      />

      <Text style={styles.smallText}>Welcome Back</Text>

      <Text style={styles.title}>Please, Log In.</Text>

      <Text style={styles.label}>Email :</Text>
      <TextInput
        style={styles.input}
        placeholder="welcome@gmail.com"
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#70A0E6",
    padding: 20,
  },
  image: {
    width: 392,
    height: 300,
    resizeMode: "cover",
    marginBottom: 24,
    marginTop: -200,
  },
  smallText: {
    fontSize: 16,
    color: "#F8FBF8",
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    color: "#373737",
    marginBottom: 20,
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
    backgroundColor: "#4947D9",
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

export default LoginScreen;
