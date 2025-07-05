from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
import random


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_client = models.BooleanField(default=False)
    position = models.CharField(max_length=100, null=True, blank=True) 

    def __str__(self):
        return self.user.username

class RequestForm(models.Model):
    user_name = models.CharField(max_length=100)
    email = models.EmailField()
    details = models.TextField()
    status = models.CharField(max_length=20, default='pending')  # Status can be 'pending', 'approved', etc.
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_name



class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField()
    name = models.CharField(max_length=255)
    address = models.TextField()
    contact = models.CharField(max_length=15)

    # New fields
    birthday = models.DateField(null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    vehicle_type = models.CharField(max_length=50, default='motorcycle')  # Set default value
    plate_number = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=30, blank=True)
    chassis_no = models.CharField(max_length=100, blank=True)
    model_make = models.CharField(max_length=100, blank=True)
    engine_no = models.CharField(max_length=100, blank=True)
    or_no = models.CharField(max_length=100, blank=True)
    photos = models.ImageField(upload_to='photos/', blank=True, null=True)
    picture_id = models.ImageField(upload_to='photos/', blank=True, null=True)
    photo_url = models.URLField(blank=True, null=True)
    vehicle_register = models.CharField(max_length=100, blank=True)

    # Timestamp field with default value as current time
    created_at = models.DateTimeField(default=timezone.now)
    is_approved = models.BooleanField(default=False)
    is_client2_approved = models.BooleanField(default=False)
    approved_by = models.CharField(max_length=255, null=True, blank=True)  # New field for approver's name
    status = models.CharField(max_length=50, default='Checking Application')
    payment_status = models.CharField(max_length=20, default='unpaid')  # 'unpaid', 'paid', or 'failed'
    payment_type = models.CharField(max_length=50, blank=True, null=True)  # e.g., 'paypal', 'gcash'
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # Amount paid
    app_status = models.CharField(max_length=20, default='Pending')
    is_disapproved = models.BooleanField(default=False)
    disapproved_by = models.CharField(max_length=255, blank=True, null=True)
    checked_by = models.CharField(max_length=255, null=True, blank=True) 
    position = models.CharField(max_length=50, default='Applicant')
    reference_number = models.CharField(max_length=100, null=True, blank=True)
    payment_date = models.DateTimeField(null=True, blank=True)
    payment_time = models.DateTimeField(null=True, blank=True)

    sticker_number = models.CharField(max_length=10, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.sticker_number:
            while True:
                potential_sticker_number = str(random.randint(1000, 9999))
                if not Application.objects.filter(sticker_number=potential_sticker_number).exists():
                    self.sticker_number = potential_sticker_number
                    break
        super(Application, self).save(*args, **kwargs)
    
    def save(self, *args, **kwargs):
        if hasattr(self, 'photo') and self.photo:
            # Do something with the photo field (e.g., resize, validate, etc.)
            pass
        super().save(*args, **kwargs)
    def __str__(self):
        return self.name
