import React, { Component } from 'react'
import { Text, StyleSheet, TouchableOpacity, ScrollView, View, TextInput, Alert,PermissionsAndroid } from 'react-native'
import { Icon } from 'react-native-elements'
//import AddShop from './AddShop';

export default class AddBankDetails extends Component {
    constructor(){
        super();
        this.state={
          phoneNumber : "",
          shopName : "",
          shopAddress : "",
          bankName : "",
          bankAccountNumber : "",
          bankIFSC : ""
        }
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Bank Details',
        headerStyle:{
            backgroundColor: '#841584'
        },
        headerTintColor: '#fff',
        headerTitleStyle:{
            color: '#fff'
        },
    })
    
  // Regex validation for Bank Name : OnChange()
  validatebankName = (value, inputField) => {
      this.setState({[inputField]:value});
  }

  // Regex validation for Bank Account Number : OnChange()
  validatebankAccountNumber = (value, inputField) => {
      this.setState({[inputField]:value});
  }

  // Regex validation for Bank IFSC  : OnChange()
  validatebankIFSC = (value, inputField) => {
      this.setState({[inputField]:value});
  }

  // Adding the shop Details
  validatingShopAddition() {

  // Check for the Shop Name field to be empty
  if(this.state.shopName === "") {
  alert('Please Enter the Name of the Bank')
  return
  }

  // Check for the Shop Address field to be empty
  if(this.state.shopAddress === "") {
  alert('Please Enter the Account Number of the Bank ')
  return
  }

  // Check for the Contact Number field to be empty
  if(this.state.phoneNumber === "") {
  alert('Please Enter the IFSC code of the Bank ')
  return
  }

  this.props.navigation.navigate("AddShopScreen");

  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Bank name"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.validateName(text,"bankName")}
            value = {this.state.bankName}
          />
        </View>
        <View style={styles.inputWrapperAddress}>
          <Icon containerStyle={{height:26,top:0,marginTop:15}} style={styles.inputIcon} name="shop" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Bank Account Number"
            underlineColorAndroid="transparent"
            keyboardType = 'numeric'
            onChangeText={(text) => this.validateAddress(text,"bankAccountNumber")}
            value = {this.state.bankAccountNumber}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
          <TextInput
            style={styles.input}
            placeholder="Account IFSC Details"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.validatePhone(text,"bankIFSC")}
            value = {this.state.bankIFSC}
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
