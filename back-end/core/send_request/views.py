from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from custom_user.permissions import *
from .models import SendingRequest
from .serializers import RequestSerializer
from custom_user.models import Client, User
from product.models import Product
from custom_user.serializers import ClientSerializer
from weight_range.models import Weight_range

# helper function to insert a record in the database
def insert_record(client, request):
    client = Client.objects.get(cin=request.data["cin"])
    product = Product.objects.get(id=request.data["product"])
    user = User.objects.get(id=request.user.id)
    range = Weight_range.objects.get(id=request.data["range"])
    
    record = {
        "client": client.id,
        "product": product.id,
        "agent": user.id,
        "sms": request.data["sms"],
        "weight": request.data["weight"],
        "destination": request.data["destination"],
        "amount": request.data["amount"],
        "range": range.id,
    }

    serializer = RequestSerializer(data=record)
            
    if serializer.is_valid():
        serializer.save()
        
        return Response({"message": "Request sent successfully", "request": serializer.data}, status=201)
    return Response({"error": serializer.errors}, status=400)

class SendRequest(APIView):
    permission_classes = [IsAgent]
    
    def post(self, request):
        try:
            insert_record(Client.objects.get(cin=request.data["cin"]), request)
        except Product.DoesNotExist:
            return Response({"error": "Product does not exist"}, status=404)
        except Client.DoesNotExist:
            # create the client
            record = {
                "cin": request.data["cin"],
                "first_name": request.data["first_name"],
                "last_name": request.data["last_name"],
                "phone_number": request.data["phone_number"],
            }

            serializer = ClientSerializer(data=record)

            if serializer.is_valid():
                serializer.save()
                insert_record(Client.objects.get(cin=request.data["cin"]), request)
            else:
                return Response({"error": serializer.errors}, status=400)
        except Weight_range.DoesNotExist:
            return Response({"error": "Weight range does not exist"}, status=404)