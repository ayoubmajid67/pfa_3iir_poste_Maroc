from rest_framework.views import APIView
from rest_framework.response import Response
from custom_user.permissions import *
from .models import SendingRequest, SMS, Receipt
from .serializers import *
from custom_user.models import Client, User
from product.models import Product
from custom_user.serializers import ClientSerializer
from weight_range.models import Weight_range
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum

# helper function to get the sms fee
def sms_fee():
    return SMS.load().price

def create_request(client, request):
    try:
        product = Product.objects.get(id=request.data["product"])
        user = User.objects.get(id=request.user.id)
        range = Weight_range.objects.get(id=request.data["range"])

        amount = request.data["amount"]
        if request.data["sms"] == True:
            amount += sms_fee()

        reference = product.code + str(product.sequence)

        # update the sequence of the product
        product.sequence += 1
        product.save()

        request_record = {
            "client": client.id,
            "product": product.id,
            "agent": user.id,
            "range": range.id,
            "amount": amount,
            "sms": request.data["sms"],
            "weight": request.data["weight"],
            "destination": request.data["destination"],
            "reference": reference,
        }

        serializer = SendingRequestSerializer(data=request_record)
                
        if serializer.is_valid():
            request_info = serializer.save()

            # get agent info
            agent_info = User.objects.filter(id=user.id).first()

            receipt_data = {
                "date": request_info.created_at,
                "request": request_info.id,
                "reference": request_info.reference,
                "weight": request_info.weight,
                "client": client.first_name + " " + client.last_name,
                "amount": request_info.amount,
                "agent": agent_info.first_name + " " + agent_info.last_name,
            }
            serializer = ReceiptSerializer(data=receipt_data)
            if serializer.is_valid():
                receipt_info = serializer.save()
                return Response({
                    "message": "Request stored successfully, you can print the receipt",
                    "receipt": ReceiptFullDataSerializer(receipt_info).data
                }, status=201)
            
        return Response({"error": serializer.errors}, status=400)
    
    except Product.DoesNotExist:
        return Response({"error": "Product does not exist"}, status=404)
    except User.DoesNotExist:
        return Response({"error": "User does not exist"}, status=404)
    except Weight_range.DoesNotExist:
        return Response({"error": "Weight range does not exist"}, status=404)
    

class SendRequest(APIView):
    permission_classes = [IsAgent]
    
    def post(self, request):
        try:
            client = Client.objects.get(cin=request.data["cin"])
            return create_request(client, request)
        except Client.DoesNotExist:
            # create the client
            data = {
                "cin": request.data["cin"],
                "first_name": request.data["first_name"],
                "last_name": request.data["last_name"],
                "phone_number": request.data["phone_number"],
            }

            record = ClientSerializer(data=data)
            if record.is_valid():
                client_info = record.save()
                return create_request(client_info, request)
            else:
                return Response({"error": record.errors}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class CancelRequest(APIView):
    permission_classes = [IsManager]
    def patch(self, request, id):
        try:
            record = SendingRequest.objects.get(id=id)
            # check the request creation time before canceling it
            if record.created_at < timezone.now() - timedelta(hours=12):
                return Response({"error": "You can't cancel the request"}, status=400)
            
            record.status = "canceled"
            record.save()
            return Response({
                "message": "Request cancelled",
                "request": SendingRequestSerializer(record).data
            }, status=200)
        
        except SendingRequest.DoesNotExist:
            return Response({"error": "Request does not exist"}, status=404)
        
class OfficeSendRequestList(APIView):
    permission_classes = [IsAgent|IsManager]
    def get(self, request):
        office_id = request.user.office
        data = SendingRequest.objects.filter(agent__office=office_id)

        serializer = SendingRequestSerializer(data, many=True)
        return Response(serializer.data, status=200)
    
class PrintReceipt(APIView):
    permission_classes = [IsAgent|IsManager]
    def get(self, request, id):
        try:
            request_data = SendingRequest.objects.filter(id=id).first()
            if request_data is None:
                return Response({"error": "Request does not exist"}, status=404)
            receipt = Receipt.objects.filter(request=request_data.id).first()

            return Response(ReceiptFullDataSerializer(receipt).data, status=200)

        except Receipt.DoesNotExist:
            return Response({"error": "Receipt does not exist"}, status=404)
        
class GetOwnTransactions(APIView):
    permission_classes = [IsAgent]
    def get(self, request):

        # get the transactions of the agent that are not canceled and created today
        data = SendingRequest.objects.filter(agent=request.user.id, created_at__date=timezone.now().date()).exclude(status="canceled")

        serializer = SendingRequestSerializer(data, many=True)
        return Response(serializer.data, status=200)
    
class GetAgentTransactions(APIView):
    permission_classes = [IsManager]
    def get(self, request, id):
        try:
            data = SendingRequest.objects.filter(agent=id, created_at__date=timezone.now().date()).exclude(status="canceled")
            if not len(data):
                return Response({"message": "Agent has no transactions"}, status=404)
            serializer = SendingRequestSerializer(data, many=True)
            return Response(serializer.data, status=200)
        except User.DoesNotExist:
            return Response({"error": "Agent does not exist"}, status=404)

class GetFullTransactions(APIView):
    permission_classes = [IsManager]
    def get(self, request):
        
        # sum the amount of transactions per agent
        transactions = SendingRequest.objects.filter(
            created_at__date= timezone.now().date()
        ).exclude(status="canceled").values(
            "agent__id",
            "agent__first_name",
            "agent__last_name",
        ).annotate( # annotate is used to perform the aggregation
            total_amount=Sum("amount")
        )
        
        transactions_list = []
        for transaction in transactions:
            transactions_list.append({
                "agent": {
                    "id": transaction["agent__id"],
                    "first_name": transaction["agent__first_name"],
                    "last_name": transaction["agent__last_name"],
                },
                "amount": transaction["total_amount"]
            })

        serializer = AgentTransactionsSerializer(transactions_list, many=True)
        return Response(serializer.data, status=200)