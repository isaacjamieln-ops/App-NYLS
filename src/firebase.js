// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";

const firebaseConfig = {
  apiKey: "AIzaSyD_1uAUTH_DOMAIN",
  databaseURL: "https://app-react-cbd1c-default-rtdb.firebaseio.com/",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const useData = (path, transform) => {
  const [snapshot, loading, error] = useObject(ref(database, path));
  
  // Logs para depuración
  console.log("📡 Path:", path);
  console.log("🔄 Loading:", loading);
  console.log("❌ Error:", error);
  
  if (snapshot) {
    console.log("📦 Snapshot existe:", snapshot.exists());
    if (snapshot.exists()) {
      const value = snapshot.val();
      console.log("📊 Datos crudos:", value);
      
      // Aplicar transform si existe
      const data = transform ? transform(value) : value;
      console.log("✨ Datos transformados:", data);
      
      return [data, loading, error];
    } else {
      console.log("⚠️ No hay datos en la ruta:", path);
      return [null, loading, error];
    }
  }

  return [null, loading, error];
};

export { database };