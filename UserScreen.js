import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { firestore, auth } from "./FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import * as Calendar from "expo-calendar";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

const UserScreen = ({ route, navigation }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");

  const userId = auth.currentUser.uid;

  useEffect(() => {
    // Request necessary permissions
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();

    // Load default profile image
    loadDefaultProfileImage();

    // Fetch user's notes when the component mounts
    fetchNotes();

    // Fetch username
    fetchUsername();
  }, [userId]);

  const handleCalendarButtonPress = async (eventTitle) => {
    try {
      // Request calendar permissions
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status === "granted") {
        // Get the list of calendars
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );

        // Assuming there's at least one calendar available
        const defaultCalendar = calendars.find(
          (cal) => cal.allowsModifications
        );

        if (defaultCalendar) {
          const eventDetails = {
            title: eventTitle || "Default Title",
            startDate: new Date(),
            endDate: new Date(Date.now() + 3600 * 1000), // 1 hour duration
            timeZone: "local", // Use the device's time zone
            location: "Event Location",
          };

          await Calendar.createEventAsync(defaultCalendar.id, eventDetails);

          console.log("Event added to the calendar!");
        } else {
          console.log("No calendar with write access found.");
        }
      } else {
        console.log("Calendar permission not granted.");
      }
    } catch (error) {
      console.error("Error adding event to the calendar: ", error.message);
    }
  };

  const fetchUsername = async () => {
    try {
      const userRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.username || "");
      } else {
        console.log("User document not found.");
      }
    } catch (error) {
      console.error("Error fetching username: ", error.message);
    }
  };

  const fetchNotes = async () => {
    try {
      const notesCollection = collection(firestore, "notes");
      const q = query(
        notesCollection,
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );

      const notesSnapshot = await getDocs(q);
      const notesData = notesSnapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        achieved: doc.data().achieved || false,
      }));
      setNotes(notesData);
    } catch (error) {
      console.error("Error fetching notes: ", error.message);
    }
  };

  const addNote = async () => {
    try {
      const notesCollection = collection(firestore, "notes");
      await addDoc(notesCollection, {
        text: newNote,
        userId: userId,
        timestamp: serverTimestamp(),
        achieved: false,
      });
      setNewNote("");
      fetchNotes();
    } catch (error) {
      console.error("Error adding note: ", error.message);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const notesCollection = collection(firestore, "notes");
      const noteDoc = doc(notesCollection, noteId);

      await deleteDoc(noteDoc);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note: ", error.message);
    }
  };

  const loadDefaultProfileImage = async () => {
    try {
      // Load default profile image here
      setProfileImage("default");
    } catch (error) {
      console.error("Error loading default profile image: ", error.message);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.uri);

        const userRef = doc(firestore, "users", userId);
        const existingData = (await getDoc(userRef)).data();
        const updatedProfileImage = result.uri || existingData?.profileImage;

        await updateDoc(userRef, { profileImage: updatedProfileImage });
      }
    } catch (error) {
      console.error("Error picking image: ", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error logging out: ", error.message);
    }
  };

  const NoteItem = ({ item }) => {
    const [achieved, setAchieved] = useState(item.achieved || false);

    const toggleAchieved = async () => {
      try {
        const notesCollection = collection(firestore, "notes");
        const noteDoc = doc(notesCollection, item.id);

        await updateDoc(noteDoc, { achieved: !achieved });
        setAchieved(!achieved);
        fetchNotes();
      } catch (error) {
        console.error("Error toggling achieved status: ", error.message);
      }
    };

    return (
      <View style={styles.noteItem}>
        <TouchableOpacity
          style={[styles.achieveButton, achieved && styles.achievedButton]}
          onPress={toggleAchieved}
        />
        <Text
          style={{
            textDecorationLine: achieved ? "line-through" : "none",
            flex: 1,
            fontSize: 18,
            color: "#373737",
          }}
        >
          {item.text}
        </Text>
        <TouchableOpacity
          style={[styles.deleteButton, achieved && styles.deleteButtonAchieved]}
          onPress={() => deleteNote(item.id)}
        >
          <Text style={styles.buttonText}>x</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: "#bfd4bf" }]}>
      <View style={styles.profileImageContainer} onTouchEnd={pickImage}>
        {profileImage === "default" ? (
          <View style={styles.defaultProfileImage}>
            <Text style={styles.placeholderText}>Tap to select image</Text>
          </View>
        ) : (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        )}
      </View>

      <Text style={styles.welcomeText}>
        Welcome, {username || route.params.username}!
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Write a New Task Here!"
        value={newNote}
        onChangeText={(text) => setNewNote(text)}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.roundedButton, { backgroundColor: "#f8bdbe" }]}
          onPress={(e) => {
            e.persist();
            handleCalendarButtonPress(newNote);
          }}
        >
          <Text style={styles.buttonText}>Add to Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roundedButton, { backgroundColor: "#8ad" }]}
          onPress={addNote}
        >
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.noteContainer}
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteItem item={item} />}
      />

      <TouchableOpacity style={styles.logoutText} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

//css here

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  noteContainer: {
    marginTop: 20,
    marginBottom: 10,
    width: "83%",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 25,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 9,
    backgroundColor: "#f7fcfe",
  },
  noteItem: {
    marginVertical: 5,
    padding: 10,
    borderBottomWidth: 0.3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 2,
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
    marginTop: 30,
    borderWidth: 0.5,
  },
  profileImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#373737",
  },
  placeholderText: {
    textAlign: "center",
    marginTop: 8,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  roundedButton: {
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#373737",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  achieveButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: "#373737",
    backgroundColor: "#f7fcfe",
    borderRadius: 6,
    marginRight: 10,
  },
  achievedButton: {
    backgroundColor: "#1EE893",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,

    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonAchieved: {
    backgroundColor: "#ff8a80",
  },
  logoutText: {
    position: "absolute",
    top: 40,
    right: 13,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.6,
    borderColor: "#f7fcfe",
  },
});

export default UserScreen;
