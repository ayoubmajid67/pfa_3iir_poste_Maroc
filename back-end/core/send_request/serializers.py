from rest_framework import serializers
from .models import *
from product.models import Product
from custom_user.models import Client, User
from product.serializers import ProductSerializer
from custom_user.serializers import ClientSerializer, UserWithOfficeSerializer, AgentSerializer

# a serializer for sending request used for creating a new sending request
class SendingRequestSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    client = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all())
    agent = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = SendingRequest
        fields = '__all__'

# a serializer for getting the full data of the sending request
class SendingRequestFullDataSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    client = ClientSerializer()
    agent = UserWithOfficeSerializer()
    
    class Meta:
        model = SendingRequest
        fields = '__all__'

# receipt serializer used for creating a new receipt record
class ReceiptSerializer(serializers.ModelSerializer):
    request = serializers.PrimaryKeyRelatedField(queryset=SendingRequest.objects.all())

    class Meta:
        model = Receipt
        fields = '__all__'

# receipt serializer with full data
class ReceiptFullDataSerializer(serializers.ModelSerializer):
    request = SendingRequestFullDataSerializer()

    class Meta:
        model = Receipt
        fields = '__all__'

# serializer for getting the amount of transactions per agent
class AgentTransactionsSerializer(serializers.ModelSerializer):
    agent = AgentSerializer()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = SendingRequest
        fields = ['agent', 'amount']