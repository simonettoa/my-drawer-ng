import { Component, OnInit, ViewChild } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";


import { Mapbox } from "nativescript-mapbox";
import * as utils from "utils/utils";
import { Page } from "ui/page";
import frame = require("ui/frame");
import { LatLng, AppComponent } from "../app.component";

@Component({
    selector: "Featured",
    moduleId: module.id,
    templateUrl: "./featured.component.html"
})
export class FeaturedComponent implements OnInit {
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    shared: AppComponent;
    mapboxFromAppComp: Mapbox;
    thisPage: Page;
    firstLoadPage: boolean = false;
    mapshowing: boolean = false;

    constructor(private _shared: AppComponent) {
        this.shared = this._shared;

        this.thisPage = <Page>frame.topmost().currentPage;
    }

    private _sideDrawerTransition: DrawerTransitionBase;

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();

        let heightBar = utils.layout.toDeviceIndependentPixels(this.thisPage.actionBar.getMeasuredHeight());

        console.log("features.OnInit - heightBar " + heightBar);
        this.shared.actionHeight = heightBar;
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();

        // hide the app.component map and the current map
        // this.hideAll();

        this.destroyAll();
    }

    hideShowMap() {

        let value = new Array<LatLng>();
        value.push(new LatLng(50.477735, 13.437718), new LatLng(50.452, 13.41),);

        // first entry in the page load or get the page from app.component
        if(!this.firstLoadPage) {
            this.firstLoadPage = true;
            console.log("hideShowMap - first loading");

            this.showMap();
        } else {
            if(this.mapshowing) {
                console.log("featuredPg.hideShowMap - hide local map");
                this.mapshowing = false;
    
                this.hideMap();
    
            } else {
                this.mapshowing = true;
    
                console.log("featuredPg.hideShowMap - show local map");
                this.showLocalMap();
            }
        }
    }

    showMap() {
        // first time load from app.component
        this.mapshowing = true;

        if(!this.shared.mapLoaded) {
            this.shared.loadMap();
        
            setTimeout(() => {
                this.mapboxFromAppComp = this.shared.mapboxCode;    
            }, 500);

        } else {
            console.log("featuredPG - map already loaded");

            this.shared.mapboxCode.unhide().then((res) => {
                console.log("featured.showMap - unhide OK! ");

                this.mapboxFromAppComp = this.shared.mapboxCode; 

                // this.thisPage = this.mapboxFromAppComp;

            }, (error) => {
                console.log("featured.showMap - unhide error hide mapboxCode ");
            });
        }
       
    }

    hideMap() {
        // this.shared.hideCurrMap();
        this.mapboxFromAppComp.hide();
    }

    hideAll() {
        console.log("featuredPg - hideAll");
        
        this.mapboxFromAppComp.hide();
        this.shared.mapboxCode.hide().then((res) => {

            console.log("featured.hideAll - OK! " + res);

        }, (error) => {
            console.log("featured.hideAll - error hide mapboxCode " + error);

        });
    }

    destroyAll() {
        if(this.shared.mapLoaded) {
            this.mapboxFromAppComp.destroy().then(() => {
                console.log("mapboxFromAppComp destroyed!");
    
            }, (error) => {
                console.log("mapboxFromAppComp.destroyAll - error " + error);
    
            });
    
            this.shared.mapboxCode.destroy().then((res) => {
                console.log("shared map destroyed!");
    
            }, (error) => {
                console.log("mapboxFromAppComp.destroyAll - error " + error);
    
            });
    
            this.shared.mapLoaded = false;
        }
    }

    showLocalMap() {
        this.mapboxFromAppComp.unhide();
    }
}
