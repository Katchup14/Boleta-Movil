import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from './../../../utils/firebase.js';
import Curso from './Curso.jsx';

export default function VerCurso({ navigation, usuario }) {
  const [cursosInscritos, setCursosInscritos] = useState([]);

  useEffect(() => {
    const obtenerCursosInscritos = async () => {
      console.log('soy usuario', usuario);

      try {
        const q = query(
          collection(db, 'curso_Inscrito'),
          where('id_Estudiante', '==', usuario.id)
        );

        const querySnapshot = await getDocs(q);

        const cursosData = await Promise.all(
          querySnapshot.docs.map(async (inscripcionDoc) => {
            const cursoRef = doc(db, 'cursos', inscripcionDoc.data().id_curso);
            const cursoDocSnap = await getDoc(cursoRef);
            return {
              id: inscripcionDoc.id,
              ...inscripcionDoc.data(),
              ...cursoDocSnap.data(),
            };
          })
        );
        setCursosInscritos(cursosData);
      } catch (error) {
        console.error('Error al obtener los cursos inscritos: ', error);
      }
    };
    obtenerCursosInscritos();
  }, [usuario.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cursos Inscritos</Text>
      <ScrollView style={styles.scroll}>
        {cursosInscritos.map((curso) => (
          <Curso
            key={curso.id}
            curso={curso}
            usuario={usuario}
            setCursos={setCursosInscritos}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#001F54',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  scroll: {
    marginBottom: 20,
  },
});
