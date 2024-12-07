import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from './../../../utils/firebase.js';
import Curso from './Curso.jsx';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native';

export default function VerCurso({ navigation, usuario }) {
  const [cursosInscritos, setCursosInscritos] = useState([]);

  const obtenerCursosInscritos = () => {
    console.log('Configurando listener de cursos inscritos');

    const q = query(
      collection(db, 'curso_Inscrito'),
      where('id_Estudiante', '==', usuario.id)
    );

    //Función de Firestore que permite escuchar cambios en tiempo real en una colección o documento específico
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
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
      console.log('Hubó cambios');

      setCursosInscritos(cursosData);
    });

    return unsubscribe;
  };

  useFocusEffect(
    useCallback(() => {
      console.log('Estoy focus en Ver Curso');

      // Se resetean los estados como al principio
      setCursosInscritos([]);

      const unsubscribe = obtenerCursosInscritos();

      // Limpiar el listener cuando el componente pierde el focus para evitar escuchas inecesarios
      return () => {
        console.log('Perdimos el focus en Ver Curso');
        unsubscribe();
      };
    }, [usuario])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cursos Inscritos</Text>
      <ScrollView style={styles.scroll}>
        {cursosInscritos.length > 0 ? (
          cursosInscritos.map((curso) => (
            <Curso
              key={curso.id}
              curso={curso}
              usuario={usuario}
              setCursos={setCursosInscritos}
            />
          ))
        ) : (
          <>
            <Image
              style={styles.logo}
              source={require('../../../../assets/No_Cursos.png')}
            />
            <Text style={styles.noCoursesText}>0 Cursos Disponibles</Text>
          </>
        )}
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
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  scroll: {
    marginBottom: 20,
  },
  noCoursesText: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  logo: {
    width: 300,
    height: 300,
    marginVertical: 30,
    alignSelf: 'center',
    borderRadius: 15,
  },
});
