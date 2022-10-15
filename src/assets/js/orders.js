"use strict";

//Get and populate orders grid
function getOrdersGrid() {
    var userData = JSON.parse(localStorage.getItem('user'));
    var primaryColor;
    var modifierClass;
    var icon;
    const truckIcon = feather.icons.truck.toSvg();
    const clockIcon = feather.icons.clock.toSvg();
    const checkIcon = feather.icons.check.toSvg();
    const packageIcon = feather.icons.package.toSvg();
    const ccIcon = feather.icons['credit-card'].toSvg();
    const blockedIcon = feather.icons['alert-octagon'].toSvg();

    //If not logged in, hide account
    if (!userData.isLoggedIn) {
        $('#orders-main, #orders-main-placeholder').toggleClass('is-hidden');
    }
    else if (userData.orders.length === 0) {
        $('#orders-main, #orders-empty-placeholder').toggleClass('is-hidden');
    }
    //Load orders
    else {
        //Remove orders
        $('#orders-main .column').remove();

        //Loop orders
        for (var i = 0; i < userData.orders.length; i++) {

            //Apply status color
            if (userData.orders[i].status === 'New') {
                primaryColor = '#00b289';
                modifierClass = 'is-success';
                icon = packageIcon;
            }
            else if (userData.orders[i].status === 'Shipping') {
                primaryColor = '#0023ff';
                modifierClass = 'is-primary';
                icon = truckIcon;
            }
            else if (userData.orders[i].status === 'Complete') {
                primaryColor = '#0023ff';
                modifierClass = 'is-primary';
                icon = checkIcon;
            }
            else if (userData.orders[i].status === 'Preparing') {
                primaryColor = '#00b289';
                modifierClass = 'is-success';
                icon = packageIcon;
            }
            else if (userData.orders[i].status === 'Processing') {
                primaryColor = '#eda514';
                modifierClass = 'is-warning';
                icon = ccIcon;
            }
            else if (userData.orders[i].status === 'Blocked') {
                primaryColor = '#FF7273';
                modifierClass = 'is-danger';
                icon = blockedIcon;
            }

            var template = `
                <div class="column is-4">
                    <div class="flat-card order-card has-popover-top" data-order-id="${userData.orders[i].id}">
                        <div class="order-info">
                            <span><a class="order-details-link" onclick="return true">ORDER-${userData.orders[i].id}</a></span>
                            <span class="tag ${modifierClass}">${userData.orders[i].status}</span>
                        </div>
                        <!-- Progress Circle -->
                        <div class="circle-chart-wrapper">
                            <svg class="circle-chart" viewbox="0 0 33.83098862 33.83098862" width="140" height="140" xmlns="http://www.w3.org/2000/svg">
                                <circle class="circle-chart-background" stroke="#efefef" stroke-width="2" fill="none" cx="16.91549431" cy="16.91549431" r="15.91549431" />
                                <circle class="circle-chart-circle" stroke="${primaryColor}" stroke-width="2" stroke-dasharray="${userData.orders[i].completed},100" stroke-linecap="round" fill="none" cx="16.91549431" cy="16.91549431" r="15.91549431" />
                            </svg>
                            <!-- Icon -->
                            <div class="chart-icon">
                                ${icon}
                            </div>
                            <!-- Label -->
                            <div class="ring-title has-text-centered">
                                <span>${userData.orders[i].completed}% Complete</span>
                            </div>
                        </div>
                    </div>

                    <div class="webui-popover-content">
                        <!-- Popover Block -->
                        <div class="popover-flex-block">
                            <img class="staff-avatar" src="http://via.placeholder.com/250x250" data-demo-src="${userData.orders[i].contact.photoUrl}" alt="">
                            <div class="content-block">
                                <label>Order handled by</label>
                                <span>${userData.orders[i].contact.name}</span>
                            </div>
                        </div>
                        <!-- Popover Block -->
                        <div class="popover-flex-block">
                            <div class="icon-block">
                                ${clockIcon}
                            </div>
                            <div class="content-block">
                                <label>Ordered on</label>
                                <span>${userData.orders[i].date}</span>
                            </div>
                        </div>
                        <!-- Popover Block -->
                        <div class="popover-flex-block">
                            <div class="icon-block">
                                ${ccIcon}
                            </div>
                            <div class="content-block">
                                <label>Order Total</label>
                                <span>${userData.orders[i].total}</span>
                            </div>
                        </div>
                        <!-- Popover Block -->
                        <div class="popover-flex-block">
                            <div class="icon-block">
                                ${truckIcon}
                            </div>
                            <div class="content-block">
                                <label>Shipping Method</label>
                                <span>${userData.orders[i].shippingMethod}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
            $.when($('#orders-main').append(template)).done(function(){
                initPopovers();
                //DEMO
                if (env === 'development') {
                    changeDemoImages();
                }
                //Hide Loader
                $('.account-loader').addClass('is-hidden');
                //Init Order details
                initOrderDetailsLinks();
            })
        }
    }
}

//Get and populate orders List
function getOrdersList() {
    var userData = JSON.parse(localStorage.getItem('user'));
    var primaryColor;
    var modifierClass;
    var icon;
    const truckIcon = feather.icons.truck.toSvg();
    const clockIcon = feather.icons.clock.toSvg();
    const checkIcon = feather.icons.check.toSvg();
    const packageIcon = feather.icons.package.toSvg();
    const ccIcon = feather.icons['credit-card'].toSvg();
    const blockedIcon = feather.icons['alert-octagon'].toSvg();
    const supportIcon = feather.icons['life-buoy'].toSvg();

    //If not logged in, hide account
    if (!userData.isLoggedIn) {
        $('#orders-main, #orders-main-placeholder').toggleClass('is-hidden');
    }
    else if (userData.orders.length === 0) {
        $('#orders-main, #orders-empty-placeholder').toggleClass('is-hidden');
    }
    //Load orders
    else {
        //Remove orders
        $('#orders-main .order-long-card').remove();

        //Loop orders
        for (var i = 0; i < userData.orders.length; i++) {

            //Apply status color
            if (userData.orders[i].status === 'Shipping') {
                primaryColor = '#0023ff';
                modifierClass = 'is-primary';
                icon = truckIcon;
            }
            else if (userData.orders[i].status === 'Complete') {
                primaryColor = '#0023ff';
                modifierClass = 'is-primary';
                icon = checkIcon;
            }
            else if (userData.orders[i].status === 'Preparing') {
                primaryColor = '#00b289';
                modifierClass = 'is-success';
                icon = packageIcon;
            }
            else if (userData.orders[i].status === 'Processing') {
                primaryColor = '#eda514';
                modifierClass = 'is-warning';
                icon = ccIcon;
            }
            else if (userData.orders[i].status === 'Blocked') {
                primaryColor = '#FF7273';
                modifierClass = 'is-danger';
                icon = blockedIcon;
            }

            var template = `
                <div class="order-long-card" data-order-id="${userData.orders[i].id}">
                    <div class="left-side">
                        <div class="order-header">
                            <h3>ORDER ${userData.orders[i].id}</h3>
                            <span class="date">${userData.orders[i].date}</span>
                            <span class="tag is-primary">${userData.orders[i].status}</span>
                            <span class="order-total">${userData.orders[i].total}</span>
                        </div>
                        <div class="ordered-products has-slimscroll">
                            <!--Loader-->
                            <div class="products-loader is-active">
                                <div class="loader is-loading"></div>
                            </div>
                        </div>
                    </div>
                    <div class="right-side">
                        <img class="side-bg" src="assets/img/logo/nephos-greyscale.svg" alt="">
                        <div class="meta-header">
                            <img src="http://via.placeholder.com/250x250" data-demo-src="${userData.orders[i].contact.photoUrl}" alt="">
                            <div class="inner-meta">
                                <span>Handled by</span>
                                <span>${userData.orders[i].contact.name}</span>
                            </div>
                            <a class="support">
                                ${supportIcon}
                            </a>
                        </div>

                        <div class="meta-actions">
                            <a class="button is-rounded is-fullwidth primary-button raised order-details-link">Order Details</a>
                            <a class="button is-rounded is-fullwidth grey-button rounded">Invoice</a>
                        </div>
                    </div>
                </div>
            `
            $.when($('#orders-main .column.is-12').append(template)).done(function () {
                //Hide Loader
                $('.account-loader').addClass('is-hidden');
            })
        }
        //Load products for each order
        loadOrdersListProducts();
        //Init Order details
        initOrderDetailsLinks();
    }
}

//Populate inner product lists in order lists
function loadOrdersListProducts() {
    var userData = JSON.parse(localStorage.getItem('user'));

    $('.order-long-card').each(function(){
        var $this = $(this);
        var orderId = parseInt($this.attr('data-order-id'));
        var $container = $this.find('.ordered-products');
        var products;

        for (var i = 0; i < userData.orders.length; i++) {
            if (userData.orders[i].id == orderId){
                products = userData.orders[i].products;
            }
        }

        for (var p = 0; p < products.length; p++) {

            var template = `
                        <div class="ordered-product">
                            <img src="http://via.placeholder.com/250x250" data-demo-src="${products[p].photoUrl}" alt="">
                            <div class="product-meta">
                                <span class="name">${products[p].name}</span>
                                <span class="price">
                                    <span>${parseFloat(products[p].price).toFixed(2)}</span>
                                    <span>x <var>${products[p].quantity}</var></span>
                                </span>
                            </div>
                            <div class="product-subtotal">
                                <span>Total</span>
                                <span>${(parseFloat(products[p].price) * parseFloat(products[p].quantity)).toFixed(2)}</span>
                            </div>
                        </div>
                    `

            $.when($container.append(template)).done(function () {
                //DEMO
                if (env === 'development') {
                    changeDemoImages();
                }
                $this.find('.products-loader').removeClass('is-active');
            })
        }
    })
}

$(document).ready(function () {

    //If orders grid page
    if ($('#orders-grid').length) {
        getOrdersGrid();
    }

    //If orders list page
    if ($('#orders-list').length) {
        getOrdersList();
    }

})