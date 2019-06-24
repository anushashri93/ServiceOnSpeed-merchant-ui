import React, { Component } from 'react'
import {Text, StyleSheet, TouchableOpacity, ScrollView, View, TextInput, Alert,PermissionsAndroid,AsyncStorage } from 'react-native'
import { Icon } from 'react-native-elements'
import AddShop from './AddShop';
import { Constants, Location, Permissions, Notifications } from 'expo';
import axios from 'axios';
import CheckBoxGroup from './CheckBoxGroup';
import {twoWheelerData, fourWheelerData} from '../constants/constants'
import sendPushNotification from './sendPushNotification'

export default class AddShopDetails extends Component {
    constructor(){
        super();
        this.state={
          phoneNumber : "",
          shopName : "",
          shopAddress : "", 
          lat : "",
          lang : "",
          merchantToken : null,
          selectedServices: [],
          fourVehicleSelectedData : [],
          twoVehicleSelectedData : [],
          token: null 
        }
    }
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Shop Details',
        headerStyle:{
            backgroundColor: '#841584'
        },
        headerTintColor: '#fff',
        headerTitleStyle:{
            color: '#fff'
        },
      })
componentWillMount() {
  navigator.geolocation.getCurrentPosition((data) => this.onSuccess(data), (data) => this.onError(data), {    enableHighAccuracy: true });
  AsyncStorage.getItem('merchantToken').then(value => {
    this.setState({
      merchantToken : value
    })
  });

  this.generatePushToken();

  // const notificationObject = {
  //   token : `${this.state.token}`,
  //   title : "New Shop Added",
  //   body : "Message Body",
  //   data : "Message Data"
  // }
  // alert(JSON.stringify(notificationObject))
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

onSuccess = (position) => {
  this.setState({lat : position.coords.latitude, lang : position.coords.longitude})
}
onError = (error) => {
    alert('code: ' + error.code );
}

// Regex validation for Shop Name : OnChange()
validateName = (value, inputField) => {
    this.setState({[inputField]:value});
}

// Regex validation for Shop Address : OnChange()
validateAddress = (value, inputField) => {
    this.setState({[inputField]:value});
}

// Regex validation for Phone Number : OnChange()
validatePhone = (value, inputField) => {
const regex = /^([0-9]{0,10})$/g;
      if(!regex.test(value)) {
      return;
    }
    this.setState({[inputField]:value});
}

newArray = (array) => {
  let newArray = [];
  for(var i = array.length - 1; i >= 0; i--) {
    newArray.push(array[i].id);
  }
  return newArray;
}


// Adding the shop for the Merchant
validatingShopAddition = () => {
// console.log(this.state.selectedServices);
// console.log(this.state.fourVehicleSelectedData);
// console.log(this.state.twoVehicleSelectedData);
// return;
// Check for the Shop Name field to be empty
if(this.state.shopName === "") {
alert('Please Enter the Name of the Shop')
return
}

// Check for the Shop Address field to be empty
if(this.state.shopAddress === "") {
alert('Please Enter the Address of the Shop')
return
}

// Check for the Contact Number field to be empty
if(this.state.phoneNumber === "") {
alert('Please Enter the Number of the Shop')
return
}

const addShopObject = {
    token : this.state.merchantToken,
    address : this.state.shopAddress,
    name : this.state.shopName,
    phone : this.state.phoneNumber,
    lat : `${this.state.lat}`,
    lang : `${this.state.lang}`,
    services : this.newArray(this.state.selectedServices),
    twoWheelers : this.newArray(this.state.twoVehicleSelectedData),
    fourWheelers : this.newArray(this.state.fourVehicleSelectedData)
  }
  // To add the details of the Shop
  // this.props.navigation.state.params.onNavigate('123');
  axios.post('https://dev.driveza.space/v1/partners/shop',addShopObject).then((response) => {
    this.callFunction();
    this.props.navigation.navigate("AddShopScreen");
  }).catch((response) => {
    alert('Invalid Credentials')
  })
  
}

callFunction = () => {
  const notificationObject = {
    token : `${this.state.token}`,
    title : "New Shop Added",
    body : "Message Body",
    data : {
      "shopAdded": true
    }
  }  
  sendPushNotification(notificationObject);
}

selectedServices = (array) => {
  this.setState({
    selectedServices: array
  })
}

// function to get the data for the data for Four Wheelers
selectedFourWheelerData = (array) => {
  this.setState({
    fourVehicleSelectedData: array
  })
}

// function to get the data for the data for Two Wheelers
selectedTwoWheelerData = (array) => {
  this.setState({
    twoVehicleSelectedData: array
  })
}

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Shop name"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.validateName(text,"shopName")}
            value = {this.state.shopName}
          />
        </View>
        <View style={styles.inputWrapperAddress}>
          <Icon containerStyle={{height:26,top:0,marginTop:15}} style={styles.inputIcon} name="shop" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Shop Address"
            multiline={true}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.validateAddress(text,"shopAddress")}
            value = {this.state.shopAddress}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Shop Contact Details"
            underlineColorAndroid="transparent"
            keyboardType = 'numeric'
            onChangeText={(text) => this.validatePhone(text,"phoneNumber")}
            value = {this.state.phoneNumber}
            maxLength={10}/>
        </View>
        <View style = {{backgroundColor: '#fff', justifyContent:"center", alignItems:"center", marginTop:20}}>
        <Text style={{color:'#000000',
                      fontSize: 22,
                      fontWeight: 'bold'}}>Select your services
        </Text>
        </View>
        <CheckBoxGroup selectedValues={(arrayData) => this.selectedServices(arrayData)} elements={data}/>
        <View style = {{backgroundColor: '#fff', justifyContent:"center", alignItems:"center", marginTop:20}}>
        <Text style={{color:'#000000',
                      fontSize: 22,
                      fontWeight: 'bold'}}>Select Models for Four Wheelers
        </Text>
        </View>
        <CheckBoxGroup selectedValues={(arrayData) => this.selectedFourWheelerData(arrayData)} elements={fourWheelerData}/>
        <View style = {{backgroundColor: '#fff', justifyContent:"center", alignItems:"center", marginTop:20}}>
        <Text style={{color:'#000000',
                      fontSize: 22,
                      fontWeight: 'bold'}}>Select Models for Two Wheelers
        </Text>
        </View>
        <CheckBoxGroup selectedValues={(arrayData) => this.selectedTwoWheelerData(arrayData)} elements={twoWheelerData}/>
        <View style={styles.inputWrapperButton}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => this.validatingShopAddition()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Add Shop</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
    )
  }
}

const data = [
    {
        "id": 1,
        "name": "General Services"
    },
    {
        "id": 2,
        "name": "Breakdown services"
    },
    {
        "id": 3,
        "name": "Cleaning Services"
    },
    {
        "id": 4,
        "name": "Tyre Services"
    },
    {
        "id": 5,
        "name": "Dents & Paints"
    }
]

const styles = StyleSheet.create({
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
      inputWrapperButton:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
      },
      inputWrapperAddress:{
        flex: 1,
        flexDirection: 'row',
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
})
