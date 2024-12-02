import { Button, StyleSheet, Text, View } from 'react-native';
import InicioDoc from './Aplicacion/Docente/InicioDoc';
import InicioEst from './Aplicacion/Estudiante/InicioEst';
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function App2({ signout,rol,usuario }) {
  return (
    <>
      {rol === "Docente" && <InicioDoc usuario={usuario}/>}
      {rol === "Estudiante" && <InicioEst />}
      {!["Docente", "Estudiante"].includes(rol) && (
        <Text>Rol no válido o no especificado</Text>
      )}
    </>
  );
}


