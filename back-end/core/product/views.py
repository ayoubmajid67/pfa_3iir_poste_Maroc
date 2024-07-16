from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product
from .serializers import ProductSerializer
from custom_user.permissions import IsAdmin

# Create your views here.

class ProductsInfo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.all()

        return Response(ProductSerializer(products, many=True).data, status=200)
    
class ProductUpdate(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, id):
        # prevent sequence from being updated
        if "sequence" in request.data:
            del request.data["sequence"]

        product = Product.objects.get(id=id)
        serializer = ProductSerializer(product, data=request.data, partial=True)   
