from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from custom_user.permissions import *
from .models import SendingRequest
from .serializers import SendingRequestSerializer
from custom_user.models import Client, User
from product.models import Product
from custom_user.serializers import ClientSerializer
from weight_range.models import Weight_range
from .models import SMS

# helper function to get the sms fee
def sms_fee():
    return SMS.load().price

# helper function to insert a record in the database
def insert_record(client, request):
    try:
        product = Product.objects.get(id=request.data["product"])
        user = User.objects.get(id=request.user.id)
        range = Weight_range.objects.get(id=request.data["range"])

        amount = request.data["amount"]
        if request.data["sms"]:
            amount += sms_fee()

        reference = product.code + str(product.sequence)
        # update the sequence of the product
        product.sequence += 1
        product.save()

        
        record = {
            "client": client,
            "product": product.id,
            "agent": user.id,
            "range": range.id,
            "amount": amount,
            "sms": request.data["sms"],
            "weight": request.data["weight"],
            "destination": request.data["destination"],
            "reference": reference,
        }

        serializer = SendingRequestSerializer(data=record)
                
        if serializer.is_valid():
            serializer.save()
            
            return Response({"message": "Request stored successfully", "request": serializer.data}, status=201)
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
        client = Client.objects.get(cin=request.data["cin"])
        if client is None:
            # create the client
            data = {
                "cin": request.data["cin"],
                "first_name": request.data["first_name"],
                "last_name": request.data["last_name"],
                "phone_number": request.data["phone_number"],
            }

            record = ClientSerializer(data=data)
            if record.is_valid():
                record.save()
                insert_record(record.id, request)
            else:
                return Response({"error": record.errors}, status=400)
        else:
            insert_record(client.id, request)