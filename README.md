# react-native-autocomplete
React native implemetation of Google places autocomplete 

## example


## how to use

```
import AutoComplete from './components/AutoComplete';

<AutoComplete 
  placeholder={'Search Address'} 
  onPress={location => console.log(location)}
/>

```

## props

| Props        | Description                         | Type          |
| ------------ | ----------------------------------- | ------------- |
| placeholder  | Change input placeholder            | void |
| onPress      | Trigger when select address         | refer: https://developers.google.com/places/web-service/details  |


