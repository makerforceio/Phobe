if ($(".large-map, .location-pick, .location-view").get(0)) {
	var script = document.createElement('script');
	script.type = "text/javascript";
	script.src = "https://maps.googleapis.com/maps/api/js?signed_in=true&callback=mapsInitialised";
	document.body.appendChild(script);
}
//THIS IS AMBROSES CANCER DO NOT TOUCH OR READ
//THIS IS AMBROSES CANCER DO NOT TOUCH OR READ
//THIS IS AMBROSES CANCER DO NOT TOUCH OR READ
//THIS IS AMBROSES CANCER DO NOT TOUCH OR READ
//THIS IS AMBROSES CANCER DO NOT TOUCH OR READ
//THIS IS AMBROSES CANCER DO NOT TOUCH OR READ
//THIS IS AMBROSES CANCER DO NOT TOUCH OR READ
//THIS IS AMBROSES CANCER DO NOT TOUCH OR READ

function mapsInitialised() {
	$(document).ready(function () {
	$(".location-view").each(function () {
		var locationview = this;
		var a = $(locationview).data("existing").split(",");
		var map = new google.maps.Map($(".location-map", locationview).get(0), {
			zoom: 11,
			center: new google.maps.LatLng(1.36, 103.82),
			disableDefaultUI: true,
			zoomControl: false,
			mapTypeControl: false,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				position: google.maps.ControlPosition.TOP_LEFT,
				mapTypeIds: [
					google.maps.MapTypeId.ROADMAP,
					google.maps.MapTypeId.SATELLITE,
					google.maps.MapTypeId.TERRAIN
				]
			}
		});
		if (!isNaN(a[0]) && !isNaN(a[1]) && $(locationview).data("existing").length > 2) {
			var latLng = new google.maps.LatLng(parseFloat(a[0]), parseFloat(a[1]));
			var mapLatLng = new google.maps.LatLng(parseFloat(a[0]) + 0.04, parseFloat(a[1]));
			map.setCenter(mapLatLng);
			var marker = new google.maps.Marker({
				position: latLng,
				map: map
			});
			var openwindow = function (textual) {
				var infowindow = new google.maps.InfoWindow({
					content: textual + '<div><small><a href="https://www.google.com.sg/maps/place/' + $(locationview).data("existing") + '" target="_blank">Open in Google Maps</a></small></div>'
				});
				infowindow.open(map, marker);
			};
			var textual = "";
			if ($(locationview).data("textual")) {
				textual = $(locationview).data("textual");
				openwindow(textual);
			}
			else {
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({
					location: latLng
				}, function(results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						if (results[1]) {
							openwindow("<i>Somewhere near " + results[1].formatted_address + "</i>");
						} else {
							// "No results found"
						}
					} else {
						// "Geocoder failed due to: " + status
					}
				});
			}
		}
		else {
			map.setZoom(10);
			$(".location-map", locationview).css("opacity", 0.2);
		}
	});
	$(".location-pick").each(function () {
		var locationpick = this;
		var defaultLatLng = new google.maps.LatLng(1.36, 103.82);
		var mapDefaultLatLng = new google.maps.LatLng(1.36 + 0.04, 103.82);
		var map = new google.maps.Map($(".location-map", locationpick).get(0), {
			zoom: 11,
			center: mapDefaultLatLng,
			disableDefaultUI: true,
			zoomControl: true,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				position: google.maps.ControlPosition.TOP_CENTER,
				mapTypeIds: [
					google.maps.MapTypeId.ROADMAP,
					google.maps.MapTypeId.SATELLITE,
					google.maps.MapTypeId.TERRAIN
				]
			}
		});
		var marker = new google.maps.Marker({
			position: defaultLatLng,
			map: map,
			draggable: true,
			title: $(locationpick).data("text-pick")
		});
		var infowindow = new google.maps.InfoWindow({
			content: $(locationpick).data("text-pick"),
			maxWidth: 160
		});
		infowindow.open(map, marker);
		var geocoder = new google.maps.Geocoder();
		var showPicked = function (lat, lng, visualonly) {
			var latLng = new google.maps.LatLng(lat, lng);
			var mapLatLng = new google.maps.LatLng(lat + 0.04, lng);
			marker.setPosition(latLng);
			map.setCenter(mapLatLng);
			if (!visualonly) {
				$(".location-lat", locationpick).val(lat);
				$(".location-lng", locationpick).val(lng);
				geocoder.geocode({
					location: {
						lat: lat,
						lng: lng
					}
				}, function(results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						console.log(results);
						if (results[1]) {
							//$(".location-textual", locationpick).attr("placeholder", "Somewhere in " + results[1].formatted_address);
							infowindow.open(map, marker);
							infowindow.setContent("<i>Somewhere in " + results[1].formatted_address + '</i>');
						} else {
							// "No results found"
						}
					} else {
						// "Geocoder failed due to: " + status
					}
				});
			}
		};
		marker.setAnimation(google.maps.Animation.BOUNCE);
		marker.addListener("dragstart", function () {
			marker.setAnimation(null);
			infowindow.close();
		});
		marker.addListener("dragend", function () {
			showPicked(marker.getPosition().lat(), marker.getPosition().lng());
			map.setZoom(16);
		});
		if ($(locationpick).data("existing") && $(locationpick).data("existing").length > 2) {
			var a = $(locationpick).data("existing").split(",");
			if (!isNaN(a[0]) && !isNaN(a[1])) {
			marker.setAnimation(null);
			showPicked(parseFloat(a[0]), parseFloat(a[1]));
			}
		}
		else if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (p) {
				if (p.coords.latitude && p.coords.longitude) {
					//marker.setAnimation(null);
					var lat = p.coords.latitude;
					var lng = p.coords.longitude;
					showPicked(lat, lng, true);
				}
			});
		}
	});
	$(".large-map").each(function () {
		var map = new google.maps.Map(this, {
			zoom: 11,
			center: new google.maps.LatLng(1.36, 103.82),
			disableDefaultUI: true,
			zoomControl: true,
			scaleControl: true,
			rotateControl: true,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				position: google.maps.ControlPosition.TOP_LEFT,
				mapTypeIds: [
					google.maps.MapTypeId.ROADMAP,
					google.maps.MapTypeId.SATELLITE,
					google.maps.MapTypeId.TERRAIN
				]
			}
		});
		$.getJSON("/map/data", function (data) {
			var infowindows = [];
			data.forEach(function (i) {
				if (!i.available) {
					return;
				}
				if (!i.location || !i.location.lat || !i.location.lng) {
					return;
				}
				var latLng = new google.maps.LatLng(i.location.lat, i.location.lng);
				var marker = new google.maps.Marker({
					position: latLng,
					map: map
				});
				var infowindow = new google.maps.InfoWindow({
					//content: textual + '<div><small><a href="https://www.google.com.sg/maps/place/' + $(locationview).data("existing") + '" target="_blank">Open in Google Maps</a></small></div>'
					content: 'Loading...'
				});
				infowindows.push(infowindow);
				var setlocation = function (l) {
					infowindow.setOptions({
						content: '\
<div class="mini-item container">\
<div class="row">\
<div class="col-md-7">\
<div>\
<h6><a href="/item/' + i._id + '">' + i.name + '</a></h6>\
<p>' + i.description + '</p>\
<div class="user-icon" data-toggle="tooltip" data-placement="top" title="@' + i.owner.username + '">\
	<img src="/files/' + i.owner.avatar + '" class="avatar" />\
	<span class="badge">' + i.owner.reputation + '</span>\
</div>\
<p>' + l + '</p>\
<p><small><a href="https://www.google.com.sg/maps/place/' + i.location.lat + ',' + i.location.lng + '" target="_blank">Open in Google Maps</a></small></p>\
</div>\
</div>\
<div class="col-md-5">\
<img class="w" src="/files/' + i.picture + '" />\
</div>\
</div>\
</div>'
					});
				};
				marker.addListener('click', function() {
					infowindows.forEach(function (iw) {
						iw.close();
					});
					infowindow.open(map, marker);
				});
				if (i.location.textual && i.location.textual.length) {
					setlocation(i.location.textual);
				}
				else {
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode({
						location: latLng
					}, function(results, status) {
						if (status === google.maps.GeocoderStatus.OK) {
							if (results[1]) {
								setlocation("<i>Somewhere near " + results[1].formatted_address + "</i>");
							} else {
								setlocation("");
								// "No results found"
							}
						} else {
							setlocation("");
							// "Geocoder failed due to: " + status
						}
					});
				}
			});
		});
		//google.maps.event.addListenerOnce(map, "idle", function () {
		/*	setInterval(function () {
				$(".large-map .gmnoprint.gm-style-mtc").css("top", "3.375rem");
			}, 16);*/
		//});
		/*
		*/
	});
	});
}
