# Generated by Django 5.0.6 on 2024-10-18 05:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0003_application'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='application',
            name='age',
        ),
        migrations.RemoveField(
            model_name='application',
            name='birthday',
        ),
        migrations.RemoveField(
            model_name='application',
            name='chassis_no',
        ),
        migrations.RemoveField(
            model_name='application',
            name='color',
        ),
        migrations.RemoveField(
            model_name='application',
            name='engine_no',
        ),
        migrations.RemoveField(
            model_name='application',
            name='model_make',
        ),
        migrations.RemoveField(
            model_name='application',
            name='or_no',
        ),
        migrations.RemoveField(
            model_name='application',
            name='plate_number',
        ),
        migrations.RemoveField(
            model_name='application',
            name='reg_no',
        ),
        migrations.RemoveField(
            model_name='application',
            name='vehicle_type',
        ),
    ]
