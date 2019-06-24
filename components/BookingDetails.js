import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, AsyncStorage, Linking, Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import {BookingInfo, BookingArrived, BookingScheduled, CreateJobcard, DeliveryMode} from './BookingDetailsComponents';
import axios from 'axios';
import {getPushNotificationData} from '../constants/constants';
import sendPushNotification from './sendPushNotification';
import ShowLoader from './ShowLoader';
import { Notifications, Permissions } from 'expo';

export default class BookingDetails extends Component {
  constructor(props) {
    super(props);
    this.state={
      serviceName: '',
      counter: 1,
      statusValue: props.currentBookingModal.bookingStatus,
      shopId: '',
      shopName: '',
      amount: '',
      isDisabled : props.currentBookingModal.bookingStatus?false:true,
      bookingStatus : 'Booking Arrived',
      services: [],
      notificationData : {},
      showLoader : true,
      merchantExpoToken : null,
      merchantToken : null,
      servicesJobcard: []
    }
  } 

  componentWillMount(){
    // Getting the Shop Name
    AsyncStorage.getItem('shopName').then(value => {
      this.setState({
        shopName : value
      })
    });

    // Getting the Merchant Token
    this.generatePushToken();


    // To get the data for the Shop Id
    AsyncStorage.getItem('shopId').then(value => {
      this.setState({
        shopId : value
      }, () => {
        this.updateBookingStatus();
        this.getJobCardDetailsOnLoad("jobId"+this.state.shopId+this.props.currentBookingModal.bookingId);
      })
    });
  }

  getJobCardDetailsOnLoad = (jobdetails) => {
    AsyncStorage.getItem(jobdetails).then(value =>{
      if(value) {
        this.setState({
          services: JSON.parse(value)
        });
      }
    });
  }

  // To recieve the Push Notification
  componentDidMount(){
      this._notificationSubscription = Notifications.addListener(this.recieveNotification);
  }

  // For getting Notification
  recieveNotification = (notification) => {
    if(notification.data.bookingStatusFlag){
    console.log("In Booking Details")
      this.setState({
        statusValue : notification.data.bookingStatusValue
      },() => {
        alert(this.state.statusValue)
        this.updateStatusLatest();
      })
    }
  }

  // To apply the Validation for the Amount
  setValueAmount = (value, fieldname) => {
    let regex = /^([0-9])/g;
      if(!regex.test(value) && value!== "") {
      return;
    }
    this.setState({
      [fieldname]: value
    });
  }

  // To apply the Validation for the Service Name
  setValueName = (value, fieldname) => {
    let regex = /^([a-zA-Z])/g;
    if(!regex.test(value) && value!== "") {
    return;
  }
  this.setState({
    [fieldname]: value
  });

  }


  totalAmount = (array) => {
    let totalAmount = 0;
    if(array.length > 0) {
      array.map(value => {
        totalAmount = totalAmount + value.amount
      })
      return totalAmount;
    } else {
      return 0
    }
  }
  
  // To increase the Value of Increament/Decreament 
  increaseValue = () => {
    this.setState({
      counter: this.state.counter+1
    })
  }

  // To decrease the Value of Increament/Decreament 
  decreaseValue = () => {
    if(this.state.counter==1){
      return
    }
    this.setState({
      counter: this.state.counter-1
    })
  }


/*To Add the service*/
  addService = (jobCardDetails) => {
    if(this.state.serviceName === "" || this.state.amount === "") {
      Alert.alert("Fields are  empty")
      return;
    }

    let newRow = {
      serviceName: this.state.serviceName,
      quantity: this.state.counter,
      amount: this.state.counter*parseInt(this.state.amount)
    }
    // alert(JSON.stringify(newRow))

    this.setState({
      serviceName: '',
      counter: 1,
      amount: '',
      services: [...this.state.services,newRow]
    },() => {
      alert(JSON.stringify(this.state.services))
      AsyncStorage.setItem(jobCardDetails,JSON.stringify(this.state.services));
    });
  }

