from django.db import models
from product.models import Product
from custom_user.models import Client, User

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

class SendingRequest(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    sms = models.BooleanField(default=False)
    weight = models.FloatField(default=0)
    destination = models.CharField(max_length=150)
    amount = models.FloatField(default=0)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    # add range fk later