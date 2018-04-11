import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";


import { AppComponent } from "../app.component";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    /* ***********************************************************
    * Use the @ViewChild decorator to get a reference to the drawer component.
    * It is used in the "onDrawerButtonTap" function below to manipulate the drawer.
    *************************************************************/
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;

    /*
    @ViewChild("actionBara") actionbarRef: ElementRef;
    private get actionBara(): ActionBar {
        return this.actionbarRef.nativeElement;
    }
*/

    private _sideDrawerTransition: DrawerTransitionBase;
    shared: AppComponent;
    mapLoaded: boolean = false;
    

    constructor(private _shared: AppComponent) {
        this.shared = _shared;

    }
    /* ***********************************************************
    * Use the sideDrawerTransition property to change the open/close animation of the drawer.
    *************************************************************/
    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    /* ***********************************************************
    * According to guidelines, if you have a drawer on your page, you should always
    * have a button that opens it. Use the showDrawer() function to open the app drawer section.
    *************************************************************/
    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();

        // hide the map (if exists)
        if(this.shared.mapboxCode) {
            this.shared.mapboxCode.hide().then((res) => {
                console.log("browsePg - hide map");
            });
            this.mapLoaded = false;
        }
    }

    changeGcStatus() {
        this.shared.changeGcStatus();

    }

    forceGc() {
        this.shared.startGarbageCollection();
    }

    hideShowMap() {
        if(this.mapLoaded) {
            this.shared.mapboxCode.hide().then((res) => {
                console.log("browsePg - hide map");
            });

            this.mapLoaded = false;

        } else {
            this.mapLoaded = true;
            this.shared.showMap();
        }
    }
}
