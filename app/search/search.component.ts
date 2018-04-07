import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";

import { LatLng } from "../app.component";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { ModalMapComponent } from "../shared/modal-map-page/modal-map-page";
import platformModule = require("platform");

@Component({
    selector: "Search",
    moduleId: module.id,
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;

    private _sideDrawerTransition: DrawerTransitionBase;

    constructor(private vcRef: ViewContainerRef,
                private modal: ModalDialogService) {

    }

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }

    openModalMap() {
        // 
        let value = new Array<LatLng>();

        value.push(new LatLng(50.477735, 13.437718), new LatLng(50.452, 13.41),);

        let fromTo = 1;
        
        let options = {
            context: { fromTo, value },
            fullscreen: false,
            viewContainerRef: this.vcRef
        };

        this.modal.showModal(ModalMapComponent, options).then((res) => {

            if(res) {
                console.log("modal map page closed!");
            }
        });
    }
}
