function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};
    $.map(unindexed_array, function(n, i){
        indexed_array[n['name'].split('properties[').join('').split(']').join('')] = n['value'];
    });
    return indexed_array;
}
/*---------------------MODAL CHECKOUT-----------------------------*/
function freeShipping(current,max) {
    var $progress = $('.free-shipping-progress-bar'),
        $current = $('.free-shipping-current'),
        $max = $('.free-shipping-full'),
        $alert = $('.js-free-shipping-alert'),
        $text = $('.js-free-shipping-text'),
        current = current,
        max = max;

    var  percent = Math.floor(current/max*100, 10);
    if (percent >= 100) {
        percent = $alert.html();
        $text.hide();
        $progress.css({
            width: '100%'
        })
        $progress.html(percent);
    } else {
        $text.show();
        $progress.css({
            width: percent + '%'
        })
        $progress.html(percent + '%');
    }
    if (percent < 100 && percent >=33){
        $progress.addClass('progress-bar-middle');
        $progress.removeClass('progress-bar-low')
    } else if (percent < 33) {
        $progress.addClass('progress-bar-low');
        $progress.removeClass('progress-bar-middle')
    } else {
        $progress.removeClass('progress-bar-low progress-bar-middle')
    }
    $current.html(Shopify.formatMoney((max-current)*100, price_format));
    $max.html(max);
    $progress.closest('.free-shipping').removeClass('hidden');
}
function freeShippingInit(){
    if($('.js-free-shipping-text').length)freeShipping(CartJS.cart.total_price/100,$('.js-free-shipping-text').data('count'));
    currencyUpdate();
}
function showCheckoutModal()
{
    // $('.removed-note').addClass('hidden');
    // $.fancybox.open({ src: '#modalCheckOut',touch: false,afterShow: function () {
    //     currencyUpdate();
    // }})
}
function modalCheckoutUpdate(){
    $price_format=price_format;
    if($('body').hasClass('checkout-popup')){
        $('.js-mdlchk-prd-count').text(CartJS.cart.item_count);
        $('.js-mdlchk-prd-total').html(Shopify.formatMoney(CartJS.cart.total_price, $price_format));
        renderCartInModalPopup();
        renderPluralSingle('>1,0');
    }
}
function renderCartInModalPopup()
{
    $cart_count=$('.minicart .minicart-qty');
    cart_list='.modalchk-prd .cart-table';
    $cart_subtotal=$('.minicart-total');
    $price_format=price_format;

    $updated_list='';
    line_item=1;
    $.each(CartJS.cart.items, function(index, item) {
        variant_title='';
        properties='';
        $.each(item.properties, function(a, b) {
            if(b!="")
            {
                properties=properties+'<div class="options_title">'+a+': '+b+'</div>';
            }
        });
        variant_title = item.product_title;
        if(item.variant_title != 'Default' && item.variant_title != undefined){variant_title=item.variant_title}
        $item='<div class="cart-table-prd"> <div class="cart-table-prd-image"> <a href="' + item.url+'"><img src = "'+item.image+'" alt="'+item.product_title+'"></a> </div> <div class="cart-table-prd-name"> <h5><span>' + item.vendor+'</span></h5> <h2><a href="' + item.url+'">'+item.title+'</a></h2></div> <div class="cart-table-prd-price"><b>'+Shopify.formatMoney(item.price, $price_format)+'</b></div> <div class="cart-table-prd-qty"> <div class="prd-block_qty"> <div class="qty qty-changer"> <fieldset> <input type="button" value="&#8210;" class="decrease" data-variant-id="'+item.variant_id+'" data-variant-url="' + item.url+'" data-variant-name="'+item.title+'"> <input disabled type="text" class="qty-input" value="'+item.quantity+'" data-min="0" data-max="9999"> <input type="button" value="+" class="increase" data-variant-id="'+item.variant_id+'" data-variant-url="' + item.url+'" data-variant-name="'+item.title+'"> </fieldset> </div> </div> </div> <div class="cart-table-prd-price"><b>'+Shopify.formatMoney(item.line_price, $price_format)+'</b></div> <div class="cart-table-prd-action"> <a href="' + item.url+'" data-variant-name="'+item.title+'" data-variant-id="'+item.variant_id+'" data-line-number="'+line_item+'"  title="'+locales.remove+'" class="icon-cross js-popupcart-remove-item"></a> </div> </div>';
        $updated_list=$updated_list+$item;
        line_item=line_item+1;
        $(cart_list).html('<div class="block fullheight fullwidth empty-cart"> <div class="container"> <div class="image-empty-cart"> <img src="//cdn.shopify.com/s/files/1/0744/9541/t/139/assets/empty-basket.png?17187805938738385478" alt=""> <div class="text-empty-cart-1">SHOPPING CART IS</div> <div class="text-empty-cart-2">EMPTY</div> </div> <div><a href="#" onclick="history.go(-1);return false;" class="btn">back to previous page</a></div> </div> </div>'); }); $(cart_list).html($updated_list);
    freeShippingInit();
    if(CartJS.cart.item_count>0){$('.btn.checkout_procees').show()}else{$('.btn.checkout_procees').hide()}
    currencyUpdate();
}
$(document).on('click','.modalchk-prd .increase,.modalchk-prd .decrease',function(e){
    $('.modal--checkout .modal-content').addClass('is-loading');
    val = $(this).parent().find('input.qty-input').val();
    if($(this).hasClass('increase')) val ++;
    if($(this).hasClass('decrease')) val --;
    if(val < 0) val = 0;
    variant_id = $(this).attr('data-variant-id');
    variant_name = $(this).attr('data-variant-name');
    variant_url = $(this).attr('data-variant-url');
    CartJS.updateItemById(variant_id, val,{},{
        "success": function(data, textStatus, jqXHR) {
            renderCartInModalPopup();
            if(val == 0)
            {
                $('.product-removed-title').text(variant_name).attr('href',variant_url);
                $('.js-undo-remove').attr('data-variant-id',variant_id);
                $('.removed-note').removeClass('hidden');
            }
            setTimeout(function(){
                $('.modal--checkout .modal-content').removeClass('is-loading');
            },500)

        },
        "error": function(jqXHR, textStatus, errorThrown) {
            $('#modalError span').text(errorThrown);
            $.fancybox.open({ src: '#modalError'})

        }
    });
    e.preventDefault();
})

