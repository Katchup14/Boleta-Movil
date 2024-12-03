import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import EditarPerfil from '../Docente/EditarPerfil';
import AgregarCurso from './AgregarCurso';
import VerCurso from './VerCurso';

const TabNavigator = ({ usuario }) => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Ocultar el header en las pantallas de las tabs
      }}
    >
      <Tab.Screen
        name='Agrrega Curso'
        children={() => <AgregarCurso usuario={usuario} />}
      />
      <Tab.Screen
        name='Ver Cursos'
        children={() => <VerCurso usuario={usuario} />}
      />
    </Tab.Navigator>
  );
};

const InicioEst = ({ usuario, signout }) => {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='Inicio'>
        <Drawer.Screen
          name='Inicio'
          children={() => <TabNavigator usuario={usuario} />}
        />
        <Drawer.Screen name='Editar Perfil'>
          {() => <EditarPerfil usuario={usuario} />}
        </Drawer.Screen>
        <Drawer.Screen
          name='Cerrar Sesión'
          children={() => {
            signout();
            return null;
          }}
        />
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

export default InicioEst;
