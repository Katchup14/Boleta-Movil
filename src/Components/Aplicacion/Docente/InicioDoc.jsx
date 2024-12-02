import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MisCursos from './MisCursos';
import CrearCurso from './CrearCurso';
import VerEstudiante from './VerEstudiante';
import EditarPerfil from './EditarPerfil';

const TabNavigator = ({usuario}) => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Ocultar el header en las pantallas de las tabs
      }}
    >
      <Tab.Screen name="Mis Cursos" 
      children={() => <MisCursos usuario={usuario}/>}/>
      <Tab.Screen name="Crear Curso"
      children={() => <CrearCurso usuario={usuario}/>}/>
      <Tab.Screen name="Ver Estudiantes"
       children={() => <VerEstudiante usuario={usuario}/>}/>
    </Tab.Navigator>
  );
};

const InicioDoc = ({usuario}) => {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
        <Drawer.Navigator initialRouteName="Inicio">
        <Drawer.Screen name="Inicio" 
        children={() => <TabNavigator usuario={usuario}/>}/>
        <Drawer.Screen name="Editar Perfil">
          {() => (
              <EditarPerfil usuario={usuario}/>
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Cerrar Sesión">
          {() => (
            <View style={styles.container}>
              <Text>Ayuda</Text>
            </View>
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
});

export default InicioDoc;
