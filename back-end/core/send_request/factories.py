import factory
from .models import SMS

class SMSFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SMS
