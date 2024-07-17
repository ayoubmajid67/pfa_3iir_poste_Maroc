from rest_framework import serializers
from .models import Weight_range
from product.serializers import ProductSerializer
from product.models import Product

class WeightRangeSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    class Meta:
        model = Weight_range
        fields = '__all__'
