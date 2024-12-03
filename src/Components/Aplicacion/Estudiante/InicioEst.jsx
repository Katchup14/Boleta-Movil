import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa los íconos
import { NavigationContainer } from '@react-navigation/native';
import EditarPerfil from '../Docente/EditarPerfil';
import AgregarCurso from './AgregarCurso';
import VerCurso from './VerCurso';

const TabNavigator = ({ usuario }) => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Ocultar el header en las pantallas de las tabs
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Definir íconos para cada pestaña
          if (route.name === 'Agregar Curso') {
            iconName = 'add-circle-outline'; // Ícono para Agregar Curso
          } else if (route.name === 'Ver Cursos') {
            iconName = 'eye-outline'; // Ícono para Ver Cursos
          }

          // Retornar el ícono correspondiente
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2b6cb0', // Color activo
        tabBarInactiveTintColor: 'gray', // Color inactivo
      })}
    >
      <Tab.Screen
        name='Agregar Curso'
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
        <Drawer.Screen
          name='Editar Perfil'
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name='create-outline' size={size} color={color} /> // Ícono para Editar Perfil
            ),
          }}
        >
          {() => <EditarPerfil usuario={usuario} />}
        </Drawer.Screen>
        <Drawer.Screen
          name='Cerrar Sesión'
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name='log-out-outline' size={size} color={color} /> // Ícono para Cerrar Sesión
            ),
          }}
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
