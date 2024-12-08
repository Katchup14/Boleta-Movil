import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import {
  getAuth,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { db } from './../../../utils/firebase.js';

const EditarPerfil = ({ navigation, usuario }) => {
  const [datosCompletos, setDatosCompletos] = useState({
    Nombre: '',
    Apellido_Paterno: '',
    Apellido_Materno: '',
    Contraseña: '',
    Correo: '',
    rol: '',
    sexo: '',
  });
  const [datosOriginales, setDatosOriginales] = useState({});
  const auth = getAuth();
  const user = auth.currentUser;

  const obtenerEmpleadoPorId = async (docId) => {
    try {
      const docRef = doc(db, 'usuarios', docId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const usuarioData = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        };
        setDatosCompletos(usuarioData);
        setDatosOriginales(usuarioData); // Guardar los datos originales
      } else {
        console.log('No se encontró el documento');
      }
    } catch (error) {
      console.error('Error al obtener el empleado: ', error);
    }
  };

  const handleUpdate = async () => {
    const { Nombre, Apellido_Paterno, Apellido_Materno, sexo } = datosCompletos;

    if (!Nombre || !Apellido_Paterno || !Apellido_Materno || !sexo) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    if (
      Nombre === datosOriginales.Nombre &&
      Apellido_Paterno === datosOriginales.Apellido_Paterno &&
      Apellido_Materno === datosOriginales.Apellido_Materno &&
      sexo === datosOriginales.sexo
    ) {
      alert('No hay cambios, no se realiza la actualización.');
      return; // No hacer nada si no hay cambios
    }

    try {
      const empleadoRef = doc(db, 'usuarios', datosCompletos.id);

      // Actualizar los datos
      await updateDoc(empleadoRef, {
        Nombre,
        Apellido_Paterno,
        Apellido_Materno,
        sexo,
      });
      setDatosOriginales(datosCompletos);
      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      alert('Ocurrió un error al actualizar los datos');
    }
  };

  useEffect(() => {
    obtenerEmpleadoPorId(usuario.id);
  }, []);

  const updateDatosCom = (newValue, campo) => {
    const newData = { ...datosCompletos };
    newData[campo] = newValue;
    setDatosCompletos(newData);
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
            source={require('../../../../assets/Perfil.png')}
          />
          <Text style={styles.title}>Editar Perfil</Text>
          <TextInput
            style={styles.input}
            placeholder='Nombre'
            value={datosCompletos.Nombre}
            placeholderTextColor='#fff'
            onChangeText={(nv) => updateDatosCom(nv, 'Nombre')}
          />
          <TextInput
            style={styles.input}
            placeholder='Apellido Paterno'
            value={datosCompletos.Apellido_Paterno}
            placeholderTextColor='#fff'
            onChangeText={(nv) => updateDatosCom(nv, 'Apellido_Paterno')}
          />
          <TextInput
            style={styles.input}
            placeholder='Apellido Materno'
            value={datosCompletos.Apellido_Materno}
            placeholderTextColor='#fff'
            onChangeText={(nv) => updateDatosCom(nv, 'Apellido_Materno')}
          />
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={datosCompletos.sexo}
              style={styles.picker}
              onValueChange={(nv) => updateDatosCom(nv, 'sexo')}
            >
              <Picker.Item label='Sexo' value='' />
              <Picker.Item label='Masculino' value='Masculino' />
              <Picker.Item label='Femenino' value='Femenino' />
            </Picker>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#001F54', // Azul marino bonito
    gap: 15,
  },
  title: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 1,
    marginBottom: 1,
  },
  input: {
    width: '80%',
    backgroundColor: '#1e3040',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1.5,
    fontSize: 16,
  },
  selectContainer: {
    width: '80%',
    borderWidth: 1.5,
    justifyContent: 'space-between',
    backgroundColor: '#1e3040',
    borderRadius: 40,
  },
  picker: {
    paddingHorizontal: 10,
    color: '#fff',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditarPerfil;
