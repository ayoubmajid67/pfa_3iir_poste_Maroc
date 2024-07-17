# Generated by Django 5.0.7 on 2024-07-17 18:31

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('send_request', '0003_sendingrequest_range'),
    ]

    operations = [
        migrations.AddField(
            model_name='sendingrequest',
            name='reference',
            field=models.CharField(default=datetime.datetime(2024, 7, 17, 18, 31, 17, 445352, tzinfo=datetime.timezone.utc), max_length=200, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='sendingrequest',
            name='amount',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='sendingrequest',
            name='sms',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='sendingrequest',
            name='weight',
            field=models.FloatField(),
        ),
    ]
