import { initializeApp } from "firebase/app";
import * as firebase_auth from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyD5sKwwBVkut_K40B0TXbdDx4tsUtyK01I",
  authDomain: window.location.host,
  databaseURL: "https://reslashstaging-default-rtdb.firebaseio.com",
  projectId: "reslashstaging",
  firebaseCloudURL: "https://us-central1-reslashstaging.cloudfunctions.net",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase_auth.getAuth(app);

/**
 * Function called when clicking the Login/Logout button.
 */
function toggleSignIn() {
  if (!auth.currentUser) {
    var provider = new firebase_auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    firebase_auth
      .signInWithPopup(auth, provider)
      .then(async function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = await result.user.getIdToken();
        // The signed-in user info.
        document.getElementById("quickstart-oauthtoken").textContent = token;
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        // var errorMessage = error.message;
        // // The email of the user's account used.
        // var email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        if (errorCode === "auth/account-exists-with-different-credential") {
          alert(
            "You have already signed up with a different auth provider for that email."
          );
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
      });
  } else {
    auth.signOut();
  }

  document.getElementById("quickstart-sign-in").disabled = true;
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // var displayName = user.displayName;
      // var email = user.email;
      // var emailVerified = user.emailVerified;
      // var photoURL = user.photoURL;
      // var isAnonymous = user.isAnonymous;
      // var uid = user.uid;
      // var providerData = user.providerData;
      document.getElementById("quickstart-sign-in-status").textContent =
        "Signed in";
      document.getElementById("quickstart-sign-in").textContent = "Sign out";
      document.getElementById("quickstart-account-details").textContent =
        JSON.stringify(user, null, "  ");
    } else {
      // User is signed out.
      document.getElementById("quickstart-sign-in-status").textContent =
        "Signed out";
      document.getElementById("quickstart-sign-in").textContent =
        "Sign in with Google";
      document.getElementById("quickstart-account-details").textContent =
        "null";
      document.getElementById("quickstart-oauthtoken").textContent = "null";
    }

    document.getElementById("quickstart-sign-in").disabled = false;
  });

  document
    .getElementById("quickstart-sign-in")
    .addEventListener("click", toggleSignIn, false);
}

window.onload = function () {
  initApp();
};
