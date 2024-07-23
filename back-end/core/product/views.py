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
        try:
            # prevent sequence from being updated manually
            if "sequence" in request.data:
                del request.data["sequence"]

            product = Product.objects.get(id=id)
            if product is None:
                return Response({"error": "Product not found"}, status=404)
            
            serializer = ProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Product updated successfully", "product": serializer.data}, status=200)
            return Response({"error": serializer.errors}, status=400)
             
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)
        

