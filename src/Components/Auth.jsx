import { useState } from "react";
import { Text, View, Image, StyleSheet, Button } from "react-native";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import App2 from "./Aplicacion/App2";

export default function Auth() {

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
                    isLogin ? <LoginForm changeForm={changeForm} /> : <RegisterForm changeForm={changeForm} />
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


