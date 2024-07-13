from rest_framework.permissions import BasePermission, IsAuthenticated

# helper function to check if the user has the required role and status
def role_and_status_check(user, role):
    return user.role == role and user.status == 'actif'

class IsAdmin(BasePermission):
    def has_permission(self, request, view):

        # check if the user is authenticated
        if not IsAuthenticated().has_permission(request, view):
            return False
            
        return role_and_status_check(request.user, 'admin')
    
class IsManager(BasePermission):
    def has_permission(self, request, view):
        if not IsAuthenticated().has_permission(request, view):
            return False
        
        return role_and_status_check(request.user, 'manager')

class IsAgent(BasePermission):
    def has_permission(self, request, view):
        if not IsAuthenticated().has_permission(request, view):
            return False
        
        return role_and_status_check(request.user, 'agent')