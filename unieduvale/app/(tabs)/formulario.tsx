
import React, {useState} from "react";
import { View,Text,TextInput,Button,StyleSheet } from "react-native";
export default function App(){
    const[text,setText] = useState<string>("");
    const[name,setName] = useState<string>("");
    const[city,setCity] = useState<string>("");
    const[message,setMessage] = useState<string>("");
    
    
    const handlePress = () => {
        setMessage(`you card cloned with sucess!! ${text}, ${name}, ${city}`);
        
        alert(`you CPF ${text}, you CV card ${name}, you numbers of cards eh ${city}`);
        setTimeout(()=>setMessage(""),10000)
        setText("");
        setName("");
        setCity("");

    };
    return(
        <View style={styles.container}>
            <Text style={styles.title}></Text>
            <TextInput className='cpf' style={styles.input} placeholder="Write CPF..." value={text} 
               onChangeText={setText} />
                
            <TextInput className='cv' style={styles.input} placeholder="Write CV of card..." value={name} 
               onChangeText={setName} />
               
            <TextInput className='cardN' style={styles.input} placeholder="Write numbers next card..." value={city} 
               onChangeText={setCity} />
                <Button title="send" onPress={handlePress}/>

                {message ?<Text style={styles.resultado}>
                    {message}</Text>:null}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        padding:20,
        backgroundColor:"#f5f5f5",
    },
    title:{
        fontSize:20,
        fontWeight:"bold",
        marginBottom:10,
    },
    input:{
        width:"80%",
        height:40,
        borderColor:"gray",
        borderWidth:1,
        borderRadius:5,
        marginBottom:20,
        padding:10,
        backgroundColor:"#fff",
    },
    resultado:{
        marginTop:20,
        fontSize:20
    }
});