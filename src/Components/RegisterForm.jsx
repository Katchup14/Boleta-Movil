import { Text, Button, View, StyleSheet, Touchable, TouchableOpacity, TextInput } from "react-native";
import Input from "../Input";
import { useState } from "react";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import app from "./../utils/firebase.js";

import { validateEmail } from "../controller";

export default function RegisterForm(
    {
        changeForm=()=>{}
    }
){

    const [ data, setData ] = useState({email:'', password:'', confirmPassword: ''})

    const [ error, setError ] = useState({ emailE: '', passwordE: '', confirmPasswordE: '' })

    const updateData = (newValue, campo) => {
        const newData = {...data}
        newData[campo] = newValue
        setData( newData )
    }

    const check = ()=> {

        const { email, password, confirmPassword } = data
        console.log('data', Boolean(email) ,email, password, confirmPassword)
        let newError = { emailE: '', passwordE: '', confirmPasswordE: '' }

        if( !email ) { newError.emailE = 'El email es obligatorio' }
        else if( !validateEmail(email) ) { newError.emailE = 'El email no es valido' }
        if( !password ) { newError.passwordE = 'El password es obligatorio' }
        else if( password.length <= 6 ) { newError.passwordE = 'El password debe ser mayor a 6 caracteres' }
        if( !confirmPassword ) { newError.confirmPasswordE = 'Debes confirmal el password' }
        else if( confirmPassword.length <= 6 ) { newError.confirmPasswordE = 'La confirmacion debe ser mayor a 6 caracteres' }

        if( !newError.emailE || !newError.passwordE || !newError.confirmPasswordE ){
            console.log('----------n no hay errores -----------')
            const auth = getAuth(app);
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                // ...
                console.log( 'user agregado: ', user )
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
        } 
        
        setError( newError )


    }

    console.log( "Object Data:", data )
    console.log( "Error:", error )

    return (
        <View style={ styles.container }>
            <TextInput
                style={ [styles.input] }
                placeholder="Ingresa tu correo"
                placeholderTextColor='#fff'
                onChangeText={ nv => { updateData(nv, 'email') } }
                />
            <TextInput
                style={ styles.input }
                placeholder="Ingresa tu contrasena"
                placeholderTextColor='#fff'
                secureTextEntry
                onChangeText={ nv => { updateData(nv, 'password') } }
                />
            <TextInput
                style={ styles.input }
                placeholder="Confirma tu contrasena"
                placeholderTextColor='#fff'
                secureTextEntry
                onChangeText={ nv => { updateData(nv, 'confirmPassword') } }
            />
            
            <TouchableOpacity>
                <Text>Registro</Text>
            </TouchableOpacity>

            <Button
                title="Registrate"
                onPress={check}
            />
            <Button
                title="Iniciar sesion"
                onPress={ changeForm }
                style={styles.btnText}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        height:'60hv',
        width:'90%',
        backgroundColor: '#000',
        gap: 10,
        alignItems: 'center',
        justifyContent:'center'
    },
    btnText: {
        fontSize: 20,
        borderRadius:20
    },
    input: {
        height: 50,
        width: '80%',
        backgroundColor: '#1e3040',
        color: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
        borderWidth: 1.5,
    }
})
