
import React, {useState} from "react";
import { View,Text,TextInput,Button,StyleSheet, Image } from "react-native";
export default function App(){
    const[cardNumber,setCardNumber] = useState<string>("");
    const[cv,setCV] = useState<string>("");
    const[cpf,setCPF] = useState<string>("");
    const[message,setMessage] = useState<string>("");
    const[alertMsg,setAlertMsg] = useState<string>("");

    const handlePress = () => {
        setMessage(`your card has been cloned successfully`);
        setAlertMsg(`Dat card: ${cardNumber}, ${cv}, ${cpf}`);
        
        alert(`you CPF ${cardNumber}, you CV card ${cv}, you numbers of cards eh ${cpf} `);
        setTimeout(()=>setMessage(""),10000)
        setTimeout(()=>setAlertMsg(""),10000)
        setCardNumber("");
        setCV("");
        setCPF("");

    };
    return(
        <View style={styles.container}>
            <Image source={{uri: 'https://www.python.org/static/community_logos/python-logo-master-v3-TM.png'}} style={{flex:1,width:500,height:300,resizeMode:'contain'}}/>
            <Text style={styles.title}></Text>
            <TextInput className='cardNumber' style={styles.input} placeholder="enter the number on the front/back of your card" value={cardNumber} 
               onChangeText={setCardNumber} />
                
            <TextInput className='cv' style={styles.input} placeholder="enter the number of" value={cv} 
               onChangeText={setCV} />
               
            <TextInput className='cpf' style={styles.input} placeholder="enter your CPF number" value={cpf} 
               onChangeText={setCPF} />
                <Button title="Send" onPress={handlePress}/>

                {message ?<Text style={styles.resultado}>
                    {message}</Text>:null}
                {alertMsg ?<Text style={styles.dataCard}>
                    {alertMsg}</Text>:null}
        </View>
    );
}

const styles = StyleSheet.create({
    dataCard: {
        flex: 1,color:'green'},
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