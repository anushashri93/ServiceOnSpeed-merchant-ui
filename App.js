import React from 'react';
import { createAppContainer } from 'react-navigation';

//Main Navigation Screen
import { AppNavigator } from './navigations/AppNavigatorScreens'

export default class App extends React.Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}

const AppContainer = createAppContainer(AppNavigator);