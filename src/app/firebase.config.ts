import * as firebase from 'firebase';

import { AuthMethods, AuthProviders } from 'angularfire2';

export const FIREBASE_CONFIG = {
    apiKey: 'testyAnTqAk9ECsguYTqrIU_a4869kBcoP-ahQ',
    authDomain: 'wishare-dev.firebaseapp.com',
    databaseURL: 'https://test.firebaseio.com',
    storageBucket: 'wishare-dev.appspot.com',
    messagingSenderId: '936740482129'
};

export const FIREBASE_AUTH = {
    provider: AuthProviders.Google,
    method: AuthMethods.Redirect,
};

export class FirebaseAuthentication {
    public static CONFIG = FIREBASE_CONFIG;
    public static AUTH_CONFIG = FIREBASE_AUTH;
}
