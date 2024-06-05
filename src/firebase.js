import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}
const Auth = firebase.auth();
const storage = firebase.storage();
export const DB = firebase.firestore();
export const signin = async ({ email, password }) => {
    const { user } = await Auth.signInWithEmailAndPassword(email, password); //firebase에 유저테이블과 입력받은 이메일 비번을 비교하여 유저를 반환해준다
    return user;
};
const UploadImage = async (uri) => {
    if (uri.startsWith('https')) {
        //문자열이 특정문자로 시작하는지 확인하여 bool타입변수를 반환한다
        return uri; //이미 웹 이미지주소이기때문에 그냥 반환하면됌
    }

    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest(); // 서버와 통신하기위한 통신객체
        xhr.onload = function () {
            resolve(xhr.response);
        }; //onload는 서버에 요청한 결과를 받은상태 , 성공시 resolve함수에 매개변수로 반환된 blob타입의 변수 매개변수로 전달한다
        xhr.onerror = function () {
            reject(new TypeError('Network request failed'));
        }; //서버에 응답이 오류가날때 타입에러 메세지를 반환한다
        xhr.responseType = 'blob'; //blob타입을 반환한다
        xhr.open('GET', uri, true); //요청을 초기화하는 객체 method는 'get',post,put,delete등있다 ,uri는 요청을 처리할 주소값,비동기의 여부를 정한다(true,false)
        xhr.send(null); //요청을 서버에 보낸다
    });
    const user = Auth.currentUser; //currentUser는 현재 user의 정보를 반환
    const ref = storage.ref(`/profile/${user.uid}/photo.png`); //firebase의 저장소를가져온다
    const snapshot = await ref.put(blob, { contentType: 'image/png' });
    blob.close();

    return await snapshot.ref.getDownloadURL();
};

export const signup = async ({ name, email, password, photo }) => {
    const { user } = await Auth.createUserWithEmailAndPassword(email, password); //user을 firebase에 저장하는함수(이메일과비번만 저장할수있으므로 다른정보는 추가로 저장해야한다)
    const photoURL = await UploadImage(photo); //이미지를 업로드하고 업로드하여 생성된 웹 이미지주소를 반환한다
    await user.updateProfile({ displayName: name, photoURL });
    return user;
};

export const getCurrentUser = () => {
    const { uid, displayName, email, photoURL } = Auth.currentUser;
    return { uid, name: displayName, email, photo: photoURL };
};

export const updateUserInfo = async (photo) => {
    const photoURL = await UploadImage(photo);
    Auth.currentUser.updateProfile({ photoURL });
    return photoURL;
};
export const signout = async () => {
    await Auth.signOut();
    return {};
};
export const createChannel = async ({ title, desc }) => {
    const newChannelRef = DB.collection('channels').doc(); //firebase db에서 channels라는 경로에 생성할 구조를 가져온다(id는 firebase 에서 자동생성)
    const id = newChannelRef.id;
    const newChannel = {
        id,
        title,
        description: desc,
        createdAt: Date.now(),
    };
    await newChannelRef.set(newChannel); //생성된 구조에 newchannel이 가지고있는 객체를 대입하여 저장한다
    return id;
};

export const createMessage = async ({ channelId, message }) => {
    return await DB.collection('channels') //collection은 id를 자동생성하고 식별자를 만드는 역할
        .doc(channelId)
        .collection('messages')
        .doc(message._id)
        .set({
            ...message,
            createdAt: Date.now(),
        });
};
