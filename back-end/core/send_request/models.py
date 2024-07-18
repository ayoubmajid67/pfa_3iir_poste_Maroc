from django.db import models
from product.models import Product
from custom_user.models import Client, User
from weight_range.models import Weight_range

# Create your models here.

# implementing singleton pattern (allowing only one instance of the model)
class SingletonModel(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super(SingletonModel, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
    
class SMS(SingletonModel):
    price = models.FloatField(default=0.8)

STATUS_CHOICES = [
    ('pending', 'pending'),
    ('delivered', 'delivered'),
    ('canceled', 'canceled'),
]

class SendingRequest(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    sms = models.BooleanField()
    weight = models.FloatField()
    destination = models.CharField(max_length=150)
    amount = models.FloatField()
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    range = models.ForeignKey(Weight_range, on_delete=models.SET_NULL, null=True)
    reference = models.CharField(max_length=200, unique=True) # code + sequence taken from the product
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    delivery_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Receipt(models.Model):
    date = models.DateTimeField()
    request = models.IntegerField()
    reference = models.CharField(max_length=255)
    weight = models.FloatField()
    client = models.CharField(max_length=255)
    amount = models.FloatField()
    agent = models.CharField(max_length=255)

    request = models.ForeignKey(SendingRequest, on_delete=models.CASCADE)
