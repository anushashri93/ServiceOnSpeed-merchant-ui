import React, {Component} from 'react'
import { TouchableOpacity,Text,View,ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'

class CheckBox extends Component {
    render() {
        return (
            <TouchableOpacity activeOpacity={1} style={{width:"100%", paddingLeft:20,paddingRight:20}} onPress={() => this.props.toggleCheck(this.props.number)}>
                <View style={{paddingTop: 10, paddingBottom: 10,height:60}}>
                    {
                        this.props.checked ? <Icon containerStyle={{width:40,position:"absolute",top:10}} size={35} name='checkbox-marked-outline' type='material-community'/>:<Icon containerStyle={{width:40,position:"absolute",top:10}} size={35} name='checkbox-blank-outline' type='material-community'/>
                    }
                    <Text style={{position:"absolute",left:50,top:12,fontSize:20}}>{this.props.value}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default class CheckBoxGroup extends Component {
    constructor(props) {
        super(props);
        this.toggleCheck = this.toggleCheck.bind(this);
        this.state={checked:false}
    }
    selectedOptions = () => {
        const selectedOptions = [];
        for (let index = 0; index < this.props.elements.length; index++) {
            if (this.state["checked"+index]) {
                selectedOptions.push(this.props.elements[index]);
            }
        }
        return selectedOptions;
    }
    toggleCheck = (index) => {
        this.setState({
            ["checked"+index]: !this.state["checked"+index]
        },() => {
            this.props.selectedValues(this.selectedOptions());
        });
    }
    render() {
        return (
            <ScrollView>
                {
                    this.props.elements.map((item,index) => {
                        return(
                            <CheckBox key={index} number={index} checked={this.state["checked"+index]} value={item.name} toggleCheck={(id) => this.toggleCheck(id)}/>
                        )
                    })
                }
            </ScrollView>
        )
    }
}