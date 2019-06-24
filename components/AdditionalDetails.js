import React, { Component } from 'react'
import { Text, StyleSheet, TouchableOpacity, ScrollView, View, TextInput, Alert,PermissionsAndroid, AsyncStorage } from 'react-native'
import { Icon } from 'react-native-elements';
import axios from 'axios'

export default class AdditionalDetails extends Component {
    constructor(){
        super();
        this.state={
          gstNumber : "",
          aadharNumber : "",
          bankAccountNumber : "", 
          bankIFSC : "",
          merchantToken: null,
          merchantDetailsFlag: null
        }
    }

   static navigationOptions =({navigation})=> ({    
    headerTitle: (
      <View  style={{flexDirection : 'row',flex:1, justifyContent:"center",alignItems:"center"}}>
        <View style={{ alignItems : 'flex-start'}}>
          <Text style={{fontSize:20,color:"#ffffff",textAlign:"center",fontWeight: "bold"}}>
        Additional Details
          </Text>
        </View>
      </View>
    ),
    headerStyle: {
      backgroundColor: '#841584',
    }
  });

componentWillMount() {
  AsyncStorage.getItem('merchantToken').then(value => {
    this.setState({
      merchantToken : value
    })
  });
  AsyncStorage.getItem('merchantDetailsFlag').then(value => {
    this.setState({
      merchantDetailsFlag : value
    })
  });
}

// Regex for the validation of GST : onChange()
validateGST = (value, inputField) => {
  const regex = /^[A-Za-z0-9-]+$/;
  if(!regex.test(value) && value !== "") {
    return;
  }
  this.setState({[inputField]:value});
 }

 // Regex for the validation of Aadhar Number : onChange()
 validateAadharNumber = (value, inputField) => { 
    const regex = /^([0-9]{0,12})$/g;
      if(!regex.test(value)) {
      return;
    }
  this.setState({[inputField]:value});
 }

// Regex validation for Bank Account : OnChange()
validateBankAccountNumber = (value, inputField) => {
  const regexName = /^[0-9]+$/;
  if(!regexName.test(value) && value!=="") {
    return;
  }
  this.setState({[inputField]:value});
}

// Regex validation for Bank IFSC : OnChange()
validateBankIFSC = (value, inputField) => {
  const regex = /([A-Za-z0-9])+/;
  if(!regex.test(value) && value!=="") {
    return;
  }
  this.setState({[inputField]:value});
}

 

// Adding the Details : OnSubmit()
validatingShopAddition() {
  // Check for the Gst Number field to be empty
    const regexGST = /^(GST-)\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/;
      if(!regexGST.test(this.state.gstNumber)) {
        Alert.alert("Please enter valid GST");
      return;
    }
  
  // Check for the Aadhar Number field to be empty
    if(this.state.aadharNumber === "") {
      Alert.alert('Please Enter your Aadhar Number')
      return
    }
  
  // Check for the Bank Account Number field to be empty
  if(this.state.bankAccountNumber === "") {
    alert('Please Enter the Bank Account Number')
    return
  }

  // Regular Expression to validate for the IFSC code 
  const regexIFSC = /^([A-Za-z]{4})([0-9]{7})/;
    if(!regexIFSC.test(this.state.bankIFSC)) {
      Alert.alert("Please enter valid IFSC Code");
      return;
    }

  const additionalDetailsOject = {
    token : this.state.merchantToken,
    gstNo : this.state.gstNumber,
    aadharNo : this.state.aadharNumber,
    bankAcNo : this.state.bankAccountNumber,
    ifscCode : this.state.bankIFSC
  }
  console.log(additionalDetailsOject.token)
  // Ajax call for Login/Signup : via OTP
    axios.post("https://dev.driveza.space/v1/partners/info",additionalDetailsOject).then((response) => {
      AsyncStorage.setItem("merchantDetailsFlag","true");
      AsyncStorage.setItem("merchantGstNumber","GstNumber");
      this.props.navigation.navigate("AddShopNavigatorScreen");
      }).catch((response) => {
        alert('Invalid Credentials')
      })
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always">
      
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="shop" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="GST-XXXXXXXXXXXXXXX"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.validateGST(text,"gstNumber")}
            value = {this.state.gstNumber}
            maxLength={19}
          />
        </View>
       <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="shop" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Aadhar Number"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.validateAadharNumber(text,"aadharNumber")}
            value = {this.state.aadharNumber}
            keyboardType = 'numeric'
            maxLength={12}
          />
        </View>
        <View style={styles.inputWrapperAddress}>
          <Icon containerStyle={{height:26,top:0,marginTop:15}} style={styles.inputIcon} name="shop" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Bank Account Number"
            underlineColorAndroid="transparent"
            keyboardType = 'numeric'
            onChangeText={(text) => this.validateBankAccountNumber(text,"bankAccountNumber")}
            value = {this.state.bankAccountNumber}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Bank IFSC Details"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.validateBankIFSC(text,"bankIFSC")}
            value = {this.state.bankIFSC}
            maxLength={11}
            />
        </View>
        <View style={styles.inputWrapperButton}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => this.validatingShopAddition()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Add Bank Details</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
    )
  }
}

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
