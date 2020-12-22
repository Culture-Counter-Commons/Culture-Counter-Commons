function cstAddItemToCart (variant_id, quantity, shipping_interval_frequency, shipping_interval_unit_type, subscription_id) {
  data = {
    "quantity": quantity,
    "id": variant_id,
    "properties[shipping_interval_frequency]": shipping_interval_frequency, 
    "properties[shipping_interval_unit_type]": shipping_interval_unit_type,            
    "properties[subscription_id]": subscription_id
  }
  jQuery.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: data,
    dataType: 'json',
    success: function() { 
      // window.location.href = '/cart';
      alert("Success..." + "Data: \n" + data);
    }
  });
  window.location = '/checkout';
}

(function Test123 () {
  console.log('Success');
})