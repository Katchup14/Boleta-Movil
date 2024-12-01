import { useState } from "react";
import { Text, View, Image, StyleSheet } from "react-native";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import App2 from "./Aplicacion/App2";

export default function Auth() {

    const [isLogin, setIsLogin] = useState(false)
    const [appl, setAPPl] = useState(true)

    const changeForm = () => {
        setIsLogin(!isLogin)
    }



    console.log(isLogin)
    return (
        <View style={styles.view}>
            <Image style={styles.logo} source={require('../../assets/icon.png')} />
            {
                isLogin ?  <LoginForm changeForm={changeForm} /> : <RegisterForm changeForm={changeForm} />
            }
        </View>
    )
}


const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',  // Centra los elementos verticalmente
        backgroundColor:'#000'
    },
    logo: {
        width: 100,
        height: 100,
        marginTop: 5,
        marginBottom: 5,
    },
})


