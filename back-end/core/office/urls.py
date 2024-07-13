from django.urls import path
from .views import *

urlpatterns = [
    path('office/', OfficeView.as_view(), name='office'), # create a new office
    path('office/<int:id>/', OfficeView.as_view(), name='office'), # update an office
    path('offices/', OfficeList.as_view(), name='offices'),
    path('office-info/', OwnOffice.as_view(), name='office-info')
]