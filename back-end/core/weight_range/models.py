from django.db import models
from product.models import Product

RANGE_STATUS = [
    ('activated', 'activated'),
    ('disabled', 'disabled'),
]

# Create your models here.
class Weight_range(models.Model):
    min_weight = models.IntegerField()
    max_weight = models.IntegerField()
    status= models.CharField(max_length=10, choices=RANGE_STATUS, default='activated')
    price = models.FloatField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
