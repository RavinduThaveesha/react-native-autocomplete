import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import axios from 'axios';
import _ from 'lodash';

const GOOGLE_API_KEY = 'ADD YOUR API KEY';

class AutoComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            address: null,
            placeholder: this.props.placeholder,
        },
        this.getLocationDebounce = _.debounce(this.getLocation, 1000);
    }

    getLocation = async () => {
        try {
            this.setState({
                suggestion: []
            });
            
            if (this.state.address) {
                const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
                    params: {
                        input: this.state.address,
                        key: GOOGLE_API_KEY,
                    }  
                });

                if (response.data.status == 'OK') {
                    this.setState({
                        suggestions: response.data.predictions
                    });
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
                    key: GOOGLE_API_KEY,
                }  
            });

            if (response.data.status == 'OK') {
                this.setState({
                    address: response.data.result.formatted_address,
                    suggestions: []
                });

                //send location details
                if (this.props.onPress) {
                    this.props.onPress(response.data.result);
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    inputHandler = (text) => {
        this.setState({
            address: text,
        }, this.getLocationDebounce);
    };

    render() {
        const suggestions = this.state.suggestions.map(suggestion => (
            <TouchableOpacity 
                key={suggestion.id} 
                onPress={() => this.getLocationDetailsbyId(suggestion.place_id)} 
                style={styles.suggestion}>
                <Text>{suggestion.description}</Text>
            </TouchableOpacity>
        ));

        return(
            <View style={styles.mainContainer}>
                <TextInput 
                    placeholder={this.state.placeholder} 
                    onChangeText={text => this.inputHandler(text)} 
                    value={this.state.address} 
                    style={styles.input}
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
        width: '100%',
    },

    suggestionContainer: {
        width: '100%',
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 9999,
        top: 40,
    },

    suggestion: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        paddingVertical: 8,
        paddingHorizontal: 5,
    },

    input: {
        height: 40,
        borderWidth: 1,
        padding: 4, 
        borderColor: 'lightgrey',
    }
});

export default AutoComplete;