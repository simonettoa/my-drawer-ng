import { Component, OnInit } from "@angular/core";

import * as utils from "utils/utils";
import { Mapbox, MapStyle } from "nativescript-mapbox";
import { isAndroid } from "platform";


let ACCESS_TOKEN = 
  "";

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
    mapLoaded: boolean = false;
    actionHeight: number;

    constructor() {
        this.mapboxCode = new Mapbox();
    }

    ngOnInit(): void {
        
        this.arrayPoints.push(new LatLng(46.488254, 11.342446), new LatLng(46.468254, 11.322446));

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
        
        if(!this.mapLoaded) {
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
    
                    // this.addMarkers();
                    this.setViewPort();
                    // this.mapboxCode.hide();
    
                },
                (error: string) => {
                    console.log("mapbox show error: " + error);
                }
            );
        }
        

    }


    setViewPort() {
        let shift = 0.15;
        let lats: Array<number> = [];
        let longs: Array<number> = [];

        console.log("set viewport!");

        this.arrayPoints.forEach((p) => {
            lats.push(p.lat);
            longs.push(p.lng);
        });

        if(this.currLatitude !== 0 && this.currLongitude !== 0) {
            this.arrayPoints.push(new LatLng(this.currLatitude, this.currLongitude));
        }
        
  
        let maxLat = Math.max(...lats) + shift;
        let minLat = Math.min(...lats) - shift;
        let maxLon = Math.max(...longs) + shift;
        let minLon = Math.min(...longs) - shift;

        // console.log("mLat " + maxLat + " |mLon " + maxLon + " | minLat " + minLat + " | minLon " + minLon);

        this.mapboxCode.setViewport({
            bounds: {
                north: maxLat,
                east: maxLon,
                south: minLat,
                west: minLon
            },
            animated: true
        });
    } 

    setBarHeight(heightFromPg: number) {
        console.log("bar height -> " + heightFromPg);

        this.actionHeight = heightFromPg;

    }
}


export class LatLng {
    constructor(
       public lat: number,
       public lng: number) {}
}
