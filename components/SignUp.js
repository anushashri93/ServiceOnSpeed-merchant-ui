import React, { Component } from 'react';
import { Animated, Dimensions, Keyboard, ScrollView, StyleSheet,Text, View, TextInput,TouchableOpacity, StatusBar, UIManager, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { Permissions, Notifications } from 'expo';


const { State: TextInputState } = TextInput;

export default class SignUp extends Component {
  constructor(){
    super();
    this.state={
      token:null,
      name:"",
      email:"",
      phoneNumber:"",
      password:"",
      confirmPassword:"",
      shift: new Animated.Value(0)
    }
  }
  
  static navigationOptions = {
    title: "Sign Up"
  }

  // To Generate Expo Push Token
  componentDidMount() {
    this.generatePushToken();
  }

  componentWillMount() {   
    
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }
  
  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  // To generate the Push Token for the Device
  generatePushToken = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return;
    }
  
    //  Get the token that uniquely identifies this device
    this.setState({
      token : await Notifications.getExpoPushTokenAsync()
    },() => {
      console.log(this.state.token);
    })
  }

  onSubmit = () => {
    this.setState({isReady : false});

    // Regular Expression to validate for the Name field
    const regexName = /^[a-zA-Z ]/;
      if(!regexName.test(this.state.name)) {
        Alert.alert("Please enter valid Name");
        return;
    }

    // Regular expression to validate for the Email Field  
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(!regex.test(this.state.email)) {
        Alert.alert("Please enter valid Email address");
        return;
    }
    
    // Regular expression to validate for the Phone Number Field
    const RegPhoneNumber = /^((?!(0))[0-9]{10})$/g;
      if(!RegPhoneNumber.test(this.state.phoneNumber)) {
        Alert.alert("Please enter valid phone number");
        return;
    }

    // Checking for the Password Confirmation
      if(this.state.password !== this.state.confirmPassword) {
        alert('Password and Confirm Password is not same');
        return;
    }    

    // Request Parameters For Creating a Merchant
    const userDetails = {
      name : this.state.name,
      email: this.state.email,
      phone: this.state.phoneNumber,
      password: this.state.password,
      pushToken: this.state.token
    }

    axios.post('https://dev.driveza.space/v1/partners/create',userDetails).then((response) => {
      console.log(JSON.stringify(response))
      const phoneNumber = userDetails.phone;
      this.props.navigation.navigate("OtpLoginScreen", {phoneNumber, isFromLogin : false});
    }).catch((response) => {
      const statusCode = response.response.status;
      if(statusCode === 422){
        Alert.alert(response.response.data)
      }else {
        Alert.alert('Something Went Wrong')
      }
    });
  }

   validate = (value, inputField) => {
    this.setState({[inputField]:value});
  }

  // Regex validation for Phone Number : OnChange()
  validatePhone = (value, inputField) => {
    const regex = /^([0-9]{0,10})$/g;
      if(!regex.test(value)){
      return;
    }
    this.setState({[inputField]:value});
  }

  // Regex validation for Merchant Name : onChange()
  validateName = (value, inputField) => {
    const regex = /^([a-zA-Z ]+$)/;
     if(!regex.test(value) && value !== "") {
      return;
    }
    this.setState({[inputField]:value});
  }


  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
      UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height;
        const fieldTop = pageY;
        const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight)-10;
        if (gap >= 0) {
          return;
      }
    Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          duration: 100,
          useNativeDriver: true,
        }
      ).start();
    });
  }

  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }
    ).start();
  }
  
  render() {
    const { shift } = this.state;
    return (
      <Animated.ScrollView keyboardShouldPersistTaps="always" style={[styles.formWrapper, { transform: [{translateY: shift}] }]}>
        <StatusBar
          backgroundColor="blue"
          barStyle="dark-content"
        />
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="user" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Name"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.validateName(text,"name")}
            value = {this.state.name}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="mail" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Email"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.validate(text,"email")}
            value = {this.state.email}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            underlineColorAndroid="transparent"
            keyboardType = 'numeric'
            onChangeText={(text) => this.validatePhone(text,"phoneNumber")}
            value = {this.state.phoneNumber}
            maxLength={10}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="lock" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Password"
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={(text) => this.validate(text,"password")}
            value = {this.state.password}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="lock" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.validate(text,"confirmPassword")}
            value = {this.state.confirmPassword}
          />
        </View>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => this.onSubmit()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
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
    marginBottom: 20,
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