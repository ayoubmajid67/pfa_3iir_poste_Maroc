# Generated by Django 5.0.7 on 2024-07-17 00:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0002_alter_product_sequence'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='sequence',
            field=models.IntegerField(default=1),
        ),
    ]
