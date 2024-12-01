import { TextInput, StyleSheet } from "react-native";


export default function Input(
    {
        placeholder='ingresa un valor',
        updateValue = ()=>{},
        styleInp={}
    }
){



    return (
        <TextInput
            style={ [styles.input, {...styleInp}] }
            placeholder={placeholder}
            onChangeText={ updateValue }
        />
    )
}



const styles = StyleSheet.create({
    input: {

    }
})


