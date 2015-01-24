function initialize() {
  var mapOptions = {
    center: { lat: 45.438917, lng: 12.335274},
    zoom: 13
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var image_locs = 
    {"IMG_4084.JPG": new google.maps.LatLng(45.433832, 12.340216),
     "IMG_4123.JPG": new google.maps.LatLng(45.437935, 12.336912),
     "IMG_4125.JPG": new google.maps.LatLng(45.438966, 12.335049),
     "IMG_4127.JPG": new google.maps.LatLng(45.432388, 12.338711),
     "IMG_4128.JPG": new google.maps.LatLng(45.432388, 12.338711),
     "IMG_4134.JPG": new google.maps.LatLng(45.450020, 12.351149),
     "IMG_4135.JPG": new google.maps.LatLng(45.450746, 12.350339),
     "IMG_4139.JPG": new google.maps.LatLng(45.450746, 12.350339),
     "IMG_4139.JPG": new google.maps.LatLng(45.451051, 12.349443),
     "IMG_4152.JPG": new google.maps.LatLng(45.451329, 12.349330),
     "IMG_4162.JPG": new google.maps.LatLng(45.453994, 12.355472)
    };
  var tripPathCoords = [];
  var images = [];
  $.each(image_locs, function(image, loc) {
    var obj = $('<img></img>', {src: "./images/" + image});
    obj.data("loc", loc);
    images.push(obj);

    tripPathCoords.push(loc);
    $("#images").append(obj);
  });
  var tripPath = new google.maps.Polyline({
          path: tripPathCoords,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

  tripPath.setMap(map);
  
  var marker = new google.maps.Marker(
        {position: $($('#images').children()[0]).data("loc"),
         map: map});

  var enable_scroll_trigger = true;

  $(document).scroll(function() {
    if (!enable_scroll_trigger) {
      return;
    }
    console.log("scrolling!");
    scroll_pos = $(document).scrollTop();
    $.each(images, function(idx, obj){
      if ($(obj).offset().top > scroll_pos) {
        var prev_obj = $(images[idx-1]);
        var prev_loc = prev_obj.data("loc");
        var this_loc = $(obj).data("loc");
  
        var prev_pos = prev_obj.offset().top;
        var this_pos = $(obj).offset().top;
      
        var frac = (scroll_pos - prev_pos)/(this_pos - prev_pos);
        var interp_loc = google.maps.geometry.spherical.interpolate(prev_loc, this_loc, frac);
        marker.setPosition(interp_loc);
        return false; 
      }
      return true;
    });
    enable_scroll_trigger = false;
  });

  window.setInterval(function() { enable_scroll_trigger = true; }, 100);
}
$(document).ready(initialize);
