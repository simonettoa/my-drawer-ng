import { Component, OnInit, ViewChild } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";

import { LatLng, AppComponent } from "../app.component";

@Component({
    selector: "Featured",
    moduleId: module.id,
    templateUrl: "./featured.component.html"
})
export class FeaturedComponent implements OnInit {
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    shared: AppComponent;

    constructor(private _shared: AppComponent) {
        this.shared = this._shared;
    
    }

    private _sideDrawerTransition: DrawerTransitionBase;

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();

        // hide the app.component map and the current map
        // this.hideAll();
    }


    test() {
        console.log("featured.test ...");
    }
}
