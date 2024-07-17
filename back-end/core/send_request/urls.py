from django.urls import path
from .views import *

urlpatterns = [
    path('send_request/', SendRequest.as_view(), name="send_request"),
    path('cancel_request/<int:id>/', CancelRequest.as_view(), name="cancel_request"),
    path('requests_list/', OfficeSendRequestList.as_view(), name="requests_list"),
]