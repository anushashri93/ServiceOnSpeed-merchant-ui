import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, AsyncStorage} from 'react-native';
import {Icon} from 'react-native-elements';

export const BookingInfo = (props) => (
	<React.Fragment>
	<View>
          {/*<Text style={{fontSize:20,fontWeight:"bold"}}>Booking ID: {props.currentBookingModal.bookingId}</Text>*/}
          {/*<Text style={{fontSize:20,marginTop:10,fontWeight:"bold", textTransform: 'uppercase'}}>{props.currentBookingModal.customerName}</Text>*/}
        </View>
        {/*<View style={{width:"100%",height:5,borderBottomColor:"#E5E5E5",borderBottomWidth:1, marginTop:10}}>
        </View>
        <View style={{flexDirection: 'row',marginTop:10,marginBottom:10}}>
          <Icon
            size={20}
            name="car"
            type="font-awesome"/>
          <Text style={{marginLeft:7,fontSize:17}}>{props.currentBookingModal.vehicle}</Text>
        </View>
        <View style={{flexDirection: 'row',marginTop:10,marginBottom:10}}>
          <Icon
            size={20}
            name="time-slot"
            type="entypo"/><Text style={{marginLeft:7,fontSize:17}}>{props.currentBookingModal.dateTime}</Text>
        </View>
        <View style={{flexDirection: 'row',marginTop:10}}>
          <Icon
            size={22}
            name="location-pin"
            type="entypo" color="red"/>
          <View style={{width:"80%"}}>
            <Text style={{marginLeft:7,fontSize:17}}>E-1/436 Chitrakoot, Vishal nagar, Pune,Maharashtra</Text>
          </View>
        </View>*/}
        {<View style={{flexDirection: 'row',marginTop:15,marginBottom:10}}>
          <View style = {{width : "50%", justifyContent : 'center', alignItems : 'center'}}>
            <TouchableOpacity onPress={() => props.callNumber()} style={[props.buttonStyle,{width: '80%', margin: 0, marginTop: 20, opacity : props.isDisabled? 0.5: 1}]}  disabled={props.isDisabled}>
              <Text style={{color:"#ffffff"}}>Call</Text>
		        </TouchableOpacity>
          </View>
          <View style = {{width : "50%", justifyContent : 'center',  alignItems : 'center'}}>
            <TouchableOpacity onPress={() => props.getLocation()} style={[props.buttonStyle,{width: '80%', margin: 0, marginTop: 20,opacity : props.isDisabled? 0.5: 1}]} disabled={props.isDisabled}>
              <Text style={{color:"#ffffff"}}>Location</Text>
	          </TouchableOpacity>
          </View>
        </View>}
        </React.Fragment>
)

export const BookingArrived = (props) => (
	<View>
          {/*<View style={{width:"100%",height:5,borderBottomColor:"#E5E5E5",borderBottomWidth:1, marginTop:10}}>
          </View>
          <View style={{height:30}}>
            <Text style={{fontSize:18,fontWeight:"bold"}}>Booking Status</Text>
          </View>
          <View style={{width:"100%",height:1,borderBottomColor:"#E5E5E5",borderBottomWidth:1}}>
          </View>*/}
          <View style={{flexDirection: 'row',marginTop:20,marginBottom:10, marginLeft:35}}>
            <Text style={{fontSize:18,fontWeight:"bold"}}>Current Status  :  </Text>
            <Text style={{marginLeft:7,fontSize:18}}>{props.bookingStatus}</Text>
          </View>
          <View style={{flexDirection: 'row',marginTop:15,marginBottom:10}}>
            <View style = {{width : "50%", justifyContent : 'center', alignItems : 'center'}}>
              <TouchableOpacity style={[props.buttonStyle,{width: '80%', margin: 0, marginTop: 20}]} onPress={() => props.changeStatus(1)}>
                <Text style={{color:"#ffffff"}}>Confirm</Text>
              </TouchableOpacity>
            </View>
            <View style = {{width : "50%", justifyContent : 'center',  alignItems : 'center'}}>
              <TouchableOpacity style={[props.buttonStyle,{width: '80%', margin: 0, marginTop: 20}]} onPress={() => props.changeStatus(-1)}>
                <Text style={{color:"#ffffff"}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
)

export const BookingScheduled = (props) => (
	<View style={{flexDirection: 'row',marginTop:15,marginBottom:10}}>
		<View style = {{width : "50%", justifyContent : 'center', alignItems : 'center'}}>
			<TouchableOpacity style={[props.buttonStyle,{width: '80%', margin: 0, marginTop: 20}]} onPress={() => props.changeStatus(2)}>
		  		<Text style={{color:"#ffffff"}}>Pick Up</Text>
			</TouchableOpacity>
		</View>
			<View style = {{width : "50%", justifyContent : 'center',  alignItems : 'center'}}>
			<TouchableOpacity style={[props.buttonStyle,{width: '80%', margin: 0, marginTop: 20}]}>
		  		<Text style={{color:"#ffffff"}}>Delivery</Text>
			</TouchableOpacity>
		</View>
    </View>
)

export const CreateJobcard = (props) => (
	<View style={{alignItems: 'center'}}>
		<TouchableOpacity style={props.buttonStyle} onPress={() => props.changeStatus(4)}>
        	<Text style={{color:"#ffffff"}}>Create Jobcard</Text>
        </TouchableOpacity>
    </View>
            
)

export const DeliveryMode = (props) => (
	 <View style={{alignItems: 'center'}}>
    <TouchableOpacity style={props.buttonStyle} onPress={() => props.changeStatus(7)}>
          <Text style={{color:"#ffffff"}}>Handed Over</Text>
        </TouchableOpacity>
    </View>
)