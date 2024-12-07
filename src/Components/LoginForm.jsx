import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { app, db } from '../utils/firebase.js';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

export default function LoginForm({
  changeForm = () => {},
  setRol,
  setUsuario,
}) {
  const [data, setData] = useState({ email: '', password: '' });

  const updateData = (newValue, campo) => {
    const newData = { ...data };
    newData[campo] = newValue;
    setData(newData);
  };

  const singin = async () => {
    const { email, password } = data;
    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user; // El usuario autenticado
      const usersCollection = collection(db, 'usuarios');
      const q = query(usersCollection, where('Correo', '==', email));

      const querySnapshot = await getDocs(q); // Ahora utilizamos await aquí

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const rol = userDoc.data().rol; // Suponiendo que tienes un campo "rol"
        setUsuario({
          Nombre: userDoc.data().Nombre,
          ApellidoP: userDoc.data().Apellido_Paterno,
          ApellidoM: userDoc.data().Apellido_Materno,
          id: userDoc.id,
        });
        setRol(rol);
        return rol;
      } else {
        alert('No se Encontraron las Crendenciales');
        console.log('No se encontró el usuario con el correo proporcionado');
      }
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        alert(
          'El correo electrónico no es válido. Por favor ingresa un correo electrónico válido.'
        );
      }
      if (error.code === 'auth/missing-password') {
        alert('Favor de colocar la contraseña');
      }
      if (error.code === 'auth/invalid-credential') {
        alert('Credenciales no Validas');
      }
      console.log('Error:', error.message);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  console.log(data);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>
      <TextInput
        style={[styles.input]}
        placeholder='Ingresa tu correo'
        placeholderTextColor='#fff'
        onChangeText={(nv) => {
          updateData(nv, 'email');
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder='Ingresa tu contraseña'
          placeholderTextColor='#fff'
          secureTextEntry={!showPassword}
          onChangeText={(nv) => {
            updateData(nv, 'password');
          }}
        />
        <Icon
          name={showPassword ? 'visibility' : 'visibility-off'}
          size={24}
          color='grey'
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={singin}>
        <Text style={styles.buttonText}>INICIAR SESION</Text>
      </TouchableOpacity>

      <Text style={styles.texto}>¿No tienes una cuenta?</Text>
      <TouchableOpacity style={styles.button} onPress={changeForm}>
        <Text style={styles.buttonText}>REGISTRARSE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
    gap: 10,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    backgroundColor: '#1e3040',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1.5,
    fontSize: 18,
    marginVertical: 8,
  },
  inputField: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
  },
  inputContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3040',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    marginVertical: 10,
    paddingVertical: 5,
  },
  texto: {
    width: '80%',
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#00509e',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
    width: '60%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
