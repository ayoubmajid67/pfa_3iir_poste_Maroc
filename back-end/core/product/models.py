from django.db import models

# Create your models here.
class Product(models.Model):
    code=models.CharField(max_length=5, unique=True)
    name=models.CharField(max_length=50)
    prefix=models.CharField(max_length=5, unique=True)
    sequence=models.IntegerField(null=False)

    def __str__(self):
        return self.name