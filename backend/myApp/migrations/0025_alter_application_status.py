# Generated by Django 5.0.6 on 2024-11-15 06:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0024_application_picture_id_application_vehicle_register'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='status',
            field=models.CharField(default='Application Checking', max_length=50),
        ),
    ]
