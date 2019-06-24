import React, { Component } from 'react'
import { ScrollView, StyleSheet,Text, View,TouchableOpacity, AsyncStorage} from 'react-native'
import { Icon } from 'react-native-elements';
import axios from 'axios';
import ShowLoader from './ShowLoader';
import { Notifications, Permissions } from 'expo';

export default class AddShop extends Component {
    constructor(props){
        super(props);
        this.state = {
            merchantToken: null,
            notification: '',
            notificationData: {},
            listShops : [],
            shopFlag: false,
            token : null
        }
    }
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Your Shops',
        headerStyle:{
            backgroundColor: '#841584'
        },
        headerTitleStyle:{
            color: '#fff'
        },
        headerRight: (
            <View style={{width: '100%',
                  height: 60,
                  marginRight:25,
                  justifyContent: 'center'}}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate("AddShopDetailsScreen")}>
                    <Icon size={45} color='#fff' name="add-circle" type='icon-icons'/>
                </TouchableOpacity>
            </View>
        ),
      })

    componentDidMount() {
      this._notificationSubscription = Notifications.addListener(this.recieveNotification);
    }

    recieveNotification = (notification) => {
        if(notification.data.shopAdded) {
        console.log("On Shop Addition")
        this.setState({
            shopFlag: false
        },() => {
            const URL = 'https://dev.driveza.space/v1/partners/shop?token=' + this.state.merchantToken;
            axios.get(URL).then((response) => {
                this.setState({
                    listShops :response.data,
                    shopFlag : true
                });    
            }).catch((response) => {
                alert('In Catch' + (response))
                console.log(response)
                });    
            });
        }
    }

    // On clicking Continue
    onContinue = (shop) => {
    let shopId = shop.id;
    
    // Setting the data for the Shop Name and Shop Address   
    AsyncStorage.setItem("shopName",shop.name);
    AsyncStorage.setItem("shopAddress",shop.address);
    AsyncStorage.setItem("shopPhoneNumber",shop.phone);
    AsyncStorage.setItem("shopId",shopId.toString());

    this.updatePushTokenForShop(shop.id)
    }

    // To update the value for the Exponent Push Token on Shop Selection
    updatePushTokenForShop(shopId){
    // Request Parameters : Object for the Push Token Update 
    const shopObject = {
      token : this.state.merchantToken,
      shopId: shopId.toString(),
      pushToken: this.state.token
    }
    console.log(shopObject)
        // Axios call to update the Push Token
        axios.post('https://dev.driveza.space/v1/partners/update-push-token',shopObject).then((response) => {
        console.log(shopObject.pushToken);
        this.props.navigation.navigate("TabNavigatorScreen");
      }).catch((response) => {
        alert('Please select the shop again')
      })
    }

    // To get the data for the Shops
   componentWillMount() {
    AsyncStorage.getItem('merchantToken').then(value => {
        this.setState({
        merchantToken : value
      }, () => {
        console.log(this.state.merchantToken);
        const URL = 'https://dev.driveza.space/v1/partners/shop?token=' + this.state.merchantToken;
        axios.get(URL).then((response) => {
            this.setState({
                listShops :response.data,
                shopFlag : true
            });    
        }).catch((response) => {
            alert('In Catch' + (response))
            this.setState({
                shopFlag : true
            });
        });
      });
    });
    this.generatePushToken();
   }

   // To generate the Push Token for the Device
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
      token : await Notifications.getExpoPushTokenAsync()
    })
  }

  render() {
    if(this.state.shopFlag) {
        if(this.state.listShops.length === 0) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center',flex:1}}>
                    <Text style={{fontSize: 34, fontWeight: 'bold', textAlign:'center'}}>No Shops Added Yet</Text>
                </View>
                )
            } else {
                return (
                    <ScrollView style={styles.container}>
                    {
                        this.state.listShops.map((shop,index) => {
                            return (
                                <View key={index} style={styles.services}>
                                    <View style={styles.booking}>
                                        <Icon containerStyle={styles.inputIcon} name="shop" type='entypo'/>
                                        <Text style={{paddingLeft:13}}>
                                            {shop.name}
                                        </Text>
                                    </View>
                                    <View style={styles.booking}>
                                        <Icon containerStyle={styles.inputIcon} name="address" type='entypo'/>
                                        <Text style={{paddingLeft:13 ,width: '95%'}}>{shop.address}</Text>
                                    </View>
                                    <View style={styles.inputWrapperButton}>
                                        <TouchableOpacity activeOpacity={0.9} 
                                        onPress={() => this.onContinue(shop)}>
                                            <View style={styles.button}>
                                                <Text style={styles.buttonText}>Continue</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
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
        padding: 10
    },
    services:{
        backgroundColor: 'white',
        marginBottom:10,
        marginTop:10,
        padding:15,
        borderRadius: 5
    },
    booking:{
        flexDirection: 'row',
        paddingBottom: 5
    },
    inputIcon:{
        height: 26,
        top:0
    },
    inputWrapperButton:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    button: {
        width: 80,
        height:30,
        borderRadius: 5,
        backgroundColor:"#841584",
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonText: {
        color:'#fff',
        fontSize: 12,
        fontWeight: 'bold'
      }
})