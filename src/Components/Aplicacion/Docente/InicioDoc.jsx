import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa los íconos
import { NavigationContainer } from '@react-navigation/native';
import MisCursos from './MisCursos';
import CrearCurso from './CrearCurso';
import VerEstudiante from './VerEstudiante';
import EditarPerfil from './EditarPerfil';
import Loading from './loading';

const TabNavigator = ({ usuario }) => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Definir íconos para cada pestaña
          if (route.name === 'Mis Cursos') {
            iconName = 'book-outline'; // Ícono para Mis Cursos
          } else if (route.name === 'Crear Curso') {
            iconName = 'add-circle-outline'; // Ícono para Crear Curso
          } else if (route.name === 'Ver Estudiantes') {
            iconName = 'people-outline'; // Ícono para Ver Estudiantes
          }

          // Retornar el ícono correspondiente
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2b6cb0', // Color activo
        tabBarInactiveTintColor: 'gray',  // Color inactivo
      })}
    >
      <Tab.Screen
        name="Mis Cursos"
        children={() => <MisCursos usuario={usuario} />}
      />
      <Tab.Screen
        name="Crear Curso"
        children={() => <CrearCurso usuario={usuario} />}
      />
      <Tab.Screen
        name="Ver Estudiantes"
        children={() => <VerEstudiante usuario={usuario} />}
      />
    </Tab.Navigator>

  );
};

const InicioDoc = ({ usuario, signout }) => {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Inicio">
        <Drawer.Screen name="Inicio"
          children={() => <TabNavigator usuario={usuario} />} />
        <Drawer.Screen name="Editar Perfil">
          {() => (
            <EditarPerfil usuario={usuario} />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Cerrar Sesión"
          children={() => {
            signout();
            return null;
          }} />
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
