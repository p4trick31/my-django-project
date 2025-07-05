from django.urls import path
from .views import home, create_user, user_login, user_dashboard, admin_dashboard, admin_login, edit_user,  athletics_info, cultural_events, inventory_equipment
from .views import equipment_borrowed, edit_players, inventory_equip, edit_equipment, borrow_equipment, cancel_borrow_request, admin_view_requests, handle_request_status
from .views import status_request, view_coaches, view_players,logout_view, create_events, add_participant, add_category, edit_participant, delete_participant, view_participants
urlpatterns = [
    path('', home, name='home'), 
    path('logout/', logout_view, name='logout'),
    path('admin_dashboard/', admin_dashboard, name='admin_dashboard'),
    path('admin_create-user/', create_user, name='create_user'),
    path('login/', user_login, name='login'),
    path('dashboard/', user_dashboard, name='user_dashboard'),
    path('admin-login/', admin_login, name='admin_login'),
    path('edit_user/<int:user_id>/', edit_user, name='edit_user'),
    path('edit_players/<int:player_id>/', edit_players, name='edit_players'),
    path('athletics/', athletics_info, name='athletics_info'),
    path('events/', cultural_events, name='cultural_events'),
    path('inventory/', inventory_equipment, name='inventory_equipment'),
    path('borrowed/', equipment_borrowed, name='equipment_borrowed'),
    path('inventory_equip/', inventory_equip, name='inventory_equip'),
    path('edit_equipment/<int:equipment_id>/', edit_equipment, name='edit_equipment'),
    path('borrow-equipment/', borrow_equipment, name='borrow_equipment'),
    path('cancel-request/<int:request_id>/', cancel_borrow_request, name='cancel_borrow_request'),
    path('admin_requests/', admin_view_requests, name='admin_view_requests'),
    path('admin_requests/<int:request_id>/<str:action>/',handle_request_status, name='handle_request_status'),
    path('status_request/', status_request, name='status_request'),
    path('view_coaches/', view_coaches, name='view_coaches'),  # Page to view all users
    path('players/<int:user_id>/', view_players, name='view_players'),
    path('create_events/', create_events, name='create_events'),
    path('add_category/<int:event_id>/', add_category, name='add_category'),
    path('edit_participant/<int:id>/', edit_participant, name='edit_participant'),
    path('delete_participant/<int:id>/', delete_participant, name='delete_participant'),
    path('add-participant/<int:event_id>/', add_participant, name='add_participant'),
    path('event/<int:event_id>/category/<int:category_id>/participants/', view_participants, name='view_participants'),

]
