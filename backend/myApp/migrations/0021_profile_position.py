# Generated by Django 5.0.6 on 2024-11-08 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0020_application_position'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='position',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
