import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from './../../../utils/firebase.js';
import { useFocusEffect } from '@react-navigation/native';
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

  useFocusEffect(
    React.useCallback(() => {
      console.log('Estoy focus');

      // Se resetean los estados como al principio
      setCodigoCurso('');
      setCursoData(null);
      setIsCameraOpen(false);

      // Retornar una función de limpieza si es necesario
      return () => {
        console.log('Perdimos el focus');
      };
    }, [])
  );

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
      {!cursoData && (
        <Image
          style={styles.logo}
          source={require('../../../../assets/Agregar_Curso.png')}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder='Ingresa el código del Curso'
        placeholderTextColor='#000'
        value={codigoCurso}
        onChangeText={setCodigoCurso}
      />
      {cursoData && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles del Curso</Text>
            <Text style={styles.cursoText}>
              <Text style={{ fontWeight: 'bold' }}>Materia:</Text>{' '}
              {cursoData.Materia}
            </Text>
            <Text style={styles.cursoText}>
              <Text style={{ fontWeight: 'bold' }}>Nombre:</Text>{' '}
              {cursoData.Nombre}
            </Text>
            <Text style={styles.cursoText}>
              <Text style={{ fontWeight: 'bold' }}>Año:</Text> {cursoData.año}
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.greenButton]}
              onPress={unirmeACurso}
            >
              <Text style={styles.buttonText}>Unirme al Curso</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={[styles.button, styles.wideButton]}
        onPress={() => buscarCurso(codigoCurso)}
      >
        <Text style={styles.buttonText}>Buscar Curso</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.wideButton, styles.buttonSpacing]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#001F54',
    padding: 20,
  },
  title: {
    marginVertical: 20,
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '80%',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 20,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    marginVertical: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  wideButton: {
    width: '80%',
  },
  buttonSpacing: {
    marginTop: 30,
  },
  cursoText: {
    fontSize: 16,
    color: '#333',
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
  modalContainer: {
    marginTop: 10,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#e6e6e6',
    borderColor: '#000',
    borderWidth: 2,
    padding: 25,
    borderRadius: 10,
    width: '80%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginTop: 2,
    marginBottom: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginTop: 15,
    alignSelf: 'center',
  },
  greenButton: {
    backgroundColor: '#00cc44', // Verde
  },
  logo: {
    width: 150,
    height: 150,
    marginVertical: 30,
  },
});
