import { React, useEffect, useState } from 'react';
import { StyleSheet, Text, View,ScrollView  } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "./../../../utils/firebase.js";


const MisCursos = ({ navigation, usuario }) => {
  const [cursos, setCursos] = useState([])


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


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Cursos</Text>
      <ScrollView style={styles.scroll}>
        {cursos.map(curso => (
          <View key={curso.id} style={styles.card}>
            <Text style={styles.courseName}>Curso: {curso.Nombre}</Text>
            <Text style={styles.subject}>Materia: {curso.Materia}</Text>
            <Text style={styles.status}>Estatus: {curso.Estatus}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
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
});
