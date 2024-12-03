import { React, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from './../../../utils/firebase.js';

export default function AgregarCurso({ navigation, usuario }) {
  const [codigoCurso, setCodigoCurso] = useState('');
  const [cursoData, setCursoData] = useState(null);

  const buscarCurso = async () => {
    try {
      const cursosCollection = collection(db, 'cursos');
      const q = query(cursosCollection, where('Codigo', '==', codigoCurso));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setCursoData({ ...doc.data(), uid: doc.id });
        });
      } else {
        setCursoData(null);
        Alert.alert('Curso no encontrado');
      }
    } catch (error) {
      console.error('Error al buscar el curso:', error);
    }
  };

  const unirmeACurso = async () => {
    console.log('Usuario:', usuario);
    console.log('Curso Data:', cursoData);

    if (!cursoData) {
      Alert.alert('Por favor, busca un curso primero');
      return;
    }

    try {
      // Verificar inscripción
      const cursoInscritoCollection = collection(db, 'curso_Inscrito');
      const q = query(
        cursoInscritoCollection,
        where('id_curso', '==', cursoData.uid),
        where('id_Estudiante', '==', usuario.id)
      );
      console.log('Consulta de inscripción:', q);

      const querySnapshot = await getDocs(q);
      console.log('Resultados de la consulta:', querySnapshot.empty);

      if (!querySnapshot.empty) {
        Alert.alert('Ya estás inscrito en este curso');
        setCursoData(null);
        setCodigoCurso('');
        return;
      }

      // Unirse al curso
      await addDoc(cursoInscritoCollection, {
        Calificaciones: ['-1', '-1', '-1', '-1', '-1'],
        id_Estudiante: usuario.id,
        id_curso: cursoData.uid,
      });
      Alert.alert('Inscrito en el curso exitosamente');
      setCursoData(null);
      setCodigoCurso('');
    } catch (error) {
      console.error('Error al inscribirse en el curso:', error);
      Alert.alert('Error al inscribirse en el curso');
      setCursoData(null);
      setCodigoCurso('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Curso</Text>
      <TextInput
        style={styles.input}
        placeholder='Ingresa el código del Curso'
        placeholderTextColor='#000'
        value={codigoCurso}
        onChangeText={setCodigoCurso}
      />
      <TouchableOpacity style={styles.button} onPress={buscarCurso}>
        <Text style={styles.buttonText}>Buscar Curso</Text>
      </TouchableOpacity>
      {cursoData && (
        <View style={styles.cursoInfo}>
          <Text style={styles.cursoText}>Materia: {cursoData.Materia}</Text>
          <Text style={styles.cursoText}>Nombre: {cursoData.Nombre}</Text>
          <Text style={styles.cursoText}>Año: {cursoData.año}</Text>
          <TouchableOpacity style={styles.button} onPress={unirmeACurso}>
            <Text style={styles.buttonText}>Unirme al Curso</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#001F54',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 20,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  cursoInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  cursoText: {
    color: 'white',
    fontSize: 18,
    marginVertical: 5,
  },
});
