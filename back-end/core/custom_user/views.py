from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from custom_user.permissions import *
from .models import User, Client
from .serializers import *
from office.models import Office
from office.serializers import OfficeSerializer

class Register(APIView):
    permission_classes = [IsAdmin]
    def post(self, request):
        try:
            office = Office.objects.get(id=request.data["office"])
            if office is not None:
                # not working
                # record = {
                #     **request.data,
                #     "office": office.id,
                # }

                record = {
                    "cin": request.data["cin"],
                    "first_name": request.data["first_name"],
                    "last_name": request.data["last_name"],
                    "email": request.data["email"],
                    "password": request.data["password"],
                    "role": request.data["role"],
                    "status": request.data["status"],
                    "office": office.id,
                }
                
                serializer = UserSerializer(data=record)
                
                if serializer.is_valid():
                    serializer.save()                   
                
                    return Response({"message": "User registered successfully", "user": serializer.data}, status=201)
                return Response({"error": serializer.errors}, status=400)
            else:
                return Response({"error": "Office does not exist"}, status=404)
        except Office.DoesNotExist:
            return Response({"error": "Office does not exist"}, status=404)

class Login(APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = User.objects.filter(email=email).first()

        if user is None:
            return Response({"message": "User not found"}, status=404)
        else:
            if user.check_password(password):

                # generate an access token
                token = RefreshToken.for_user(user)
                return Response({
                    "user": UserSerializer(user).data,
                    "token": str(token.access_token)
                }, status=200)
            
            else:
                return Response({'message': 'Invalid credentials'}, status=401)

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