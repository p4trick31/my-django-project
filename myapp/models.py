from django.db import models
from django.contrib.auth.models import User
import uuid



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    sport = models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    account_type = models.CharField(
        max_length=20, 
        choices=[('coach', 'Coach'), ('assistant coach', 'Assistant Coach')], 
        default='other'
    )
    gender = models.CharField(
        max_length=10,
        choices=[
            ('men', 'Men'),
            ('women', 'Women')
        ],
        blank=True,
        null=True
    )

# Signal to create/update profile automatically
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        # Assign the default account type as 'Coach'
        Profile.objects.create(user=instance, account_type='coach', gender='men')
    else:
        # Save/update profile when User data changes
        if hasattr(instance, 'profile'):
            instance.profile.save()

class Player(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    course = models.CharField(max_length=100)
    age = models.IntegerField()
    birthdate = models.DateField()
    sport = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=[('men', 'Men'), ('women', 'Women')])

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Sport(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Equipment(models.Model):
    sport = models.ForeignKey(Sport, related_name='equipment', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} - {self.quantity} items"


class BorrowRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE, null=True, blank=True)  # Linking sport
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, null=True, blank=True)  # Allowing null and blank
    quantity = models.IntegerField()
    borrow_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateField()
    status = models.CharField(max_length=20, choices=[('waiting', 'Waiting'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='waiting')
    request_id = models.CharField(max_length=255, unique=True, default=uuid.uuid4)



    def __str__(self):
        if self.equipment:  # Check if equipment is not None
            return f"{self.user.username} borrowed {self.equipment.name}"
        else:
            return f"{self.user.username} borrowed no equipment" 



class Event(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    
class Category(models.Model):
    name = models.CharField(max_length=100)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='categories', default=1)  # Set default Event ID

    def __str__(self):
        return self.name

class Participant(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participants')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    course = models.CharField(max_length=100)
    category_name = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='participants')

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.event.name}"