$(document).on('click','a.js-popupcart-remove-item',function(e){
    $('.modal--checkout .modal-content').addClass('is-loading');
    variant_id = $(this).attr('data-variant-id');
    variant_name = $(this).attr('data-variant-name');
    variant_url = $(this).attr('data-variant-url');
    CartJS.removeItem($(this).data('line-number'),{
        "success": function(data, textStatus, jqXHR) {
            renderCartInModalPopup();
            $('.product-removed-title').text(variant_name).attr('href',variant_url);
            $('.js-undo-remove').attr('data-variant-id',variant_id);
            $('.removed-note').removeClass('hidden');
            setTimeout(function(){
                $('.modal--checkout .modal-content').removeClass('is-loading');
            },500)
        },
        "error": function(jqXHR, textStatus, errorThrown) {
            $('#modalError span').text(errorThrown);
            $.fancybox.open({ src: '#modalError'})
        }
    });
    e.preventDefault();
})

$(document).on('click','.js-undo-remove',function(e){
    $('.modal--checkout .modal-content').addClass('is-loading');
    variant_id = $(this).attr('data-variant-id');
    CartJS.addItem(variant_id, 1,{},{
        "success": function(data, textStatus, jqXHR) {
            renderCartInModalPopup();
            $('.removed-note').addClass('hidden');
            setTimeout(function(){
                $('.modal--checkout .modal-content').removeClass('is-loading');
            },500)
        },
        "error": function(jqXHR, textStatus, errorThrown) {
            $('#modalError span').text(errorThrown);
            $.fancybox.open({ src: '#modalError'})

        }
    });
    e.preventDefault();
})
function getLatestProductData(variant_id){
    setTimeout(function(){
        $('.modalchk-prd-image').append("<div class='gdw-loader'></div>");
        $price_format=price_format;
        $.each(CartJS.cart.items, function (i, item) {
            if(item.id == variant_id){
                $('.modalchk-price').html(Shopify.formatMoney(item.price, $price_format));
                $('.modalchk-prd-info .modalchk-title').html('<a href="' + item.url + '" title="' + item.product_title + '">' + item.product_title + '</a>');
                $('.modalchk-prd-info .label-options').html(item.variant_title);
                image = item.image;
                if(image.indexOf('.png?v=') !== -1)
                {
                    image = image.replace('.png?v=','_340x.png?v=');
                }
                else if(image.indexOf('.jpg?v=') !== -1)
                {
                    image = image.replace('.jpg?v=','_340x.jpg?v=');
                }
                else if(image.indexOf('.gif?v=') !== -1)
                {
                    image = image.replace('.gif?v=','_340x.gif?v=');
                }
                $('.modalchk-prd-image').html('<a href="' + item.url + '" title="' + item.title + '"><img src="' + image + '" alt="' + item.title + '"><div class="gdw-loader"></div></a>');
            }
        })
        setTimeout(function(){
            $('.modalchk-prd-image .gdw-loader').remove();
        },1000)
    },1000)
}
/*---------------------END MODAL CHECKOUT-----------------------------*/
/*---------------------COLOR IMAGE PRICE SELECTOR CHANGE--------------*/
function _changeVprice(price,compare_price,el){
    $('.price-new',el).html(Shopify.formatMoney(price, moneyFormat));
    $('.prd-price .price-old,.prd-price .price-comment',el).remove();
    if(compare_price)
    {
        $('<div class="price-old">'+Shopify.formatMoney(compare_price, moneyFormat)+'</div><div class="price-comment"></div>').appendTo($('.prd-price',el));
    }
    currencyUpdate();
}
function _changeQuickViewPrice(price,compare_price,el){
    $('.prd-block_price--actual',el).html(Shopify.formatMoney(price, moneyFormat));
    $('.prd-block_price--old',el).remove();
    if(compare_price)
    {
        $('<div class="prd-block_price--old">'+Shopify.formatMoney(compare_price, moneyFormat)+'</div>').appendTo($('.prd-block_price',el));
    }
    currencyUpdate();
}
function _changeVid(vid,el) {
    $('select[name=id]',el).selectpicker('val', vid);
}
function _changePreviews(image,el) {
    data = {
        toggle: '.js-color-toggle',
        image: '.js-prd-img',
        colorswatch: '.color-swatch',
        product: '.prd, .prd-hor',
        arrows: '.color-swatch-arrows',
        prev: '.js-color-swatch-prev',
        next: '.js-color-swatch-next',
        scrolldiv: '.color-swatch-scroll',
        scrollpx: 42,
        scrollspeed: 300
    }
    $('.color-swatch li',el).removeClass('active');
    if (image) {
        var $prd = el,
            $image = $prd.find(data.image),
            imgSrc = image;
        $prd.addClass('prd-loading');
        //$($(data.toggle).parent(),el).siblings().removeClass('active');
        var newImg = document.createElement("img");
        newImg.src = imgSrc;
        newImg.onload = function() {
            $image.attr('src', imgSrc);
            $prd.removeClass('prd-loading');
        };
    }
}

