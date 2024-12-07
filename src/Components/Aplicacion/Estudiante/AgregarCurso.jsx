import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from './../../../utils/firebase.js';

import { CameraView, useCameraPermissions } from 'expo-camera';

export default function AgregarCurso({ navigation, usuario }) {
  const [codigoCurso, setCodigoCurso] = useState('');
  const [cursoData, setCursoData] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const buscarCurso = async (codigo) => {
    try {
      const cursosCollection = collection(db, 'cursos');
      const q = query(cursosCollection, where('Codigo', '==', codigo));
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

  const handleBarCodeScanned = (data) => {
    setIsCameraOpen(false);
    console.log('Soy el código', data);
    setCodigoCurso(data);
    buscarCurso(data);
  };

  const unirmeACurso = async () => {
    console.log('Usuario:', usuario);
    console.log('Curso Data:', cursoData);

    if (!cursoData) {
      Alert.alert('Por favor, busca un curso primero');
      return;
    }

    try {
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

  if (!permission) {
    console.log('Con permisos');
    return <View />;
  }

  if (!permission.granted) {
    console.log('Sin permisos');
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Necesitamos tu permiso para acceder a la cámara
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
      <TouchableOpacity
        style={styles.button}
        onPress={() => buscarCurso(codigoCurso)}
      >
        <Text style={styles.buttonText}>Buscar Curso</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsCameraOpen(true)}
      >
        <Text style={styles.buttonText}>Escanear Curso</Text>
      </TouchableOpacity>
      {isCameraOpen && (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing='back'
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={({ data }) => {
              handleBarCodeScanned(data);
            }}
          >
            <View style={styles.cameraOverlay}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsCameraOpen(false)}
              >
                <Text style={styles.buttonText}>Cerrar Cámara</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </SafeAreaView>
      )}
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
  cameraContainer: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 30,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
});
