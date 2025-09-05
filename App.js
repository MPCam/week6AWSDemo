import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { useState } from 'react';


Amplify.configure(awsconfig);
export default function App() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [stage, setStage] = useState("signUp")

  async function signUp(){
    try{
      await Auth.signUp({username, password, attributes:{email}})
      setStage("confirm")
    }catch(err){
      console.log("Error", err)
    }
  }

  async function confirm() {
    try{
      await Auth.confirmSignUp(username, code)
      setStage("signIn")
    }catch(err){
      console.log("Error", err)
    }
  }

  async function signIn(){
    try{
      const user = await Auth.signIn(username, password)
      console.log("Sign in:", user)
      setStage("signedIn")
    }catch(err){
      console.log("Error", err)
    }
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', padding: 30}}>
      <Text style={{fontSize: 40, fontWeight: 'bold', color: 'purple', textAlign: 'center', marginBottom: 50}}>Welcome to AWS Login Module</Text>
      {
        stage==='signUp' &&(
          <>
          <Text style={styles.headingText}>Sign Up</Text>
          <TextInput placeholder='Username' onChangeText={setUsername}/>
          <TextInput placeholder='Email' onChangeText={setEmail}/>
          <TextInput placeholder='Password' onChangeText={setPassword} secureTextEntry/>

          <Button title='Sign Up' onPress={signUp}/>
          <Button title='Sign In' onPress={()=>setStage('signIn')}/>
          </>
        )
      }

      {
        stage==='confirm' &&(
          <>
          <Text style={styles.headingText}>Confirm Sign Up</Text>
          <TextInput placeholder='Code' onChangeText={setCode}/>

          <Button title='Confirm' onPress={confirm}/>
          </>
        )
      }

      {
        stage==='signIn' &&(
          <>
          <Text style={styles.headingText}>Sign In</Text>
          <TextInput placeholder='Username' onChangeText={setUsername}/>
          <TextInput placeholder='Password' onChangeText={setPassword}/>

          <Button title='Sign In' onPress={signIn}/>
          <Button title='Go To Sign Up' onPress={()=>setStage('signUp')}/>
          </>
        )
      }

      {
        stage==='signedIn' &&(
          <>
          <Text style={styles.headingText}>Welcome {username}</Text>
          <Button title='Go Back to Sign In Page' onPress={()=>setStage('signIn')}/>
          </>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  headingText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'darkgreen',
    textAlign: 'center',
    marginBottom: 20
  }
});
