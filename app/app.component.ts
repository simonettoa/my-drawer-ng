import { Component } from "@angular/core";

import * as utils from "utils/utils";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent { 

    doTheGargbageCollection: boolean = true;
    currentPage: string;


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
}


export class LatLng {
    constructor(
       public lat: number,
       public lng: number) {}
}
