import { useState } from "react";
import { Button, Text, StyleSheet, TextInput, View } from "react-native";

import app from '../utils/firebase.js'

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginForm(
    {
        changeForm = () => { }
    }
) {

    const [data, setData] = useState({ email: '', password: '' })

    const updateData = (newValue, campo) => {
        const newData = { ...data }
        newData[campo] = newValue
        setData(newData)
    }

    const singin = () => {

        const { email, password } = data

        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('logeado', user)
                // ...
            })
            .catch((error) => {
                console.log('error')
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    }

    console.log(data)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LOGIN</Text>
            <TextInput
                style={[styles.input]}
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
            <Button title="INICIAR SESION" onPress={singin} />
            <View style={styles.cambio}>
                <Text style={styles.texto}>
                    ¿No tienes una cuenta?
                </Text>
                <Button title="REGISTRARSE" onPress={changeForm} />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#000',
        gap: 10,
        alignItems: 'center'
    },
    title: {
        color: 'white',
        fontSize: 35,
        fontWeight: 'bold'
    },
    btnText: {
        fontSize: 20,
    },
    input: {
        height: 50,
        width: '80%',
        backgroundColor: '#1e3040',
        color: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
        borderWidth: 1.5,
    },
    texto: {
        height: 50,
        width: '80%',
        color: '#fff',
        textAlign: 'center', // Centra el texto horizontalmente
    },
    cambio: {
        marginTop: 250,
        position: 'absolute',
        alignItems: 'center', 
        justifyContent: 'center', 
    },
})

