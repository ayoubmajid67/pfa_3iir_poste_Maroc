from rest_framework import serializers
from .models import User, Client
from office.models import Office
from office.serializers import OfficeSerializer

class UserSerializer(serializers.ModelSerializer):

    office = serializers.PrimaryKeyRelatedField(queryset=Office.objects.all())
    class Meta:
        model = User
        fields = ['id', 'cin', 'first_name', 'last_name', 'email', 'password', 'role', 'status', 'office']
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # when creating a user, the password must be hashed
        password = validated_data.pop('password')

        user = User(**validated_data)
        if password is not None:
            user.set_password(password) # BaseUser method used to hash the password
        user.save()
        return user
    
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

# a serializer for getting user info with the details of the office
class UserWithOfficeSerializer(serializers.ModelSerializer):
    
    office = OfficeSerializer()  
    
    class Meta:
        model = User
        fields = ['id', 'cin', 'first_name', 'last_name', 'email', 'role', 'status', 'office']
        extra_kwargs = {"password": {"write_only": True}}