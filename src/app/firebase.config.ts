import {AuthMethods, AuthProviders} from "angularfire2";
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDuxcKRKTlMJAlhgHp-xAggNooIS9v9VNc",
  authDomain: "beautiful-day-ng2.firebaseapp.com",
  databaseURL: "https://beautiful-day-ng2.firebaseio.com",
  storageBucket: "beautiful-day-ng2.appspot.com",
  messagingSenderId: "592308348960"
};

export const FIREBASE_AUTH = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};
