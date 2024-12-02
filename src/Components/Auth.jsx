import { useState } from "react";
import { Text, View, Image, StyleSheet, Button } from "react-native";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Auth({setRol}) {

    const [isLogin, setIsLogin] = useState(true)
    const [appl, setAPPl] = useState(true)

    const changeForm = () => {
        setIsLogin(!isLogin)
    }

    

    return (
        <>
            <View style={styles.view}>
                <Image style={styles.logo} source={require('../../assets/Logo.png')} />
                {
                    isLogin ? <LoginForm changeForm={changeForm} setRol={setRol} /> : <RegisterForm changeForm={changeForm} setRol={setRol}/>
                }
            </View>
        </>

    )
}


const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',  // Centra los elementos verticalmente
        backgroundColor: '#000',
        position: 'relative',
    },
    logo: {
        width: 200,
        height: 150,
        marginTop: 1,
        marginBottom: 1,
    },
    cambio: {
        position: 'absolute',
        width:'50%',
        marginTop:60,
        right:10
    },
    btnText: {
        top: 10,
        right: 10,
    }
})


