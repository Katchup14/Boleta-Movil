import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa los íconos
import { NavigationContainer } from '@react-navigation/native';
import EditarPerfil from '../Docente/EditarPerfil';
import ConsultaEst from './ConsultaEst';
import ConsultaDoc from './ConsultaDoc';


const TabNavigator = ({ usuario }) => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Listar Estudiantes') {
                        iconName = 'people-outline'; // Icono para Listar Estudiantes
                    } else if (route.name === 'Listar Docentes') {
                        iconName = 'school-outline'; // Icono para Listar Docentes (relacionado con la enseñanza)
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2b6cb0',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name='Listar Estudiantes'
                children={() => <ConsultaEst usuario={usuario} />}
            />
            <Tab.Screen
                name='Listar Docentes'
                children={() => <ConsultaDoc usuario={usuario} />}
            />
        </Tab.Navigator>
    );
};

const InicioAdmin = ({ usuario, signout }) => {
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

export default InicioAdmin

/**/

