import { Text, Button, View, StyleSheet, TextInput, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { collection, query, where, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from "./../../../utils/firebase.js";

const EditarPerfil = ({ navigation, usuario }) => {
    const [datosCompletos, setDatosCompletos] = useState({
        Nombre: "",
        Apellido_Paterno: "",
        Apellido_Materno: "",
        Contraseña: "",
        Correo: "",
        rol: "",
        sexo: "",
    });
    const [datosOriginales, setDatosOriginales] = useState({});

    const obtenerEmpleadoPorId = async (docId) => {
        try {
            const docRef = doc(db, 'usuarios', docId);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const usuarioData = {
                    id: docSnapshot.id,
                    ...docSnapshot.data(),
                };
                setDatosCompletos(usuarioData);
                setDatosOriginales(usuarioData); // Guardar los datos originales
            } else {
                console.log('No se encontró el documento');
            }
        } catch (error) {
            console.error('Error al obtener el empleado: ', error);
        }
    };

    const handleUpdate = async () => {
        const { Nombre, Apellido_Paterno, Apellido_Materno, sexo, Correo, Contraseña } = datosCompletos;

        // Comparar los datos actuales con los originales
        if (
            Nombre === datosOriginales.Nombre &&
            Apellido_Paterno === datosOriginales.Apellido_Paterno &&
            Apellido_Materno === datosOriginales.Apellido_Materno &&
            sexo === datosOriginales.sexo &&
            Correo === datosOriginales.Correo &&
            Contraseña === datosOriginales.Contraseña
        ) {
           
            alert("No hay cambios, no se realiza la actualización.");
            return; // No hacer nada si no hay cambios
        }

        try {
            const empleadoRef = doc(db, 'usuarios', datosCompletos.id);

            // Actualizar los datos
            await updateDoc(empleadoRef, {
                Nombre,
                Apellido_Paterno,
                Apellido_Materno,
                sexo,
                Correo,
                Contraseña,
            });
            setDatosOriginales(datosCompletos)
            alert('Datos actualizados correctamente');
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
            alert('Ocurrió un error al actualizar los datos');
        }
    };

    useEffect(() => {
        obtenerEmpleadoPorId(usuario.id);
    }, []);

    const updateDatosCom = (newValue, campo) => {
        const newData = { ...datosCompletos };
        newData[campo] = newValue;
        setDatosCompletos(newData);
    };

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../../../../assets/Perfil.png')} />
            <Text style={styles.title}>Editar Perfil</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={datosCompletos.Nombre}
                placeholderTextColor="#fff"
                onChangeText={(nv) => updateDatosCom(nv, "Nombre")}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido Paterno"
                value={datosCompletos.Apellido_Paterno}
                placeholderTextColor="#fff"
                onChangeText={(nv) => updateDatosCom(nv, "Apellido_Paterno")}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido Materno"
                value={datosCompletos.Apellido_Materno}
                placeholderTextColor="#fff"
                onChangeText={(nv) => updateDatosCom(nv, "Apellido_Materno")}
            />
            <View style={styles.selectContainer}>
                <Picker
                    selectedValue={datosCompletos.sexo}
                    style={styles.picker}
                    onValueChange={(nv) => updateDatosCom(nv, "sexo")}
                >
                    <Picker.Item label="Sexo" value="" />
                    <Picker.Item label="Masculino" value="Masculino" />
                    <Picker.Item label="Femenino" value="Femenino" />
                </Picker>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Ingresa tu correo"
                placeholderTextColor="#fff"
                value={datosCompletos.Correo}
                onChangeText={(nv) => updateDatosCom(nv, "Correo")}
            />
            <TextInput
                style={styles.input}
                placeholder="********"
                value={datosCompletos.Contraseña} // Mostrar la contraseña actual
                placeholderTextColor="#fff"
                secureTextEntry
                onChangeText={(nv) => updateDatosCom(nv, "Contraseña")}
            />
            <Button title="Guardar Cambios" onPress={handleUpdate} />
        </View>
    );
};

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
    logo: {
        width: 150,
        height: 150,
        marginTop: 1,
        marginBottom: 1,
    },
    input: {
        height: 40,
        width: "80%",
        backgroundColor: "#1e3040",
        color: "#fff",
        borderRadius: 20,
        paddingHorizontal: 10,
        borderWidth: 1.5,
    },
    selectContainer: {
        width: "80%",
        borderWidth: 1.5,
        justifyContent: "space-between",
        backgroundColor: "#1e3040",
        borderRadius: 40,
    },
    picker: {
        paddingHorizontal: 10,
        height: 50,
        color: "#fff",
    },
});

export default EditarPerfil;
