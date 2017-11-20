import firebase from "firebase";

firebase
  .initializeApp({
    apiKey: "AIzaSyA1Pm1LlGnCjUxemF4XXmzim8TfMYqYOBg",
    authDomain: "giggie-login.firebaseapp.com",
    databaseURL: "https://giggie-login.firebaseio.com",
    projectId: "giggie-login",
    storageBucket: "",
    messagingSenderId: "826648099577"
  })
  .auth()
  .setPersistence("local");

var auth = firebase.auth();

auth.createAndSetUserWithEmailAndPassword = function (email, password) {
  return auth
    .createUserWithEmailAndPassword(email, password)
    .then(function (user) {
      return setToken(user);
    });
};

function deleteCookie() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function setCookie(cname, cvalue) {
  var d = new Date();
  d.setTime(d.getTime() + 60 * 1000 * 55);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires;
}

function setToken(user) {
  if (!user) {
    return Promise.resolve().then(deleteCookie());
  } else {
    return user.getIdToken().then(function (token) {
      setCookie("token", token);
      return user;
    });
  }
}

export default auth;