import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Input from './src/Input'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

import app from './src/utils/firebase.js'
import Auth from './src/Components/Auth.jsx';
import App2 from './src/Components/App2.jsx';
import Inicio from './src/Components/Aplicacion/Estudiante/InicioEst.jsx';

export default function App() {
  const [value, setValue] = useState();
  const [user, setUser] = useState(null); // Cambié a null para indicar estado de carga
  const [rol,setRol]=useState('')
  const [usuario,setUsuario]=useState({});


  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Está autenticado');
        setUser(true);
      } else {
        console.log('No está autenticado');
        setUser(false);
      }
    });

  }, []);

  const signout = () => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      console.log('Se cerró la sesión');
    }).catch((error) => {
      console.log('Error al cerrar sesión', error);
    });
  };

  if (user === null) return null; // Muestra nada mientras se espera el estado de autenticación

  return (
    <View style={styles.container}>
     {user ? <App2 rol={rol} usuario={usuario} signout={signout}/> : <Auth setRol={setRol} setUsuario={setUsuario}/>}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
