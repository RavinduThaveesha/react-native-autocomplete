# react-native-autocomplete
React native implemetation of Google places autocomplete 

## example
![Image of Example](https://user-images.githubusercontent.com/5220867/73115035-b8030180-3f5b-11ea-85a6-e584b24ce1f7.gif)

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


