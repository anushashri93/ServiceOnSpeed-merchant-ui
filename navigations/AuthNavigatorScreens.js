import React from 'react';
import { createStackNavigator } from 'react-navigation';

//Components Or Screens
import WelcomePage from '../components/WelcomePage';
import SignUp from '../components/SignUp';
import LoginForm from '../components/LoginForm';
import OtpLogin from '../components/OtpLogin';
import PasswordLogin from '../components/PasswordLogin';

export const AuthNavigator = createStackNavigator({
  WelcomePageScreen: WelcomePage,
  SignUpScreen: SignUp,
  LoginFormScreen: LoginForm,
  OtpLoginScreen: OtpLogin,
  PasswordLoginScreen: PasswordLogin
},{
    initialRouteName: 'WelcomePageScreen'
});