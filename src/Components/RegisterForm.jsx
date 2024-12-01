import { Text, Button, View, StyleSheet, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Input from "../Input";
import { useState } from "react";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import app from "./../utils/firebase.js";

import { validateEmail } from "../controller";

export default function RegisterForm(
    {
        changeForm = () => { }
    }
) {
    const [sexo, setSexo] = useState('');
    const [rol, setRol] = useState('');
    const [data, setData] = useState({ email: '', password: '', confirmPassword: '' })

    const [error, setError] = useState({ emailE: '', passwordE: '', confirmPasswordE: '' })

    const updateData = (newValue, campo) => {
        const newData = { ...data }
        newData[campo] = newValue
        setData(newData)
    }

    const check = () => {

        const { email, password, confirmPassword } = data
        console.log('data', Boolean(email), email, password, confirmPassword)
        let newError = { emailE: '', passwordE: '', confirmPasswordE: '' }

        if (!email) { newError.emailE = 'El email es obligatorio' }
        else if (!validateEmail(email)) { newError.emailE = 'El email no es valido' }
        if (!password) { newError.passwordE = 'El password es obligatorio' }
        else if (password.length <= 6) { newError.passwordE = 'El password debe ser mayor a 6 caracteres' }
        if (!confirmPassword) { newError.confirmPasswordE = 'Debes confirmal el password' }
        else if (confirmPassword.length <= 6) { newError.confirmPasswordE = 'La confirmacion debe ser mayor a 6 caracteres' }

        if (!newError.emailE || !newError.passwordE || !newError.confirmPasswordE) {
            console.log('----------n no hay errores -----------')
            const auth = getAuth(app);
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    // ...
                    console.log('user agregado: ', user)
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                });
        }

        setError(newError)


    }

    console.log("Object Data:", data)
    console.log("Error:", error)

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor='#fff'
                onChangeText={nv => { updateData(nv, 'email') }}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido Paterno"
                placeholderTextColor='#fff'
                onChangeText={nv => { updateData(nv, 'email') }}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido Materno"
                placeholderTextColor='#fff'
                onChangeText={nv => { updateData(nv, 'email') }}
            />
            {/* Dropdown para Rol */}
            <View style={styles.selectContainer}>
                <Picker
                    selectedValue={rol}
                    style={styles.picker}
                    onValueChange={(itemValue) => setRol(itemValue)}
                >   
                    <Picker.Item label=" Rol" value="" />
                    <Picker.Item label="Docente" value="Docente" />
                    <Picker.Item label="Estudiante" value="Estudiante" />
                </Picker>
                <Picker
                    selectedValue={sexo}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSexo(itemValue)}
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