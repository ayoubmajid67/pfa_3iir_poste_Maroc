from django.urls import path
from .views import *

urlpatterns = [
    path('products/', ProductsInfo.as_view(), name='products'),
    path('product/<int:id>/', ProductUpdate.as_view(), name='product'),
]