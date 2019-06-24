import React, { Component } from 'react'
import { Text, StyleSheet, View, AsyncStorage } from 'react-native'

export default class Loading extends Component {
  constructor() {
      super();
      this.state={
          checkToken : null
      }
  }

  // Screen Navigation Function
  screenToNavigate = () => {
    if(this.state.checkToken === null){
      this.props.navigation.navigate("AuthNavigatorScreen");
    } else {
      AsyncStorage.getItem('merchantDetailsFlag').then(value => {
        if(value === "true"){
          this.props.navigation.navigate("AddShopNavigatorScreen");
        } else if(value === "false") {
          this.props.navigation.navigate("AdditionalDetailsScreen");
        }
      })
    }
  }

  componentWillMount(){
    AsyncStorage.getItem('merchantToken').then(value => {
      this.setState({
        checkToken : value,
      }, () => {
        this.screenToNavigate();
      })
    })
  }

  render() {
    return (
      <View>
        <Text>Loading.....</Text>
      </View>
    )
  }
}