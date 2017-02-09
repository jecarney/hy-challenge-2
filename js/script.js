$(function() {

    // API FETCH

    //MDo3NTU4MDQ0NC01ZGRiLTExZTYtYjliZC1mNzA2N2UyOWYwYTE6dGRXNDJOUms4MjZCRlg3b0N2OWx3bkZtYmhiZkVZeWJEYTdk
    //https://lcboapi.com/products?access_key=ACCESS_KEY

    //VARS
    var beers;
    var screen = $(window);
    //FUNCTIONS

    function listBeers(beers) {
        $.each(beers, function(i, beer) {
            $('.beer_list').append('<a href="#" id="' + beer.id + '">' + beer.name + '</a>')
            .on('click', '#' + beer.id, function() {
                if (screen.width() < 950) {
                    $('#left_panel').width('0');
                }
                $('aside').empty();
                displayBeer(beer);
            });
        });
    }

    function displayBeer(beer) {

        fetchStores(beer.id);
        $('main figure, #desc, #store_list').empty();
        if ($('#left_open').css('visibility') === 'hidden') {
            if (screen.width() < 950) {
                $('#left_open').css('visibility', 'visible');
            }
            $('#stores').css('visibility', 'visible');
            $('#first_select').remove();
        }
        if (beer.name) {
            $('#desc').append('<h2>' + beer.name + '</h2>');
        }
        if (beer.image_thumb_url) {
            $('#desc').append('<figure><img id="beer_img" src="' + beer.image_thumb_url + '" width="50px" alt="' + beer.name + '" title="' + beer.name + '"/></figure>');
        }
        if (beer.secondary_category && beer.style) {
            $('#desc').append('<h3>' + beer.style + ' ' + beer.secondary_category + '</h3>');
        }
        if (beer.tasting_note) {
            $('#desc').append('<p>' + beer.tasting_note + '</p>');
        }
        if (beer.serving_suggestion) {
            $('#desc').append('<p>' + beer.serving_suggestion + '</p>');
        }
        if (beer.producer_name && beer.origin) {
            $('#desc').append('<p>' + beer.producer_name + ", " + beer.origin + '</p>');
        }
    }

    var fetchCtr = 0;

    function fetchStores(id) {
        fetchCtr += 1;

        jQuery.ajax({
            url: 'http://lcboapi.com/stores?product_id=' + id,
            dataType: 'jsonp',
            headers: {
                'Authorization': 'Token MDo3NTU4MDQ0NC01ZGRiLTExZTYtYjliZC1mNzA2N2UyOWYwYTE6dGRXNDJOUms4MjZCRlg3b0N2OWx3bkZtYmhiZkVZeWJEYTdk'
            }
        }).done(function(data) {
            var stores = data.result;
            $.each(stores, function(i, store) {
                if (store.name) {
                    $('#stores').append('<a href="#" id="store' + store.id + fetchCtr + '">' + store.name + '</a>')
                    .on('click', '#store' + store.id + fetchCtr, function() {
                        displayStore(store);
                    });
                    $.fn.matchHeight._update();
                }
            });
        }).fail(function() {
            $('stores').html('Sorry, we cannot retrieve store details at this time. Please return later.');
        });
    }

    function displayStore(store) {
        $('aside').empty();
        if (screen.width() < 950) {
            // $('#left_panel').width('0');
            $('#right_panel').width('100%').height('100%');
        } else {
            $.fn.matchHeight._update();
        }
        if (store.name) {
            $('aside').append('<h3>' + store.name + ' Location</h3>');
        }
        if (store.address_line_1 && store.city && store.postal_code) {
            $('aside').append('<p>' + store.address_line_1 + '<span class="linebreak">' + store.city + '</span><span class="linebreak">' + store.postal_code + '</span></p>');
        }
        if (store.telephone) {
            $('aside').append('<p>' + store.telephone + '</p>');
        }
        $('#right_panel aside').append('<div id="map"></div>');
        var latLong = {
            lat: store.latitude,
            lng: store.longitude
        };
        var map = new google.maps.Map(document.getElementById('map'), {
            center: latLong,
            zoom: 15
        });
        var marker = new google.maps.Marker({
            position: latLong,
            map: map,
        });
    }

    // WAIT GIFS
    $(document).ajaxStart(function() {
        $(".wait").css("display", "block");
    });

    $(document).ajaxComplete(function() {
        $(".wait").css("display", "none");
    });

    $('.match_height').matchHeight();

    $(window).resize(function() {
        if (screen.width() > 950) {
            // $('#left_panel').width('33.334%').height('100%');
            // $('#right_panel').width('32.7%').height('100%');
            $('#left_open').css('visibility', 'hidden');
        } else {
            // $('#left_panel').width('0');
            // $('#right_panel').width('0');
            // console.log('$(#first_select).length===0');
            // console.log($('#first_select').length);
            if ($('#first_select').length===0) {
                $('#left_open').css('visibility', 'visible');
            }
        }
    });

    // AJAX CALL INITIATES APP
    jQuery.ajax({
        url: 'http://lcboapi.com/products?where=is_seasonal',
        dataType: 'jsonp',
        headers: {
            'Authorization': 'Token MDo3NTU4MDQ0NC01ZGRiLTExZTYtYjliZC1mNzA2N2UyOWYwYTE6dGRXNDJOUms4MjZCRlg3b0N2OWx3bkZtYmhiZkVZeWJEYTdk'
        }
    }).done(function(data) {
        listBeers(data.result);
        $.fn.matchHeight._update();
    }).fail(function() {
        $('#first_select h2').html('Sorry, we cannot retrieve the product details at this time. Please return later.');
    });


    // SELECT PRODUCT MENU
    $('#left_open').click(function() {
        $('#left_panel').width('100%').height('100%');
    });
    $('#left_close').click(function() {
        $('#left_panel').width('0');
    });

    // STORES SIDE NAV
    $('#right_close').click(function() {
        $('#right_panel').width('0');
        $('aside').empty();
    });
});
