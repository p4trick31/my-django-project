from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import create_application, get_applications, login_view, signup_view, login_client, approve_application, user_view
from .views import admin_login, add_client, submit_to_person2, get_submitted_applications, client2_approve_application
from .views import get_application_by_id, process_payment, check_pending_application, disapprove_application, get_done_application
from .views import client2_approved, get_submitted, GetUsers, get_application_detail, get_user_id, proceed_to_payment, accept_application, reject_application

urlpatterns = [
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('loginClient/', login_client, name='loginClient'),
    path('users/', user_view, name='user_list'),
    path('admin/login/', admin_login, name='admin_login'),
    path('add-client/', add_client, name='add-client'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Application-related paths
    
    path('get-application-id/', get_user_id, name='get_user_id'),
    path('application/', create_application, name='create_application'),   # For creating an application (POST request)
    path('applications/', get_applications, name='get_applications'),  # For fetching all applications (GET request)
    path('applications/<int:id>/', get_application_detail, name='application-detail'),
    path('application/<int:application_id>/',get_application_by_id, name='get_application_by_id'),
    path('application/<int:pk>/approve/', approve_application, name='approve_application'),
    path('application/<int:pk>/disapprove/', disapprove_application, name='disapprove_application'),
    path('application/get_submitted/<int:pk>/client2_approve/', client2_approve_application, name='client2_approve_application'),
    path('application/get_submitted/', get_submitted, name='get_submitted'),
    path('application/submit_to_person2/<int:application_id>/', submit_to_person2, name='submit_to_person2'),
    path('application/submitted/', get_submitted_applications, name='get_submitted_applications'),
    path('payment/process/<int:application_id>/',process_payment, name='process_payment'),
    path('application/pending/', check_pending_application, name='check_pending_application'),
    path('application/client2_approved/', client2_approved, name='client2_approved'),
    path('application/<int:pk>/proceed-to-payment/', proceed_to_payment, name='proceed_to_payment'),
    path('application/get_done_application/<int:application_id>/', get_done_application, name='get_done_application'),
    path('get-users/', GetUsers.as_view(), name='get_users'),
    path('applications/<int:application_id>/accept/', accept_application, name='accept-application'),
    path('applications/<int:application_id>/reject/', reject_application, name='reject-application'),
]



