from django.urls import path
from .views import *

urlpatterns = [
    path('weight-ranges/', WeightRangeView.as_view(), name='products'), # POST, GET
    path('weight-ranges/<int:id>/', WeightRangeView.as_view(), name='product'), # PATCH
    path('active-weight-ranges/', ActiveWeightRangeList.as_view(), name='active_weight_ranges'),
    path('product-weight-ranges/<int:id>/', AllProductWeightRanges.as_view(), name='product_weight_ranges'),
    path('active-product-weight-ranges/<int:id>/', ActiveProductWeightRanges.as_view(), name='active_product_weight_ranges'),
    path('range-price/', GetWeightPrice.as_view(), name='range_price')
]