import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { db } from "./../../../utils/firebase.js";

const ConsultaDoc = () => {
    const [docente, setDocente] = useState([])
    const [cursos, setCursos] = useState({});
    const [uniqueCurso, setUniqueCurso] = useState([]);
    const [modal, setModal] = useState(false);


    useEffect(() => {
        const obtener = async () => {
            try {
                // Obtener los docentes
                const q = query(collection(db, 'usuarios'), where('rol', '==', 'Docente'));
                const querySnapshot = await getDocs(q);
                const docentesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setDocente(docentesData);

                // Obtener los cursos directamente desde la colección 'cursos'
                const cursosPromises = docentesData.map(async (docente) => {
                    const cursosQuery = query(collection(db, 'cursos'), where('id_profesor', '==', docente.id));
                    const cursosSnapshot = await getDocs(cursosQuery);
                    const cursosNombres = cursosSnapshot.docs.map(doc => doc.data().Nombre);
                    return { id: docente.id, cursos: cursosNombres };
                });

                const cursosData = await Promise.all(cursosPromises);
                const cursosObj = cursosData.reduce((acc, { id, cursos }) => {
                    acc[id] = cursos;
                    return acc;
                }, {});

                setCursos(cursosObj);

            } catch (error) {
                console.error('Error al obtener docentes o cursos: ', error);
            }
        };

        obtener();
    }, []);

    console.log(cursos)

    const mostrarCursos = (id) => {
        const cursosProf = cursos[id];

        if (cursosProf && cursosProf.length > 0) {
            setUniqueCurso(cursosProf);
        } else {
            setUniqueCurso([]);
        }
        setModal(true);
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Listado de Docentes</Text>
                <ScrollView>
                    <View style={styles.table}>
                        <View style={[styles.row, styles.header]}>
                            <Text style={[styles.cell, styles.headerText, styles.smallCell]}>#</Text>
                            <Text style={[styles.cell, styles.headerText]}>Nombre</Text>
                            <Text style={[styles.cell, styles.headerText]}>Cursos Inscritos</Text>
                        </View>
                        {docente.map((docente, index) => (
                            <View key={docente.id} style={styles.row}>
                                <Text style={[styles.cell, styles.texto, styles.smallCell]}>{index + 1}</Text>
                                <Text style={[styles.cell, styles.texto]}>{docente.Nombre} {docente.Apellido_Paterno} {docente.Apellido_Materno}</Text>
                                <View style={[styles.cell, styles.contenedorB]}>
                                    <TouchableOpacity
                                        style={[styles.editButton]}
                                        onPress={() => mostrarCursos(docente.id)}
                                    >
                                        <Text style={styles.editButtonText}>Cursos</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {modal && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modal}
                    onRequestClose={() => setModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Cursos Creados</Text>
                            <ScrollView>
                                {uniqueCurso.length > 0 ? (
                                    uniqueCurso.map((curso, index) => (
                                        <View key={index} style={styles.courseItem}>
                                            <Text style={styles.courseText}>{curso}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noCoursesText}>No hay cursos registrados.</Text>
                                )}
                            </ScrollView>
                            <TouchableHighlight
                                style={styles.closeButton}
                                onPress={() => setModal(false)}
                            >
                                <Text style={styles.closeButtonText}>Cerrar</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            )}

        </>
    );
};

const styles = StyleSheet.create({
    // Estilos generales
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
        justifyContent: 'space-between',
    },
    header: {
        backgroundColor: '#00509e',
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
    },
    smallCell: {
        flex: 0.2,
    },
    texto: {
        fontSize: 15,
        textAlign: 'center',
    },
    contenedorB: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        width: '60%',
        borderRadius: 4,
        backgroundColor: '#FFC107',
        paddingVertical: 7,
        textAlign: 'center',
    },
    editButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#001F54',
        padding: 20,
        borderRadius: 8,
        borderWidth: 2,  // Añade el borde
        borderColor: '#ccc', // Color del borde (puedes cambiarlo si prefieres otro color)
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    courseItem: {
        backgroundColor: '#f8f9fa',  // Fondo más claro para las tarjetas
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,  // Sombra en dispositivos Android
    },

    courseText: {
        fontSize: 16,
        color: '#495057',  // Un color gris oscuro
        fontWeight: 'bold',  // Para resaltar el texto
        textAlign: 'center',  // Centrado de texto
    },
    noCoursesText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#28a745',  // Color verde (puedes cambiarlo a otro que prefieras)
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ConsultaDoc;
