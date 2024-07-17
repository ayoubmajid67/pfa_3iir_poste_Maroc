from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Office
from .serializers import OfficeSerializer
from custom_user.permissions import *

# Create your views here.
class OfficeView(APIView):
    permission_classes = [IsAdmin]

    # create a new office
    def post(self, request):
        serializer = OfficeSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response({"message": "Office created successfully", "office": serializer.data}, status=201)
        return Response({"error": serializer.errors}, status=400)

    # update an office
    def patch(self, request, id):
        office = Office.objects.get(id=id)
        serializer = OfficeSerializer(office, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response({"message": "Office updated successfully", "office": serializer.data}, status=200)
        return Response({"error": serializer.errors}, status=400)

class OfficeList(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        offices = Office.objects.all()

        return Response(OfficeSerializer(offices, many=True).data, status=200)

# get the office information of the logged in staff member 
class OwnOffice(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            office = Office.objects.filter(id=request.user.office.id).first()
            return Response(OfficeSerializer(office).data, status=200)
        except Office.DoesNotExist:
            return Response({"error": "Office not found"}, status=404)