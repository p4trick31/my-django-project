from django.contrib import admin
from .models import Application

class ApplicationAdmin(admin.ModelAdmin):
    # Include all relevant fields in the list_display
    list_display = (
        'id', 
        'user',  # If you want to display the related user
        'date', 
        'name', 
        'address', 
        'contact', 
        'birthday', 
        'age', 
        'vehicle_type', 
        'plate_number', 
        'color', 
        'chassis_no', 
        'model_make', 
        'engine_no', 
        'photos', 
        'picture_id',
        'created_at', 
        'is_approved',
        'is_client2_approved',
        'approved_by', 
        'status',
        'payment_status',
        'payment_type',
        'paid_amount',
        'app_status',
        'is_disapproved',
        'disapproved_by',
        'checked_by',
        'sticker_number',
        'reference_number',
        'payment_time'

    )
    
    search_fields = ('name', 'address', 'contact')  # Fields you want to be searchable
    list_filter = ('status', 'vehicle_type')  # Fields you want to filter by

admin.site.register(Application, ApplicationAdmin)
