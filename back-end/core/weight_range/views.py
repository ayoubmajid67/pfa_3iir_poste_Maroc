from rest_framework.views import APIView
from rest_framework.response import Response
from custom_user.permissions import *
from .models import Weight_range, RANGE_STATUS
from .serializers import WeightRangeSerializer
from product.models import Product

# helper function to check if a weight range is overlapping with an existing range
def range_status(min, max, current_range_id=None):
    # exclude the current range if it is being updated
    ranges = Weight_range.objects.exclude(id=current_range_id) if current_range_id else Weight_range.objects.all()

    for range in ranges :
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

            # both range limits provided
            if "min_weight" in request.data and "max_weight" in request.data:
                request.data['status'] = range_status(request.data['min_weight'], request.data['max_weight'], weight_range.id)
            
            # only min_weight provided
            elif "min_weight" in request.data:
                request.data['status'] = range_status(request.data['min_weight'], weight_range.max_weight, weight_range.id)
            
            # only max_weight provided
            elif "max_weight" in request.data:
                request.data['status'] = range_status(weight_range.min_weight, request.data['max_weight'], weight_range.id)

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
    permission_classes = [IsAdmin]

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
        
class ActiveProductWeightRanges(APIView):
    permission_classes = [IsAgent|IsManager]

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
        
class GetWeightPrice(APIView):
    permission_classes = [IsAgent]

    def get(self, request):
        try:
            price = Weight_range.objects.get(product=request.data['product_id'], min_weight__lte=request.data['weight'], max_weight__gte=request.data['weight'], status='activated').price
            return Response({"price": price}, status=200)
        except Weight_range.DoesNotExist:
            return Response({"error": "Weight range not found"}, status=404)