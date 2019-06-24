import React from 'react';
import { createSwitchNavigator} from 'react-navigation';

//Component Or Screens
import Loading from '../components/Loading';

//Navigation Screens
import { AuthNavigator } from './AuthNavigatorScreens';
import { AddShopNavigator } from './AddShopScreens';
import { TabNavigator } from './TabNavigatorScreens';
import { AddAdditionalNavigator } from './AddAdditionalDetailsScreens';

export const AppNavigator = createSwitchNavigator({
  LoadingScreen : Loading,
  AuthNavigatorScreen : AuthNavigator,
  AddShopNavigatorScreen : AddShopNavigator,
  TabNavigatorScreen : TabNavigator,
  AdditionalDetailsScreen : AddAdditionalNavigator
},{
  initialRouteName: 'LoadingScreen'
});