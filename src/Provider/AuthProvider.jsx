import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import app from "../Firebase/Firebase.config";

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Set persistence to LOCAL (survives page reloads)
setPersistence(auth, browserLocalPersistence);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (error) {
            console.error("Failed to parse saved user:", error);
            localStorage.removeItem("user");
          }
        } else {
          // If no saved user but Firebase user exists, create from Firebase
          const userData = {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            uid: firebaseUser.uid,
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } else {
        // Check for regular login (non-Firebase)
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (error) {
            console.error("Failed to parse saved user:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createUser = async ({ name, email, password, confirmPassword }) => {
    setLoading(true);
    try {
      console.log("Creating user with:", { name, email });
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        confirmPassword,
      });

      console.log("Registration response:", response.data);
      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error("Registration error in AuthProvider:", error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Build a base user object from Firebase in case backend is unavailable
      const firebaseUserData = {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        uid: firebaseUser.uid,
      };

      // Try to register/login with backend to get a JWT token
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          password: `google_${firebaseUser.uid}`,
        });

        const { token, user: userData } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return response.data;
      } catch (registerError) {
        // Backend unavailable or user already exists — fall back to Firebase session
        console.warn(
          "Backend registration failed, using Firebase session:",
          registerError?.response?.status ?? registerError.message,
        );
        setUser(firebaseUserData);
        localStorage.setItem("user", JSON.stringify(firebaseUserData));
        return { user: firebaseUserData };
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      // Sign out from Firebase if user signed in with Google
      await firebaseSignOut(auth);
    } catch (error) {
      console.log("Firebase signout error (may not be signed in):", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);
    return Promise.resolve();
  };

  const resetPassword = () => {
    throw new Error("Password reset not implemented yet");
  };

  const authData = {
    user,
    setUser,
    loading,
    createUser,
    signIn,
    googleSignIn,
    resetPassword,
    logOut,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