  // // Creating Job Card Data
  // creatingJobCard(){
  //   let data = this.state.services;
  //   let newData = [];
  //   for (var index = 0; index < data.length; index++) {
  //     let newDataObject = {
  //       serviceName: data[index].serviceName,
  //       quantity: data[index].counter,
  //       amount: data[index].counter*parseInt(data[index].amount)
  //     }
  //     newData.push(newDataObject);
  //     alert(JSON.stringify(newData))
  //   }
  // }

  /*To delete service*/
  deleteService = (index,jobCardDetails) => {
    let newArray = this.state.services;
    newArray.splice(index,1);
    this.setState({
      services: newArray
    },() => {
      AsyncStorage.setItem(jobCardDetails,JSON.stringify(this.state.services));
    });
  }

  updateBookingStatus = () => {
    const URL = 'https://dev.driveza.space/v1/partners/booking-status?token='+this.props.merchantToken+'&bookingId='+this.props.currentBookingModal.bookingId+'&shopId='+this.state.shopId;
    axios.get(URL).then((response) => { 
      this.setState({
        statusValue: response.data.bookingStatus,
        isDisabled: response.data.bookingStatus?false:true,
        showLoader: false
      },() => {
        this.updateStatusLatest();
      })
    }).catch((response) => {
        alert('In Catch' + (response))
    });
  }

  //use to send job card services values
  sendJobcard = (jobCardDetails) => {
    // Check if the Fields are Empty
    if(!this.state.services.length) {
      Alert.alert("Please add the Services")
      return;
    }
    this.sendJobcardMerchant();

    AsyncStorage.getItem(jobCardDetails).then(value => {
      this.setState({
        services: JSON.parse(value)
      },() => {
        //Add ajax call for Send job card and status update, then on success send push token
        // alert(JSON.stringify(this.state.services));
        //dummy call to update status
        this.changeStatus(5);
      })
    });
  }

  // on Confirming the Booking
  onConfirmBooking = () => {
    this.setState({
      isDisabled : false,
      bookingStatus : 'Scheduled'
    });
  }

 
  // Change Status 
  changeStatus = (status) => {
    // this.setState({
    //   statusValue : status
    // }, function() {
      this.updateStatus(status, true);
    // });
  }
  
  // Update Status Value
  updateStatus = (statusValue, flag) => {
        if(flag) {
          console.log(this.state.merchantExpoToken)
          axios.post("https://dev.driveza.space/v1/partners/update-booking-status",{
            token: this.props.merchantToken,
            bookingId: this.props.currentBookingModal.bookingId,
            statusId: statusValue
          }).then((response) => {   
            if(statusValue!==4){
            sendPushNotification(getPushNotificationData(statusValue, {...this.props.currentBookingModal, 
              shopName : this.state.shopName}));
            } 
            if(statusValue===7 || statusValue===-1){
             this.sendPushTokenForCompleted(this.state.merchantExpoToken, this.props.currentBookingModal, statusValue);
             AsyncStorage.removeItem("jobId"+this.state.shopId+this.props.currentBookingModal.bookingId);
              //  Get the token that uniquely identifies this device
              this.setState({
                services : []
              }) 
            }
            // To set the value for the Status, Once updated in Database
            this.setState ({
              statusValue
            },() => {
              this.updateStatusLatest();
            })
          }).catch((response) => {
            alert('In Catch Enter' + (response))
          });
        }
    }

