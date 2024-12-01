import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Input from './src/Input'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import app from './src/utils/firebase.js'
import Auth from './src/Components/Auth.jsx';
import App2 from './src/Components/Aplicacion/App2.jsx';

export default function App() {
  const [value, setValue] = useState();
  const [user, setUser] = useState(null); // Cambié a null para indicar estado de carga

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

  if (user === null) return null; // Muestra nada mientras se espera el estado de autenticación

  return (
    <View style={styles.container}>
     {user ? <Logout /> : <Auth />}
    </View>
  );
}


function Logout() {
  const signout = () => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      console.log('Se cerró la sesión');
    }).catch((error) => {
      console.log('Error al cerrar sesión', error);
    });
  };
  return(
    <App2 signout={signout}/>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
