# Generated by Django 5.0.6 on 2024-11-10 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0022_application_photo_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='app_status',
            field=models.CharField(default='Pending', max_length=20),
        ),
    ]
