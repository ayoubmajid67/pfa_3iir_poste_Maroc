from django_use_email_as_username.models import BaseUser, BaseUserManager
from django.db import models 

# abstract class (not created in the database and used as a base classe)
class Person(models.Model):
    cin = models.CharField(max_length=20 ,unique=True)
    first_name = models.CharField(max_length=25)
    last_name = models.CharField(max_length=25)
    
    class Meta:
        abstract = True

# the user class represents the staff interacting with the system
class User(BaseUser, Person):
    ROLES = [
        ('admin', 'admin'),
        ('manager', 'manager'),
        ('agent', 'agent'),
    ]

    STATUS = [
        ('actif', 'actif'),
        ('démissionné', 'démissionné'),
        ('décédé', 'décédé'),
        ('retraite', 'retraite'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLES, default='agent')
    status = models.CharField(max_length=20, choices=STATUS, default='actif')

    objects = BaseUserManager()


class Client(Person):
    phone_number = models.CharField(max_length=12)
