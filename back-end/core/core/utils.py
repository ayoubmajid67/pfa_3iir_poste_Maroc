from custom_user.models import Client

# check if a client with the same cin exists, excluding the client with the given ID
def cin_exists(cin, exclude=None):
    queryset = Client.objects.filter(cin=cin)
    if exclude is not None:
        queryset = queryset.exclude(id=exclude)
    return queryset.exists()
