import { Component, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { GoogleMaps, GoogleMapsEvent, LatLng, MarkerOptions,Environment,GoogleMapsAnimation,Marker,MyLocation } from "@ionic-native/google-maps";

import { Platform } from "@ionic/angular";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  address: string;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public platform: Platform
  ) {}

  // geolocation options
  options = {
    timeout: 10000, 
    enableHighAccuracy: true, 
    maximumAge: 3600
  };

  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp)
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.loadMap(this.latitude,this.longitude)
      this.getAddress(this.latitude, this.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  // geocoder options
  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  // get address using coordinates
  getAddress(lat,long){
    this.nativeGeocoder.reverseGeocode(lat, long, this.nativeGeocoderOptions)
    .then((res: NativeGeocoderResult[]) => {
      this.address = this.pretifyAddress(res[0]);
    })
    .catch((error: any) => {
      console.log('Error getting location address'+ JSON.stringify(error));
    });
  }

  // address
  pretifyAddress(address){
    let obj = [];
    let data = "";
    for (let key in address) {
      obj.push(address[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if(obj[val].length)
      data += obj[val]+', ';
    }
    return address.slice(0, -2);
  }

  ngAfterViewInit() {
		//this.platform.ready().then(() => this.loadMap(0,0));
	}

	loadMap(latitude,longitude) {
    /* The create() function will take the ID of your map element */
    /*Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCnzwTuivxoonuTlZBtg7XSbdU7xjL9F9w',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCnzwTuivxoonuTlZBtg7XSbdU7xjL9F9w',
    });*/
    const map = GoogleMaps.create('map')

		map.one( GoogleMapsEvent.MAP_READY ).then((data: any) => {
      
      const coordinates: LatLng = new LatLng(latitude,longitude);
      let marker: Marker = map.addMarkerSync({
        title: 'Votre localisation',
        snippet: 'Vous êtes ICI',
        position: coordinates,
        animation: GoogleMapsAnimation.BOUNCE
      })
      marker.showInfoWindow()
			map.setCameraTarget(coordinates);
			map.setCameraZoom(16);
    });
    
	}
}
