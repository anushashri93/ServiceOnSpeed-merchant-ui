import React, { Component } from 'react';
import {Alert, ScrollView, StyleSheet,Text, View, TextInput,TouchableOpacity,StatusBar, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios'

export default class OtpLogin extends Component {
  constructor(props) {
    super(props);
     this.state = {
      phoneNumber : props.navigation.getParam('phoneNumber'),
      otp: "",
      // To check for flag value
      isFromLogin : props.navigation.getParam('isFromLogin')
    }
  }

  static navigationOptions = {
    title: "Log In"
  }

  // To check the validation for OTP
  validate = (otp) => {
    const regex = /^([0-9]{0,6})$/g;
      if(!regex.test(otp)) {
        return;
      }
    this.setState({otp});
  }

  // Creation for the Object of Login Authentication if the Type for OTP/Password
  loginAuthentication = () => {
    const serviceObject = this.state.isFromLogin ? {
      type:'otp',
      phone : this.state.phoneNumber,
      otp : parseInt(this.state.otp)
    } : {
      phone : this.state.phoneNumber,
      otp : parseInt(this.state.otp)
  }
  
  // Get the service on the basis of Login/SignUp
  const serviceCall = this.state.isFromLogin ? 'https://dev.driveza.space/v1/partners/login' : 'https://dev.driveza.space/v1/partners/verify';
    
  // Ajax call for Login/Signup : via OTP
  axios.post(serviceCall,serviceObject).then((response) => {
      console.log(response.data.token);
      AsyncStorage.setItem("merchantToken",response.data.token);
      AsyncStorage.setItem("merchantName",response.data.name);
      AsyncStorage.setItem("merchantPhone",response.data.phone);
      AsyncStorage.setItem("merchantEmail",response.data.email);
      
      if(this.state.isFromLogin){
        AsyncStorage.setItem("merchantDetailsFlag",`${response.data.flag}`);
      } else {
        AsyncStorage.setItem("merchantDetailsFlag","false");
      }

      if(response.data.flag){
        this.props.navigation.navigate("AddShopNavigatorScreen");
      } else {
        this.props.navigation.navigate("AdditionalDetailsScreen");
      }
  }).catch((response) => {
      const statusCode = response.response.status;
      if(statusCode === 401){
        Alert.alert('Invalid Credentials')
      } else {
        Alert.alert('Something Went Wrong')
      }
    })
  } 

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <StatusBar
        backgroundColor="blue"
        barStyle="dark-content"
        />
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="lock" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Enter Otp"
            onChangeText={(otp) => this.validate(otp)}
            value = {this.state.otp}
            underlineColorAndroid="transparent"
            keyboardType = 'numeric'
            maxLength={6}
          />
        </View>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={0.9} onPress={() =>  this.loginAuthentication()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>LogIn</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 3,
    borderColor: "#e5e5e5",
    paddingLeft: 5,
    marginTop: 15,
    borderRadius: 5,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 15,
    paddingRight: 10,
    paddingLeft: 5,
    paddingBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#424242',
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 5,
  },
  button: {
    width: 200,
    height:50,
    borderRadius: 5,
    backgroundColor:"#841584",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color:'#fff',
    fontSize: 20,
    fontWeight: 'bold'
  }
});