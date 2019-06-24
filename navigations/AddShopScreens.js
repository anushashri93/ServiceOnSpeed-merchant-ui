import React from 'react';
import { createStackNavigator } from 'react-navigation';

//Components or Screens
import AddShop from '../components/AddShop';
import AddShopDetails from '../components/AddShopDetails';

export const AddShopNavigator = createStackNavigator({
  AddShopScreen: AddShop,
  AddShopDetailsScreen: AddShopDetails
},{
  initialRouteName: 'AddShopScreen'
});