    // To Update the Views on a Push Token
    updateStatusLatest = () => {
        // Merchant has Cancelled the Booking
        if(this.state.statusValue === -1){
            this.setState({
            bookingStatus : 'Booking Cancelled'
          });   
        }
      // Merchant has Confirmed the Booking
        if(this.state.statusValue === 1){
            this.setState({
            isDisabled : false,
            bookingStatus : 'Scheduled'
          });   
        }
      // Merchant has snd the service man : Service Man On the Way
        if(this.state.statusValue === 2){
            this.setState({
            isDisabled : false,
            bookingStatus : 'ServiceMan On The Way'
          });   
        }
      // Customer has approved the vehicle Pick up : Vehicle Picked up
        if(this.state.statusValue === 3 || this.state.statusValue === 4){
            this.setState({
            bookingStatus : 'Picked up'
          });   
        }
      // Job Card Approved by the Customer
        if(this.state.statusValue === 5){
            this.setState({
            bookingStatus : 'Payment Pending'
          });   
        }

      // Drop and Pick up Displayed
        if(this.state.statusValue === 6){
            this.setState({
            bookingStatus : 'Payment Recieved'
          });   
        }

       // Booking Completed
        if(this.state.statusValue === 7){
            this.setState({
            bookingStatus : 'Booking Completed'
          });   
        }

    }

// To get the Push Token for the Current Device
  generatePushToken = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return;
    }
  
    //  Get the token that uniquely identifies this device
    this.setState({
      merchantExpoToken : await Notifications.getExpoPushTokenAsync()
    })
  }

  // Sending the Push Token to the Merchant for the Completed Booking
  sendPushTokenForCompleted = (merchantToken, bookingData, statusValue) => {
    const notificationObject = {
    token : `${merchantToken}`,
    title : (statusValue === 7 ? "Booking Completed" : "Booking Cancelled"),
    body : (statusValue === 7 ? ("Booking Id " + bookingData.bookingId + " is Completed ") : 
      ("Booking Id " + bookingData.bookingId + " is Cancelled ")),
    data : {
    }
  }  
  sendPushNotification(notificationObject);
}

// To call the customer When Call utton is Enabled
callNumber = () =>{
  let url = `tel:+91${this.props.currentBookingModal.customerPhone}`;
  Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      console.log('Can\'t handle url: ' + url);
    } else {
      return Linking.openURL(url);
    }
  }).catch(err => console.error('An error occurred', err));
}

// To get the Location based on the Lattitude and Longitude
getLocation = () =>{
  let address = `${this.props.currentBookingModal.address}`;
  let latitude = `${this.props.currentBookingModal.lat}`;
  let longitude = `${this.props.currentBookingModal.long}`;

  // To get the Address
  let addressDisplayed = address.split(",", 2); 
  let label = addressDisplayed[0] + " " + addressDisplayed[1];

const url = Platform.select({
  ios: "maps:" + latitude + "," + longitude + "?q=" + label,
  android: "geo:" + latitude + "," + longitude + "?q=" + label
});

Linking.canOpenURL(url).then(supported => {
  if (supported) {
    return Linking.openURL(url);
  } else {
    browser_url =
      "https://www.google.de/maps/@" +
      latitude +
      "," +
      longitude +
      "?q=" +
      label;
    return Linking.openURL(browser_url);
  }
});

}

  // To store the data for the Job card
sendJobcardMerchant = () => {
    AsyncStorage.getItem('merchantToken').then(value => {
      this.setState({
        merchantToken : value
  }, () => {
    AsyncStorage.getItem('shopId').then(value => {
        this.setState({
        shopId : value
    }, () => {
      this.storeJobcardDetails();
    })
  });
  })
});
}

