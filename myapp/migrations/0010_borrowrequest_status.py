# Generated by Django 5.0.6 on 2024-11-23 01:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0009_remove_borrowrequest_equipment_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='borrowrequest',
            name='status',
            field=models.CharField(choices=[('waiting', 'Waiting'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='waiting', max_length=20),
        ),
    ]
