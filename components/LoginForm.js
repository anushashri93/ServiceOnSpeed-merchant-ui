import React, { Component } from 'react';
import { ScrollView, StyleSheet,Text, View, TextInput,TouchableOpacity,StatusBar, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios'

export default class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      phoneNumber:"",
    }
  }

  static navigationOptions = {
      title: "Enter Phone Number"
  }

  validate = (value, inputField) => {
    let regex = /^([0-9]{0,10})$/g;
    if(!regex.test(value)) {
      return;
    }
    this.setState({[inputField]:value});
  }

  // Regex to check the Validation for Phone Number
  onSubmit = (phoneNumber) => {
    let newReg = /^((?!(0))[0-9]{10})$/g;
    if(!newReg.test(phoneNumber)) {
      Alert.alert("Please enter valid phone number");
      return;
    }
  
    // Axios Call Parameters  
    const loginFormDetails = {
      phone : this.state.phoneNumber
    }

    axios.post('https://dev.driveza.space/v1/partners/otp',loginFormDetails).then((response) => {
      const phoneNumber = loginFormDetails.phone;
      this.props.navigation.navigate("OtpLoginScreen", {phoneNumber, isFromLogin : true});
    }).catch((response) => {
      const statusCode = response.response.status;
      if(statusCode === 401){
        Alert.alert('Invalid Credentials')
      } else {
        Alert.alert('Something Went Wrong')
      }
    });
  }
  
  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always" 
      style={styles.formWrapper}>
        <StatusBar backgroundColor="blue" barStyle="dark-content"/>
          <View style={styles.inputWrapper}>
            <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType = 'numeric'
              onChangeText={(text) => this.validate(text,"phoneNumber")}
              value = {this.state.phoneNumber}
              underlineColorAndroid="transparent"
              maxLength={10}
            />
          </View>
          <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => this.onSubmit(this.state.phoneNumber)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Via Otp</Text>
              </View>
            </TouchableOpacity> 
          </View>
          <Text style={styles.option}>OR</Text>
          <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate('PasswordLoginScreen')}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Via Password</Text>
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
  option: {
    paddingTop: 20,
    textAlign: 'center'
  },
  formWrapper: {
    width: "100%",
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