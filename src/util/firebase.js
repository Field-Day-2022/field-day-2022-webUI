import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collectionGroup } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const TEST_CONFIG = require("../login.json"); // TODO: revert to deployment database configuration before merge into main

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    type: TEST_CONFIG.type,
    projectId: TEST_CONFIG.project_id,
    privateKeyId: TEST_CONFIG.private_key_id,
    privateKey: TEST_CONFIG.private_key,
    clientEmail: TEST_CONFIG.client_email,
    clientId: TEST_CONFIG.client_id,
    authUri: TEST_CONFIG.auth_uri,
    tokenUri: TEST_CONFIG.token_uri,
    authProviderX509CertUrl: TEST_CONFIG.auth_provider_x509_cert_url,
    clientX509CertUrl: TEST_CONFIG.client_x509_cert_url,
};

/* Original Database Configuration
    const firebaseConfig = {
    apiKey: 'AIzaSyAmjxPpYBWe1gwBvDXka9-Fk4zRuWPQw-Y',
    authDomain: 'asu-field-day.firebaseapp.com',
    databaseURL: 'https://asu-field-day-default-rtdb.firebaseio.com',
    projectId: 'asu-field-day',
    storageBucket: 'asu-field-day.appspot.com',
    messagingSenderId: '470318492986',
    appId: '1:470318492986:web:955f2fa8a51014c6fc7403',
    measurementId: 'G-4NXHBQ69GK',
};
*/

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // export db

// TODO: delete
testRead(); 
async function testRead() {
    //read wildlife data from "WildlifeData" collection, not knowing all of the arbitrary document names
    console.log('Reading from Firestore in WildlifeData');
    const wildlifeCollection = collectionGroup(db, 'WildlifeData');
    const wildlifeDocs = await getDocs(wildlifeCollection);
    wildlifeDocs.forEach((doc) => {
        console.log(doc.id + ': ' + JSON.stringify(doc.data()));
    });
}
