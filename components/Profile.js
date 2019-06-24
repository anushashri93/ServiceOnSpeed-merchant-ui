import React, { Component } from 'react'
import {Image, Keyboard, Animated, UIManager, ScrollView,Dimensions ,TextInput, Text, StyleSheet, View, TouchableOpacity, AsyncStorage} from 'react-native'
import { Icon } from 'react-native-elements';
import ToggleButton from './ToggleButton';
import axios from 'axios';

const { State: TextInputState } = TextInput;

export default class Profile extends Component {
  constructor(){
    super()
      this.state = {
        measurement : null,
        isDisplayed : true,
        type1: false,
        type2 : false,
        type3 : false,
        aadharIdentity : "",
        gstIdentity : "",
        shopName : "",
        shopId : "",
        shopNumber : "",
        shopAddress : "",
        bankAccountNumber : "",
        bankIFSC : "",
        nameProfile : "",
        emailProfile : "",
        numberProfile : "",
        merchantToken : null,
        switchValuePickup : false,
        switchValueShopAvailable : true,
        shift: new Animated.Value(0)
      }
    }

    static navigationOptions = {
      title: "Profile"
    }

// State Toggling on the Basis Of Index Value
showStateDisplayUsingIndex = (indexButton) => {
this.setState({
 ...this.state,
  type1: false,
  type2 : false,
  type3 : false,
  ["type"+indexButton] : !this.state["type"+indexButton]
}) 

}

 /*
Identity Section Validations
*/ 
// Regex validation for Merchant Name : onChange()
  validateName = (value, inputField) => {
    const regex = /^([a-zA-Z ]+$)/;
     if(!regex.test(value) && value !== "") {
      return;
    }
  this.setState({[inputField]:value});
  }

  // Regex for the validation of GST : onChange()
 validateGST = (value, inputField) => {
   const regex = /^[A-Za-z0-9-]+$/;
   if(!regex.test(value) && value !== "") {
      return;
    }
  this.setState({[inputField]:value});
 }

 // Validation of TIN : onChange()
 validateTIN = (value, inputField) => {
  this.setState({[inputField]:value});
 }


/*
Shop Section Validations
*/ 
// Regex validation for Shop Name : onChange()
  validateNameShop = (value, inputField) => {
    const regex = /^([a-zA-Z ]+$)/;
     if(!regex.test(value) && value !== "") {
      return;
    }
  this.setState({[inputField]:value});
  }

// Regex validation for Shop Number : onChange()
validateNumberShop = (value, inputField) => {
const regex = /^([0-9]{0,10})$/g;
      if(!regex.test(value)) {
      return;
    }
    this.setState({[inputField]:value});
}
// State Setting for Shop Address
validateshopAddress = (value, inputField) => {
this.setState({[inputField]:value});
}

/*
Bank Section Validations
*/ 
// Regex validation for Bank Account Number : onChange()
validateAccountNumber = (value, inputField) => {
const regex = /^([0-9]{0,10})$/g;
      if(!regex.test(value)) {
      return;
    }
    this.setState({[inputField]:value});
}
// State Setting for Bank IFSC code
validateIFSC = (value, inputField) => {
this.setState({[inputField]:value});
}

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);

// Getting the Merchant Name
  AsyncStorage.getItem('merchantName').then(value => {
        this.setState({
          nameProfile : value,
        })
  })
// Getting the Merchant Email
  AsyncStorage.getItem('merchantPhone').then(value => {
        this.setState({
          numberProfile : value,
        })
  })

// Getting the Merchant PhoneNumber
  AsyncStorage.getItem('merchantEmail').then(value => {
        this.setState({
          emailProfile : value,
        })
  })

// Getting the Merchant Token
  AsyncStorage.getItem('merchantToken').then(value => {
    this.setState({
      merchantToken : value
    })
  });  

// Getting the Shop Name
  AsyncStorage.getItem('shopName').then(value => {
    this.setState({
      shopName : value
    })
  });

// Getting the Shop Address
  AsyncStorage.getItem('shopAddress').then(value => {
    this.setState({
      shopAddress : value
    })
  });

// Getting the Shop Number
  AsyncStorage.getItem('shopPhoneNumber').then(value => {
    this.setState({
      shopNumber : value
    })
  });

// Getting the Shop Id 
  AsyncStorage.getItem('shopId').then(value => {
          this.setState({
          shopId : value
  }, () => {
  // Getting the Merchant Token
  AsyncStorage.getItem('merchantToken').then(value => {
    this.setState({
      merchantToken : value
    }, () => {
        // To get the details for Identity, Bank details and Shop status
      this.getDetailsForShop();
    })
  });
  })
  });

}

