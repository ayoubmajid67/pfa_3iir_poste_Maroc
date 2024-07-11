import factory
from faker import Faker
from .models import Client, User
from office.factories import OfficeFactory

fake = Faker()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.LazyAttribute(lambda x: fake.email())
    password = factory.LazyAttribute(lambda x: fake.password())
    first_name = factory.LazyAttribute(lambda x: fake.first_name())
    last_name = factory.LazyAttribute(lambda x: fake.last_name())
    cin = factory.LazyAttribute(lambda x: fake.unique.random_number(digits=8))
    role = factory.LazyAttribute(lambda x: fake.random_element(elements=('admin', 'manager', 'agent')))
    status = factory.LazyAttribute(lambda x: fake.random_element(elements=('actif', 'démissionné', 'décédé', 'retraite')))
    office = factory.SubFactory(OfficeFactory)