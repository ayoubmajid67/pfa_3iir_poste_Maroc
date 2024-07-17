from django.db import models

# Create your models here.
class Product(models.Model):
    code = models.CharField(max_length=5, unique=True)
    name = models.CharField(max_length=50)
    prefix = models.CharField(max_length=5, unique=True)
    sequence = models.IntegerField(default=1, null=False)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk: # while creating a new record
            last_product = Product.objects.filter(prefix=self.prefix).order_by('sequence').last()
            if last_product:
                self.sequence = last_product.sequence + 1
        else:
            original = Product.objects.get(pk=self.pk)
            if original.prefix != self.prefix:
                self.sequence = 1  # when prefix is updated, the sequence resets to 1
        super(Product, self).save(*args, **kwargs)