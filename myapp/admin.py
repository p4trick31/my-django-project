from django.contrib import admin
from .models import Profile, Player
from .models import Sport, Equipment
from .models import BorrowRequest
from .models import Event, Participant, Category

# Customize the Profile admin interface
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'sport', 'department', 'account_type', 'gender')
    search_fields = ('user__username', 'sport', 'department')
    list_filter = ('account_type', 'gender')

# Customize the Player admin interface
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name', 'course', 'age', 'birthdate', 'sport', 'gender')
    search_fields = ('user__username', 'first_name', 'last_name', 'sport')
    list_filter = ('sport', 'gender')


# Register the Sport model
class SportAdmin(admin.ModelAdmin):
    list_display = ('name',)  # Display sport name in the list view

# Register the Equipment model
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'sport', 'quantity')  # Display equipment name, sport, and quantity
    list_filter = ('sport',)  # Add filter by sport to the list view
    search_fields = ('name', 'sport__name')  # Allow searching by equipment name and sport name


# Create a custom admin class (optional, if you want to customize the display)
class BorrowRequestAdmin(admin.ModelAdmin):
    list_display = ('request_id', 'user', 'sport', 'equipment', 'quantity', 'borrow_date', 'return_date', 'status')
    list_filter = ('user', 'sport_id')  # Optional: Add filters to the list page
    search_fields = ('user__username', 'equipment_name')  # Optional: Add search fields
    


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'description')
    search_fields = ('name', 'description')
    list_filter = ('date',)
    ordering = ('date',)


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'course', 'category_name', 'event')
    search_fields = ('first_name', 'last_name', 'course', 'category_name__name', 'event__name')
    list_filter = ('category_name', 'event')
    ordering = ('last_name', 'first_name')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'event') 


# Register models with custom admin views
admin.site.register(Sport, SportAdmin)
admin.site.register(Equipment, EquipmentAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Player, PlayerAdmin)
admin.site.register(BorrowRequest, BorrowRequestAdmin)
