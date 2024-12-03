import { Button, StyleSheet, Text, View } from 'react-native';
import InicioDoc from './Aplicacion/Docente/InicioDoc';
import InicioEst from './Aplicacion/Estudiante/InicioEst';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App2({ rol, usuario, signout }) {
  return (
    <>
      {rol === 'Docente' && <InicioDoc usuario={usuario} signout={signout} />}
      {rol === 'Estudiante' && (
        <InicioEst usuario={usuario} signout={signout} />
      )}
      {!['Docente', 'Estudiante'].includes(rol) && (
        <Text>Rol no válido o no especificado</Text>
      )}
    </>
  );
}
