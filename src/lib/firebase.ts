import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCBgAGBf9NpL6dkbSDbuR4wwEFEHvGLq_0",
  authDomain: "absensi-9f088.firebaseapp.com",
  projectId: "absensi-9f088",
  storageBucket: "absensi-9f088.firebasestorage.app",
  messagingSenderId: "882675872469",
  appId: "1:882675872469:web:7eb0759758163658cde85c",
  measurementId: "G-YY1K3YPJ2P"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
