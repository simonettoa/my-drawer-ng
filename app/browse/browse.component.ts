import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";

import { Mapbox } from "nativescript-mapbox";
import { LatLng, AppComponent } from "../app.component";
import { ActionBar } from "ui/action-bar";
import { Page } from "ui/page";
import frame = require("ui/frame");
import * as utils from "utils/utils";

@Component({
    selector: "Browse",
    moduleId: module.id,
    templateUrl: "./browse.component.html"
})
export class BrowseComponent implements OnInit {
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;

    @ViewChild("map") mapboxRef: ElementRef;
    private get mapbox(): Mapbox {
        return this.mapboxRef.nativeElement;
    }

    private _sideDrawerTransition: DrawerTransitionBase;
    currLongitude: number = 0;
    currLatitude: number = 0;

    mapLoaded: boolean = false;
    shared: AppComponent;
    thisPage: Page;

    constructor(private _shared: AppComponent) {
        this.shared = _shared;

        this.thisPage = <Page>frame.topmost().currentPage;
    }

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();

        setTimeout(() => {
            if(this.thisPage.actionBar) {
                let heightBar = utils.layout.toDeviceIndependentPixels(this.thisPage.actionBar.getMeasuredHeight());

                console.log("features.OnInit - heightBar " + heightBar);
                this.shared.actionHeight = heightBar;            
            } else {
                console.log("features.OnInit - actionBar not defined!");
            }
            
        }, 1000);
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();

        // hide the map (if exists)
        if(this.shared.mapboxCode) {
            this.shared.mapboxCode.hide().then((res) => {
                console.log("browsePg - hide map ");
            });
            this.mapLoaded = false;
        }
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
                
                this.addMarkersAndPolylines();
    
            }, (error) => {
                console.log("error getting position - still load the poi");

                this.addMarkersAndPolylines();
            });
        }, 1500);

    }

    addMarkersAndPolylines() {
        
        setTimeout(() => {
            console.log("add markers!");

            // add polylines
            let arrayPoints = new Array<LatLng>();

            arrayPoints.push(new LatLng(50.477735, 13.437718), new LatLng(50.452, 13.41),);

            arrayPoints.forEach((p) => {
                this.mapbox.addMarkers([
                {
                    lat: p.lat,
                    lng: p.lng,
                }]);
            });

            this.setViewPort(arrayPoints);
        }, 500);
    }

    setViewPort(arrP: Array<LatLng>) {
        let shift = 0.15;
        let lats: Array<number> = [];
        let longs: Array<number> = [];

        console.log("set viewport!");

        arrP.forEach((p) => {
            lats.push(p.lat);
            longs.push(p.lng);
        });

        if(this.currLatitude !== 0 && this.currLongitude !== 0) {
            arrP.push(new LatLng(this.currLatitude, this.currLongitude));
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

    hideShowMap() {
        let tmpArr = new Array<LatLng>();
        tmpArr.push(new LatLng(50.470735, 13.437718), new LatLng(50.452, 13.437718),);
        
        this.shared.addNewMarkers(tmpArr);

        if(this.mapLoaded) {
            this.shared.mapboxCode.hide().then((res) => {
                console.log("browsePg - hide map ");
            });

            this.mapLoaded = false;

        } else {
            this.mapLoaded = true;
            this.shared.showMap();
        }
    }
}
