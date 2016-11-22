(function ($) {
    'use strict';

    /** Init settings **/
    (function () {
        // Setup reveal and ajax loading
        window.scrollRevealEnabled = function () {
            var scrollReveal = sessionStorage.getItem('scroll-reveal');
            return scrollReveal == null ? true : (scrollReveal == '1');
        };
        window.ajaxLoadingEnabled = function () {
            var ajaxLoading = sessionStorage.getItem('ajax-loading');
            return ajaxLoading == null ? true : (ajaxLoading == '1');
        };
    })();

    // Init ScrollReveal
    if (scrollRevealEnabled()) {
        window.sr = ScrollReveal();
    }

    /** Window load handler **/
    $(window).load(function () {
        // Hide preloader
        $('#preloader').velocity({ opacity: 0 }, { visibility: "hidden", duration: 600 });

        // Fix menu rendering
        if (scrollRevealEnabled()) {
            $('.menuitem:last').on('afterReveal', function () {
                $('#nav').css('background-color', $(this).css('background-color'));
            });
        } else {
            $('#nav').css('background-color', $('.menuitem:last').css('background-color'));
        }

        // Header Animations
        if (scrollRevealEnabled()) {
            scrollReveal(scrollRevealItems.header);
        }

        // Footer Animations
        if (scrollRevealEnabled()) {
            scrollReveal(scrollRevealItems.footer);
        }

        /** Back to top **/
        (function () {
            var backTopVisible = false;
            var $backTop = $('#back-top');
            $backTop.on('click', function () {
                $("body").velocity("scroll", { duration: 1000 });
                return false;
            });

            var scrollTrigger = 100, // px
                backToTop = function () {
                    var scrollTop = window.pageYOffset;
                    if (scrollTop > scrollTrigger && !backTopVisible) {
                        backTopVisible = true;
                        $backTop.velocity({ top: '-=20px', opacity: 1 }, { visibility: 'visible', duration: 600 });
                    } else if (scrollTop <= scrollTrigger && backTopVisible) {
                        backTopVisible = false;
                        $backTop.velocity({ top: "+=20px", opacity: 0 }, { visibility: "hidden", duration: 600 });
                    }
                };
            backToTop();
            $(window).on('scroll', backToTop);
        })();
    });

    /** Document ready handler **/
    $(document).ready(function () {
        // Load scripts for each section (portfolio, counter ...)
        sectionsScripts();

        /** Ajax page load settings **/
        (function () {

            if (ajaxLoadingEnabled()) {
                $(document).pjax('a', '.content-wrap', {fragment: '.content-wrap'});

                $(document).on('pjax:click', function (event) {
                    if (!ajaxLoadingEnabled()) {
                        event.preventDefault();
                        window.location.reload();
                    }
                });

                $(document).on('pjax:end', function () {
                    document.activeElement && document.activeElement.blur();
                    sectionsScripts();
                });

                $(document).on('pjax:beforeReplace', function () {
                    $('.content-wrap')
                        .velocity({ opacity: 0 }, { duration: 0 })
                        .velocity({ opacity: 1 }, { duration: 300, easing: [ 0, 1, 1, 0 ] });
                });
            }

        })();
    });

    /** Set of sections scripts **/
    function sectionsScripts() {

        /** Script for Animated Counter section **/
        (function () {
            if ($('[data-section="counter"]').length) {
                var animateCounter = function (elem) {
                    elem = elem || document.querySelectorAll('.count-container span');
                    $(elem).counterUp({
                        delay: 10, // the delay time in ms
                        time: 1000 // the speed time in ms
                    });
                };

                if (scrollRevealEnabled()) {
                    $('[data-section="counter"] .count>div').on('afterReveal', function () {
                        animateCounter($(this).find('span'));
                    });
                } else {
                    animateCounter();
                }
            }
        })();

        /** Script for Owl Carousel section **/
        (function () {
            if ($('[data-section="owl-carousel"]').length) {
                $('[data-section="owl-carousel"]').imagesLoaded( function() {
                    $('.owl-carousel').owlCarousel({
                        items:1,
                        loop:true,
                        nav:true,
                        navText: [
                            "<i class='fa fa-angle-left' aria-hidden='true'></i>",
                            "<i class='fa fa-angle-right' aria-hidden='true'></i>"
                        ],
                        dots: true,
                        margin:0,
                        autoplay: true,
                        autoplayTimeout: 11000,
                        autoplayHoverPause: true,
                        autoplaySpeed: 1250,
                        autoHeight:true
                    });
                });
            }
        })();


        /** Circle Progress **/
        (function () {
            if ($('[data-section="progress"]').length) {

                $('.progressbar').each(function () {
                    $(this).find('.circle').circleProgress({
                        startAngle: -Math.PI / 2,
                        value: 0,
                        thickness: 3,
                        fill: {
                            color: '#ffffff'
                        }
                    });
                });

                var animateProgressElements = function () {
                    $('.progressbar').each(function () {
                        var animate = $(this).data('animate');
                        if (!animate) {
                            var percent = $(this).find('.circle').attr('data-percent');
                            $(this).data('animate', true);
                            $(this).find('.circle').circleProgress({
                                startAngle: -Math.PI / 2,
                                value: percent / 100,
                                thickness: 3,
                                fill: {
                                    color: '#ffffff'
                                }
                            }).on('circle-animation-progress', function (event, progress, stepValue) {
                                $(this).find('div').text((stepValue * 100).toFixed(1) + "%");
                            }).stop();
                        }
                    });
                };

                if (scrollRevealEnabled()) {
                    $('[data-section="progress"]').on('afterReveal', function () {
                        animateProgressElements();
                    });
                } else {
                    animateProgressElements();
                }
            }
        })();

        /** Script for Portfolio section **/
        (function () {
            if ($('[data-section="portfolio"], [data-section="blog"]').length) {

                // Magnific Popup
                $('.gallery-item').magnificPopup({
                    type: 'image',
                    gallery: {
                        enabled: true
                    }
                });

                // Isotope Portfolio
                var grid = $('.grid').isotope({
                    itemSelector: '.grid-item',
                    percentPosition: true,
                    masonry: {
                        // use outer width of grid-sizer for columnWidth
                        columnWidth: '.grid-sizer'
                    }
                });

                grid.imagesLoaded(function () {
                    grid.isotope();
                });

                grid.isotope({filter: '*'});

                // filter items on button click
                $('#isotope-filters').on('click', 'a', function () {
                    var filterValue = $(this).attr('data-filter');
                    grid.isotope({filter: filterValue});
                });

                // filter items on tag click
                $('.post-tag').on('click', 'a', function () {
                    var filterValue = $(this).attr('data-filter');
                    grid.isotope({filter: filterValue});
                    $('#isotope-filters a[data-filter="' + filterValue + '"]').focus();
                });
            }
        })();

        /** Contact Form **/
        (function () {
            if ($('[data-section="feedback"]').length) {
                // Get the form.
                var form = $('#ajax-contact');

                // Get the messages div.
                var formMessages = $('#form-messages');

                // Set up an event listener for the contact form.
                $(form).submit(function (e) {
                    // Stop the browser from submitting the form.
                    e.preventDefault();

                    // Serialize the form data.
                    var formData = $(form).serialize();

                    // Submit the form using AJAX.
                    $.ajax({
                        type: 'POST',
                        url: $(form).attr('action'),
                        data: formData
                    })
                        .done(function (response) {
                            // Make sure that the formMessages div has the 'success' class.
                            $(formMessages).removeClass('alert alert-danger');
                            $(formMessages).addClass('alert alert-success');

                            // Set the message text.
                            $(formMessages).text(response);

                            // Clear the form.
                            $('#name').val('');
                            $('#email').val('');
                            $('#message').val('');
                        })
                        .fail(function (data) {
                            // Make sure that the formMessages div has the 'error' class.
                            $(formMessages).removeClass('alert alert-success');
                            $(formMessages).addClass('alert alert-danger');

                            // Set the message text.
                            if (data.responseText !== '') {
                                $(formMessages).text(data.responseText);
                            } else {
                                $(formMessages).text('Oops! An error occured and your message could not be sent.');
                            }
                        });
                });
            }
        })();

        /** Google map **/
        (function () {
            if ($('[data-section="map"]').length) {

                window.initGmap = function () {

                    // Create an array of styles.
                    var styles = [
                        {
                            stylers: [
                                {saturation: -90}
                            ]
                        }, {
                            featureType: "road",
                            elementType: "geometry",
                            stylers: [
                                {lightness: 100},
                                {visibility: "simplified"}
                            ]
                        }, {
                            featureType: "road",
                            elementType: "labels",
                            stylers: [
                                {visibility: "off"}
                            ]
                        }
                    ];

                    // Create a new StyledMapType object, passing it the array of styles,
                    // as well as the name to be displayed on the map type control.
                    var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

                    // Create a map object, and include the MapTypeId to add
                    // to the map type control.
                    var $latlng = new google.maps.LatLng(52.5075419, 13.4261419),
                        $mapOptions = {
                            zoom: 13,
                            center: $latlng,
                            panControl: false,
                            zoomControl: true,
                            scaleControl: false,
                            mapTypeControl: false,
                            scrollwheel: false,
                            mapTypeControlOptions: {
                                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                            }
                        };
                    var map = new google.maps.Map(document.getElementById('google-map'), $mapOptions);

                    google.maps.event.trigger(map, 'resize');

                    //Associate the styled map with the MapTypeId and set it to display.
                    map.mapTypes.set('map_style', styledMap);
                    map.setMapTypeId('map_style');

                    var marker = new google.maps.Marker({
                        position: $latlng,
                        map: map,
                        title: ""
                    });

                };

                if (document.getElementById('gmapSrc')) {
                    initGmap();
                }

                loadScript('http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=initGmap', 'gmapSrc');
            }
        })();

        // Sections Animation
        if (scrollRevealEnabled()) {
            scrollReveal(scrollRevealItems.content);
        }
    }

    /** Load js script to head **/
    function loadScript(src, id) {
        if (document.getElementById(id)) {
            return;
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = id;
        document.getElementsByTagName("head")[0].appendChild(script);
        script.src = src;
    }

    /** Animation handler **/
    function scrollReveal(items) {

        $.each(items, function(itemKey, reveal) {
            $(reveal.selector).each(function(index, elem) {
                var data = elem.dataset;

                var revealData = {
                    duration: (typeof data.animationDuration != "undefined") ? parseInt(data.animationDuration)
                        : (reveal.data.duration || 1000),
                    origin: (typeof data.animationOrigin != "undefined") ? data.animationOrigin
                        : (reveal.data.origin || 'bottom'),
                    distance: (typeof data.animationDistance != "undefined") ? data.animationDistance
                        : (reveal.data.distance || '0px'),
                    delay: (typeof data.animationDelay != "undefined") ? parseInt(data.animationDelay)
                        : (reveal.data.delay || 0),
                    scale: (typeof data.animationScale != "undefined") ? parseFloat(data.animationScale)
                        : (reveal.data.scale || 1),
                    rotate: (typeof data.animationRotate != "undefined") ? data.animationRotate
                        : (reveal.data.rotate || { x: 0, y: 0, z: 0 }),
                    easing: (typeof data.animationEasing != "undefined") ? data.animationEasing
                        : (reveal.data.easing || 'cubic-bezier(1.000, 1.000, 1.000, 1.000)'),
                    mobile: false,
                    afterReveal: function(elem) { $(elem).trigger('afterReveal') }
                };

                sr.reveal(elem, revealData);
            });
        });
    }

})(jQuery);