function updateProductCardSelectbox(){
    $('.prd-action select').on('loaded.bs.select', function () {
        currencyUpdate();
    }).on('show.bs.select', function () {
        currencyUpdate();
    }).on('changed.bs.select', function () {
        product_item = $(this).closest('.product-item.prd');
        val = $(this).selectpicker('val');
        option = $('option[value='+val+']',$(this));
        price = option.data('price');
        compare_price = option.data('compare-price');
        data_image = option.data('image');
        color = option.data('color');
        _changeVprice(price,compare_price,product_item);
        _changePreviews(data_image,product_item);
        currencyUpdate();
    });
}

$(document).on('click','.prd .prd-img-area .color-swatch li',function(){
    product_item = $(this).closest('.product-item.prd');

    _changeVprice($(this).data('price'),$(this).data('compare-price'),product_item);
    _changeVid($(this).data('variant-id'),product_item);
    $('.color-swatch li',product_item).removeClass('active');
    $(this).addClass('active');
})
updateProductCardSelectbox();
/*---------------------END COLOR IMAGE PRICE SELECTOR CHANGE----------*/

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

function initElevateZoom($imageHolder, $zoomImg, $prdBlock) {
    var $imageHolder = $imageHolder,
        $zoomImg = $zoomImg,
        imageHolder = '.prd-block_main-image-holder',
        zoompos = $('body').is('.rtl') ? 11 : 1,
        append,
        zoomtype;
    if (!$('body').hasClass('touch')) {
        $imageHolder.removeClass('hideZoom');
        append = '#' + $prdBlock.attr('id') + " " + imageHolder;
        zoomtype = $zoomImg.closest('[data-zoomtype]').data('zoomtype') ? $zoomImg.closest('[data-zoomtype]').data('zoomtype') : 'window';
        $zoomImg.ezPlus({
            zoomType: zoomtype,
            zIndex: 149,
            zoomWindowPosition: zoompos,
            zoomContainerAppendTo: append,
            zoomWindowFadeIn: 500,
            zoomWindowFadeOut: 500,
            lensFadeIn: 500,
            lensFadeOut: 500,
            imageCrossfade: true,
            responsive: true,
            cursor: 'crosshair'
        });
        $imageHolder.addClass('zoomInit');
    } else {
        $imageHolder.addClass('hideZoom');
    }
}

