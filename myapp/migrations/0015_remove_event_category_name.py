# Generated by Django 5.0.6 on 2024-11-27 01:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0014_remove_event_category_event_category_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='category_name',
        ),
    ]
