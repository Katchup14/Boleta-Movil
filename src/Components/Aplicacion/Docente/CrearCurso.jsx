import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native'
import { React, useState, useEffect } from 'react'
import {db} from "./../../../utils/firebase.js";
import { collection, addDoc } from 'firebase/firestore';

const CrearCurso = ({ navigaion, usuario }) => {
    const [data, setData] = useState({
        Materia: '',
        Nombre: '',
        Año: ''
    })

    const updateData = (newValue, campo) => {
        const newData = { ...data }
        newData[campo] = newValue
        setData(newData)
    }

    const newCurso= async ()=>{
        const cod=codigo()
        try{
        const userCollection = collection(db, "cursos");
                await addDoc(userCollection, {
                Codigo: cod,
                Estatus: "Activo",
                Materia: data.Materia,
                Nombre: data.Nombre,
                año: data.Año,
                id_profesor:usuario.id
            });
            alert(`Guardado con éxito Tu Codigo de acceso es: ${cod}`);
            setData({
                Materia: "",
                Nombre: "",
                Año: "",
            })
        } catch (error) {
            console.error("Error al guardar el curso:", error);
            alert("Error al guardar los datos. Intenta nuevamente.");
        }
    }

    const codigo = () => {
        const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numeros = "0123456789";
    
        // Generar 4 letras aleatorias
        const parteLetras = Array.from({ length: 4 }, () =>
            letras[Math.floor(Math.random() * letras.length)]
        ).join("");
    
        // Generar 4 números aleatorios
        const parteNumeros = Array.from({ length: 4 }, () =>
            numeros[Math.floor(Math.random() * numeros.length)]
        ).join("");
    
        // Combinar y devolver el código
        return `${parteLetras}-${parteNumeros}`;
    };
    

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../../../../assets/Curso.png')} />
            <Text style={styles.title}>Registra un Nuevo Curso</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre del Curso"
                placeholderTextColor='#000'
                value={data.Nombre}
                onChangeText={nv => { updateData(nv, 'Nombre') }}
            />
            <TextInput
                style={styles.input}
                placeholder="Materia"
                placeholderTextColor='#000'
                value={data.Materia}
                onChangeText={nv => { updateData(nv, 'Materia') }}
            />
            <TextInput
                style={styles.input}
                placeholder="Año"
                placeholderTextColor="#000"
                keyboardType="numeric" 
                value={data.Año}
                maxLength={4} 
                onChangeText={nv => {
                    if (/^\d{0,4}$/.test(nv)) {
                        updateData(nv, 'Año');
                    }
                }}/>

             <Button
                title="Registrate"
                onPress={newCurso}
            />
        </View>
    )
}

export default CrearCurso

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: '#001F54', // Azul marino bonito
        gap: 15
    },
    title: {
        color: 'white',
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center'
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