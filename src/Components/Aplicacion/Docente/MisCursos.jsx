import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MisCursos = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Cursos</Text>
      <View style={styles.card}>
        <Text style={styles.courseName}>Curso: Matemáticas</Text>
        <Text style={styles.subject}>Materia: Álgebra</Text>
        <Text style={styles.status}>Estatus: En curso</Text>
      </View>
      
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
    color:'#fff',
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
