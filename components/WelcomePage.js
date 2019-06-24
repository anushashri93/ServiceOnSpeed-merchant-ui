import React, { Component } from 'react';
import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';

export default class WelcomePage extends Component {
  constructor() {
    super();
  }

  static navigationOptions = {
    header: null
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={{fontSize: 35,fontWeight:'bold', marginBottom:50}}>
           Service On Speed
          </Text>
          <TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate('LoginFormScreen')}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Log In</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate('SignUpScreen')}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </View>
          </TouchableOpacity>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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