import { Component, OnInit } from "@angular/core";

import * as utils from "utils/utils";
import { Mapbox, MapStyle } from "nativescript-mapbox";
import { isAndroid } from "platform";


let ACCESS_TOKEN = 
  "your-token";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit { 

    doTheGargbageCollection: boolean = true;
    currentPage: string;
    mapboxCode: Mapbox;
    currLongitude: number = 0;
    currLatitude: number = 0;
    arrayPoints: Array<LatLng> = new Array<LatLng>();
    actionHeight: number;
    markersChanged: boolean = false;
    mapLoaded: boolean = false;

    constructor() {
        // 
    }

    ngOnInit(): void {
        
        // this.arrayPoints.push(new LatLng(46.488254, 11.342446), new LatLng(46.468254, 11.322446));

        // this.loadMap();
    }

    changeGcStatus() {
        this.doTheGargbageCollection = !this.doTheGargbageCollection;

        console.log("change status var gc to " + this.doTheGargbageCollection);
    }

    startGarbageCollection() {
        if(this.doTheGargbageCollection) {
            setTimeout(() => {
                // clear the GC
                console.log("*** startGarbageCollection - doing the GC!");
                utils.GC();
            }, 2000);
        } else {
            console.log("GC not possible - doTheGargbageCollection false!!!");
        }
    }

    loadMap() {
        console.log("app.component loading map...");

        this.mapLoaded = true;

        this.mapboxCode.show({
            accessToken: ACCESS_TOKEN,
            style: MapStyle.OUTDOORS,
            margins: {
                left: 3,
                right: 3,
                top: isAndroid ? this.actionHeight +3 : this.actionHeight +23,
                bottom: 3
            },
            center: {
                lat: this.currLatitude !== 0 ? this.currLatitude : 50.457735,
                lng: this.currLongitude !== 0 ? this.currLongitude : 13.427718
            },
            zoomLevel: 9, // 0 (most of the world) to 20, default 0
            showUserLocation: true, // default false
            hideAttribution: true, // default false
            hideLogo: true, // default false
            hideCompass: false, // default false
            disableRotation: false, // default false
            disableScroll: false, // default false
            disableZoom: false, // default false
            disableTilt: false, // default false
        }).then(
            (showResult) => {
                console.log(`Mapbox show done! for ${showResult.ios ? "iOS" : "Android"}, native object received: ${showResult.ios ? showResult.ios : showResult.android}`);
                console.log("mapbox show Ok: " + showResult);

                // get actual position
                setTimeout(() => {
                    this.mapboxCode.getUserLocation().then((userLocation) => {

                        console.log("Current user location: " +  userLocation.location.lat + ", " + userLocation.location.lng);
            
                        this.currLatitude = userLocation.location.lat;
                        this.currLongitude = userLocation.location.lng; 
                        
                        this.addMarkers();
            
                    }, (error) => {
                        console.log("error getting position - still load the poi");
        
                        this.addMarkers();
                    });
                }, 1500);                

            },
            (error: string) => {
                console.log("mapbox show error: " + error);
            }
        );
        

    }

    addMarkers() {

        setTimeout(() => {
            
            console.log("addMarkers - arrLng " + this.arrayPoints.length);

            if(this.arrayPoints.length > 0) {
                
                this.arrayPoints.forEach((el) => {
                    this.mapboxCode.addMarkers([
                    {
                        lat: el.lat,
                        lng: el.lng,
                    }]);
                });
            }

            this.setViewPort();

        }, 500);
        
    }

    setViewPort() {
        let shift = 0.15;
        let lats: Array<number> = [];
        let longs: Array<number> = [];
        let setV = false;

        console.log("set viewport!");

        if(this.currLatitude !== 0 && this.currLongitude !== 0) {
            this.arrayPoints.push(new LatLng(this.currLatitude, this.currLongitude));

            setV = true;
        }

        this.arrayPoints.forEach((p) => {
            lats.push(p.lat);
            longs.push(p.lng);
            
            setV = true;
        });

        if(this.arrayPoints.length > 0) {
            let maxLat = Math.max(...lats) + shift;
            let minLat = Math.min(...lats) - shift;
            let maxLon = Math.max(...longs) + shift;
            let minLon = Math.min(...longs) - shift;

            console.log("mLat " + maxLat + " |mLon " + maxLon + " | minLat " + minLat + " | minLon " + minLon);

            this.mapboxCode.setViewport({
                bounds: {
                    north: maxLat,
                    east: maxLon,
                    south: minLat,
                    west: minLon
                },
                animated: true
            });
            
        } else {
            console.log("no posizione o markers");
        }
        
    } 

    setBarHeight(heightFromPg: number) {
        console.log("bar height -> " + heightFromPg);

        this.actionHeight = heightFromPg;

    }

    showMap() {
        console.log("show the map!");

        if (!this.mapboxCode) {
            this.mapboxCode = new Mapbox();

            setTimeout(() => {
                this.loadMap();
            }, 30);
        } else {
            this.mapboxCode.unhide();
        }
    }

    addNewMarkers(arrNew: Array<LatLng>) {
        this.arrayPoints = arrNew;

        this.markersChanged = true;

        if(this.mapLoaded) {
            this.mapboxCode.removeMarkers().then((res) => {
                //  load the new ones
                this.addMarkers();
            });

            // this.mapboxCode.removePolylines([1]);
        }
    }
}


export class LatLng {
    constructor(
       public lat: number,
       public lng: number) {}
}
