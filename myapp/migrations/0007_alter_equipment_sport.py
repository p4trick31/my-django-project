# Generated by Django 5.0.6 on 2024-11-22 14:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0006_sport_equipment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='equipment',
            name='sport',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='equipment', to='myapp.sport'),
        ),
    ]
