from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from custom_user.permissions import *
from .models import User, Client, STAFF_ROLES, STAFF_STATUS
from .serializers import *
from office.models import Office
from office.serializers import OfficeSerializer
from core.throttling import CustomAnonRateThrottle
from django.contrib.auth import authenticate
from core.utils import cin_exists

# create a new staff member
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
    throttle_classes = [CustomAnonRateThrottle]  # Limit the number of login requests to 3 every 30 minutes

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        # authenticate built-in function checks if the user exists and the password is correct
        user = authenticate(request, username=email, password=password)

        if not user or user.status != 'actif':
            return Response({"message": "Invalid credentials"}, status=401)

        # generate an access token
        token = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "token": str(token.access_token)
        }, status=200)

class StaffList(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        staff = User.objects.all()

        return Response(UserWithOfficeSerializer(staff, many=True).data, status=200)
    
class OfficeStaffList(APIView):
    permission_classes = [IsManager]

    def get(self, request):
        office_id = request.user.office

        # get all the staff members of the office except the office manager
        staff = User.objects.filter(office=office_id).exclude(role='manager')

        return Response(UserWithOfficeSerializer(staff, many=True).data, status=200)
    
class UpdateStaff(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, id):
        try:
            staff = User.objects.get(id=id)

            # check the uniqueness of the CIN value given
            if "cin" in request.data:
                # .exclude(id=id) is used to exclude the current user from the search
                if User.objects.filter(cin=request.data["cin"]).exclude(id=id).exists():
                    return Response({"error": "CIN already used by another user"}, status=400)
                
            # check the uniqueness of the email value given
            if "email" in request.data:
                if User.objects.filter(email=request.data["email"]).exclude(id=id).exists():
                    return Response({"error": "Email already used by another user"}, status=400)
                
            # check the validity of the role value given
            if "role" in request.data:
                # extract the role values from the STAFF_ROLES list
                valid_roles = [role[0] for role in STAFF_ROLES]
                if request.data["role"] not in valid_roles:
                    print(request.data["role"])
                    return Response({"error": "Invalid role choice"}, status=400)

            # check the validity of the status value given
            if "status" in request.data:
                valid_status = [status[0] for status in STAFF_STATUS]
                if request.data["status"] not in valid_status:
                    return Response({"error": "Invalid status choice"}, status=400)

            # check the existence of the office given
            if "office" in request.data:
                office = Office.objects.get(id=request.data["office"])
                if office is not None:
                    request.data["office"] = office.id

            if "password" in request.data:
                staff.set_password(request.data["password"])
                staff.save()
                return Response({"message": "Password updated successfully"}, status=200)
            
            serializer = UserSerializer(staff, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        
        except Office.DoesNotExist:
            return Response({"error": "Office not found"}, status=404)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

class ClientInfo(APIView):
    permission_classes = [IsAgent]

    # check if a client exists by their cin
    def post(self, request, *args, **kwargs):
        if cin_exists(request.data["cin"]):
            return Response(ClientSerializer(Client.objects.get(cin=request.data["cin"])).data, status=200)
        else:
            return Response({"message": "Client not found"}, status=404)
    
    # update a client's information
    def patch(self, request, *args, **kwargs):
        id = kwargs.get('id')
        if not id:
            return Response({"error": "no id given in the request"}, status=400)
        try:
            client = Client.objects.get(id=id)

            if "cin" in request.data and cin_exists(request.data["cin"], exclude=client.id):
                return Response({"error": "cin already registered"}, status=400)
            
            serializer = ClientSerializer(client, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            
            return Response(serializer.errors, status=400)
        
        except Client.DoesNotExist:
            return Response({"error": "Client not found"}, status=404)
