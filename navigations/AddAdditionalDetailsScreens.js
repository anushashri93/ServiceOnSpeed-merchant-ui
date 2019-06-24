import React from 'react';
import { createStackNavigator } from 'react-navigation';

//Components Or Screens
import AdditionalDetails from '../components/AdditionalDetails';

export const AddAdditionalNavigator = createStackNavigator({
  AdditionalDetailsScreen: AdditionalDetails,
},{
  initialRouteName: 'AdditionalDetailsScreen'
});