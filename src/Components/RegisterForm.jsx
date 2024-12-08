import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app, db } from './../utils/firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { validateEmail } from '../controller';

export default function RegisterForm({
  changeForm = () => {},
  setRol,
  setUsuario,
}) {
  const [rolI, setRolI] = useState('');
  const [sexo, setSexo] = useState('');
  const [data, setData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [datosCompletos, setDatosCompletos] = useState({
    Nombre: '',
    Apellido_Paterno: '',
    Apellido_Materno: '',
    Contraseña: '',
    Correo: '',
    rol: '',
    sexo: '',
  });

  const [error, setError] = useState({
    emailE: '',
    passwordE: '',
    confirmPasswordE: '',
  });

  const updateData = (newValue, campo) => {
    const newData = { ...data };
    newData[campo] = newValue;
    setData(newData);
  };

  const updateDatosCom = (newValue, campo) => {
    const newData = { ...datosCompletos };
    newData[campo] = newValue;
    setDatosCompletos(newData);
  };

  const validateData = (data) => {
    const { email, password, confirmPassword } = data;
    let newError = { emailE: '', passwordE: '', confirmPasswordE: '' };

    // Validación del correo
    if (!email) {
      newError.emailE = 'El email es obligatorio';
    } else if (!validateEmail(email)) {
      newError.emailE = 'El email no es válido';
    }

    // Validación de la contraseña
    if (!password) {
      newError.passwordE = 'El password es obligatorio';
    } else if (password.length <= 6) {
      newError.passwordE = 'El password debe ser mayor a 6 caracteres';
    }

    if (!confirmPassword) {
      newError.confirmPasswordE = 'Debes confirmar el password';
    } else if (confirmPassword.length <= 6) {
      newError.confirmPasswordE =
        'La confirmación debe ser mayor a 6 caracteres';
    } else if (password !== confirmPassword) {
      newError.confirmPasswordE = 'Las contraseñas no coinciden';
    }

    return newError;
  };

  const registerUser = async (email, password, datosCompletos) => {
    const auth = getAuth(app);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userCollection = collection(db, 'usuarios');
      const docRef = await addDoc(userCollection, {
        uid: user.uid,
        Nombre: datosCompletos.Nombre,
        Apellido_Paterno: datosCompletos.Apellido_Paterno,
        Apellido_Materno: datosCompletos.Apellido_Materno,
        rol: datosCompletos.rol,
        sexo: datosCompletos.sexo,
        Correo: email,
        Contraseña: password,
      });
      setRol(datosCompletos.rol);
      setUsuario({
        id: docRef.id,
        Nombre: datosCompletos.Nombre,
        ApellidoP: datosCompletos.Apellido_Paterno,
        ApellidoM: datosCompletos.Apellido_Materno,
      });
    } catch (error) {
      //console.error("Error al guardar el empleado:", error);
      if (error.code === 'auth/email-already-in-use') {
        alert('Este correo ya está registrado. Por favor, utiliza otro.');
      } else {
        alert('Error al guardar los datos. Intenta nuevamente.');
      }
    }
  };

  const check = async () => {
    const { email, password, confirmPassword } = data;
    const newError = validateData(data);
    setError(newError);

    if (!datosCompletos.Nombre) {
      alert('Por favor, llene su nombre.');
      return;
    }

    if (!datosCompletos.Apellido_Paterno) {
      alert('Por favor, llene su apellido paterno.');
      return;
    }

    if (!datosCompletos.Apellido_Materno) {
      alert('Por favor, llene su apellido materno.');
      return;
    }

    if (!datosCompletos.rol) {
      alert('Por favor, seleccione su rol.');
      return;
    }

    if (!datosCompletos.sexo) {
      alert('Por favor, seleccione su sexo.');
      return;
    }

    if (!newError.emailE && !newError.passwordE && !newError.confirmPasswordE) {
      console.log('---------- No hay errores -----------');
      await registerUser(email, password, datosCompletos);
    } else if (newError.emailE) {
      alert(newError.emailE);
    } else if (newError.passwordE) {
      alert(newError.passwordE);
    } else if (newError.confirmPasswordE) {
      alert(newError.confirmPasswordE);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Nombre'
        placeholderTextColor='#fff'
        onChangeText={(nv) => {
          updateDatosCom(nv, 'Nombre');
        }}
      />
      <TextInput
        style={styles.input}
        placeholder='Apellido Paterno'
        placeholderTextColor='#fff'
        onChangeText={(nv) => {
          updateDatosCom(nv, 'Apellido_Paterno');
        }}
      />
      <TextInput
        style={styles.input}
        placeholder='Apellido Materno'
        placeholderTextColor='#fff'
        onChangeText={(nv) => {
          updateDatosCom(nv, 'Apellido_Materno');
        }}
      />
      <View style={styles.selectContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={rolI}
            style={styles.picker}
            onValueChange={(nv) => {
              updateDatosCom(nv, 'rol');
            }}
          >
            <Picker.Item label=' Rol' value='' />
            <Picker.Item label='Docente' value='Docente' />
            <Picker.Item label='Estudiante' value='Estudiante' />
            <Picker.Item label='Administrador' value='Administrador' />
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sexo}
            style={styles.picker}
            onValueChange={(nv) => {
              updateDatosCom(nv, 'sexo');
            }}
          >
            <Picker.Item label='sexo' value='' />
            <Picker.Item label='Masculino' value='Masculino' />
            <Picker.Item label='Femenino' value='Femenino' />
          </Picker>
        </View>
      </View>
      <TextInput
        style={styles.input}
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder='Confirma tu contraseña'
          placeholderTextColor='#fff'
          secureTextEntry={!showConfirmPassword}
          onChangeText={(nv) => {
            updateData(nv, 'confirmPassword');
          }}
        />
        <Icon
          name={showConfirmPassword ? 'visibility' : 'visibility-off'}
          size={24}
          color='grey'
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={check}>
        <Text style={styles.buttonText}>Registrate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={changeForm}>
        <Text style={styles.buttonText}>Iniciar Sesion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignItems: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: '#1e3040',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1.5,
    fontSize: 16,
    marginVertical: 8,
  },
  selectContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  pickerContainer: {
    backgroundColor: '#1e3040',
    borderRadius: 25,
    width: '48%',
    paddingHorizontal: 5,
    borderWidth: 1.5,
  },
  picker: {
    color: '#fff',
    fontSize: 16,
  },
  inputField: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3040',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    marginVertical: 10,
    paddingVertical: 3,
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
