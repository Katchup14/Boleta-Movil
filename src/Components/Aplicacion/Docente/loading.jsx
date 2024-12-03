import { StyleSheet, Text, View, Image, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';

const Loading = () => {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animación de rotación
        const startRotation = () => {
            Animated.loop(
                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        };

        startRotation();
    }, [rotation]);

    // Interpolar el valor para la rotación
    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../../../../assets/Tuerca.png')} // Cambia la ruta a tu imagen
                style={[styles.image, { transform: [{ rotate: spin }] }]}
            />
            <Text style={styles.text}>Cargando...</Text>
        </View>
    );
};

export default Loading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: 200,
        height: 200,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
});
