import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa los íconos
import { NavigationContainer } from '@react-navigation/native';
import MisCursos from './MisCursos';
import CrearCurso from './CrearCurso';
import VerEstudiante from './VerEstudiante';
import EditarPerfil from './EditarPerfil';

const TabNavigator = ({ usuario }) => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Mis Cursos') {
            iconName = 'book-outline';
          } else if (route.name === 'Crear Curso') {
            iconName = 'add-circle-outline';
          } else if (route.name === 'Ver Estudiantes') {
            iconName = 'people-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2b6cb0',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name='Mis Cursos'
        children={() => <MisCursos usuario={usuario} />}
      />
      <Tab.Screen
        name='Crear Curso'
        children={() => <CrearCurso usuario={usuario} />}
      />
      <Tab.Screen
        name='Ver Estudiantes'
        children={() => <VerEstudiante usuario={usuario} />}
      />
    </Tab.Navigator>
  );
};

const InicioDoc = ({ usuario, signout }) => {
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
              <Icon name='create-outline' size={size} color={color} />
            ),
          }}
        >
          {() => <EditarPerfil usuario={usuario} />}
        </Drawer.Screen>
        <Drawer.Screen
          name='Cerrar Sesión'
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name='log-out-outline' size={size} color={color} />
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

export default InicioDoc;
