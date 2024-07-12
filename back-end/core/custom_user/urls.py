from django.urls import path
from .views import *

urlpatterns = [
    path('register/', Register.as_view(), name='register'),
    path('login/', Login.as_view(), name='login'),
    path('staff/', StaffList.as_view(), name='staff_list'),
    path('office-staff/', OfficeStaffList.as_view(), name='office_staff_list'),
]