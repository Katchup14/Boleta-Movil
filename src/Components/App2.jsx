import { Button, StyleSheet, Text, View } from 'react-native';
import InicioDoc from './Aplicacion/Docente/InicioDoc';
import InicioEst from './Aplicacion/Estudiante/InicioEst';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './Aplicacion/Docente/loading';
import InicioAdmin from './Aplicacion/Administrador/inicioAdmin';

export default function App2({ rol, usuario, signout }) {
  return (
    <>
      {rol === 'Docente' && <InicioDoc usuario={usuario} signout={signout} />}
      {rol === 'Estudiante' && (
        <InicioEst usuario={usuario} signout={signout} />
      )}
      {rol ==='Administrador' && <InicioAdmin usuario={usuario} signout={signout}/>}
      {!['Docente', 'Estudiante','Administrador'].includes(rol) && <Loading />}
    </>
  );
}
