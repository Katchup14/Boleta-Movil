import { useState } from "react";
import { Button, Text, StyleSheet, TextInput, View } from "react-native";

import {app,db} from '../utils/firebase.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export default function LoginForm(
    {
        changeForm = () => { },setRol,setUsuario
    }
) {

    const [data, setData] = useState({ email: '', password: '' })

    const updateData = (newValue, campo) => {
        const newData = { ...data }
        newData[campo] = newValue
        setData(newData)
    }

    const singin = async () => {
        const { email, password } = data;
        try {
            const auth = getAuth(app);
            const userCredential = await signInWithEmailAndPassword(auth, email, password); 
    
            const user = userCredential.user;  // El usuario autenticado
            const usersCollection = collection(db, "usuarios");
            const q = query(usersCollection, where("Correo", "==", email));
            
            const querySnapshot = await getDocs(q); // Ahora utilizamos await aquí
    
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const rol = userDoc.data().rol;  // Suponiendo que tienes un campo "rol"
                setUsuario({"Nombre":userDoc.data().Nombre,
                            "ApellidoP":userDoc.data().Apellido_Paterno,
                            "ApellidoM":userDoc.data().Apellido_Materno,
                            "id":userDoc.id
                        })
                await AsyncStorage.setItem('rol', rol);
                setRol(rol)
                return rol;
            } else {
                console.log("No se encontró el usuario con el correo proporcionado");
            }
        } catch (error) {
            console.log('Error:', error.message);
        }
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

