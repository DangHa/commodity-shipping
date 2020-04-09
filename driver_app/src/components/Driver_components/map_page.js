import React, { Component } from 'react';
import {StyleSheet, View, Platform, TextInput, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RetroMapStyles from '../../assets/RetroMapStyles'

// Get location 
export const getLocation = () => {
  return new Promise(
      (resolve, reject) => {
          Geolocation.getCurrentPosition(
              (data) => resolve(data.coords),
              (err) => reject(err)
          );
      }
  );
}

export const geocodeLocationByName = (locationName) => {
  return new Promise(
      (resolve, reject) => {
        Geolocation.from(locationName)
              .then(json => {
                  const addressComponent = json.results[0].address_components[0];
                  resolve(addressComponent);
              })
              .catch(error => reject(error));
      }
  );
}

export const geocodeLocationByCoords = (lat, long) => {
  return new Promise(
      (resolve, reject) => {
        Geolocation.from(lat, long)
              .then(json => {
                  const addressComponent = json.results[0].address_components[0];
                  resolve(addressComponent);
              })
              .catch(error => reject(error));
      }
  );
}

export default class Map extends Component {
  state = {
    region: {},
    start : {},
    destination: {},
    startingPredictions: [],
    destinationPredictions: []
  }

  componentDidMount() {
    this.getInitialState();
  }

  getInitialState() {
    getLocation().then(
      (data) => {
        this.setState({
          region: {
              latitude: data.latitude,
              longitude: data.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02
          }
        });
      }
    );
  }

  onMapRegionChange(region) {
    this.setState({ region });
  }

  // --- Starting textinput
  async onPressStartingPoint(prediction) {
    const apiKey = "AIzaSyDI3l4n3NL_KbvvLtO8DuSfl4mImgrANoM"
    const placeid = prediction.place_id
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${apiKey}`;
    
    // get coordinate from place id
    var start ={}
    try {
      const result = await fetch(apiUrl)
      const json = await result.json();
      
      if(json['result']){
        start = {
          latitude: json.result.geometry.location.lat,
          longitude: json.result.geometry.location.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        }
      }else {
        start = this.state.region
      }
      
      
    } catch (err) {
      console.error(err)
    }

    // change the region on map and starting point
    this.setState({
      region: start
    });
    this.setState({
      start: start
    });

    // remove the prediction dropdown
    this.setState({
      startingPredictions: []
    });

    // from id find coordinate put in start and regoin. create a marker
  };

  async onChangeStart(start){    
    const apiKey = "AIzaSyDI3l4n3NL_KbvvLtO8DuSfl4mImgrANoM"
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${start}&location=${this.state.region.latitude}, ${this.state.region.longitude}&radius=20000`;
    
    // get prediction from google api
    try {
      const result = await fetch(apiUrl)
      const json = await result.json();
      this.setState({
        startingPredictions: json.predictions
      })
    } catch (err) {
      console.error(err)
    }
  }

  // --- Destination textinput
  async onPressDestination(prediction) {
    const apiKey = "AIzaSyDI3l4n3NL_KbvvLtO8DuSfl4mImgrANoM"
    const placeid = prediction.place_id
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${apiKey}`;
    
    // get coordinate from place id
    var description ={}
    try {
      const result = await fetch(apiUrl)
      const json = await result.json();
      
      if(json['result']){
        description = {
          latitude: json.result.geometry.location.lat,
          longitude: json.result.geometry.location.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        }
      }else {
        description = this.state.region
      }
      
      
    } catch (err) {
      console.error(err)
    }

    // change the region on map and starting point
    this.setState({
      region: description
    });
    this.setState({
      description: description
    });

    // remove the prediction dropdown
    this.setState({
      destinationPredictions: []
    });

    // from id find coordinate put in start and regoin. create a marker
  };

  async onChangeDestination(start){    
    const apiKey = "AIzaSyDI3l4n3NL_KbvvLtO8DuSfl4mImgrANoM"
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${start}&location=${this.state.region.latitude}, ${this.state.region.longitude}&radius=20000`;
    
    // get prediction from google api
    try {
      const result = await fetch(apiUrl)
      const json = await result.json();
      this.setState({
        destinationPredictions: json.predictions
      })
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const startingPredictions = this.state.startingPredictions.map(prediction => (
      <Text style={styles.suggestions} key={prediction.id} onPress={() => this.onPressStartingPoint(prediction)}>
        {prediction.description}
      </Text>
    ));

    const destinationPredictions = this.state.destinationPredictions.map(prediction => (
      <Text style={styles.suggestions} key={prediction.id} onPress={() => this.onPressDestination(prediction)}>
        {prediction.description}
      </Text>
    ));

    return (
      <View style={{ flex: 1 }}>
        {this.state.region['latitude'] ?
          <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE}
              ref={map => this._map = map}
              style={styles.map}
              customMapStyle={ RetroMapStyles }
              region={this.state.region}
              onRegionChange={(reg) => this.onMapRegionChange(reg)}
              showsUserLocation={true}>
            </MapView>
            <TextInput style={styles.inputBox}
              onChangeText={(start) => this.onChangeStart(start)}
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Starting point"
              selectionColor="#fff"
              keyboardType="default"
              onSubmitEditing={()=> this.destination.focus()}/>
            <TextInput style={styles.inputBox}
                onChangeText={(destination) => this.onChangeDestination(destination)} 
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Destination"
                selectionColor="#fff"
                keyboardType="default"
                ref={(input) => this.destination = input}/>
              {startingPredictions}
              {destinationPredictions}
          </View>
        : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  inputBox: {
    width: 370,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#002f6c',
    marginVertical: 5,
    marginLeft: 20
  },
  suggestions: {
    width: 370,
    marginLeft: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    fontSize: 14,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  }
});