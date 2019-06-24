import React, { Component } from 'react'
import {TextInput,Text, Alert, StyleSheet, View, ScrollView,TouchableOpacity,Linking, Modal, AsyncStorage, RefreshControl} from 'react-native'
import { Icon } from 'react-native-elements';
import BookingDetails from './BookingDetails';
import ShowLoader from './ShowLoader';
import axios from 'axios';
import { Notifications } from 'expo';

export default class MerchantFlow extends Component {
    constructor(props){
        super(props);
        this.state={
            modalVisible : false,
            serviceName: '',
            counter : 1,
            amount: '',
            services: [],
            currentBookingModal: {},
            bookingsData : [],
            merchantToken: null,
            shopId: null,
            bookingsFlag: false,
            bookingsInProgressArray : [],
            refreshing: false
        }
    }

    static navigationOptions = {
        title: 'Ongoing'
    }

// To Check for getting Notification
componentDidMount(){
    this._notificationSubscription = Notifications.addListener(this.recieveNotification);
}

// For getting the Notification Data
recieveNotification = (notification) => {
    if(!notification.data.bookingStatusValue) {
    console.log("On Merchant Flow : Ongoing")
        this.getBookingDetails();
    }
}

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

// To get the data for the Bookings Corresponding to a shop
getBookingDetails(){
    const URL = 'https://dev.driveza.space/v1/partners/bookings?token=' + this.state.merchantToken 
    + '&shopId=' + this.state.shopId
    axios.get(URL).then((response) => { 
    this.setState({
        bookingsData :response.data,
        bookingsFlag : true,
        refreshing: false
    }, () => {
        this.bookingsForInProgress(this.state.bookingsData)
    });    
    }).catch((response) => {
        console.log('In Catch' + (response))
    });

}

// To get the Data for In Progress Bookings
bookingsForInProgress(bookingsData) {
  this.setState({
   bookingsInProgressArray : bookingsData.filter(function(booking) {
     return (booking.bookingStatus !== -1 && booking.bookingStatus !== 7)
   })
 })
}

setModalVisible(visible, currentBookingModal) {
    // To Transfer the data to BookingDetails.js
    this.setState({
        modalVisible: visible,
        currentBookingModal
    });
}

 // To Refresh the component
  _onRefresh = () => {
    let reactNativeInstance = this;
    this.setState({refreshing: true},() => {
        this.getBookingDetails();
    });

  }
    render() {
        if(this.state.bookingsFlag) {
            if(this.state.bookingsInProgressArray.length === 0) {
                return (
                    <View style={{justifyContent: 'center', alignItems: 'center',flex:1}}>
                        <Text style={{fontSize: 34, fontWeight: 'bold', textAlign:'center'}}>No Bookings Present</Text>
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
                    style={styles.container} >
                        <Modal
                            animationType="fade"
                            visible={this.state.modalVisible}
                            presentationStyle="overFullScreen"
                            style={styles.modal}
                            onRequestClose={() => {
                                this.setModalVisible(!this.state.modalVisible, '');
                            }}>
                            <View style={{height:55,width:"100%",backgroundColor:"#841584",flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible, '');
                                }} style={{height:50,width:50,
                                justifyContent: 'center',
                                alignItems: 'center',paddingTop:10}}>
                                    <Icon
                                        size={25}
                                        name="arrow-back"
                                        type="material-icons"
                                        color="#ffffff"
                                    />
                            </TouchableOpacity>
                            <View style={{justifyContent: 'center',alignItems: 'center'}}><Text style={{fontSize:20,fontWeight:"bold",color:"#ffffff"}}>Booking Status</Text>
                            </View>
                            </View>
                            <ScrollView style={{paddingTop:10,paddingLeft:10,paddingRight:10,paddingBottom:20}}>
                                <BookingDetails merchantToken={this.state.merchantToken} currentBookingModal={this.state.currentBookingModal}/>
                            </ScrollView>
                        </Modal>
                        {
                            this.state.bookingsInProgressArray.map((item,index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => {
                                        this.setModalVisible(true,item);
                                      }}>
                                        <View style={styles.services}>
                                            <View style={{flexDirection: 'row'}}>
                                                <View style={styles.leftSection}>
                                                    <View style={styles.booking}>
                                                        <Text style={{paddingLeft:13,fontWeight: 'bold',fontSize: 17}}>
                                                            {item.bookingId}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.booking}>
                                                        <Icon containerStyle={styles.inputIcon} name="user" type='entypo'/>
                                                        <Text style={{paddingLeft:13}}>
                                                            {item.customerName}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.booking}>
                                                        <Icon containerStyle={styles.inputIcon} name="address" type='entypo'/>
                                                        <Text style={{paddingLeft:13}}>
                                                            {item.address}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.booking}>
                                                        <Icon containerStyle={styles.inputIcon} name="car" type='font-awesome'/>
                                                        <Text style={{paddingLeft:13}}>
                                                            {item.vehicle}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    )
                            })
                        }
                    </ScrollView>           
                )
            }
        } else {
            return <ShowLoader/>
        }
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#b4bac4',
        // padding: 10,
        marginBottom : 20
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
    },
    modal: {
        backgroundColor: 'white',
        margin: 15, // This is the important style you need to set
        alignItems: undefined,
        justifyContent: undefined,
  }
});
