from rest_framework.permissions import BasePermission, IsAuthenticated

class IsAdmin(BasePermission):
    def has_permission(self, request, view):

        # check if the user is authenticated
        if not IsAuthenticated().has_permission(request, view):
            return False
            
        return request.user.role == 'admin'
    
class IsManager(BasePermission):
    def has_permission(self, request, view):
        if not IsAuthenticated().has_permission(request, view):
            return False
        
        return request.user.role == 'manager'

class IsAgent(BasePermission):
    def has_permission(self, request, view):
        if not IsAuthenticated().has_permission(request, view):
            return False
        
        return request.user.role == 'agent'