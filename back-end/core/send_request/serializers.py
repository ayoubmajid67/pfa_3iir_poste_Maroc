from rest_framework import serializers
from .models import SendingRequest
from product.models import Product
from custom_user.models import Client, User
from product.serializers import ProductSerializer
from custom_user.serializers import ClientSerializer, UserSerializer

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
    agent = UserSerializer()
    
    class Meta:
        model = SendingRequest
        fields = '__all__'
