# Generated by Django 5.0.6 on 2024-11-23 03:13

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0010_borrowrequest_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='borrowrequest',
            name='request_id',
            field=models.CharField(default=uuid.uuid4, max_length=255),
        ),
    ]
