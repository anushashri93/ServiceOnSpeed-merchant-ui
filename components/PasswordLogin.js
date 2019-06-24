import React, { Component } from 'react';
import { ScrollView, StyleSheet,Text, View, TextInput,TouchableOpacity,StatusBar,AsyncStorage} from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios'

export default class PasswordLogin extends Component {
    constructor(props) {
    super(props);
     this.state = {
     user : "",
     password : ""
    }
  }
  static navigationOptions = {
    title: "Log In"
  }

  
  onSubmit = () => {
  // Checking the state of Phone Number  
    if (this.state.user === ""){
      alert('Please Enter your Email or Mobile Number');
      return;
    }
  
  // Check for the state of Password 
    if( this.state.password === ""){
      alert('Please Enter the Password')
      return; 
    }

  // To store the data for the Merchant while Login
    axios.post('https://dev.driveza.space/v1/partners/login',{username : this.state.user, password : this.state.password, type : "password"}).then((response) => {
     
      AsyncStorage.setItem("merchantToken",response.data.token);
      AsyncStorage.setItem("merchantName",response.data.name);
      AsyncStorage.setItem("merchantPhone",response.data.phone);
      AsyncStorage.setItem("merchantEmail",response.data.email);
      AsyncStorage.setItem("merchantDetailsFlag",`${response.data.flag}`);
      
      if(response.data.flag){
        this.props.navigation.navigate("AddShopNavigatorScreen");
      } else {
        this.props.navigation.navigate("AdditionalDetailsScreen");
      }
    }).catch((err) => {
      alert("Invalid Credentils");
    });
  }

  // Method to check for the state : onChangeText() 
  setStateForFieldUser = (value, inputField) => {
    this.setState({[inputField]:value});
  }

  // Method to check for the Password : onChangeText()
  setStateForFieldPassword = (value, inputField) => {
    this.setState({[inputField]:value});
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <StatusBar
     backgroundColor="blue"
     barStyle="dark-content"
   />
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Phone or Email"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setStateForFieldUser(text, "user")}
            value = {this.state.user}
          />
        </View>
        
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="lock" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Password"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setStateForFieldPassword(text, "password")}
            value = {this.state.password}
          />
        </View>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => this.onSubmit()}>
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