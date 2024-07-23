import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={require("./ImagesToDoList/homescreenImage.png")}
        style={styles.image}
      />

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Make Your Day</Text>
        <Text style={styles.subtitle}>
          More Productive<Text style={styles.dot}>.</Text>
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={() => navigation.navigate("SignUp")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ecb6b6",
    paddingBottom: 50,
  },
  image: {
    width: 440,
    height: 400,
    resizeMode: "cover",
    marginBottom: 0,
    marginTop: -120,
  },
  titleContainer: {
    paddingHorizontal: 30,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    color: "#4a4a4a",
    textAlign: "left",
    letterSpacing: -0.2,
    marginBottom: 14,
    marginTop: -40,
  },
  subtitle: {
    fontSize: 37,
    color: "#00a378",
    textAlign: "left",
    paddingLeft: 33,
    letterSpacing: -0.2,
    //fontWeight: "bold",
  },
  dot: {
    color: "#4a4a4a",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: 230,
    height: 67,
    borderRadius: 40,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
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
  loginButton: {
    backgroundColor: "#afdcfd",
  },
  signUpButton: {
    backgroundColor: "#F8FBF8",
  },
  buttonText: {
    color: "#373737",
    fontSize: 24,
  },
});

export default HomeScreen;
