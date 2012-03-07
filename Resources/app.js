var LATITUDE_DELTA=0.01;
var LONGITUDE_DELTA=0.01;
var DISTANCE_FILTER=0; // The minium change of heading (in degrees) before a 'heading' event is fired. Default is 0, meaning that heading events are continuously generated. (iPhone, iPad only.)
var GEOLOCATION_PURPOSE='Location Services';

Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = DISTANCE_FILTER;
Ti.Geolocation.purpose = GEOLOCATION_PURPOSE; // only for iOS

var w = Ti.UI.createWindow({
	backgroundColor: 'white'
});

var map=null;

var setMapCoordinates = function(coords) {
	Ti.API.info('setMapCoordinates: ' + JSON.stringify(coords));
	
	if (coords.latitude && coords.longitude) {
		Ti.API.info('updating map...');
		
		if (map===null) {
			map = Ti.Map.createView({
				mapType: Ti.Map.SATELLITE_TYPE,
				region: {
					latitude: coords.latitude,
					longitude: coords.longitude,
					latitudeDelta: LATITUDE_DELTA, // defines the zoom level
					longitudeDelta: LONGITUDE_DELTA
				},
				animate: true,
				regionFit: true, // to attempt to fit the map view into the region in the visible view
				userLocation: true // to show the user's current device location as a pin on the map
			});
			w.add(map);
			w.open();
		} else if (coords.latitude!==map.region.latitude || coords.longitude!==map.region.longitude) {
			map.setLocation(coords);
			Ti.API.info('MapView updated. lat/long ' + coords.latitude + '/' + coords.longitude);
		} else {
			Ti.API.info('skipping. same coords.');
		}
	} else {
		Ti.API.info('skipping. no coords.');
	}
};

if (Ti.Geolocation.locationServicesEnabled) {
	Ti.API.info('Ti.Geolocation.locationServicesEnabled TRUE');
	
	Ti.Geolocation.getCurrentPosition(function(e) {
		Ti.API.info('getCurrentPosition return ' + JSON.stringify(e));
		
		if (!e.error) {
			setMapCoordinates(e.coords);
		} else {
			Ti.API.error('Ti.Geolocation.getCurrentPosition returned error: ' + JSON.stringify(e.error));
		}
	});
	
	Ti.Geolocation.addEventListener('location', function(e) {
		Ti.API.info('location event fired ' + JSON.stringify(e));
		
		if (!e.error) {
			if (e.coords.latitude && e.coords.longitude) {
				setMapCoordinates(e.coords);
			} else {
				Ti.API.error('Skipping, fixed location');
			}
		} else {
			Ti.API.error('Ti.Geolocation.location event returned error: ' + JSON.stringify(e.error));
		}
	});
} else {
	Ti.API.error('Ti.Geolocation.locationServicesEnabled FALSE');
}