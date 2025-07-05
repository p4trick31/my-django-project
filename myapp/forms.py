from django import forms
from .models import Sport, Equipment,  Participant, Event


class SportForm(forms.ModelForm):
    class Meta:
        model = Sport
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter sport name'}),
        }

class EquipmentForm(forms.ModelForm):
    class Meta:
        model = Equipment
        fields = ['sport', 'name', 'quantity']
        widgets = {
            'sport': forms.Select(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter equipment name'}),
            'quantity': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Enter quantity'}),
        }

class ParticipantForm(forms.ModelForm):
  
    class Meta:
        model = Participant
        fields = ['first_name', 'last_name', 'course', 'category_name']


class EventForm(forms.ModelForm):
  

    class Meta:
        model = Event
        fields = ['name', 'date', 'description']  # Remove 'category'
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
        }