function destroyElevateZoom($imageHolder, $zoomImg) {
    var $zoomImg = $zoomImg,
        $imageHolder = $imageHolder;
    if ($('.zoomContainer').length) {
        $zoomImg.data('ezPlus').destroy();
        $zoomImg.removeData('ezPlus');
    }
    $('.zoomContainer, .ezp-spinner').remove();
    if ($zoomImg.closest('.zoomWrapper').length) {
        $zoomImg.removeAttr('style').unwrap();
    }
    $imageHolder.removeAttr('style');
}

function updateData($type,$id,$options){

  	path='product_options_'+$id;
    product_to_update=$('.product-info-block-id-'+$id);
    $price_format=price_format;

    $($type,$options).each(function(){
        if($type=='select') val=$(this).val(); else val=$(this).data('value');
        x='[\''+val+'\']';
        path+=x;
    });
    if(eval(path)!=undefined){
        /*variant changer*/
        $('input[name=id]',product_to_update).val(eval(path+'[\'id\']'));
        window.history.pushState('', '', updateQueryStringParameter(window.location.toString(),'variant',eval(path+'[\'id\']')));

        /*add to cart button update for checkout modal*/
        $('.js-add-to-cart-product-page',product_to_update).attr('data-variant-id',eval(path+'[\'id\']'));

        /*price changer*/
        $('.prd-block_price--actual',product_to_update).html(Shopify.formatMoney(eval(path+'[\'price\']'), $price_format));

        /*compare price changer*/
        if(eval(path+'[\'compare_at_price\']')!='')
        {
            if(eval(path+'[\'compare_at_price\']')>eval(path+'[\'price\']'))
            {
                if($('.prd-block_price .prd-block_price--old').length){
                    $('.prd-block_price .prd-block_price--old',product_to_update).html(Shopify.formatMoney(eval(path+'[\'compare_at_price\']'), $price_format));
                }else{
                    $('.prd-block_price',product_to_update).append('<div class="prd-block_price--old">'+Shopify.formatMoney(eval(path+'[\'compare_at_price\']'), $price_format)+'</div>');
                }
            }else{
                $('.prd-block_price--old',product_to_update).html('');
            }
        }
        else {
            $('.prd-block_price--old',product_to_update).html('');
        }

        /*sku changer*/
        sku=eval(path+'[\'sku\']');
        if(sku == '')sku = '----'
        $('.product-sku span',product_to_update).html(sku);
      
        GOODWIN.product.swatchToggleSize(eval(path+'[\'image\']'), product_to_update);

        /*stock changer*/
        path_inventory_management = eval(path + '[\'inventory_management\']');
        path_inventory_quantity = eval(path + '[\'inventory_quantity\']');
        path_inventory_policy = eval(path + '[\'inventory_policy\']');
        if (path_inventory_management == 'shopify' && path_inventory_policy == 'deny') {
            $('.stock-dynamic',product_to_update).removeClass('hidden').find('b').text(path_inventory_quantity);
            $('.qty-input',product_to_update).attr('data-max', path_inventory_quantity);
            if (parseInt($('.qty-input',product_to_update).val()) > parseInt(path_inventory_quantity)) {
                $('.qty-input',product_to_update).val(path_inventory_quantity);
            }
        } else {
            if (!$('.stock-dynamic',product_to_update).hasClass('hidden'))$('.stock-dynamic',product_to_update).addClass('hidden');
            $('.qty-input',product_to_update).removeAttr('data-max');
        }
    }
    currencyUpdate();
}

