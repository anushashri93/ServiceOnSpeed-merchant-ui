import React, { Component } from 'react';
import {ScrollView, Text, StyleSheet, View, AsyncStorage} from 'react-native';
import axios from 'axios';
import {faresDetails, dateFormat} from '../constants/constants'
import {dataFormat} from '../constants/constants'


export default class Fares extends Component {
  constructor() {
    super();
    this.state = {
      faresDetails,
      nextBillingDate : '',
      merchantToken : null,
      listFares : [],
      shopId : null
    }
  }
  static navigationOptions = {
    title: "Fares"
  }

  componentWillMount() {

    // To Calulate Next billing Date
    this.calculateNextBillingDate();
    
    // To get the Merchant Token
        AsyncStorage.getItem('merchantToken').then(value => {
        this.setState({
        merchantToken : value
      }, () => {
        AsyncStorage.getItem('shopId').then(value => {
          this.setState({
          shopId : value
      }, () => {
        this.getFaresDetails();
      })
    });
      });
    });
   }

  // this.getDetailsFares();
  getFaresDetails = () => {
  const URL = 'https://dev.driveza.space/v1/partners/fares?token=' + this.state.merchantToken + '&shopId=' + this.state.shopId;
   axios.get(URL).then((response) => {
    this.setState({
      listFares :response.data.data,
      // shopFlag : true
    }, () => {
    console.log(JSON.stringify(this.state.listFares))
    });    
    }).catch((response) => {
      alert('In Catch' + (response))
      console.log(response)
  });
}


  calculateNextBillingDate = () => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Getting The Date for Next Sunday
    let td = new Date();
    let diffDays = 7-td.getDay();
    let nextDate = new Date(td.setDate(td.getDate() + diffDays));
    
    // Constructing the Date Object
    let nextSundayDate = `${nextDate.getDate()} ${months[nextDate.getMonth()]} ${nextDate.getFullYear()}` 

    this.setState({
      nextBillingDate : nextSundayDate
    })  
  }

  outstandingAmounts = () => {
    let creditAmount = 0 , debitAmount = 0;
    for (var i = 0; i < this.state.faresDetails.length; i++) {
      if(this.state.faresDetails[i].type) {
        debitAmount +=  this.state.faresDetails[i].amount * 0.1
      } else {
        creditAmount +=  this.state.faresDetails[i].amount * 0.9
      }
    }
    return [creditAmount,debitAmount];
  }

  calculateFare = (amount,type) => {
        if(type === 'Online Payment'){
      return amount*0.1
    } else {
      return amount*0.9
    }
  }
  render() {
    return (
      <ScrollView style = {styles.fareContainer}>
        <View style={styles.totalAmount}>
          <View style={styles.innerContainer}>
            <Text style={styles.innerText}>Total Amount To be Credited</Text>
          </View>
          <View style={[styles.innerContainer,{width: "30%",borderLeftWidth: 1,borderColor: "black"}]}>
            <Text style={[styles.innerText,{color: "green"}]}>+{this.outstandingAmounts()[0]}</Text>
          </View>
        </View>
        <View style={[styles.totalAmount,{borderTopWidth: 0}]}>
          <View style={styles.innerContainer}>
            <Text style={styles.innerText}>Total Amount To be Debited</Text>
          </View>
          <View style={[styles.innerContainer,{width: "30%",borderLeftWidth: 1,borderColor: "black"}]}>
            <Text style={[styles.innerText,{color: "red"}]}>-{this.outstandingAmounts()[1]}</Text>
          </View>
        </View>
        <View style={[styles.totalAmount,{borderTopWidth: 0,marginBottom: 20}]}>
          <View style={styles.innerContainer}>
            <Text style={styles.innerText}>Total Amount</Text>
          </View>
          <View style={[styles.innerContainer,{width: "30%",borderLeftWidth: 1,borderColor: "black"}]}>
            <Text style={styles.innerText}>{this.outstandingAmounts()[0]-this.outstandingAmounts()[1]}</Text>
          </View>
        </View>
        <View style={[styles.totalAmount]}>
          <View style={styles.innerContainer}>
            <Text style={styles.innerText}>Upcoming Billing Date</Text>
          </View>
          <View style={[styles.innerContainer,{width: "30%",borderLeftWidth: 1,borderColor: "black"}]}>
            <Text st  yle={styles.innerText}>{this.state.nextBillingDate}</Text>
          </View>
        </View>
        <React.Fragment>
        {
          this.state.listFares.map((item,index) => {
            return (
              <View key={index} style={{marginTop: 20}}>
                <View style={styles.transactionMode}>
                  <Text style={[styles.innerText,{color: "#fff"}]}>Payment By {item.type}</Text>
                </View>
                <View style={styles.totalAmount}>
                  <View style={[styles.transactionDetails,{padding: 10}]}>
                    <Text style={styles.innerText}>Transaction Id: {item.bookingId}</Text>
                    <Text style={styles.innerText}>{dateFormat(item.dateTime)}</Text>
                    <Text style={[styles.innerText,{paddingTop: 15, paddingBottom: 15}]}>{item.customerName}</Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.innerText}>Total Amount : {item.total}</Text>
                    </View>
                  </View>
                  <View style={[styles.transactionDetails,{width: "30%",borderLeftWidth: 1,borderColor: "black",justifyContent: 'center',alignItems: 'center'}]}>
                    <Text style={{width: "100%",textAlign: 'center',color: item.type?"red":"green",fontSize: 30}}>{(item.type === 'Online Payment')?"-":"+"}{this.calculateFare(item.total)}</Text>
                    <Text style={{width: "100%",textAlign: 'center',color: item.type?"red":"green"}}>{item.type?"(Debit)":"(Credit)"}</Text>
                  </View>
                </View>
              </View>
              )
          })
        }
        </React.Fragment>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  fareContainer: {
    width: "100%",
    backgroundColor: "#e5e5e5",
    padding: 10
  },
  totalAmount: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black"
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: "70%"
  },
  innerText: {
    fontWeight: 'bold',
    fontSize: 15
  },
  transactionMode: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#841584",
    height: 30,
    borderRadius: 5,
    width: 250
  },
  transactionDetails: {
    width: "70%"
  }
})