storeJobcardDetails = () => {
  const objectSendJobcard = {
    token : this.state.merchantToken,
    bookingId : this.props.currentBookingModal.bookingId,
    shopId : (Number.parseInt(this.state.shopId)),
    data : this.state.services
  }
  // alert(JSON.stringify(objectSendJobcard))
  console.log(JSON.stringify(objectSendJobcard))
  axios.post('https://dev.driveza.space/v1/partners/job-card',objectSendJobcard).then((response) => {
    alert('In Try');
    console.log(JSON.stringify(response))
     }).catch((response) => {
    const statusCode = response.response.status;
    if(statusCode === 422){
      Alert.alert(response.response.data)
    }else {
      Alert.alert(JSON.stringify(response))
    }
  });

}

  render() {
    if(!this.state.showLoader) {
    return (      
      <React.Fragment>
      {(this.state.statusValue !== -1)?
        <BookingInfo
          buttonStyle={styles.buttonStyle}
          callNumber = {this.callNumber}
          getLocation = {this.getLocation}
          currentBookingModal={this.props.currentBookingModal}
          isDisabled={this.state.isDisabled}
          changeStatus={(counter) => this.changeStatus(counter)}
        /> : null
      }
        {(this.state.isDisabled && this.state.statusValue !== -1) ? 
          <BookingArrived
            buttonStyle={styles.buttonStyle}
            bookingStatus={this.state.bookingStatus}
            currentBookingModal={this.props.currentBookingModal}
            changeStatus={(counter) => this.changeStatus(counter)}
          />
        :
        <View>
          {/*<View style={{width:"100%",height:5,borderBottomColor:"#E5E5E5",borderBottomWidth:1, marginTop:10}}>
          </View>
          <View style={{height:30}}>
            <Text style={{fontSize:18,fontWeight:"bold"}}>Booking Status</Text>
          </View>
          <View style={{width:"100%",height:1,borderBottomColor:"#E5E5E5",borderBottomWidth:1}}>
          </View>*/}
          <View style={{flexDirection: 'row',marginTop:20,marginBottom:10, marginLeft:15}}>
            <Text style={{fontSize:16,fontWeight:"bold"}}>Current Status  :  </Text>
            <Text style={{marginLeft:7,fontSize:16}}>{this.state.bookingStatus}</Text>
          </View>
          {(this.state.statusValue === 6)?
          <DeliveryMode
            buttonStyle={styles.buttonStyle}
            changeStatus={(counter) => this.changeStatus(counter)}
          />:null
          }
          {(this.state.statusValue === 3)?
            <CreateJobcard
              buttonStyle={styles.buttonStyle}
              changeStatus={(counter) => this.changeStatus(counter)} 
            /> :
            ((this.state.statusValue === 1)?
            <BookingScheduled
              buttonStyle={styles.buttonStyle}
              changeStatus={(counter) => this.changeStatus(counter)} 
            />
            :null)
          }
        </View>}
      {(this.state.statusValue > 3 && this.state.statusValue < 6)?
      <View>
        <View style={{width:"100%",height:5,borderBottomColor:"#E5E5E5",borderBottomWidth:1, marginTop:10}}>
        </View>
        <View style={{justifyContent: 'center',alignItems: 'center',height:50}}>
          <Text style={{fontSize:20,fontWeight:"bold"}}>Bill Details</Text>
        </View>
        <View style={{width:"100%",height:5,borderBottomColor:"#E5E5E5",borderBottomWidth:1}}>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop:15,
            marginLeft:10
          }}>
          <View style={{ alignItems: 'flex-start', right: 5,width:"50%" }}>
            <Text style={{fontSize:20}}>Total Amount</Text>
          </View>
          <View style={{ alignItems: 'flex-end',width:"50%" }}>
              <Text
                style={{
                fontSize: 20,
                fontWeight: 'bold',
                }}>
                  {
                    this.totalAmount(this.state.services)
                  }
              </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop:15,
            marginLeft:10
        }}>
        </View>
        <View>
          {
            this.state.services.length > 0 ?
              <View style={{flexDirection:"row",marginTop:20,marginBottom:10}}>
                <View style={{width:"33%",alignItems : 'center', justifyContent : 'center'}}>
                  <Text style = {{fontSize : 17}}>Services Name</Text>
                </View>
                <View style={{width:"30%",alignItems : 'center', justifyContent : 'center'}}>
                  <Text style = {{fontSize : 17}}>Qty</Text>
                </View>
                <View style={{width:"30%",alignItems : 'center', justifyContent : 'center'}}>
                  <Text style = {{fontSize : 17}}>Amount</Text>
                </View>
              </View>:null 
          }        
          { 
            this.state.services.map((value,index) => {
              return(
                <View key={index} style={{flexDirection:"row",marginTop:20,marginBottom:10,borderWidth:1,borderColor:'#dbdbdb',paddingTop:10,paddingBottom:10}}>
                  <View style={{width:"30%",alignItems : 'center', justifyContent : 'center',paddingLeft:10}}>
                    <Text style = {{fontSize : 17}}>{value.serviceName}</Text>
                  </View>
                  <View style={{width:"30%",alignItems : 'center', justifyContent : 'center'}}>
                    <Text style = {{fontSize : 17}}> {value.quantity}</Text>
                  </View>
                  <View style={{width:"30%",alignItems : 'center', justifyContent : 'center', flexDirection : 'row'}}>
                    <View>
                      <Icon size = {25} name="rupee" type='font-awesome'/>
                    </View>
                    <Text style = {{fontSize : 17}}>{value.amount}</Text>
                  </View>
                  {this.state.statusValue < 5 ? <TouchableOpacity style = {{width : '10%', justifyContent : 'center'}} onPress={() => this.deleteService(index,"jobId"+this.state.shopId+this.props.currentBookingModal.bookingId)}>
                    <Icon size = {25} name="delete" type='material-community-icons' color = '#000000'/>
                  </TouchableOpacity> : null}
                </View>
              )
            })
          }
        {this.state.statusValue < 5  ? <View>
          <View>
            <TextInput
            style={styles.input}
            placeholder="Service Name"
            underlineColorAndroid="transparent"
            onChangeText = {(text) => this.setValueName(text,"serviceName")}
            value = {this.state.serviceName}
            />
          </View>
          <View style = {{flexDirection : 'row',  marginBottom :20}}>
            <View style = {{width : '50%', flexDirection : 'row'}}> 
              <View style = {{width : '30%', backgroundColor : '#dbdbdb', alignItems : 'center', justifyContent : 'center'}}>
                <TouchableOpacity onPress={this.increaseValue}>
                  <Text style = {{fontSize : 30}}>+</Text>
                </TouchableOpacity>
              </View>
              <View style= {{width : '40%', border:5, borderColor : '#dbdbdb', borderWidth : 1, justifyContent : 'center',alignItems : 'center'}}>
                <Text>{this.state.counter}</Text>
              </View>
              <View style = {{width : '30%',  backgroundColor : '#dbdbdb',  alignItems : 'center', justifyContent : 'center'}}>
                <TouchableOpacity onPress={this.decreaseValue}>
                  <Text style = {{fontSize : 30}}>-</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style = {{width : '50%'}}>
              <TextInput
                style={styles.inputAmount}
                  placeholder="Amount Per Unit"
                  underlineColorAndroid="transparent"
                  onChangeText = {(text) => this.setValueAmount(text,"amount")}
                  value = {this.state.amount}
              />
            </View>
          </View>
          <View style={{alignItems: 'center', marginBottom : 20}}>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => this.addService("jobId"+this.state.shopId+this.props.currentBookingModal.bookingId)}>
              <Text style={{color:"#ffffff"}}>Add Service</Text>
		        </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center', marginBottom : 20}}>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => this.sendJobcard("jobId"+this.state.shopId+this.props.currentBookingModal.bookingId)}>
              <Text style={{color:"#ffffff"}}>Send JobCard</Text>
            </TouchableOpacity>
          </View>
        </View> : null}
      </View>
      </View>:null} 
    </React.Fragment>) 
    } else {
      return <ShowLoader/>
    }
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
	padding:10,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 20,
  marginTop: 40,
  marginRight: 20,
  width:"100%",
	backgroundColor: '#841584',
	borderRadius:5
  },
  inputAmount :{
    flex: 1,
    width : '80%',
    paddingTop: 15,
    paddingRight: 10,
    paddingLeft: 5,
    paddingBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#424242',
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: 5,
    marginLeft : 20
  },
  input: {
    flex: 1,
    paddingTop: 15,
    paddingRight: 10,
    paddingLeft: 5,
    paddingBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#424242',
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: 5,
    marginTop : 20,
    marginBottom : 20
  }
});