function add_to() {
    if($('body').hasClass('adding_'))return false;
    $('body').addClass('adding_');
    _this = $(this);
    $form=_this.closest('form');
    var line_properties = getFormData($('[name*=properties]',$form));
    CartJS.addItem(_this.data("variant-id"), 1, line_properties, {
        "success": function (data, textStatus, jqXHR) {
            if (_this.length) {
                if($('body').hasClass('checkout-popup'))
                {
                    getLatestProductData(_this.data("variant-id"));
                    setTimeout(function () {
                        showCheckoutModal();
                    }, 2000);
                }
                _this.addClass('btn--loading');
                setTimeout(function () {
                    $('.js-add-to-cart').removeClass('btn--loading');
                }, 2000);
                setTimeout(function () {
                    $('body').removeClass('adding_');
                }, 2500);
            }
        },
        "error": function (jqXHR, textStatus, errorThrown) {
            $('#modalError span').text('Some items became unavailable. Update the quantity and try again');
            $.fancybox.open({ src: '#modalError'})
            setTimeout(function () {
                $('body').removeClass('adding_');
            }, 2500);
        }
    });
    CartJS.clearAttributes();/*ie 11 fix ajax add to cart*/
}

if($('body').hasClass('ajax_cart'))
{
    $(document).on('click','.js-add-to-cart',function(e){
        add_to.call(this);
        e.preventDefault();
    });

    $(document).on('click','.js-add-to-cart-select',function(e){
        if($('body').hasClass('adding_'))return false;
        $('body').addClass('adding_');
        _this = $(this);
        $form=_this.closest('form');
        CartJS.addItem($('[name=id]',$form).val(), 1,{}, {
            "success": function(data, textStatus, jqXHR) {
                if($('body').hasClass('checkout-popup'))
                {
                    getLatestProductData($('[name=id]',$form).val());
                    setTimeout(function () {
                        showCheckoutModal();
                    }, 2000);
                }
                _this.addClass('btn--loading');
                setTimeout(function () {
                    $('.js-add-to-cart-select').removeClass('btn--loading');
                }, 2000);
                setTimeout(function () {
                    $('body').removeClass('adding_');
                }, 2500);
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                $('#modalError .sms').text('Select variant of the product, please!');
                $.fancybox.open({ src: '#modalError'})
                setTimeout(function () {
                    $('body').removeClass('adding_');
                }, 2500);
            }
        });
        CartJS.clearAttributes();/*ie 11 fix ajax add to cart*/
        e.preventDefault();
    })

    $(document).on('click','.js-add-to-cart-product-page',function(e){
        if($('body').hasClass('loading'))return false;
        _this = $(this);
        $form=_this.closest('form');
        var line_properties = getFormData($('[name*=properties]',$form));
        CartJS.addItem($('[name=id]',$form).val(), $('[name=quantity]',$form).val(),line_properties, {
            "success": function(data, textStatus, jqXHR) {
                if($('.js-add-to-cart-product-page').length){
                    if($('body').hasClass('checkout-popup'))
                    {
                        getLatestProductData($('[name=id]',$form).val());
                        setTimeout(function () {
                            showCheckoutModal();
                        }, 2000);
                    }
                    _this.addClass('btn--loading')
                    setTimeout(function () {
                        $('.js-add-to-cart-product-page').removeClass('btn--loading');
                    }, 2000);
                }
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                $('#modalError span').text('Some items became unavailable. Update the quantity and try again');
                $.fancybox.open({ src: '#modalError'})
            }
        });
        CartJS.clearAttributes();/*ie 11 fix ajax add to cart*/
        e.preventDefault();
    })


}

