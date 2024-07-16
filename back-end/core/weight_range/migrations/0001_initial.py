# Generated by Django 5.0.7 on 2024-07-16 11:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('product', '0002_alter_product_sequence'),
    ]

    operations = [
        migrations.CreateModel(
            name='Weight_range',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('min_weight', models.IntegerField()),
                ('max_weight', models.IntegerField()),
                ('status', models.CharField(choices=[('activated', 'activated'), ('disabled', 'disabled')], default='activated', max_length=10)),
                ('price', models.FloatField()),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.product')),
            ],
        ),
    ]