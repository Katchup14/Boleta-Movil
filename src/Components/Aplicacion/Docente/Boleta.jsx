import { StyleSheet, Text, View, ScrollView, Button, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

import { db } from "./../../../utils/firebase.js";

const Boleta = ({ cursoSeleccionado, setBoleta }) => {
    const [alumnos, setAlumnos] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [modalBaja, setModalBaja] = useState(false);

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

    const abrirModal2 = (alumno) => {
        setAlumnoSeleccionado(alumno);
        setModalBaja(true);
    };

    const cerrarModal2 = () => {
        setModalBaja(false);
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

    const darDeBaja = async (cursoId) => {
        try {
            await deleteDoc(doc(db, 'curso_Inscrito', cursoId));
            setAlumnos((prevAlumno) =>
                prevAlumno.filter((curso) => curso.id !== cursoId)
            );
            cerrarModal2();
        } catch (error) {
            console.error('Error al dar de baja el curso: ', error);
        }
    };



    return (
        <>
            <View style={styles.container}>
                <View style={styles.boton} color="#007BFF" // Cambia el color si es necesario
                >
                    <TouchableOpacity style={styles.button} onPress={() => { setBoleta(false) }}>
                        <Icon name="arrow-back-outline" size={20} color="#fff" style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>Lista de Estudiantes</Text>
                <View style={styles.tableHeader}>
                    <Text style={[styles.headerText, styles.numeroLista]}>#</Text>
                    <Text style={[styles.headerText, styles.nombre]}>Nombre Completo</Text>
                    <Text style={[styles.headerText, styles.calificaciones]}>Calificaciones</Text>
                    <Text style={[styles.headerText, styles.calificaciones]}>Baja</Text>
                </View>
                <ScrollView>
                    {alumnos.map((item, index) => (
                        <View key={item.id} style={styles.tableRow}>
                            <Text style={[styles.cell, styles.numeroLista]}>{index + 1}</Text>
                            <Text style={[styles.cell, styles.nombre]}>
                                {item.Nombre} {item.Apellido_Paterno} {item.Apellido_Materno}
                            </Text>
                            <View style={[styles.cell, styles.calificaciones, styles.buttonContainer]}>
                                <TouchableOpacity style={[styles.button, styles.botonCalif]} onPress={() => { abrirModal(item) }}>
                                    <Icon name="list-outline" size={20} color="#fff" style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.cell, styles.calificaciones, styles.buttonContainer]}>
                                <TouchableOpacity style={[styles.button, styles.botonBaja]} onPress={() => { abrirModal2(item) }}>
                                    <Icon name="trash-outline" size={20} color="#fff" style={styles.icon} />
                                </TouchableOpacity>
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
                            <View style={styles.containerBoton}>
                                <TouchableOpacity style={[styles.button, styles.botonCalif]} onPress={() => {
                                    actualizarCal();
                                }}>
                                    <Text style={[styles.buttonText]}>🗑 Editar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button} onPress={cerrarModal}>
                                    <Text style={styles.buttonText}>Cerrar</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                </Modal>
            )}
            {modalBaja && (
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalBaja}
                    onRequestClose={cerrarModal2}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Eliminar Alumno</Text>
                            <Text style={styles.modalText}>
                                <Text style={{ fontWeight: 'bold' }}>Curso: {cursoSeleccionado.Nombre} </Text>

                            </Text>
                            <Text style={styles.modalText}>
                                <Text style={{ fontWeight: 'bold' }}>Nombre: {alumnoSeleccionado.Nombre} {alumnoSeleccionado.Apellido_Paterno} {alumnoSeleccionado.Apellido_Materno}</Text>

                            </Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.closeButton]}
                                    onPress={cerrarModal2}
                                >
                                    <Text style={styles.buttonText}>Cerrar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.confirmButton]}
                                    onPress={() => darDeBaja(alumnoSeleccionado.id_ins)}
                                >
                                    <Text style={styles.buttonText}>Confirmar Baja</Text>
                                </TouchableOpacity>
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
        fontSize: 12,
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
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        width: '100%',
    },
    boton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '30%', // Abarca todo el contenedor
    },
    button: {
        backgroundColor: '#00509e',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: 'center',
        alignContent: 'center',
        marginVertical: 10,
        width: '100%',
        alignSelf: 'center',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    botonBaja: {
        backgroundColor: '#FF4D4D', // Rojo vibrante
    },
    botonCalif: {
        backgroundColor: '#FFC107', // Amarillo suave
    },
    closeButton: {
        backgroundColor: '#808080', // Gris
    },
    confirmButton: {
        backgroundColor: '#FF0000', // Rojo
    },
    modalButton: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5,
        justifyContent: 'center',
    },
    containerBoton: {
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '50%',
      },
});