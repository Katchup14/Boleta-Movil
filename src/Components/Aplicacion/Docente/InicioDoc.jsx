import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput,Button } from 'react-native';
import Colors from '../utils/colors';

const InicioDoc = ({ signout }) => {
    //destructuración de props


    const [selectedLanguage, setSelectedLanguage] = useState();

    return (
        <>
            <View style={styles.viewForms}>
            <Text>Eres un Docente</Text>
            </View>

        </>
    );
};

const styles = StyleSheet.create({
    viewForms: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: Colors.PRIMARY_COLOR_OSCURO,
        width: '85%',
        borderRadius: 20,
        padding: 20,
        paddingTop:50
    },
    viewInput: {
        flexDirection: 'row',
        marginBottom: 10, // Añadido para separar los inputs
    },
    input: {
        height: 50,
        width: '60%', // Ajustado para dar más espacio al segundo input
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.PRIMARY_COLOR,
        borderRadius: 5,
        paddingLeft: 5,
        marginRight: 10,
    },
    inputPorcentaje: {
        width: '30%', // Ajustado para dar un tamaño más acorde
    },

});

const pickerStyles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        borderRadius: 60,
        borderWidth: 1,
        paddingVertical: 10
    }

})

export default InicioDoc;