function cartPopupUpdate(){
    $cart_count=$('.minicart .minicart-qty');
    cart_list='.cart-list-prd';
    $cart_subtotal=$('.minicart-total');
    $price_format=price_format;
    if(CartJS.cart.item_count > 0)
    {
        free_shipping = '';
        if(checkout_popup_free_shipping_yes && free_shipping_header_cart_yes)
        {
            free_shipping =  '<div class="free-shipping">' +
                '   <div class="free-shipping-progress progress">' +
                '       <div class="free-shipping-progress-bar progress-bar progress-bar-striped active"></div>' +
                '   </div>' +
                '   <div class="free-shipping-text js-free-shipping-text" data-count="'+checkout_popup_free_shipping_count+'">'+locales.checkout_popup_free_condition_text+' ('+locales.free_shipping_from+'  '+Shopify.formatMoney(checkout_popup_free_shipping_count*100,price_format)+').</div>' +
                '   <div class="hidden js-free-shipping-alert">'+locales.congrats+'</div>' +
                '</div>';
        }
        $('.minicart-drop-content').html('<h3>'+locales.recently_added_items+':</h3><div class="cart-list-prd"></div>' + free_shipping +
            '<div class="minicart-drop-total"> ' +
            '   <div class="pull-right">' +
            '       <span class="minicart-drop-summa"><span>'+locales.subtotal+':</span> <b>'+Shopify.formatMoney(CartJS.cart.total_price, $price_format)+'</b></span> ' +
            '       <div class="minicart-drop-btns-wrap">' +
            '            <a href="/checkout" class="btn"><i class="icon-check-box"></i><span>'+locales.go_to_checkout+'</span></a>' +
            '            <a href="/cart" class="btn btn--alt"><i class="icon-handbag"></i><span>'+locales.view_cart+'</span></a>' +
            '       </div>' +
            '   </div> ' +
            '   <div class="pull-left">' +
            '        <a href="/cart" class="btn btn--alt"><i class="icon-handbag"></i><span>'+locales.view_cart+'</span></a>' +
            '   </div> ' +
            '</div>');

        $updated_list='';
        line_item=1;
        $.each(CartJS.cart.items, function(index, item) {
            variant_title='';
            properties='';
            $.each(item.properties, function(a, b) {
                if(b!="")
                {
                    properties=properties+'<div class="options_title">'+a+': '+b+'</div>';
                }
            });
            if(item.variant_title != 'Default' && item.variant_title != undefined){variant_title=item.variant_title}
            $item='<div class="minicart-prd"> <div class="minicart-prd-image"> <a href="' + item.url+'" title="'+item.product_title+'"><img src = "'+item.image+'" alt="'+item.product_title+'"> </a> </div> <div class="minicart-prd-name"> <h5><span>' + item.vendor+'</span></h5> <h5><a href="' +item.url+'">'+variant_title+'</a></h5> <h2><a href="' +item.url+'">'+item.product_title+'</a></h2> </div> <div class="minicart-prd-qty"><span>'+locales.qty+':</span> <b>'+item.quantity+'</b></div> <div class="minicart-prd-price"><span>'+locales.price+':</span> <b>'+Shopify.formatMoney(item.price, $price_format)+'</b></div> <div class="minicart-prd-action"> <a href="' + item.url+'"  class="icon-pencil "></a> <a href="' + item.url+'" data-variant-id="'+item.variant_id+'" data-line-number="'+line_item+'"  title="'+locales.remove+'" class="icon-cross js-minicart-remove-item"></a> </div> </div>';
            $updated_list=$updated_list+$item;
            line_item=line_item+1;
        });
        $(cart_list).html($updated_list);
        currencyUpdate();
    }
    else
    {
        $('.minicart-drop-content').html('<div class="cart-empty mx-auto"> <div class="cart-empty-icon"> <i class="icon icon-handbag"></i> </div> <div class="cart-empty-text"> <h3 class="cart-empty-title">'+locales.empty_minicart_text_1+'</h3> <p>'+locales.empty_minicart_text_2+' <a href="collections/all/">'+locales.empty_minicart_text_3+'</a></p> </div> </div>');
    }
    $cart_subtotal.html(Shopify.formatMoney(CartJS.cart.total_price, $price_format));
    $cart_count.html(CartJS.cart.item_count);
}
function currencyUpdate(){
    if(jQuery('.selected-currency:first').length)
    {
        Currency.convertAll(shopCurrency, jQuery('.selected-currency:first').text());
    }
}

