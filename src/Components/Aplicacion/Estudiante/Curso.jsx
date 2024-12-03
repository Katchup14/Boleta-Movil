import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from './../../../utils/firebase.js';

export default function Curso({ curso, usuario, setCursos }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  const abrirModal = (curso) => {
    setCursoSeleccionado(curso);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setCursoSeleccionado(null);
  };

  const darDeBaja = async (cursoId) => {
    try {
      await deleteDoc(doc(db, 'curso_Inscrito', cursoId));
      setCursos((prevCursos) =>
        prevCursos.filter((curso) => curso.id !== cursoId)
      );
      cerrarModal();
    } catch (error) {
      console.error('Error al dar de baja el curso: ', error);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.courseName}>Curso: {curso.Nombre}</Text>
      <Text style={styles.subject}>Materia: {curso.Materia}</Text>
      <Text style={styles.status}>Estatus: {curso.Estatus}</Text>
      <Text style={styles.grade}>
        Calificaciones:{' '}
        {curso.Calificaciones ? curso.Calificaciones.join(', ') : 'N/A'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => abrirModal(curso)}>
        <Text style={styles.buttonText}>Dar de Baja</Text>
      </TouchableOpacity>
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
              <Text>Nombre: {cursoSeleccionado.Nombre}</Text>
              <Text>Código: {cursoSeleccionado.Codigo}</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.closeButton]}
                  onPress={cerrarModal}
                >
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={() => darDeBaja(cursoSeleccionado.id)}
                >
                  <Text style={styles.buttonText}>Confirmar Baja</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
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
  grade: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#e6e6e6',
    borderColor: '#000',
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: '#808080', // Gris
  },
  confirmButton: {
    backgroundColor: '#FF0000', // Rojo
  },
});
