import { StyleSheet, Text, View,TextInput,Button,Image } from 'react-native'
import {React,useState,useEffect} from 'react'

const CrearCurso = ({navigaion}) => {
    const [data,setData]=useState({
                                    Materia:'',
                                    Nombre:'',
                                    Año:''})

    const updateData = (newValue, campo) => {
        const newData = { ...data }
        newData[campo] = newValue
        setData(newData)
    }

    console.log(data)

  return (
    <View style={styles.container}>
        <Image style={styles.logo} source={require('../../../../assets/Curso.png')} />
        <Text style={styles.title}>Registra un Nuevo Curso</Text>
        <TextInput
                style={styles.input}
                placeholder="Nombre del Curso"
                placeholderTextColor='#000'
                onChangeText={nv => { updateData(nv, 'password') }}
            />
            <TextInput
                style={styles.input}
                placeholder="Materia"
                placeholderTextColor='#000'
                onChangeText={nv => { updateData(nv, 'password') }}
            />
             <TextInput
                style={styles.input}
                placeholder="Año"
                placeholderTextColor='#000'
                onChangeText={nv => { updateData(nv, 'password') }}
            />
             <TextInput
                style={styles.input}
                placeholder="No Evaluaciones"
                placeholderTextColor='#000'
                onChangeText={nv => { updateData(nv, 'password') }}
            />
             <Button
                title="Registrate"
            />
    </View>
  )
}

export default CrearCurso

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent:'center',
        position: 'relative',
        backgroundColor: '#001F54', // Azul marino bonito
        gap:15
    },  
    title: {
        color: 'white',
        fontSize: 35,
        fontWeight: 'bold',
        textAlign:'center'
    },
    btnText: {
        fontSize: 20,
        borderRadius: 20
    },
    input: {
        height: 40,  // Ajusta el tamaño del input a un tamaño más pequeño
        width: '80%',
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 20,
        paddingHorizontal: 10,
        borderWidth: 1.5,
    },
    cambio: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,  // Un pequeño margen en la parte inferior
    },
    logo: {
        width: 150,
        height: 150,
        marginTop: 1,
        marginBottom: 1,
    },
});