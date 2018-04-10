
This project is to test the plugin nativescript-mapbox - the memory retain problem in a RadSideDrawer app in nativescript (I've tested in ios but I know in android is similar).

***
BEFORE STARTS THE APP: go to browse.html and change 'your-token' with your token from mapbox web page.
***


In the home page there are two buttons, 'change GC var' changes

To verify the memory retain build the app and then open the 'mydrawerng.xcworkspace' in the ios' platforms folder.

Choose your simulator and start it. Then click on seventh icon on the left panel 'Show the Debug navigator'.
It will appear a Memory line, click on it, you'll see the memory consume in the simulator.

The app starts in the home page, don't touch for the moment the two buttons.
Click on the menù and open the browse page, the map is suppose to appear loadin also two markers.

The memory will increase. Then click again the menù and go to another page, the gc() function will start after a while. the memory is not going down. back to the browse page, you'll see a the increase of memory. 
Below some data:


					in MB (around values)
app starts 			-> 140		
pg browse 			-> 230	
other page with GC 	-> 220 
back to browse 		-> 274 
other page with GC 	-> 273
browse pg 			-> 320
other page with GC 	-> 323
browse pg 			-> 372
other page with GC 	-> 369
browse pg 			-> 421
other page with GC 	-> 421



app starts 			-> 140		
pg browse 			-> 220	
other page NO GC 	-> 224
back to browse 		-> 269
other page NO GC 	-> 271
browse pg 			-> 318
other page NO GC 	-> 323 (before I clicked on settings page, now features)
browse pg 			-> 367
other page NO GC 	-> 368
browse pg 			-> 417
other page NO GC 	-> 417

back to browse		-> 462
zoom on map			-> 467
other page NO GC 	-> 469 (home, changed gc var to true)
back to browse		-> 518
other page with GC 	-> 517


So with or without the gc (garbage collection) function the memory is not changing a lot. This is a big problem in sidedrawer app - any suggestion use the map without creating every time it ?


***
UPDATE

A better solution is to call the mapbox via modal page as it's called in search page - the utils.gc() function has to be called (test it with or without setting the variable from the home page)

***


***
UPDATE 10 April 2018

the modal page solution doesn't work in android. Tested to add the map programatically and use the hide and unhide property.
It works good in ios, it doesn't add any memory because the map is created once. In android it does not work when you change the page.

To test it go from the home page to search page, click on the actionBar map's icon, first time you'll see the map, click on the menu on the top left the hide property is called, go to settings page and back to search, click again you'll see the map (in this page is just using hide and unhide). In android the same behaviour is not replied, you'll see the first time the map and the click on the map's icon is playing with hide/unhide (of the local page mapbox) - click on the menù will set the unhide to the app.component map and the current one; the click again will fires the unhide on the app.component map but it won't appear.

In featured page it works little different, when you click on the menu icon the destroy fuction is called; it will work logically but the every time the map is called the show function is also and the memory will increase as usual.


Still looking to a good solution...
***