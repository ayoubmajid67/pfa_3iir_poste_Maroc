from django.urls import path
from .views import *

urlpatterns = [
    path('send_request/', SendRequest.as_view(), name="send_request"),
    path('cancel_request/<int:id>/', CancelRequest.as_view(), name="cancel_request"),
    path('requests_list/', OfficeSendRequestList.as_view(), name="requests_list"),
    path('receipt_print/<int:id>/', PrintReceipt.as_view(), name="receipt_print"),
    path('transactions/', GetOwnTransactions.as_view(), name="transactions"),
    path('transactions/<int:id>/', GetAgentTransactions.as_view(), name="agent_transactions"),
    path('transactions-dashboard/', GetFullTransactions.as_view(), name="transactions-dashboard"),
]