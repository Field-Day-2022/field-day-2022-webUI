import {initializeApp} from "firebase/app";
import {getFirestore, doc, setDoc, getDoc, collectionGroup, getDocs, collection, query, where} from "firebase/firestore";

var json = require("./login.json");

const firebaseApp = initializeApp({
	type: json.type,
	projectId: json.project_id,
	privateKeyId: json.private_key_id,
	privateKey: json.private_key,
	clientEmail: json.client_email,
	clientId: json.client_id,
	authUri: json.auth_uri,
	tokenUri: json.token_uri,
	authProviderX509CertUrl: json.auth_provider_x509_cert_url,
	clientX509CertUrl: json.client_x509_cert_url
});



console.log("Initializing Firestore");
const firestore = getFirestore();
console.log("Initialized Firestore");

const testDoc = doc(firestore, "testCollection/testDocument")

//read wildlife data from "WildlifeData" collection, not knowing all of the arbitrary document names
console.log("Reading from Firestore in WildlifeData");
const toecipCollection = collectionGroup(firestore, "toeClipCodes");
const toeclipDocs = await getDocs(toecipCollection);
var domout = "<table border='1'><tr><th>doc id</th><th>data</th></tr>";
toeclipDocs.forEach((doc) => {
	domout += "<tr>";
	domout += "<td>" + doc.id + "</td>";
	domout += "<td>" + JSON.stringify(doc.data()) + "</td>";
	domout += "</tr>";
});
domout += "</table>";
document.getElementById("output").innerHTML = domout