import React, { useState, Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    StyleSheet,
} from 'react-native';
import TextInput from '../components/UI/Input';
import {assets} from '../assets';
import axios from '../axios';
import _ from 'lodash';
import config from '../config';

class AutoComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: null,
            suggestions: [],
            placeholder: this.props.placeholder,
        },
        this.getLocationDebounce = _.debounce(this.getLocation, 1000);
    }

    getLocation = async () => {
        try {
            if (this.state.address) {
                const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
                    params: {
                        input: this.state.address,
                        key: config.GOOGLE_API_KEY,
                    }  
                });
    
                if (response.data.status == 'OK') {
                    this.setState({suggestions: response.data.predictions});
                }
            }
            
        } catch (error) {
            throw new Error(error);
        }
    };

    getLocationDetailsbyId = async (id) => {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
                params: {
                    place_id: id,
                    libraries: 'places',
                    key: config.GOOGLE_API_KEY,
                }  
            });
            
            if (response.data.status == 'OK') {
                this.setState({
                    address: response.data.result.formatted_address,
                    suggestions: []
                });

                //send location details
                this.props.onPress(response.data.result);
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    getLocationDetailsbyGeo = async () => {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    latlng: `${this.state.location.lat},${this.state.location.lng}`,
                    key: config.GOOGLE_API_KEY,
                    result_type: 'street_address'
                }  
            });
            
            if (response.data.status == 'OK') {
                this.setState({
                    address: response.data.results?.[0]?.formatted_address
                });
            }
            
        } catch (error) {
            throw new Error(error);
        }
    };

    inputHandler = (text) => {
        this.setState({
            address: text,
            location: {},
        },() => {
            this.getLocationDebounce()
        });
    };

    componentDidMount = () => {
        // this.setState({
        //     address: this.props.address,
        //     placeholder: this.props.placeholder,
        //     editable: this.props.editable
        // });
    };

    render() {
        const suggestions = this.state.suggestions.map(suggestion => (
            <TouchableOpacity key={suggestion.id} 
                onPress={() => Keyboard.dismiss(this.getLocationDetailsbyId(suggestion.place_id))} 
                style={styles.suggestion}>
                <Text>{suggestion.description}</Text>
            </TouchableOpacity>
        ));

        return(
            <View style={styles.mainContainer}>
                <TextInput placeholder={this.state.placeholder} 
                    onChangeText={text => this.inputHandler(text)} 
                    value={this.state.address} 
                    style={{...this.props.style, height: 40}}
                    editable={this.state.editable}
                />
                {
                    suggestions ? 
                        <View style={styles.suggestionContainer}>
                            {suggestions}
                        </View>
                    : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%'
    },

    suggestionContainer: {
        width: '100%',
        backgroundColor: assets.style.colors.white,
        position: 'absolute',
        zIndex: 9999,
        top: 40
    },

    suggestion: {
        borderBottomWidth: 1,
        borderBottomColor: assets.style.colors.gray_6,
        paddingVertical: 8,
        paddingHorizontal: 5
    }
});

export default AutoComplete;