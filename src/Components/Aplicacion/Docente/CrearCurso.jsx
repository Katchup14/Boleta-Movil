import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { React, useState, useEffect } from 'react';
import { db } from './../../../utils/firebase.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const CrearCurso = ({ navigaion, usuario }) => {
  const [data, setData] = useState({
    Materia: '',
    Nombre: '',
    Año: '',
  });

  const updateData = (newValue, campo) => {
    const newData = { ...data };
    newData[campo] = newValue;
    setData(newData);
  };

  const newCurso = async () => {
    const { Materia, Nombre, Año } = data;

    if (!Materia || !Nombre || !Año) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    try {
      // Obtener todos los códigos existentes
      const cursosCollection = collection(db, 'cursos');
      const querySnapshot = await getDocs(cursosCollection);
      const existingCodes = new Set(
        querySnapshot.docs.map((doc) => doc.data().Codigo)
      );

      console.log('códigos existentes', Array.from(existingCodes));

      let cod;
      // Generar un código único
      do {
        cod = codigo();
        console.log('código generado', cod);
      } while (existingCodes.has(cod));

      const userCollection = collection(db, 'cursos');
      await addDoc(userCollection, {
        Codigo: cod,
        Estatus: 'Activo',
        Materia: data.Materia,
        Nombre: data.Nombre,
        año: data.Año,
        id_profesor: usuario.id,
      });

      alert(`Guardado con éxito Tu Codigo de acceso es: ${cod}`);
      setData({
        Materia: '',
        Nombre: '',
        Año: '',
      });
    } catch (error) {
      console.error('Error al guardar el curso:', error);
      alert('Error al guardar los datos. Intenta nuevamente.');
    }
  };

  const codigo = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';

    // Generar 4 letras aleatorias
    const parteLetras = Array.from(
      { length: 4 },
      () => letras[Math.floor(Math.random() * letras.length)]
    ).join('');

    // Generar 4 números aleatorios
    const parteNumeros = Array.from(
      { length: 4 },
      () => numeros[Math.floor(Math.random() * numeros.length)]
    ).join('');

    // Combinar y devolver el código
    return `${parteLetras}-${parteNumeros}`;
  };

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps='always'
      >
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require('../../../../assets/Curso.png')}
          />
          <Text style={styles.title}>Registra un Nuevo Curso</Text>
          <TextInput
            style={styles.input}
            placeholder='Nombre del Curso'
            placeholderTextColor='#000'
            value={data.Nombre}
            onChangeText={(nv) => {
              updateData(nv, 'Nombre');
            }}
          />
          <TextInput
            style={styles.input}
            placeholder='Materia'
            placeholderTextColor='#000'
            value={data.Materia}
            onChangeText={(nv) => {
              updateData(nv, 'Materia');
            }}
          />
          <TextInput
            style={styles.input}
            placeholder='Año'
            placeholderTextColor='#000'
            keyboardType='numeric'
            value={data.Año}
            maxLength={4}
            onChangeText={(nv) => {
              if (/^\d{0,4}$/.test(nv)) {
                updateData(nv, 'Año');
              }
            }}
          />
          <TouchableOpacity style={styles.button} onPress={newCurso}>
            <Text style={styles.buttonText}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CrearCurso;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#001F54',
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#001F54',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    backgroundColor: '#001F54', // Azul marino bonito
    paddingVertical: 20,
    gap: 15,
  },
  title: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    fontSize: 16,
    paddingVertical: 10,
    marginVertical: 5,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 1,
    marginBottom: 1,
  },
  button: {
    backgroundColor: '#00509e',
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
    width: '70%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