$(document).on('click','a.js-minicart-remove-item',function(e){
    CartJS.removeItem($(this).data('line-number'),{
        "success": function(data, textStatus, jqXHR) {
        },
        "error": function(jqXHR, textStatus, errorThrown) {
            $('#modalError span').text(errorThrown);
            $.fancybox.open({ src: '#modalError'})
        }
    })
    e.preventDefault();
})
$(document).on('click','.update_qty',function(e){
    CartJS.updateItemById($(this).data('variant-id'), $(this).prev().val(),{},{
        "success": function(data, textStatus, jqXHR) {
        },
        "error": function(jqXHR, textStatus, errorThrown) {
            $('#modalError span').text(errorThrown);
            $.fancybox.open({ src: '#modalError'})

        }
    });
    e.preventDefault();
})
$(document).on('cart.requestComplete', function(event, cart) {
    cartPopupUpdate();
    modalCheckoutUpdate();
    currencyUpdate();
});


function showProduct(delay,effect,selector){
    var delay = delay,
        effect = effect;
    $(selector).each(function(i) {
        var $this = $(this);
        setTimeout(function(){
            //$this.addClass(effect + ' animated');
        }, delay*i);
    });
}

function viewMode(viewmode) {
    var $grid = $('.grid-view', $(viewmode)),
        $list = $('.list-view', $(viewmode)),
        $products = $('.products-listview, .products-grid');
    if ($('.products-listview').length){
        $list.addClass('active');
    } else if ($('.products-grid').length){
        $grid.addClass('active');
    } else return false;
    $grid.on("click", function (e) {
        var $this = $(this);
        $products.addClass('no-animate');
        if(!$this.is('.active')){
            $list.removeClass('active');
            $this.addClass('active');
            $products.removeClass('products-listview').addClass('products-grid');
        }
        setTimeout(function() {
            $products.removeClass('no-animate');
        }, 500);
        e.preventDefault();
    });
    $list.on("click", function (e) {
        var $this = $(this);
        $products.addClass('no-animate');
        if(!$this.is('.active')){
            $grid.removeClass('active');
            $this.addClass('active');
            $products.removeClass('products-grid').addClass('products-listview');
        }
        setTimeout(function() {
            $products.removeClass('no-animate');
        }, 500);
        e.preventDefault();
    });
}

function tooltipIni() {
    var title;
    $('[data-tooltip]').darkTooltip({
        size: 'small',
        animation: 'fade'
    }).hover(function () {
        title = $(this).attr('title');
        $(this).attr('title', '');
    }, function () {
        $(this).attr('title', title);
    });
}

function countDownIni(countdown) {
    $(countdown).each(function () {
        var countdown = $(this);
        var promoperiod;
        if (countdown.attr('data-promoperiod')) {
            promoperiod = new Date().getTime() + parseInt(countdown.attr('data-promoperiod'), 10);
        } else if (countdown.attr('data-countdown')) {
            promoperiod = countdown.attr('data-countdown');
        }
        if (Date.parse(promoperiod) - Date.parse(new Date()) > 0) {
            countdown.countdown(promoperiod, function (event) {
                countdown.html(event.strftime('<span><span>%D</span>DAYS</span>' + '<span><span>%H</span>HRS</span>' + '<span><span>%M</span>MIN</span>' + '<span><span>%S</span>SEC</span>'));
            });
        }
    });
}
function renderPluralSingle(statement){
    var statement = statement;
    $('[data-text-plural]').each(function(){
        var $this = $(this),
            $target = $('.'+ $this.attr('data-count')),
            count = parseInt($target.html(),10),
            statementArray = statement.split(','),
            statementString = '';
        $.each(statementArray, function (index, value) {
            if($.isNumeric(value.substring(0))){
                statementString += 'count==' + value
            } else {
                statementString += 'count' + value
            }
            if (index !== (statementArray.length - 1)) {
                statementString += '||'
            }
        });
        if (eval(statementString)){
            $this.html($this.data('text-plural'))
        } else {
            $this.html($this.data('text-single'))
        }
    })
}





