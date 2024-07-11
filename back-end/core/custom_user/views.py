from rest_framework.views import APIView
from rest_framework.response import Response
from custom_user.permissions import *
from models import User, Client
from serializers import *
from office.models import Office
from office.serializers import OfficeSerializer

class StaffList(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        staff = User.objects.all()

        return Response(UserWithOfficeSerializer(staff, many=True).data, status=200)
    
class OfficeStaffList(APIView):
    permission_classes = [IsManager]

    def get(self, request, office_id):
        staff = User.objects.filter(office=office_id)

        return Response(UserWithOfficeSerializer(staff, many=True).data, status=200)