getDetailsForShop() {
  const URL =  'http://dev.driveza.space/v1/partners/shopinfo?token=' + this.state.merchantToken + '&shopId=' 
  + this.state.shopId;
  axios.get(URL).then((response) => {
    this.setState({
      aadharIdentity : response.data.aadharNo,
      gstIdentity : response.data.gstNo,
      bankAccountNumber : response.data.backAcNo,
      bankIFSC : response.data.ifscCode,
      switchValuePickup : response.data.isPickupAvailable,
      switchValueShopAvailable : response.data.isShopAvailable
    });
  }).catch(() => { 
      alert('Something Went Wrong');
  }); 
}

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }


// Dimensions Logic : 
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

  // To check for the state of Toggle Button
  toggleSwitchPickup = (value) => {
      this.setState({
        switchValuePickup: value
      }, () => {
        this.updatePickAvailable(this.state.switchValuePickup);
      })
    
  }


  // To check for the state of Toggle Button
  toggleSwitchShopAvailable = (value) => {
      this.setState({
        switchValueShopAvailable: value
      }, () => {
        this.updateShopAvailable(this.state.switchValueShopAvailable);
      })
    
  }

   // Axios call to update the PickUp/Drop Status
   updatePickAvailable = (value) => {
    const dataPickup = {
        token : this.state.merchantToken,
        value,
        id : this.state.shopId
    }
    axios.post('https://dev.driveza.space/v1/partners/updatepickupavailable',dataPickup).then((response) => {
     console.log(response.data.status);
    }).catch((response) => {
      alert("Something Went Wrong");
    });
   }

   // Axios call to update the Shop Availabilty Status
   updateShopAvailable = (value) => {
    const dataShop = {
        token : this.state.merchantToken,
        value,
        id : this.state.shopId
    }
    axios.post('https://dev.driveza.space/v1/partners/updateavailable',dataShop).then((response) => {
     console.log(response.data) 
    }).catch((response) => {
      alert("Something Went Wrong");
    });
   }

   // Logout Functionality
   logout = () => {
    AsyncStorage.clear();
    this.props.navigation.navigate('WelcomePageScreen')
   }  

    render() {
      const { shift } = this.state;
      return (
        <Animated.ScrollView keyboardShouldPersistTaps="always" style={[styles.formWrapper, { transform: [{translateY: shift}] }]}>
        <View style={{ flexDirection: 'row',backgroundColor:"#ffffff",marginBottom:10,padding: 10}}>
          <View style={{width: "73%"}}>
                  <Text
                      style={{
                        color: '#000000',
                        fontSize: 17,
                        fontWeight: 'bold',
                      }}>
                      {this.state.nameProfile}
                  </Text>
                  <Text
                      style={{
                        color: '#000000',
                        fontSize: 17,
                        fontWeight: 'bold',
                      }}>    
                      {this.state.numberProfile}
                  </Text>
                  <Text
                      style={{
                        color: '#000000',
                        fontSize: 17,
                        fontWeight: 'bold',
                      }}>
                      {this.state.emailProfile}
                  </Text>  
          </View>
          <View style ={{flexDirection:'row', alignItems: 'center', marginTop : 15}}>
            <TouchableOpacity activeOpacity={0.9} onPress = {() => this.logout()}>
            <View style={styles.buttonLogout}>
              <Text style={styles.buttonTextLogout}>Log Out</Text>
            </View>
          </TouchableOpacity>
          </View>
        </View>
        <View style ={{flexDirection:'row'}}>
          <View style = {{paddingTop:10, paddingLeft:10, width:'80%'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Pick up Avilability</Text>
          </View>
          <View style = {{width:'20%', paddingRight:10}}>
              <ToggleButton
              toggleSwitch = {this.toggleSwitchPickup}
              switchValue = {this.state.switchValuePickup}/>
          </View>
        </View>
        <View style ={{flexDirection:'row'}}>
          <View style = {{paddingTop:10, paddingLeft:10, width:'80%'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Shop Avilability</Text>
          </View>
          <View style = {{width:'20%', paddingRight:10}}>
              <ToggleButton
              toggleSwitch = {this.toggleSwitchShopAvailable}
              switchValue = {this.state.switchValueShopAvailable}/>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.expander}>
            <TouchableOpacity style={styles.opener} activeOpacity={0.9} onPress = {() => this.showStateDisplayUsingIndex(1)}>
              <View style={styles.button}>
                <View style = {{width:'100%',flexDirection: 'row'}}>
                <View style={{width: 25, position: 'absolute', left: 0}}>
                  <Icon size={25} name="users" type='entypo'/>
                </View>
                <Text style={styles.buttonText}>Identity</Text>
                <View style={{width: 25, position: 'absolute', right: 0}}>
                {
                  this.state.type1?
                  <Icon size={25} name = "chevron-thin-down" type='entypo'/>:
                  <Icon size={25} name = "chevron-thin-right" type='entypo'/> 
                  
                }
                </View>
                </View>
              </View>
            </TouchableOpacity>
            {
              this.state.type1?
              <View style={{width:'100%',padding: 10,paddingTop: 0}}>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="Aadhar Number"
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => this.validateName(text,"aadharIdentity")}
                    value = {this.state.aadharIdentity}
                    editable = {false}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="GST Number"
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => this.validateGST(text,"gstIdentity")}
                    value = {this.state.gstIdentity}
                    editable = {false}
                  />
                </View>
            </View>:null 
            }
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.expander}>
            <TouchableOpacity style={styles.opener} activeOpacity={0.9} onPress = {() => 
            this.showStateDisplayUsingIndex(2)}>
              <View style={styles.button}>
                <View style = {{width:'100%',flexDirection: 'row'}}>
                <View style={{width: 25, position: 'absolute', left: 0}}>
                  <Icon size={25} name="users" type='entypo'/>
                </View>
                <Text style={styles.buttonText}>Shop</Text>
                <View style={{width: 25, position: 'absolute', right: 0}}>
                  {
                  this.state.type2?
                  <Icon size={25} name = "chevron-thin-down" type='entypo'/>:
                  <Icon size={25} name = "chevron-thin-right" type='entypo'/> 
                  
                }
                </View>
                </View>
              </View>
            </TouchableOpacity>
            {
              this.state.type2?
              <View style={{width:'100%',padding: 10,paddingTop: 0}}>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="Shop Name"
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => this.validateNameShop(text,"shopName")}
                    value = {this.state.shopName}
                    editable = {false}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="Shop Contact Number"
                    underlineColorAndroid="transparent"
                    keyboardType = 'numeric'
                    onChangeText={(text) => this.validateNumberShop(text,"shopNumber")}
                    value = {this.state.shopNumber}
                    editable = {false}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="Shop Address"
                    underlineColorAnodroid="transparent"
                    onChangeText={(text) => this.validateshopAddress(text,"shopAddress")}
                    value = {this.state.shopAddress}
                    editable = {false}
                  />
                </View>
            </View>:null
            }
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.expander}>
            <TouchableOpacity style={styles.opener} activeOpacity={0.9} onPress = {() => 
            this.showStateDisplayUsingIndex(3)}>
              <View style={styles.button}>
                <View style = {{width:'100%',flexDirection: 'row'}}>
                <View style={{width: 25, position: 'absolute', left: 0}}>
                  <Icon size={25} name="users" type='entypo'/>
                </View>
                <Text style={styles.buttonText}>Bank Details</Text>
                <View style={{width: 25, position: 'absolute', right: 0}}>
                                    {
                  this.state.type3?
                  <Icon size={25} name = "chevron-thin-down" type='entypo'/>:
                  <Icon size={25} name = "chevron-thin-right" type='entypo'/> 
                  
                }
                </View>
                </View>
              </View>
            </TouchableOpacity>
            {
              this.state.type3?
              <View style={{width:'100%',padding: 10,paddingTop: 0}}>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="Account Number"
                    underlineColorAndroid="transparent"
                    keyboardType = 'numeric'
                    onChangeText={(text) => this.validateAccountNumber(text,"bankAccountNumber")}
                    value = {this.state.bankAccountNumber}
                    editable = {false}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="IFSC Code"
                    underlineColorAnodroid="transparent"
                    onChangeText={(text) => this.validateIFSC(text,"bankIFSC")}
                    value = {this.state.bankIFSC}
                    editable = {false}
                  />
                </View>
            </View>:null
            }
          </View>
        </View>
      </Animated.ScrollView>
      )
    }
  }

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#e5e5e5'
  },
  expander: {
    borderRadius: 5,
    borderColor : '#ededed',
    borderWidth : 1,
    backgroundColor:"#ffffff"
  },
  opener: {
    padding : 10
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    color:'#000000',
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 35
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#fff',
    borderBottomWidth: 3,
    borderColor: "#e5e5e5",
    paddingLeft: 5,
    marginTop: 15,
    height: 60,
    borderRadius: 5,
    borderWidth: 1
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
    borderRadius: 5,
  },
  formWrapper: {
    width: "100%",
    backgroundColor: "#e5e5e5"
  },
  buttonLogout: {
    width: 100,
    height:40,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor:"#841584",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextLogout: {
    color:'#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
})
