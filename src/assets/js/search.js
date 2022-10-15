"use strict";

//Init search results page filter input
function initSearchFilter(){
    $('.nephos-search-filter')
        .focus(function (e) {
            if ($(this).val() === defaultText)
                $(this).val('');
        })
        .blur(function (e) {
            if ($(this).val() === '')
                $(this).val(defaultText);
        })
        .keyup(function (e) {
            var patterns = $(this).val().toLowerCase().split(' ');
            if (!patterns.length)
                return;
            $('.search-filter-target')
                .hide()
                .filter(function () {
                    var matchText = $(this)
                        .find('.search-filter-match')
                        .text()
                        .toLowerCase();
                    for (var i = 0; i < patterns.length; i++)
                        if (matchText.indexOf(patterns[i]) === -1)
                            return false;
                    return true;
                })
                .show();
        });
}

//Get and build search results page
function getSearchResults(){
    const plusIcon = feather.icons.plus.toSvg();
    const minusIcon = feather.icons.minus.toSvg();
    const cartIcon = feather.icons['shopping-cart'].toSvg();
    $('#search-results-list .flat-card').remove();

    $.ajax({
        url: 'assets/data/search.json',
        async: true,
        dataType: 'json',
        success: function (data){
            console.log(data);
            for (var i = 0; i < data.length; i++) {

                var template = `
                    <div class="flat-card is-auto cart-card search-card search-filter-target product-container" data-product-id="${data[i].id}">
                        <ul class="cart-content">
                            <li>
                                <img src="http://via.placeholder.com/500x500/ffffff/999999"
                                    data-demo-src="${data[i].images[0].url}" alt="">
                                <span class="product-info">
                                    <span class="search-filter-match product-name">${data[i].name}</span>
                                    <span class="search-filter-match product-category">${data[i].category}</span>
                                </span>
                                <span class="product-price">
                                    <span>Price</span>
                                    <span>${parseFloat(data[i].price).toFixed(2)}</span>
                                </span>

                                <div data-trigger="spinner" class="main-cart-spinner">
                                    <input class="hidden-spinner" type="hidden" value="1" data-spin="spinner" data-rule="quantity"
                                        data-min="1" data-max="99">
                                    <a class="spinner-button is-remove" href="javascript:;" data-spin="down">
                                        ${minusIcon}
                                    </a>
                                    <span class="spinner-value">1</span>
                                    <a class="spinner-button is-add" href="javascript:;" data-spin="up">
                                        ${plusIcon}
                                    </a>
                                </div>

                                <span class="action">
                                    <span class="action-link is-add add-from-search-action has-simple-popover" data-content="Add to Cart"
                                        data-placement="top" onclick="return true">
                                        <a>${cartIcon}</a>
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </div>
                `

                $('#search-results-list').append(template);

                if (i == data.length - 1) {
                    initCartSpinners();
                    initAddFromSearchAction();
                    initPopovers();
                    //DEMO
                    if (env === 'development') {
                        changeDemoImages();
                    }
                }
            }
        }
    })
}

//Add to cart from search results page
function addToCartFromSearch(trigger) {
    var data = JSON.parse(localStorage.getItem('cart'));
    var $container = trigger.closest('.product-container');
    var productId = parseInt($container.attr('data-product-id'));
    var productName = $container.find('.product-name').text();
    var productCategory = $container.find('.product-category').text();
    var productPrice = parseFloat($container.find('.product-price span:nth-child(2)').text());
    var productImage = $container.find('img').attr('src');
    var productQuantity = parseInt($container.find('.hidden-spinner').val());

    const found = data.products.some(el => parseInt(el.id) === productId);
    if (!found) {
        console.log('Product does not exist in cart');
        data.items = parseInt(data.items) + 1;
        data.products.push({
            id: productId,
            name: productName,
            quantity: productQuantity,
            category: productCategory,
            price: productPrice,
            images: [
                {
                    url: productImage
                }
            ]
        });
        localStorage.setItem('cart', JSON.stringify(data));
    }
    else {
        console.log('Product exists in cart');

        for (var i = 0; i < data.products.length; i++) {
            if (parseInt(data.products[i].id) === productId) {
                data.products[i].quantity = parseInt(data.products[i].quantity + 1);
                localStorage.setItem('cart', JSON.stringify(data));
            }
        }
    }
}

//Add to cart user action
function initAddFromSearchAction(){
    $('.product-container .action .add-from-search-action').on('click', function () {
        var $this = $(this);
        if ($('.cart-quickview').hasClass('is-active')) {
            $('.cart-loader').addClass('is-active');
        }
        setTimeout(function () {
            $.when(addToCartFromSearch($this)).done(function () {
                getCart()
            })
        }, 300)
        setTimeout(function () {
            if ($('.cart-quickview').hasClass('is-active')) {
                $('.cart-loader').removeClass('is-active');
            }
            toasts.service.success('', 'fas fa-plus', 'Product successfully added to cart', 'bottomRight', 2500);
        }, 800)
    })
}

$(document).ready(function(){

    //Search results page
    if ($('#search-results').length){
        getSearchResults();
        initSearchFilter();
    }

    //Append link to search result in search overlay
    function initFullSearch() {
        $('#full-search').on('click', function () {
            $('#clear-search').removeClass('is-active');
            $('#nephos-search').closest('.control').addClass('is-loading');
            setTimeout(function () {
                window.location.href = '/search-results.html'
            }, 2200);
        })
    }

    //Init search overlay autocomplete
    const searchIcon = feather.icons.search.toSvg();

    var searchOptions = {
        url: "assets/data/products.json",
        getValue: "name",
        template: {
            type: "custom",
            method: function (value, item) {
                return `
                    <div class="nephos-search-template">
                        <img class="autocpl-product" src="${item.pic}" alt="">
                        <div class="entry-text">
                            <span>${value}</span>
                            <span>${parseFloat(item.price).toFixed(2)}</span>
                        </div>
                    </div>
                `
            }
        },
        highlightPhrase: false,
        list: {
            maxNumberOfElements: 5,
            showAnimation: {
                type: "fade", //normal|slide|fade
                time: 400,
                callback: function () { }
            },
            match: {
                enabled: true
            },
            onShowListEvent: function () {
                if (!$('#full-search').length){
                        var searchLink = `
                        <li id="full-search" class="full-search">
                            <div class="eac-item">
                                <div class="nephos-search-template">
                                    <div class="icon-wrapper">
                                        ${searchIcon}
                                    </div>
                                    <div class="entry-text">
                                        <span>View All Results</span>
                                        <small>357 results</small>
                                    </div>
                                </div>
                            </div>
                        </li>
                    `
                    $('.search-input-wrapper .easy-autocomplete-container ul').append(searchLink);
                    initFullSearch();
                }
                $('.search-input-wrapper .easy-autocomplete-container ul').addClass('opened');
            },
            onHideListEvent: function () {
                $('.search-input-wrapper .easy-autocomplete-container ul').removeClass('opened');
                $('#full-search').remove();
            }
        },
    };

    $("#nephos-search").easyAutocomplete(searchOptions);

})