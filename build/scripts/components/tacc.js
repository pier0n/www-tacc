define(['jquery','jquery.cycle2', 'skrollr', 'vimeo', 'async!http://maps.google.com/maps/api/js?sensor=false'], function($, cycle, skrollr) {

  var tacc;
  var Tacc = Tacc || {};

  Tacc.init = function () {

    tacc = this; 

    tacc.loaded();
    tacc.cache();
    tacc.bind();
    tacc.animatePhones();
    tacc.slideshows();
    tacc.showMap();

    }; // init() 

    Tacc.loaded = function () {
      $('body').removeClass('loading').addClass('loaded');
    }

    Tacc.cache = function () {

      tacc.$doc = $(document);
      tacc.$win = $(window);
      tacc.$nav = $('nav');
      tacc.$navTrigger = $('.nav-mobile-trigger');
      tacc.$timeline = $('.timeline-wrap'); 
      tacc.$contactForm = $('.form-contact');
      tacc.$contactSection = $('.contact-items');
      tacc.$teamSection = $('.cycle-team');
      tacc.$video = $('.video-overlay');
      tacc.$body = $('html, body');
      tacc.$timelineInt;

    }; // cache()

    Tacc.bind = function () {
      // mobile nav
      tacc.$doc.on('click', '.nav-mobile-trigger', function (e) {
        e.preventDefault();
        tacc.$navTrigger.toggleClass('active');
        tacc.$nav.toggleClass('show');
      });
      
      // timeline go
      tacc.$doc.on('touchstart mousedown', '[data-timeline]', function(){
        tacc.animateTimeline($(this).data('timeline')); 
      });
      
      // timeline stop
      tacc.$doc.on('touchend mouseup', '[data-timeline]', function(){
       tacc.animateTimeline(false); 
     });
      
      // mobile timeline
      tacc.$doc.on('touchstart touchend', '.timeline-item', function(e){
        e.preventDefault();
        $(this).toggleClass('hover');
      });
      
      // main nav behavior
      tacc.$doc.on('click', 'nav a', function(e){
        e.preventDefault(); 
        tacc.$navTrigger.toggleClass('active');
        tacc.$nav.toggleClass('show');
        var target = $(this).attr('href'); 
        tacc.$body.stop().animate({ scrollTop: $(target).offset().top}, 500);
      });
      
      // learn more on hero
      tacc.$doc.on('click', '.js-learn-more', function(e){ 
        e.preventDefault(); 
        tacc.$navTrigger.removeClass('active');
        tacc.$nav.removeClass('show');
        var target = $(this).attr('href'); 
        tacc.$body.stop().animate({ scrollTop: $(target).offset().top}, 500);
      });
      
      // profiles nav
      tacc.$doc.on('click', '.cycle-pager span', function(){
        tacc.$body.stop().animate({ scrollTop: $('#team').offset().top}, 500);
      });
      
      // watch video
      tacc.$doc.on('click', '.watch-video, .js-watch-video', function(e){
       e.preventDefault();
       tacc.$video.removeClass('hide-it');
       tacc.videoHandler('play');
     });

      // close video
      tacc.$doc.on('click touchstart', '.close-video, .video-overlay', function(e){
       e.preventDefault();    
       tacc.$video.addClass('hide-it');
       tacc.videoHandler('pause');
     });
      
      //close video on esc
      tacc.$doc.on('keydown', function(e){
        if (e.keyCode == 27) {    
         tacc.$video.addClass('hide-it');
         tacc.videoHandler('unload');
       }
     });

      //form
      tacc.$doc.on('submit', '.form-contact', function(e){
        //prevent submit
        e.preventDefault();

        //gather data
        var email = $('#email').val();
        var name = $('#name').val();
        var checkbox = $('.checkbox-list input:checked').map(function() {
          return this.value;
        }).get().join('|');

        // validate
        if(email.length > 0 && name.length > 0) {
          // get data
          var formData = {
            name: name,
            email: email,
            checkbox: checkbox
          };

          // submit it
          $.ajax({
            type: 'POST',
            url: '', //set the handler here
            data: formData,
            success: function(data) {
              // go to thank you on success
              $('.contact-items').cycle('goto', 3);
            }
          }); 
        }
        else {
          // we need name and email - go back to first form if validation fails
          $('.contact-items').cycle('goto', 1);
        }
      });

    }; //bind();

    Tacc.videoHandler = function(option) {
      var iframe = document.getElementById('video');
      var player = Froogaloop(iframe);
      player.api(option);
    }


    Tacc.animateTimeline = function (direction) {
      if(direction) {
        tacc.$timelineInt = setInterval(function() { moveTimeline(direction); }, 50);
      }
      else {
        clearInterval(tacc.$timelineInt);
      }
    }; // animateTimeline();

    Tacc.slideshows = function () {
      // contact section
      tacc.$contactSection.cycle({
        timeout: 0,
        autoHeight: 'container',
        slides: '.contact-item',
        next: '.cycle-next-form',
        prev: '.cycle-prev-form',
        log: false
      });

      // team section
      tacc.$teamSection.cycle({
        timeout: 0,
        autoHeight: 'container',
        slides: '.slide',
        pager: '.cycle-pager',
        log: false,
        swipe: true
      });
    }; //slideshows()

    Tacc.animatePhones = function () {
      if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){
        var s = skrollr.init({forceHeight: false});
      }
    }; //animatePhones()

    Tacc.showMap = function () {

        // Basic options for a simple Google Map
        // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
        var mapOptions = {
            // How zoomed in you want the map to start at (always required)
            zoom: 11,
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false,

            // The latitude and longitude to center the map (always required)
            center: new google.maps.LatLng(40.4612861, -79.9233424), // 6101 Penn Ave, Pittsburgh, PA

            // How you would like to style the map. 
            // This is where you would paste any style found on Snazzy Maps.
            styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
          };

        // Get the HTML DOM element that will contain your map 
        // We are using a div with id="map" seen below in the <body>
        var mapElement = document.getElementById('map');

        // Create the Google Map using our element and options defined above
        var map = new google.maps.Map(mapElement, mapOptions);
        var image = 'images/map-pin.svg'; 
        // Let's also add a marker while we're at it
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(40.4612861, -79.9233424),
          map: map,
          title: 'tACC',
          icon: image
        });


    }; // showMap() 

    window.Tacc = Tacc;
    window.Tacc.init();


  // helper functions
  function moveTimeline(direction) {
    var el = document.querySelector('.timeline-wrap');
    var st = window.getComputedStyle(el, null);
    var tr = st.getPropertyValue('-webkit-transform') ||
    st.getPropertyValue('-moz-transform') ||
    st.getPropertyValue('-ms-transform') ||
    st.getPropertyValue('-o-transform') ||
    st.getPropertyValue('transform') ||
    'FAIL';

    var matrix = matrixToArray(tr) ;

    var current = parseInt(matrix[4]);
    var move = (direction === 'future') ? current -= 100 : current += 100;

    if(current > -150 && (tacc.$timeline.width() - tacc.$win.width() > current - 300)) { 
      tacc.$timeline.attr('style', '-webkit-transform: translateX(' + move + 'px);-ms-transform: translateX(' + move + 'px);-moz-transform: translateX(' + move + 'px); transform: translateX(' + move + 'px)');
    }
  }

  function matrixToArray(str) {
    return str.match(/(-?[0-9\.]+)/g);
  }

});


