import React, { Component } from 'react'
import {Image, Keyboard, Animated, UIManager, ScrollView,Dimensions ,TextInput, Text, StyleSheet, View, TouchableOpacity} from 'react-native'
import { Icon } from 'react-native-elements';

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
        nameIdentity : "",
        gstIdentity : "",
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

/*
Shop Section Validations
*/ 
// Regex validation for Merchant Name : onChange()
  validateNameShop = (value, inputField) => {
    const regex = /^([a-zA-Z ]+$)/;
     if(!regex.test(value) && value !== "") {
      return;
    }
    this.setState({[inputField]:value});
  }

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
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

    render() {
      const { shift } = this.state;
      return (
        <Animated.ScrollView keyboardShouldPersistTaps="always" style={[styles.formWrapper, { transform: [{translateY: shift}] }]}>
          <View style={{ flexDirection: 'row',backgroundColor:"#ffffff",marginBottom:10,padding: 10}}>
            <View style={{width: "60%"}}>
                    <Text
                        style={{
                          color: '#000000',
                          fontSize: 17,
                          fontWeight: 'bold',
                        }}>
                        Aditi Gupta bewafa hai
                      </Text>
            </View>
            <View style={{width: '40%', justifyContent: 'center', alignItems: 'flex-end'}}> 
              <View style={{ height:100,
                          width:100}}>    
                      <Image source = {require('../assets/snack-icon.png')}
                        style={{
                          height:"100%",
                          width:"100%",
                          backgroundColor: 'black',
                          
                        }}
                      />
              </View>
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
                      <Icon size={25} name="chevron-thin-right" type='entypo'/>
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
                    placeholder="Name"
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => this.validateName(text,"nameIdentity")}
                    value = {this.state.nameIdentity}
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
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="TIN Number"
                    underlineColorAndroid="transparent"
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
                  <Icon size={25} name="chevron-thin-right" type='entypo'/>
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
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="Shop Contact Number"
                    underlineColorAndroid="transparent"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="Shop Address"
                    underlineColorAnodroid="transparent"
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
                  <Icon size={25} name="chevron-thin-right" type='entypo'/>
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
                    placeholder="Name"
                    underlineColorAndroid="transparent"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="Contact Number"
                    underlineColorAndroid="transparent"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Icon style={styles.inputIcon} name="mobile" type='entypo'/>
                  <TextInput
                    style={styles.input}
                    placeholder="Shop Address"
                    underlineColorAnodroid="transparent"
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
})
