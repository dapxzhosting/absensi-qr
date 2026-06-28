import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "-----",
  authDomain: "-----.firebaseapp.com",
  projectId: "absensi-9f088",
  storageBucket: "-----.firebasestorage.app",
  messagingSenderId: "-----",
  appId: "-----",
  measurementId: "-----"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
