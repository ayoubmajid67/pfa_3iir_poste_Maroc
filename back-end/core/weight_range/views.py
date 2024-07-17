from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from custom_user.permissions import *
from .models import Weight_range, RANGE_STATUS
from .serializers import WeightRangeSerializer
from product.models import Product

# helper function to check if a weight range is overlapping with an existing range
def range_status(min, max):
    for range in Weight_range.objects.all():
        # check of the range interval is overlapping with an existing range
        # there are 4 cases to consider:
        c1 = min >= range.min_weight and max <= range.max_weight # 1. the new range is inside the existing range
        c2 = min <= range.min_weight and max >= range.min_weight and max <= range.max_weight # 2. the new range is overlapping with the left side of the existing range
        c3 = max >= range.max_weight and min >= range.min_weight and min <= range.max_weight # 3. the new range is overlapping with the right side of the existing range
        c4 = min <= range.min_weight and max >= range.max_weight # 4. the new range is covering the existing range

        if c1 or c2 or c3 or c4:
            return 'disabled'
    return 'activated'

# Create your views here.
class WeightRangeView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        weight_ranges = Weight_range.objects.all()
        serializer = WeightRangeSerializer(weight_ranges, many=True)
        return Response(serializer.data)

    def post(self, request):
        
        request.data['status'] = range_status(request.data['min_weight'], request.data['max_weight'])
        
        serializer = WeightRangeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def patch(self, request, *args, **kwargs):
        id = kwargs.get('id')
        if not id:
            return Response({"error": "Weight range id is required"}, status=400)
        try:
            weight_range = Weight_range.objects.get(id=id)
            serializer = WeightRangeSerializer(weight_range, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Weight_range.DoesNotExist:
            return Response({"error": "Weight range does not exist"}, status=404)
    
class ActiveWeightRangeList(APIView):
    permission_classes = [IsAgent|IsManager]

    def get(self, request):
        weight_ranges = Weight_range.objects.filter(status='activated')
        serializer = WeightRangeSerializer(weight_ranges, many=True)
        return Response(serializer.data)
    
class ProductWeightRanges(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        id = kwargs.get('id')
        if not id:
            return Response({"error": "Product id is required"}, status=400)
        try:
            weight_ranges = Weight_range.objects.filter(product=id, status='activated')
            serializer = WeightRangeSerializer(weight_ranges, many=True)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({"error": "Product does not exist"}, status=404)
        
class GetPrice(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        
        try:
            weight_range = Weight_range.objects.get(id=request.data['weight_range_id'])
            return Response({"price": weight_range.price})
        except Weight_range.DoesNotExist:
            return Response({"error": "Weight range does not exist"}, status=404)