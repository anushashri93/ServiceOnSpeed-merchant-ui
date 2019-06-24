import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';

//Components Or Screens
import MerchantFlow from '../components/MerchantFlow';
import Completed from '../components/Completed';
import Fares from '../components/Fares';
import Profile from '../components/Profile';

export const TabNavigator = createMaterialTopTabNavigator({
  MerchantFlowScreen: MerchantFlow,
  CompletedScreen: Completed,
  FaresScreen: Fares,
  ProfileScreen: Profile
},{
  animationEnabled : true,
  backBehavior :"none",
  tabBarOptions: {
      activeTintColor: 'red',
      inactiveTintColor: 'black',
      indicatorStyle: {
        backgroundColor: 'white',
      },
      labelStyle: {
        fontSize: 12,
        color: 'white',
        fontWeight:'bold',
        width: '100%'
      },
      tabStyle: {
        height: 80,
        paddingTop: 20,
        flex:1,
        alignItems:'center',
      },
      style: {
        backgroundColor: '#841584',
      },
      statusBarStyle: 'light-content',
    }
});