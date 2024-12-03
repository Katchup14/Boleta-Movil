import { React, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from "./../../../utils/firebase.js";


const MisCursos = ({ navigation, usuario }) => {
  const [cursos, setCursos] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);


  useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        const q = query(collection(db, 'cursos'), where('id_profesor', '==', usuario.id));
        const querySnapshot = await getDocs(q);
        const cursosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCursos(cursosData);
      } catch (error) {
        console.error('Error al obtener los empleados: ', error);
      }
    };

    obtenerEmpleados();

  }, [cursos])

  const abrirModal = (curso) => {
    setCursoSeleccionado(curso);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setCursoSeleccionado(null);
  };
  const eliminarCurso = async (curso) => {
    try {
      const q = query(collection(db, 'curso_Inscrito'), where('id_curso', '==', curso.id));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (documentSnapshot) => {
          const idCurso = documentSnapshot.id;
          await deleteDoc(doc(db, 'curso_Inscrito', idCurso));
        });

      } else {
        console.log('No se encontraron documentos que coincidan con el filtro');
        const cursoRef = doc(db, 'cursos', curso.id);
        await deleteDoc(cursoRef);
        alert('Curso Eliminado');
        setCursos((prevCursos) => prevCursos.filter((item) => item.id !== curso.id));
        cerrarModal()
      }
    } catch (error) {
      console.error('Error al obtener documentos: ', error);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Mis Cursos</Text>
        <ScrollView style={styles.scroll}>
          {cursos.length === 0 ? (
            <Text style={styles.title}>¡Registra tu curso ahora!</Text>
          ) : (
            cursos.map(curso => (
              <TouchableOpacity key={curso.id} style={styles.card} onPress={() => abrirModal(curso)}>
                <Text style={styles.courseName}>Curso: {curso.Nombre}</Text>
                <Text style={styles.subject}>Materia: {curso.Materia}</Text>
                <Text style={styles.status}>Estatus: {curso.Estatus}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
      {cursoSeleccionado && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cerrarModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalles del Curso</Text>
              <Text>Nombre: {cursoSeleccionado.Nombre}</Text>
              <Text style={[styles.modalTitle, styles.plus]}>{cursoSeleccionado.Codigo}</Text>
              <View style={styles.containerBoton}>
                <Button title="Eliminar" onPress={() => { eliminarCurso(cursoSeleccionado) }}  />
                <Button title="Cerrar" onPress={cerrarModal} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

export default MisCursos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#001F54', // Azul marino bonito
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3, // Para Android
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subject: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#e6e6e6', // Gris ligeramente más oscuro
    borderColor: '#000',        // Borde blanco
    borderWidth: 1,
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
  plus: {
    fontSize: 40,
  },
  containerBoton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%'
  },
  botonEliminar:{
    backgroundColor: 'red',
    }
});