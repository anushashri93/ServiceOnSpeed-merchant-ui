import React, { Component } from 'react'
// import { Text, ScrollView, StyleSheet, View,StatusBar } from 'react-native'
import { createStackNavigator } from 'react-navigation';
// import { Icon } from 'react-native-elements';
import AddShop from './AddShop'
import AddShopDetails from './AddShopDetails'
export default class AddShopComponent extends Component {
  render() {
    return (
        <AddShopNavigator />
    )
  }
}

const AddShopNavigator = createStackNavigator({
    AddShopScreen: AddShop,
    AddShopDetailsScreen: AddShopDetails
},{
    initialRouteName: 'AddShopScreen'
});
