import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  set, 
  update,
  push 
} from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRAJ7eXCJjWvts1ExAf6OENZtfq9NrFvE",
  authDomain: "app-react-cbd1c.firebaseapp.com",
  databaseURL: "https://app-react-cbd1c-default-rtdb.firebaseio.com",
  projectId: "app-react-cbd1c",
  storageBucket: "app-react-cbd1c.firebasestorage.app",
  messagingSenderId: "434683676139",
  appId: "1:434683676139:web:5f052ab47b791638efc5ae"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// 🔹 Leer datos
export const useData = (path, transform) => {
  const [snapshot, loading, error] = useObject(ref(database, path));
  
  if (snapshot && snapshot.exists()) {
    const value = snapshot.val();
    return [transform ? transform(value) : value, loading, error];
  }

  return [null, loading, error];
};

// 🔹 Escribir datos
export const writeData = (path, data) => {
  if (!auth.currentUser) {
    return Promise.reject(new Error("Debes iniciar sesión"));
  }
  return set(ref(database, path), data);
};

// 🔹 Actualizar datos
export const updateData = (path, data) => {
  if (!auth.currentUser) {
    return Promise.reject(new Error("Debes iniciar sesión"));
  }
  return update(ref(database, path), data);
};

// 🔹 Agregar elemento
export const pushData = (path, data) => {
  if (!auth.currentUser) {
    return Promise.reject(new Error("Debes iniciar sesión"));
  }
  return push(ref(database, path), data);
};

// 🔹 Login Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// 🔹 Logout
export const firebaseSignOut = () => signOut(auth);

// 🔹 Estado usuario
export const useUserState = () => useAuthState(auth);

export { database, auth };