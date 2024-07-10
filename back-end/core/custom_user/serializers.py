from rest_framework import serializers
from .models import User, Client


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'cin', 'first_name', 'last_name', 'email', 'role', 'status']
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