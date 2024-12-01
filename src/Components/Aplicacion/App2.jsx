import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import Colors from './utils/colors'
import { useEffect, useState } from 'react';
import Form from './Form';


export default function App2({signout}) {
  return (
    <>
    <View style={styles.container}>
      <Form signout={signout}/>
      <Text style={styles.title}>Bienvenido a la Boleta </Text>
      </View>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY_COLOR,
    height:200,
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:30
  },
  title:{
      fontSize:25,
      color:'#fff',
      fontWeight:"bold"
  },
});
