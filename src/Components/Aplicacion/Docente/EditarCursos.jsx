import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { collection, query, where, getDocs,doc,updateDoc } from 'firebase/firestore';
import { db } from './../../../utils/firebase.js';

const EditarCursos = ({ usuario }) => {
    const [cursos, setCursos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [cursoOriginal, setCursoOriginal] = useState({});
    const [cursoSeleccionado, setCursoSeleccionado] = useState({
        Nombre: '',
        Materia: '',
        año: ''
    });

    useEffect(() => {
        const obtenerCursos = async () => {
            try {
                const q = query(
                    collection(db, 'cursos'),
                    where('id_profesor', '==', usuario.id)
                );
                const querySnapshot = await getDocs(q);
                const cursosData = querySnapshot.docs.map((doc, index) => ({
                    id: doc.id,
                    numero: index + 1,
                    ...doc.data(),
                }));
                setCursos(cursosData);
            } catch (error) {
                console.error('Error al obtener los cursos: ', error);
            }
        };

        obtenerCursos();
    }, [usuario.id,cursoOriginal]);

    const abrirModal = (curso) => {
        setCursoSeleccionado(curso);
        setCursoOriginal(curso);
        setModalVisible(true)
    }
    const cerrarModal = () => {
        setCursoSeleccionado({
            Nombre: '',
            Materia: '',
            Año: ''
        });
        setCursoOriginal(null)
        setModalVisible(false)
    }

    const handleUpdate = async () => {
        const { Nombre, Materia, año } = cursoSeleccionado;
        if (!Nombre || !Materia || !año) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        if (
            Nombre === cursoOriginal.Nombre &&
            Materia === cursoOriginal.Materia &&
            año === cursoOriginal.año
        ) {
            alert('No hay cambios, no se realiza la actualización.');
            return; // No hacer nada si no hay cambios
        }

        try {
            const empleadoRef = doc(db, 'cursos', cursoSeleccionado.id);

            // Actualizar los datos
            await updateDoc(empleadoRef, {
                Nombre,
                Materia,
                año,
            });
            setCursoOriginal(cursoSeleccionado);
            alert('Datos actualizados correctamente');
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
            alert('Ocurrió un error al actualizar los datos');
        }
    };

    const updateDatosCom = (newValue, campo) => {
        const newData = { ...cursoSeleccionado };
        newData[campo] = newValue;
        setCursoSeleccionado(newData);
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Editar Cursos</Text>
                <ScrollView>
                    <View style={styles.table}>
                        {/* Encabezado de la tabla */}
                        <View style={[styles.row, styles.header]}>
                            <Text style={[styles.cell, styles.headerText, styles.smallCell]}>#</Text>
                            <Text style={[styles.cell, styles.headerText]}>Nombre</Text>
                            <Text style={[styles.cell, styles.headerText]}>Materia</Text>
                            <Text style={[styles.cell, styles.headerText]}>Editar</Text>
                        </View>
                        {/* Filas de datos */}
                        {cursos.map((curso, index) => (
                            <View key={curso.id} style={styles.row}>
                                <Text style={[styles.cell, styles.texto, styles.smallCell]}>{index + 1}</Text>
                                <Text style={[styles.cell, styles.texto]}>{curso.Nombre}</Text>
                                <Text style={[styles.cell, styles.texto]}>{curso.Materia}</Text>
                                <View style={[styles.cell, styles.contenedorB]}>
                                    <TouchableOpacity
                                        style={[styles.editButton]}
                                        onPress={() => abrirModal(curso)}
                                    >
                                        <Text style={styles.editButtonText}>Editar</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
            {cursoSeleccionado && (
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={cerrarModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Detalles del Curso</Text>


                            {/* Input de Nombre */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Nombre del Curso</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ingresa el nombre del curso"
                                    value={cursoSeleccionado.Nombre}
                                    onChangeText={(nv) => updateDatosCom(nv, 'Nombre')}
                                />
                            </View>

                            {/* Input de Materia */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Materia</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ingresa la materia"
                                    value={cursoSeleccionado.Materia}
                                    onChangeText={(nv) => updateDatosCom(nv,'Materia')}
                                />
                            </View>

                            {/* Input de Descripción */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Año</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ingresa una breve descripción"
                                    value={cursoSeleccionado.año}
                                    onChangeText={(nv) => updateDatosCom(nv, 'año')}
                                    multiline
                                    numberOfLines={4}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.containerBoton}>
                                <TouchableOpacity style={[styles.button, styles.guardar]} onPress={handleUpdate}>
                                    <Text style={styles.buttonText}>Guardar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button} onPress={cerrarModal}>
                                    <Text style={styles.buttonText}>Cerrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
};

export default EditarCursos;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'space-between', // Asegura que las celdas se distribuyan uniformemente
    },
    header: {
        backgroundColor: '#00509e',
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cell: {
        flex: 1, // Asegura que las celdas se distribuyan proporcionalmente
        textAlign: 'center',
        fontSize: 14,
    },
    editButton: {
        width: '60%',
        borderRadius: 4,
        backgroundColor: '#FFC107',
        paddingVertical: 7,
        textAlign: 'center'
    },
    editButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    texto: {
        fontSize: 15,
        textAlign: 'center',
    },
    contenedorB: {
        width: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallCell: {
        flex: 0.2, // Ajusta el tamaño para la celda de número
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#001F54', // Gris ligeramente más oscuro
        borderColor: '#000', // Borde blanco
        borderWidth: 1,
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000', // Sombra negra
        shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
        shadowOpacity: 0.3, // Opacidad de la sombra
        shadowRadius: 5, // Radio de la sombra
        elevation: 6, // Para sombras en Android
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#fff'
    },
    plus: {
        fontSize: 40,
    },
    containerBoton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
    button: {
        backgroundColor: '#00509e',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginVertical: 10,
        width: '70%',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    guardar: {
        backgroundColor: 'green'
    },
    inputContainer: {
        marginBottom: 15,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        color: '#fff',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 14,
        width: '100%',
        backgroundColor: '#f9f9f9',
    },
});
