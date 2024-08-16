// Importa las funciones que necesitas desde los SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

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

document.addEventListener('DOMContentLoaded', () => {
    const registroButton = document.getElementById('registro');
    if (registroButton) {
        registroButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir el comportamiento por defecto del botón si está dentro de un formulario

            let email = document.getElementById('emailreg').value;
            let password = document.getElementById('passwordreg').value;

            createUserWithEmailAndPassword(auth, email, password)
                .then(cred => {
                    alert("Usuario creado");
                    signOut(auth).then(() => {
                        sendEmailVerification(auth.currentUser)
                            .then(() => {
                                alert('Se ha enviado un correo de verificación');
                            });
                    });
                })
                .catch(error => {
                    const errorCode = error.code;
                    if (errorCode === 'auth/email-already-in-use') {
                        alert('El correo ya está en uso');
                    } else if (errorCode === 'auth/invalid-email') {
                        alert('El correo no es válido');
                    } else if (errorCode === 'auth/weak-password') {
                        alert('La contraseña debe tener al menos 6 caracteres');
                    } else {
                        alert('Error desconocido: ' + error.message);
                    }
                });
        });
    } else {
        console.error('El botón de registro no se encuentra en el DOM.');
    }
});
