import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";

import { LatLng, AppComponent } from "../app.component";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { ModalMapComponent } from "../shared/modal-map-page/modal-map-page";

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
    mapLoaded: boolean = false;

    constructor(private vcRef: ViewContainerRef,
                private _shared: AppComponent) {

        this.shared = _shared;  

        this.thisPage = <Page>frame.topmost().currentPage;
    }

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();

        setTimeout(() => {
            let heightBar = utils.layout.toDeviceIndependentPixels(this.thisPage.actionBar.getMeasuredHeight());

            console.log("search.OnInit - heightBar " + heightBar);

            this.shared.actionHeight = heightBar;
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

    
    openModalMap() {
/*        
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
*/
    }

    hideShowMap() {

        let tmpArr = new Array<LatLng>();
        tmpArr.push(new LatLng(50.477735, 13.437718), new LatLng(50.4777, 13.41),);
        // tmpArr.push(new LatLng(46.458254,11.312446), new LatLng(46.458254,11.352446));
        this.shared.addNewMarkers(tmpArr);
        
        if(this.mapLoaded) {
            this.shared.mapboxCode.hide().then((res) => {
                console.log("searchPg - hide map");
            });

            this.mapLoaded = false;

        } else {
            this.mapLoaded = true;
            this.shared.showMap();
        }
    }

    showLocalMap() {
        this.mapboxFromAppComp.unhide();
    }

}
