import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/db";

const googleProvider = new GoogleAuthProvider();

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await createUserProfile(userCredential.user);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfile(result.user);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const createUserProfile = async user => {
  if (!user) {
    console.error("Cannot create profile: No user provided");
    return;
  }

  console.log("Creating user profile for:", user.uid);
  const userRef = doc(db, "users", user.uid);

  try {
    const userSnap = await getDoc(userRef);
    console.log("User document exists:", userSnap.exists());

    if (!userSnap.exists()) {
      const { email, displayName, photoURL } = user;
      const userData = {
        email,
        displayName: displayName || email.split("@")[0],
        photoURL: photoURL || null,
        createdAt: new Date().toISOString(),
        totalConversions: 0,
        totalCharacters: 0,
        totalAudioDuration: 0,
        recentActivity: []
      };

      console.log("Creating new user document with data:", userData);
      await setDoc(userRef, userData);
      console.log("User profile created successfully");
      return userData;
    } else {
      console.log("User profile already exists");
      return userSnap.data();
    }
  } catch (error) {
    console.error("Error in createUserProfile:", {
      code: error.code,
      message: error.message,
      userId: user.uid
    });
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      user => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};
