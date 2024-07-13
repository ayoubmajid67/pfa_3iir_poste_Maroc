from django.db import models

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