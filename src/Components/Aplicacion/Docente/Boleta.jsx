import { StyleSheet, Text, View, ScrollView, Button, Modal, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';

import { db } from "./../../../utils/firebase.js";

const Boleta = ({ cursoSeleccionado, setBoleta }) => {
    const [alumnos, setAlumnos] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

    useEffect(() => {
        const obtenerAlumnos = async () => {
            try {
                const q = query(collection(db, 'curso_Inscrito'), where('id_curso', '==', cursoSeleccionado.id));
                const querySnapshot = await getDocs(q);
                const alumnosData = [];

                // Iteramos sobre los documentos de curso_Inscrito
                for (let docCurso of querySnapshot.docs) {
                    const alumnoId = docCurso.data().id_Estudiante;
                    const calificaciones = docCurso.data().Calificaciones || [];
                    const id_ins = docCurso.id; // Aquí obtienes el id del documento 'curso_Inscrito'

                    // Obtenemos los datos del alumno desde la colección 'usuarios'
                    const alumnoDoc = await getDoc(doc(db, 'usuarios', alumnoId));
                    if (alumnoDoc.exists()) {
                        // Agregamos los datos del alumno y las calificaciones junto con el id del documento curso_Inscrito
                        alumnosData.push({
                            id: alumnoDoc.id,
                            ...alumnoDoc.data(),
                            calificaciones,
                            id_ins // El id del documento curso_Inscrito
                        });
                    }
                }

                // Establecemos los datos de los alumnos en el estado
                setAlumnos(alumnosData);
            } catch (error) {
                console.error('Error al obtener los alumnos: ', error);
            }
        };

        obtenerAlumnos();
    }, [alumnoSeleccionado]); // Solo vuelve a ejecutarse si cambia el id del curso

    const abrirModal = (alumno) => {
        setAlumnoSeleccionado(alumno);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setAlumnoSeleccionado(null);
    };



    const handleCalificacionChange = (index, value) => {
        const newCalificaciones = [...alumnoSeleccionado.calificaciones];
        newCalificaciones[index] = value; // Actualiza la calificación en el índice correspondiente
        setAlumnoSeleccionado({ ...alumnoSeleccionado, calificaciones: newCalificaciones });
    };

    const actualizarCal = async () => {
        try {
            const calificacionesVacias = alumnoSeleccionado.calificaciones.some(calificacion => !calificacion || calificacion === "");

            if (calificacionesVacias) {
                alert('Una o más calificaciones están vacías.');
                return;
            }

            const docRef = doc(db, 'curso_Inscrito', alumnoSeleccionado.id_ins);
            await updateDoc(docRef, {
                Calificaciones: alumnoSeleccionado.calificaciones
            });

            alert('Calificaciones actualizadas exitosamente');
        } catch (error) {
            console.error('Error al actualizar las calificaciones: ', error);
        }
    }



    return (
        <>
            <View style={styles.container}>
                <View style={styles.boton} color="#007BFF" // Cambia el color si es necesario
                >
                    <Button
                        title="Regresar"
                        onPress={() => { setBoleta(false) }}
                    />
                </View>
                <Text style={styles.title}>Lista de Estudiantes</Text>
                <View style={styles.tableHeader}>
                    <Text style={[styles.headerText, styles.numeroLista]}>#</Text>
                    <Text style={[styles.headerText, styles.nombre]}>Nombre Completo</Text>
                    <Text style={[styles.headerText, styles.calificaciones]}>Calificaciones</Text>
                </View>
                <ScrollView>
                    {alumnos.map((item, index) => (
                        <View key={item.id} style={styles.tableRow}>
                            <Text style={[styles.cell, styles.numeroLista]}>{index + 1}</Text>
                            <Text style={[styles.cell, styles.nombre]}>
                                {item.Nombre} {item.Apellido_Paterno} {item.Apellido_Materno}
                            </Text>
                            <View style={[styles.cell, styles.calificaciones, styles.buttonContainer]}>
                                <Button
                                    title="Ver"
                                    onPress={() => { abrirModal(item) }}
                                    color="#007BFF" // Cambia el color si es necesario
                                />
                            </View>

                        </View>
                    ))}
                </ScrollView>
            </View>
            {alumnoSeleccionado && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={cerrarModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Calificaciones</Text>
                            <View style={styles.inputsContainer}>
                                {alumnoSeleccionado?.calificaciones?.map((calificacion, index) => (
                                    <View style={styles.inputWrapper} key={index}>
                                        {/* Etiqueta con el número de ejercicio */}
                                        <Text style={styles.inputLabel}>E{index + 1}</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={calificacion}
                                            onChangeText={(text) => handleCalificacionChange(index, text)}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                ))}
                            </View>
                            <View style={styles.row}>
                                <Button title="Guardar" onPress={() => actualizarCal()} />
                                <Button title="Cerrar" onPress={cerrarModal} />
                            </View>

                        </View>
                    </View>

                </Modal>
            )}
        </>
    );
};

export default Boleta;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#343a40',
        paddingVertical: 10,
        borderRadius: 5,
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        marginVertical: 2,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
    },
    cell: {
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    numeroLista: {
        flex: 0.2,
    },
    nombre: {
        flex: 0.5,
        textAlign: 'left',
    },
    calificaciones: {
        flex: 0.3,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#e6e6e6', // Gris ligeramente más oscuro
        borderColor: '#000',        // Borde blanco
        borderWidth: 1,             // Grosor del borde
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',        // Sombra negra
        shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
        shadowOpacity: 0.3,         // Opacidad de la sombra
        shadowRadius: 5,            // Radio de la sombra
        elevation: 6,               // Para sombras en Android
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    inputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'column', // Coloca el texto encima del input
        alignItems: 'center', // Centra el texto y el input
        width: '18%', // Ajusta el ancho de cada input
    },
    inputLabel: {
        marginBottom: 5, // Espacio entre el texto y el input
        fontSize: 14, // Tamaño del texto
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%'
    },
    boton: {
        flexDirection: 'row',
        alignItems: 'center',

        width: '40%', // Abarca todo el contenedor
    },
});