from django.urls import path
from .views import *

urlpatterns = [
    path('office/', OfficeView.as_view(), name='office'),
    path('offices/', OfficeList.as_view(), name='offices'),
]