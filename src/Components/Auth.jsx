import { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function Auth({ setRol, setUsuario }) {
  const [isLogin, setIsLogin] = useState(true);

  const changeForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps='always'
      >
        <View style={styles.view}>
          <Image
            style={styles.logo}
            source={require('../../assets/Logo.png')}
          />
          {isLogin ? (
            <LoginForm
              changeForm={changeForm}
              setRol={setRol}
              setUsuario={setUsuario}
            />
          ) : (
            <RegisterForm
              changeForm={changeForm}
              setRol={setRol}
              setUsuario={setUsuario}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#000',
  },
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 150,
    marginTop: 15,
    marginBottom: 1,
  },
});
