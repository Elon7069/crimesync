import { initializeApp, getApps, getApp } from 'firebase/app'
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmQnO5oLo9uIIQRvhOn4DN2vnKwL2hNFw",
  authDomain: "blockchain-63c2f.firebaseapp.com",
  databaseURL: "https://blockchain-63c2f-default-rtdb.firebaseio.com",
  projectId: "blockchain-63c2f",
  storageBucket: "blockchain-63c2f.firebasestorage.app",
  messagingSenderId: "272076502170",
  appId: "1:272076502170:web:d4544dc05a0152362c9b23"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const db = getFirestore(app)
export const storage = getStorage(app)
export { app }

// --- TYPE DEFINITIONS ---
export interface SosAlert {
  id: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: Timestamp;
  userId: string;
  status: 'active' | 'resolved';
  message: string;
  alertType: 'sos';
}

export interface CrimeReport {
  id: string;
  type: 'theft' | 'harassment' | 'accident' | 'vandalism' | 'assault' | 'burglary';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  severity: 'high' | 'medium' | 'low';
  description: string;
  timestamp: Timestamp;
  reportedBy: string;
  verified: boolean;
  status: 'active' | 'under_review' | 'resolved';
  imageUrl?: string;
  alertType: 'report';
}

export type CombinedAlert = SosAlert | CrimeReport;

// --- FIRESTORE FUNCTIONS ---

export const addSosAlert = async (alertData: Omit<SosAlert, 'id' | 'timestamp' | 'alertType'>) => {
  try {
    const docRef = await addDoc(collection(db, 'sos-alerts'), {
      ...alertData,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Could not save SOS alert");
  }
};

export const addCrimeReport = async (reportData: Omit<CrimeReport, 'id' | 'timestamp' | 'alertType'>) => {
  try {
    const docRef = await addDoc(collection(db, 'crime-reports'), {
      ...reportData,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Could not save crime report");
  }
};

export const listenToCollection = <T>(collectionName: string, callback: (data: T[]) => void): () => void => {
  const q = query(collection(db, collectionName), orderBy("timestamp", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    callback(data);
  }, (error) => {
    console.error(`Error listening to ${collectionName}:`, error);
    callback([]);
  });
  return unsubscribe;
};

export const listenToCombinedAlerts = (callback: (alerts: CombinedAlert[]) => void): () => void => {
  let sosAlerts: SosAlert[] = [];
  let crimeReports: CrimeReport[] = [];

  const combineAndCallback = () => {
    const combined = [...sosAlerts, ...crimeReports].sort((a, b) => 
      (b.timestamp?.toMillis() ?? 0) - (a.timestamp?.toMillis() ?? 0)
    );
    callback(combined);
  };

  const sosUnsubscribe = listenToCollection<SosAlert>('sos-alerts', (data) => {
    sosAlerts = data.map(d => ({...d, alertType: 'sos'}));
    combineAndCallback();
  });

  const reportsUnsubscribe = listenToCollection<CrimeReport>('crime-reports', (data) => {
    crimeReports = data.map(d => ({...d, alertType: 'report'}));
    combineAndCallback();
  });

  return () => {
    sosUnsubscribe();
    reportsUnsubscribe();
  };
};

export const updateDocumentStatus = async (collectionName: string, docId: string, status: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { status });
  } catch (e) {
    console.error("Error updating status: ", e);
    throw new Error("Could not update status");
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw new Error("Could not delete document");
  }
};
