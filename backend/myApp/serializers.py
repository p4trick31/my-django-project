from rest_framework import serializers
from .models import Application
from django.contrib.auth.models import User


class AppSerializer(serializers.ModelSerializer):
    photos_url = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = '__all__'

    def get_photos_url(self, obj):
        request = self.context.get('request')
        if obj.photos and request:
            return request.build_absolute_uri(obj.photos.url)
        
        return None  # or return a placeholder URL
class UserSerializer(serializers.ModelSerializer):
    app_status = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'app_status', 'position', 'is_staff', 'first_name', 'last_name']  # Added 'email'

    def get_app_status(self, obj):
        application = Application.objects.filter(user=obj).first()
        return application.app_status if application else 'N/A'

    def get_position(self, obj):
        application = Application.objects.filter(user=obj).first()
        return application.position if application else 'N/A' 


