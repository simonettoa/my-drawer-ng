import { Component, Input, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";


import { AppComponent } from "../../app.component";

/* ***********************************************************
* Keep data that is displayed as drawer items in the MyDrawer component class.
*************************************************************/
@Component({
    selector: "MyDrawerItem",
    moduleId: module.id,
    templateUrl: "./my-drawer-item.component.html",
    styleUrls: ["./my-drawer-item.component.scss"]
})
export class MyDrawerItemComponent implements OnInit {
    @Input() title: string;
    @Input() route: string;
    @Input() icon: string;
    @Input() isSelected: boolean;

    shared: AppComponent;

    constructor(private routerExtensions: RouterExtensions,
                private _shared: AppComponent) {
        this.shared = _shared;

    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the MyDrawerItemComponent "onInit" event handler to initialize the properties data values.
        *************************************************************/
    }

    /* ***********************************************************
    * Use the "tap" event handler of the GridLayout component for handling navigation item taps.
    * The "tap" event handler of the app drawer item <GridLayout> is used to navigate the app
    * based on the tapped navigationItem's route.
    *************************************************************/
    onNavItemTap(navItemRoute: string): void {

        // if coming from browse start the gc
        if(this.shared.currentPage === "/browse" && this.shared.doTheGargbageCollection) {
            this.shared.startGarbageCollection();
        }

        this.shared.currentPage = navItemRoute;

        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });
    }
}
