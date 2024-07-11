from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from custom_user.permissions import *
from models import Office
from serializers import OfficeSerializer

# Create your views here.
class OfficeList(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        offices = Office.objects.all()

        return Response(OfficeSerializer(offices, many=True).data, status=200)