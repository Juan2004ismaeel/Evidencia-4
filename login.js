import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBFvB1XC-jRj-IVzQK2Dn3TLVGP7kcrBvc",
    authDomain: "facelook-594f8.firebaseapp.com",
    projectId: "facelook-594f8",
    storageBucket: "facelook-594f8.appspot.com",
    messagingSenderId: "700040766440",
    appId: "1:700040766440:web:ea1c88fb6fca6e68143a5d",
    measurementId: "G-8SW36TC85W"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); // Inicializa Realtime Database
const analytics = getAnalytics(app); // Inicializa Analytics

// Función para mostrar notificaciones
function showNotification(type, message) {
    const notification = document.getElementById('notification');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <span class="close" onclick="this.parentElement.classList.add('hidden')">&times;</span>
    `;
    notification.classList.remove('hidden');
}

// Función para manejar el inicio de sesión
function handleLogin() {
    const email = document.getElementById('emaillog').value;
    const password = document.getElementById('passwordlog').value;

    console.log('Intentando iniciar sesión con:', { email, password });

    signInWithEmailAndPassword(auth, email, password)
        .then(cred => {
            showNotification('success', 'Inicio de sesión exitoso');
            console.log('Usuario:', cred.user);
            logEvent(analytics, 'login', { method: 'email' }); // Registrar evento de login
            updateUserStatus(cred.user.uid, true); // Actualizar estado del usuario en línea
        })
        .catch(handleAuthError);
}

// Función para manejar errores de autenticación
function handleAuthError(error) {
    console.error('Error durante el inicio de sesión:', error);
    const errorCode = error.code;

    let errorMessage;
    switch (errorCode) {
        case 'auth/invalid-email':
            errorMessage = 'El correo no es válido';
            break;
        case 'auth/user-disabled':
            errorMessage = 'El usuario está deshabilitado';
            break;
        case 'auth/user-not-found':
            errorMessage = 'El usuario no existe';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Contraseña incorrecta';
            break;
        default:
            errorMessage = 'Error desconocido: ' + error.message;
    }
    showNotification('error', errorMessage);
}

// Función para manejar el cierre de sesión
function handleSignOut() {
    const user = auth.currentUser;
    if (user) {
        updateUserStatus(user.uid, false); // Actualizar estado del usuario fuera de línea
    }
    signOut(auth)
        .then(() => {
            showNotification('success', 'Sesión cerrada');
            logEvent(analytics, 'logout'); // Registrar evento de logout
        })
        .catch((error) => {
            console.error('Error durante el cierre de sesión:', error);
            showNotification('error', 'Error al cerrar sesión');
        });
}

// Función para actualizar el estado del usuario en la base de datos
function updateUserStatus(uid, isOnline) {
    const statusRef = ref(database, 'users/' + uid + '/status');
    set(statusRef, {
        online: isOnline,
        last_changed: new Date().toISOString()
    });
}

// Función para manejar el estado de autenticación
function handleAuthStateChange(user) {
    if (user) {
        console.log("Usuario Activo");
        if (user.emailVerified) {
            window.open("https://www.google.com/");
            logEvent(analytics, 'user_active'); // Registrar evento cuando el usuario está activo
        } else {
            signOut(auth);
        }
    } else {
        console.log("Usuario Inactivo");
    }
}

// Asignar eventos a botones
document.getElementById('login').addEventListener('click', handleLogin);
document.getElementById('cerrar').addEventListener('click', handleSignOut);

// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, handleAuthStateChange);
