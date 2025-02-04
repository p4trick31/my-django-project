# Generated by Django 5.0.6 on 2024-11-23 00:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0008_borrowrequest'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='borrowrequest',
            name='equipment_id',
        ),
        migrations.RemoveField(
            model_name='borrowrequest',
            name='equipment_name',
        ),
        migrations.RemoveField(
            model_name='borrowrequest',
            name='sport_id',
        ),
        migrations.AddField(
            model_name='borrowrequest',
            name='equipment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='myapp.equipment'),
        ),
        migrations.AddField(
            model_name='borrowrequest',
            name='sport',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='myapp.sport'),
        ),
    ]
