import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView,TouchableOpacity, AsyncStorage, RefreshControl} from 'react-native'
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { Notifications } from 'expo';
 
export default class Completed extends Component {
    constructor(){
        super();
        this.state={
            bookingsData : [],
            bookingStatus : '',
            bookingsCompleteArray : [],
            refreshing: false
        }
    }

  static navigationOptions = {
    title: "Completed"
  }

// To check for the Push Notification
componentDidMount(){
    this._notificationSubscription = Notifications.addListener(this.recieveNotification);
}

// For getting Notification
recieveNotification = (notification) => {
    if(notification.data.booking) {
    console.log("On Completed")
            this.getBookingDetails();
    }
    this.getBookingDetails();
}

// To Get the details from Async Storage
componentWillMount(){
        AsyncStorage.getItem('merchantToken').then(value => {
                this.setState({
                merchantToken : value
        }, () => {
        AsyncStorage.getItem('shopId').then(value => {
                this.setState({
                shopId : value
        }, () => {
            this.getBookingDetails();
        })
    });
        })
    });
}

// To get the data for the Completed Bookings Corresponding to a shop
getBookingDetails(){
    const URL = 'https://dev.driveza.space/v1/partners/bookings?token=' + this.state.merchantToken 
    + '&shopId=' + this.state.shopId
    axios.get(URL).then((response) => { 
    this.setState({
        bookingsData : response.data,
        refreshing: false
    }, () => {
        this.bookingsForCompleted(this.state.bookingsData)
    });    
    }).catch((response) => {
        console.log('In Catch' + (response))
    });

}

// Filtering the Completed bookings
bookingsForCompleted(bookingsData) {
  this.setState({
   bookingsCompleteArray : bookingsData.filter(function(booking) {
     return (booking.bookingStatus === -1 || booking.bookingStatus === 7)
   })
 })
}

 // To Refresh the component
  _onRefresh = () => {
    let reactNativeInstance = this;
    this.setState({
        refreshing: true
    },() => {
        this.getBookingDetails();
    });

  }  

    render() {
    if(this.state.bookingsData.length === 0) {
                return (
                    <View style={{justifyContent: 'center', alignItems: 'center',flex:1}}>
                        <Text style={{fontSize: 34, fontWeight: 'bold', textAlign:'center'}}>No Bookings Completed</Text>
                    </View>
                    )
    } else {
    return (
      <ScrollView 
          refreshControl={
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
            />
    }
    style={styles.container}>
            {
                this.state.bookingsCompleteArray.map((booking,index) => {
                return (
                <View key={index} style={styles.services}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.leftSection}>
                                <View style={styles.booking}>
                                    <Icon containerStyle={styles.inputIcon} name="user" type='entypo'/>
                                    <Text style={{paddingLeft:13}}>
                                        {booking.bookingId}
                                    </Text>
                                </View>
                                <View style={styles.booking}>
                                    <Icon containerStyle={styles.inputIcon} name="user" type='entypo'/>
                                    <Text style={{paddingLeft:13}}>
                                        {booking.customerName}
                                    </Text>
                                </View>
                                <View style={styles.booking}>
                                    <Icon containerStyle={styles.inputIcon} name="address" type='entypo'/>
                                    <Text style={{paddingLeft:13}}>
                                       {booking.address}
                                    </Text>
                                </View>
                                <View style={styles.booking}>
                                    <Icon containerStyle={styles.inputIcon} name="car" type='font-awesome'/>
                                    <Text style={{paddingLeft:13}}>
                                       {booking.vehicle}
                                    </Text>
                                </View>
                        </View>
                    </View>
                    <View style={styles.status}>
                        <View style={styles.leftSection}>
                            <Text>
                                {booking.bookingStatus !==0 ? 
                                    (booking.bookingStatus === -1 ? 'Cancelled' : 'Completed') : ''}
                            </Text>
                        </View>
                    </View>
                </View>
                )
            })
            }

            </ScrollView>
    )
    }
  }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#b4bac4',
        // padding: 10
    },
    services:{
        backgroundColor: 'white',
        marginBottom:10,
        marginTop:10,
        padding:5,
        borderRadius: 5
    },
    leftSection:{
        width: '80%',
    },
    rightSection:{
        width: '20%',
        alignItems:'flex-end'
    },
    booking:{
        flexDirection: 'row',
        paddingBottom: 5
    },
    inputIcon:{
        height: 26,
        top:0
    },
    status:{
        flexDirection: 'row',
        paddingTop: 5,
        borderTopWidth: 2,
        borderColor: "#000"
    }
});