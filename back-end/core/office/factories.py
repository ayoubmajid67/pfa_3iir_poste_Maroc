import factory
from faker import Faker
from .models import Office

fake = Faker()

class OfficeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Office

    name = fake.company()
    address = fake.address()
    city = fake.city()