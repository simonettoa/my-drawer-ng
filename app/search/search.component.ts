import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";

import { LatLng, AppComponent } from "../app.component";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { ModalMapComponent } from "../shared/modal-map-page/modal-map-page";
import platformModule = require("platform");
import { Mapbox } from "nativescript-mapbox";
import * as utils from "utils/utils";
import { Page } from "ui/page";
import frame = require("ui/frame");

@Component({
    selector: "Search",
    moduleId: module.id,
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;

    private _sideDrawerTransition: DrawerTransitionBase;
    shared: AppComponent;
    mapboxFromAppComp: Mapbox;
    mapshowing: boolean = false;
    firstLoadPage: boolean = false;
    thisPage: Page;

    constructor(private vcRef: ViewContainerRef,
                private modal: ModalDialogService,
                private _shared: AppComponent) {

        this.shared = _shared;  

        this.thisPage = <Page>frame.topmost().currentPage;
    }

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();

        let heightBar = utils.layout.toDeviceIndependentPixels(this.thisPage.actionBar.getMeasuredHeight());

        console.log("search.OnInit - heightBar " + heightBar);

        this.shared.actionHeight = heightBar;
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();

        // hide the app.component map and the current map
        this.hideAll();
    }

    
    openModalMap() {
        // 
        let value = new Array<LatLng>();

        value.push(new LatLng(50.477735, 13.437718), new LatLng(50.452, 13.41),);

        let fromTo = 1;
        
        let options = {
            context: { fromTo, value },
            fullscreen: true,
            viewContainerRef: this.vcRef
        };

        this.modal.showModal(ModalMapComponent, options).then((res) => {

            if(res) {
                console.log("modal map page closed!!");
            }
        });
    }

    hideShowMap() {
        // first entry in the page load or get the page from app.component
        if(!this.firstLoadPage) {
            this.firstLoadPage = true;
            console.log("hideShowMap - first loadgin");

            this.showMap();
        } else {
            if(this.mapshowing) {
                console.log("searchPg.hideShowMap - hide local map!");
                this.mapshowing = false;
    
                this.hideMap();
    
            } else {
                this.mapshowing = true;
    
                console.log("searchPg.hideShowMap - show local map!");
                this.showLocalMap();
            }
        }
    }

    showLocalMap() {
        this.mapboxFromAppComp.unhide();
    }

    showMap() {
        // first time load from app.component
        this.mapshowing = true;

/*        
        this.shared.loadMap();
    
        setTimeout(() => {
            this.mapboxFromAppComp = this.shared.mapboxCode;
        }, 500);
*/

        if(!this.shared.mapLoaded) {
            this.shared.loadMap();
        
            setTimeout(() => {
                this.mapboxFromAppComp = this.shared.mapboxCode;    
            }, 500);

        } else {
            console.log("searchPG - map already loaded!");

            setTimeout(() => {
                this.shared.mapboxCode.unhide();

                this.mapboxFromAppComp = this.shared.mapboxCode;    
            }, 500);
        }
       
    }

    hideMap() {
        // this.shared.hideCurrMap();
        this.mapboxFromAppComp.hide();
    }

    hideAll() {
        console.log("searchPg - hideAll");
        
        this.mapboxFromAppComp.hide();
        this.shared.mapboxCode.hide();
    }
}
