import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app, db } from '../../../utils/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { validateEmail } from '../../../controller';

export default function RegistrarAdmin({ }) {
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
                rol: 'Administrador',
                sexo: datosCompletos.sexo,
                Correo: email,
                Contraseña: password,
            });
            reset()
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('Este correo ya está registrado. Por favor, utiliza otro.');
            } else {
                alert('Error al guardar los datos. Intenta nuevamente.');
            }
        }
    };

    const reset=()=>{
        setDatosCompletos({
            Nombre: '',
            Apellido_Paterno: '',
            Apellido_Materno: '',
            Contraseña: '',
            Correo: '',
            sexo: '',
        })
        setData({
            email: '',
            password: '',
            confirmPassword: '',
        })
        setSexo('')
        alert("El administrador se ha Registrado Correctamente")
    }

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
                        source={require('../../../../assets/AdminLogo.png')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Nombre'
                        placeholderTextColor='#000'
                        value={datosCompletos.Nombre}
                        onChangeText={(nv) => {
                            updateDatosCom(nv, 'Nombre');
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Apellido Paterno'
                        placeholderTextColor='#000'
                        value={datosCompletos.Apellido_Paterno}
                        onChangeText={(nv) => {
                            updateDatosCom(nv, 'Apellido_Paterno');
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Apellido Materno'
                        placeholderTextColor='#000'
                        value={datosCompletos.Apellido_Materno}
                        onChangeText={(nv) => {
                            updateDatosCom(nv, 'Apellido_Materno');
                        }}
                    />
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
                    <TextInput
                        style={styles.input}
                        placeholder='Ingresa tu correo'
                        placeholderTextColor='#000'
                        value={data.email}
                        onChangeText={(nv) => {
                            updateData(nv, 'email');
                        }}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputField}
                            placeholder='Ingresa tu contraseña'
                            placeholderTextColor='#000'
                            value={data.password}
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
                            placeholderTextColor='#000'
                            value={data.confirmPassword}
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
                        <Text style={styles.buttonText}>Registrar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'flex-start',
        backgroundColor: '001F54',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        color: '#000',
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
        backgroundColor: '#fff',
        borderRadius: 25,
        width: '100%',
        paddingHorizontal: 5,
        borderWidth: 1.5,
    },
    picker: {
        color: '#000',
        fontSize: 16,
    },
    inputField: {
        flex: 1,
        color: '#000',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
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
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        backgroundColor: '#001F54',
    },
    logo: {
        width: 200,
        height: 150,
        marginTop: 15,
        marginBottom: 1,
      },
});
