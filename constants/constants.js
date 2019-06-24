export const bookingsOnLoad = [
{
	"id" : 1,
	"name" : "Dev",
	"address" : "Kaspate", 
},
{
	"id" : 2,
	"name" : "Mauank",
	"address" : "Wakad", 
}
]


export const bookingPushToken = [
{
	"id" : 3,
	"name" : "Piyush",
	"address" : "Hinjewadi",
	"vehicle" : {
		"name" : "Pulsar",
		"km" : 2000,
		"type" : "Petrol",
		"year" : 2014
	} 
},{
	"id" : 1,
	"name" : "Dev",
	"address" : "Kaspate",
	"vehicle" : {
		"name" : "Activa",
		"km" : 1000,
		"type" : "Petrol",
		"year" : 2015
	} 
},
{
	"id" : 2,
	"name" : "Mauank",
	"address" : "Wakad",
	"vehicle" : {
		"name" : "Aviatot",
		"km" : 1500,
		"type" : "Petrol",
		"year" : 2016
	} 
}
]

// Data for Two Wheelers :

export const twoWheelerData = [{ "name": "BMW","id":1},
{ "name": "22motors"	, "id":2},
{ "name": "Royal Enfield"	, "id":3},
{ "name": "TVS"	, "id":4},
{ "name": "Bajaj"	, "id":5},
{ "name": "KTM"	, "id":6},
{ "name": "Hero Electric"	, "id":7},
{ "name": "Vespa"	, "id":8},
{ "name": "Harley Davidson"	, "id":9},
{ "name": "Triumph"	, "id":10},
{ "name": "Moto Guzzi"	, "id":11},
{ "name": "Indian"	, "id":12},
{ "name": "UM Motorcycles"	, "id":13},
{ "name": "Tork"	, "id":14},
{ "name": "Avon"	, "id":15},
{ "name": "Honda"	, "id":16},
{ "name": "Hero Moto Corp"	, "id":17},
{ "name": "Yamaha"	, "id":18},
{ "name": "Suzuki"	, "id":19},
{ "name": "Mahindra"	, "id":20},
{ "name": "Kawasaki"	, "id":21},
{ "name": "Ducati"	, "id":22
}]

// Data for Four Wheelers :

export const fourWheelerData =[{"name":"Maruti Suzuki","id":1},
{"name":"Honda","id":2},
{"name":"Mahindra","id":3},
{"name":"Jeep","id":4},
{"name":"Ford","id":5},
{"name":"BMW","id":6},
{"name":"Mercedes Benz","id":7},
{"name":"Datsun","id":8},
{"name":"MG Motor","id":9},
{"name":"Volvo","id":10},
{"name":"Fiat","id":11},
{"name":"Lamborghini","id":12},
{"name":"MINI","id":13},
{"name":"Bugatti","id":14},
{"name":"Aston Martin","id":15},
{"name":"Land Rover","id":16},
{"name":"Bentley","id":17},
{"name":"Force Motors","id":18},
{"name":"DC","id":19},
{"name":"Hyundai","id":20},
{"name":"Toyota","id":21},
{"name":"Tata","id":22},
{"name":"Volkswagen","id":23},
{"name":"Renault","id":24},
{"name":"Audi","id":25},
{"name":"Skoda","id":26},
{"name":"Mitsubishi","id":27},
{"name":"Rolls Royce","id":28},
{"name":"Tesla","id":29},
{"name":"Porsche","id":30},
{"name":"Ferrari","id":31},
{"name":"Maserati","id":32},
{"name":"ISUZU","id":33},
{"name":"Bajaj","id":34},
{"name":"Lexus","id":35},
{"name":"Chervrolet","id":36
}]

// Fares Details :

export const faresDetails =
[{"transactionId":"111111","name":"Mayank", "date" : "01-Jan-2018", "amount" : 1000, "type" : true},
 {"transactionId":"222222","name":"Deva", 	"date" : "01-Feb-2018", "amount" : 2000, "type" : false},
 {"transactionId":"333333","name":"Anusha", "date" : "01-Mar-2018", "amount" : 3000, "type" : true},
 {"transactionId":"444444","name":"Kushal", "date" : "01-Apr-2018", "amount" : 4000, "type" : false}]

// To Generate the Push Token Object to the Customer
export const getPushNotificationData = (statusValue,bookingData) => {
	console.log(JSON.stringify(bookingData))
	let token = 'ExponentPushToken[xPzNPFIQwPLNyvwoc1mwur]', title, body, data = {"bookingStatusFlag": true}

	// When the Merchant has Canceled the Booking
	if(statusValue === -1) {
		title = 'Booking Cancelled',
		body =   'Our Apologies, The Merchant is unable to provide the requested services, Kindly select another Merchant'
		data = {
			...data,
			"bookingStatusFlag": false,
			"bookingStatusValue": statusValue         
		}
	}

	// When Merchant has Confirmed the Booking
	if(statusValue === 1) {
		title = 'Booking Confirmed',
		body =   bookingData.shopName +' has Confirmed your Booking, Scheduled on ' + bookingData.dateTime
		data = {
			...data,
			"bookingStatusValue": statusValue
		}
	}

	// When Merchant has send the Service Man to Pick the Vehicle from the Customer
	if(statusValue === 2) {
		title = 'Service Man on the Way',
		body = 'Your Service Man is on the way, Please press Pick up once Vehicle is Picked up '
		data = {
			...data,
			"bookingStatusValue": statusValue
		}
	}

	// When the Merchant has send the Job card to the Customer
	if(statusValue === 5) {
		title = 'Job Card Arrived',
		body = 'Kindly view and approve the Job Card'
		data = {
			...data,
			"bookingStatusValue": statusValue
		}
	}

	// When the customer has got the Vehicle, with completed service
	if(statusValue === 7) {
		alert('In Handed Over')
		title = 'Hurray..!!!',
		body = 'Your Service is Completed'
		data = {
			...data,
			"bookingStatusValue": statusValue
		}
	}
	return {token,title,body,data}
}

// Function for data Format
export const dateFormat = (date) => {
	//alert(date.substr(0,10));

	//let day = date.getDay();
  // let month = date.getMonth();
	// let year = date.getFullYear();
	// fullDate = year+"-"+(month+1)+"-"+day;
	var changedFormat = date.substr(0,10);
	var changedDate = changedFormat.split("-").reverse().join("-");
	return  changedDate;
}


