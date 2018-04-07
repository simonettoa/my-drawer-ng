
import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";

import { isAndroid } from "platform";
let appSettings = require("application-settings");
import { LatLng, AppComponent } from "../../app.component";
import { Mapbox } from "nativescript-mapbox";

@Component({
    selector: "my-modal",
    moduleId: module.id,
    templateUrl: "./modal-map-page.html",
    styleUrls: ["./modal-map-page-common.css"],
})
export class ModalMapComponent implements OnInit {
    @ViewChild("map") mapboxRef: ElementRef;
    private get mapbox(): Mapbox {
        return this.mapboxRef.nativeElement;
    }

    resFromPg: any;
    arrayPoints: Array<LatLng> = new Array<LatLng>();
    currLongitude: number = 0;
    currLatitude: number = 0;
    shared: AppComponent;
    screenHeight: number = 550;
    screenWidth: number = 300;

    constructor(private params: ModalDialogParams,
                private _shared: AppComponent) {
    
        // this var is used to show the part of interest based on the fromTo 
        this.resFromPg = this.params.context.fromTo;

        // console.log("modal-pg screenHeight " + this.screenHeight + " | screenWidth " + this.screenWidth);
        this.shared = _shared;
    }


    ngOnInit(): void {
        // init elements based on 'type'
        this.initElements(this.params.context.fromTo, this.params.context.value);
    }


    closeModal() {
        // return the selected date or the time based on the request
        switch(this.resFromPg) {
            case 1:
                // destroy the map and launch the GC
                this.mapbox.destroy();
                this.shared.startGarbageCollection();

                this.params.closeCallback();
                break;

        }
    }


    initElements(fromType: number, val: any) {
        
        switch(fromType) {
            case 1:
                this.arrayPoints = val;
                break;
        }

/*
        // set the max date
        let dateNormalFormat = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
        let dateFormat = new Date(dateNormalFormat);

        switch(fromType) {
            case Globals.modalIndexFromDate:
            case Globals.modalIndexToDate:
                this.setRadcalendarLng();
                this.radcalendarRef.nativeElement.maxDate = dateFormat;
                this.radcalendarRef.nativeElement.selectedDate = val;
                break;
                
            // pick the current time from 
            case Globals.modalIndexFromTime:
            case Globals.modalIndexToTime:
                this.timepickerRef.nativeElement.hour = val.getHours();
                this.timepickerRef.nativeElement.minutes = val.getMinutes();
                this.timeSelected = val;
                // console.log("date passed -> " + val + " | getHours -> toTimeStr " + val.getHours() + " | getMinutes -> " + val.getMinutes());
                break;

        }
*/        
    }

    onMapReady(args: any) {
        console.log("enter onMapReady()");

        this.getUserPosition();
    }

    getUserPosition() {

        setTimeout(() => {
            this.mapbox.getUserLocation().then((userLocation) => {

                console.log("Current user location: " +  userLocation.location.lat + ", " + userLocation.location.lng);
                // console.log("Current user speed: " +  userLocation.speed);
    
                this.currLatitude = userLocation.location.lat;
                this.currLongitude = userLocation.location.lng; 
                
                this.addMarkers();
    
            }, (error) => {
                console.log("error getting position - still load the poi");

                this.addMarkers();
            });
        }, 1500);

    }


    addMarkers() {
        
        setTimeout(() => {
            console.log("add markers!");

            this.arrayPoints.forEach((p) => {
                this.mapbox.addMarkers([
                {
                    lat: p.lat,
                    lng: p.lng,
                }]);
            });

            this.setViewPort();
        }, 500);
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

        console.log("mLat " + maxLat + " |mLon " + maxLon + " | minLat " + minLat + " | minLon " + minLon);

        this.mapbox.setViewport({
            bounds: {
                north: maxLat,
                east: maxLon,
                south: minLat,
                west: minLon
            },
            animated: true
        });
    } 

}
