# Generated by Django 5.0.6 on 2024-10-27 06:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0009_application_approved_by_application_is_approved'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='submitted_to_person2',
            field=models.BooleanField(default=False),
        ),
    ]