/*--------------------------------SHOPIFY theme.js-----------------------------------*/

window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
    this.constructors = {};
    this.instances = [];

    $(document)
        .on('shopify:section:load', this._onSectionLoad.bind(this))
        .on('shopify:section:unload', this._onSectionUnload.bind(this))
        .on('shopify:section:select', this._onSelect.bind(this))
        .on('shopify:section:deselect', this._onDeselect.bind(this))
        .on('shopify:block:select', this._onBlockSelect.bind(this))
        .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};



theme.customerTemplates = (function() {

    function initEventListeners() {
        // Show reset password form
        $('#RecoverPassword').on('click', function(evt) {
            evt.preventDefault();
            toggleRecoverPasswordForm();
        });

        // Hide reset password form
        $('#HideRecoverPasswordLink').on('click', function(evt) {
            evt.preventDefault();
            toggleRecoverPasswordForm();
        });
    }

    /**
     *
     *  Show/Hide recover password form
     *
     */
    function toggleRecoverPasswordForm() {
        $('#RecoverPasswordForm').toggleClass('hide');
        $('#CustomerLoginForm').toggleClass('hide');
    }

    /**
     *
     *  Show reset password success message
     *
     */
    function resetPasswordSuccess() {
        var $formState = $('.reset-password-success');

        // check if reset password form was successfully submited.
        if (!$formState.length) {
            return;
        }

        // show success message
        $('#ResetSuccess').removeClass('hide');
    }

    /**
     *
     *  Show/hide customer address forms
     *
     */
    function customerAddressForm() {
        var $newAddressForm = $('#AddressNewForm');

        if (!$newAddressForm.length) {
            return;
        }

        // Initialize observers on address selectors, defined in shopify_common.js
        if (Shopify) {
            // eslint-disable-next-line no-new
            new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
                hideElement: 'AddressProvinceContainerNew'
            });
        }

        // Initialize each edit form's country/province selector
        $('.address-country-option').each(function() {
            var formId = $(this).data('form-id');
            var countrySelector = 'AddressCountry_' + formId;
            var provinceSelector = 'AddressProvince_' + formId;
            var containerSelector = 'AddressProvinceContainer_' + formId;

            // eslint-disable-next-line no-new
            new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
                hideElement: containerSelector
            });
        });



        $('.address-edit-toggle').on('click', function() {
            var formId = $(this).data('form-id');
            $('#EditAddress_' + formId).toggleClass('hide');
        });

        $('.address-delete').on('click', function() {
            var $el = $(this);
            var formId = $el.data('form-id');
            var confirmMessage = $el.data('confirm-message');

            // eslint-disable-next-line no-alert
            if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
                Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
            }
        });
    }

    /**
     *
     *  Check URL for reset password hash
     *
     */
    function checkUrlHash() {
        var hash = window.location.hash;

        // Allow deep linking to recover password form
        if (hash === '#recover') {
            toggleRecoverPasswordForm();
        }
    }

    return {
        init: function() {
            checkUrlHash();
            initEventListeners();
            resetPasswordSuccess();
            customerAddressForm();
        }
    };
})();

theme.init = function() {
    theme.customerTemplates.init();


};
$(function(){
    $(theme.init);
    $('.address-new-toggle').on('click', function() {
        $('#AddressNewForm').toggleClass('hide');
    });
    /*$('.product-card-selectbox').selectBox({
        topPositionCorrelation:0,
        keepInViewport:true
    });*/
})