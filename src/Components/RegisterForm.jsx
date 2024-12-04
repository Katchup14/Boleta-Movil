import { Text, Button, View, StyleSheet, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app, db } from "./../utils/firebase.js";
import { collection, addDoc } from 'firebase/firestore';



import { validateEmail } from "../controller";

export default function RegisterForm(
    {
        changeForm = () => { }, setRol, setUsuario
    }
) {
    const [rolI, setRolI] = useState('')
    const [sexo, setSexo] = useState('');
    const [data, setData] = useState({ email: '', password: '', confirmPassword: '' })
    const [datosCompletos, setDatosCompletos] = useState({ Nombre: '', Apellido_Paterno: '', Apellido_Materno: '', Contraseña: '', Correo: '', rol: '', sexo: '' })

    const [error, setError] = useState({ emailE: '', passwordE: '', confirmPasswordE: '' })


    const updateData = (newValue, campo) => {
        const newData = { ...data }
        newData[campo] = newValue
        setData(newData)
    }

    const updateDatosCom = (newValue, campo) => {
        const newData = { ...datosCompletos }
        newData[campo] = newValue
        setDatosCompletos(newData)
    }

    const validateData = (data) => {
        const { email, password, confirmPassword } = data;
        let newError = { emailE: '', passwordE: '', confirmPasswordE: '' };
    
        // Validación del correo
        if (!email) {
            newError.emailE = 'El email es obligatorio';
        } else if (!validateEmail(email)) {
            newError.emailE = 'El email no es válido';
        }
    
        // Validación de la contraseña
        if (!password) {
            newError.passwordE = 'El password es obligatorio';
        } else if (password.length <= 6) {
            newError.passwordE = 'El password debe ser mayor a 6 caracteres';
        }
    
        if (!confirmPassword) {
            newError.confirmPasswordE = 'Debes confirmar el password';
        } else if (confirmPassword.length <= 6) {
            newError.confirmPasswordE = 'La confirmación debe ser mayor a 6 caracteres';
        } else if (password !== confirmPassword) {
            newError.confirmPasswordE = 'Las contraseñas no coinciden';
        }
    
        return newError;
    };
    

    const registerUser = async (email, password, datosCompletos) => {
        const auth = getAuth(app);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userCollection = collection(db, "usuarios");
            const docRef = await addDoc(userCollection, {
                uid: user.uid,
                Nombre: datosCompletos.Nombre,
                Apellido_Paterno: datosCompletos.Apellido_Paterno,
                Apellido_Materno: datosCompletos.Apellido_Materno,
                rol: datosCompletos.rol,
                sexo: datosCompletos.sexo,
                Correo: email,
                Contraseña: password
            });
            setRol(datosCompletos.rol);
            setUsuario({
                "id": docRef.id,
                "Nombre": datosCompletos.Nombre,
                "ApellidoP": datosCompletos.Apellido_Paterno,
                "ApellidoM": datosCompletos.Apellido_Materno
            });
        } catch (error) {
            //console.error("Error al guardar el empleado:", error);
            if (error.code === "auth/email-already-in-use") {
                alert("Este correo ya está registrado. Por favor, utiliza otro.");
            } else {
                alert("Error al guardar los datos. Intenta nuevamente.");
            }
        }
    };
    

    const check = async () => {
        const { email, password, confirmPassword } = data;
        const newError = validateData(data);
        setError(newError);

        if (!datosCompletos.Nombre || !datosCompletos.Apellido_Paterno || !datosCompletos.Apellido_Materno || !datosCompletos.rol || !datosCompletos.sexo) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (!newError.emailE && !newError.passwordE && !newError.confirmPasswordE) {
            console.log('---------- No hay errores -----------');
            await registerUser(email, password, datosCompletos);
        } else {
            if (newError.emailE) alert(newError.emailE);
            if (newError.passwordE) alert(newError.passwordE);
            if (newError.confirmPasswordE) alert(newError.confirmPasswordE);
        }
    };
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor='#fff'
                onChangeText={nv => { updateDatosCom(nv, 'Nombre') }}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido Paterno"
                placeholderTextColor='#fff'
                onChangeText={nv => { updateDatosCom(nv, 'Apellido_Paterno') }}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido Materno"
                placeholderTextColor='#fff'
                onChangeText={nv => { updateDatosCom(nv, 'Apellido_Materno') }}
            />
            <View style={styles.selectContainer}>
                <Picker
                    selectedValue={rolI}
                    style={styles.picker}
                    onValueChange={nv => { updateDatosCom(nv, 'rol') }}
                >
                    <Picker.Item label=" Rol" value="" />
                    <Picker.Item label="Docente" value="Docente" />
                    <Picker.Item label="Estudiante" value="Estudiante" />
                </Picker>
                <Picker
                    selectedValue={sexo}
                    style={styles.picker}
                    onValueChange={nv => { updateDatosCom(nv, 'sexo') }}
                >
                    <Picker.Item label="sexo" value="" />
                    <Picker.Item label="Masculino" value="Masculino" />
                    <Picker.Item label="Femenino" value="Femenino" />
                </Picker>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Ingresa tu correo"
                placeholderTextColor='#fff'
                onChangeText={nv => { updateData(nv, 'email') }}
            />
            <TextInput
                style={styles.input}
                placeholder="Ingresa tu contrasena"
                placeholderTextColor='#fff'
                secureTextEntry
                onChangeText={nv => { updateData(nv, 'password') }}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirma tu contrasena"
                placeholderTextColor='#fff'
                secureTextEntry
                onChangeText={nv => { updateData(nv, 'confirmPassword') }}
            />

            <Button
                title="Registrate"
                onPress={check}
            />
            <View style={styles.cambio}>
                <Button
                    title="Iniciar Sesion"
                    onPress={changeForm}
                    style={styles.btnText}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        maxHeight: '80%',  // Limita la altura al 80% de la pantalla
        gap: 10,
        alignItems: 'center',
    },
    btnText: {
        fontSize: 20,
        borderRadius: 20
    },
    input: {
        height: 40,  // Ajusta el tamaño del input a un tamaño más pequeño
        width: '80%',
        backgroundColor: '#1e3040',
        color: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
        borderWidth: 1.5,
    },
    cambio: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,  // Un pequeño margen en la parte inferior
    },
    selectContainer: {
        width: '90%',
        borderWidth: 1.5,
        flexDirection: 'row', // Los coloca en la misma línea
        justifyContent: 'space-between', // Asegura que se distribuyan correctamente
    },
    picker: {
        backgroundColor: '#1e3040',
        borderRadius: 40,
        paddingHorizontal: 10,
        height: 50,
        width: '48%',
        fontSize: 1, // Tamaño de la letra más pequeño
        color: '#fff', // Color blanco para el texto
    },
});