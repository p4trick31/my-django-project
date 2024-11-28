from django.shortcuts import render, redirect,  get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Profile
from .models import Player, Participant, Event, Category
from .models import Sport, Equipment
from .forms import SportForm, EquipmentForm, ParticipantForm, EventForm
from django.http import JsonResponse
from django.db.models import Sum
from django.views.decorators.csrf import csrf_exempt
import json
from .models import BorrowRequest 
from datetime import datetime  # Correct import
from django.http import HttpResponse
import json
from uuid import uuid4


def logout_view(request):
    logout(request)
    return redirect('home')

def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('user_dashboard')
        else:
            messages.error(request, 'Invalid credentials')
    return render(request, 'login.html')

def create_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        email = request.POST['email']
        sport = request.POST.get('sport', '')
        department = request.POST.get('department', '')
        account_type = request.POST['account_type']
        gender = request.POST['gender']   # Get the account_type value

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
        else:
            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=first_name,
                last_name=last_name,
                email=email
            )
            user.profile.sport = sport
            user.profile.department = department
            user.profile.account_type = account_type 
            user.profile.gender = gender  # Save the account_type
            user.profile.save()
            messages.success(request, 'User created successfully')
            return redirect('create_user')

    # Fetch all users to display in the user list
    users = User.objects.exclude(is_staff=True)
    return render(request, 'create_user.html', {'users': users})

def edit_user(request, user_id):
    user = get_object_or_404(User, id=user_id)

    # Ensure the user has a profile, create one if it doesn't exist
    if not hasattr(user, 'profile'):
        Profile.objects.create(user=user, account_type='coach', gender='men')
    
    if request.method == 'POST':
        user.username = request.POST['username']
        user.first_name = request.POST['first_name']
        user.last_name = request.POST['last_name']
        user.email = request.POST['email']
        
        # Update profile fields
        user.profile.sport = request.POST.get('sport', '')
        user.profile.department = request.POST.get('department', '')
        user.profile.account_type = request.POST['account_type'] 
        user.profile.gender = request.POST['gender']  # Update account_type
        user.profile.save()
        user.save()
        
        messages.success(request, 'User updated successfully')
        return redirect('create_user')

    # Fetch user data to prefill the form
    return render(request, 'edit_user.html', {'user': user})

def admin_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.is_staff:  # Check if the user is an admin/staff
                login(request, user)
                return redirect('admin_dashboard')  # Redirect to the admin dashboard
            else:
                messages.error(request, 'Access denied. Only admin users can log in.')
        else:
            messages.error(request, 'Invalid username or password.')
    
    return render(request, 'admin_login.html')


@login_required
def admin_dashboard(request):
    if not request.user.is_staff:
        return redirect('admin_login')  # Redirect if a non-admin tries to access

    # Count the number of requests with status 'waiting'
    waiting_count =  BorrowRequest.objects.filter(status='waiting').count()

    return render(request, 'admin_dashboard.html', {'waiting_count': waiting_count})

@login_required
def user_dashboard(request):
    if not request.user.is_authenticated:
        return redirect('login')
    return render(request, 'dashboard.html')


@login_required
def athletics_info(request):
    user = request.user
    profile = user.profile if hasattr(user, 'profile') else None

    # Handle player data submission without forms
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        course = request.POST.get('course')
        age = request.POST.get('age')
        birthdate = request.POST.get('birthdate')
        sport = request.POST.get('sport')
        gender = request.POST.get('gender')

        # Create a new player
        Player.objects.create(
            user=user,  # Assign the logged-in user to the player
            first_name=first_name,
            last_name=last_name,
            course=course,
            age=age,
            birthdate=birthdate,
            sport=sport,
            gender=gender
        )

        # Redirect to the same page to see the newly added player
        return redirect('athletics_info')

    # Get all players for the logged-in user
    players = Player.objects.filter(user=user)

    context = {
        'user': user,
        'profile': profile,
        'players': players,
    }

    return render(request, 'athletics_info.html', context)


def edit_players(request, player_id):
    # Fetch the player object based on the provided player_id
    player = get_object_or_404(Player, id=player_id)
    user = request.user
    profile = user.profile if hasattr(user, 'profile') else None

    if request.method == 'POST':
        # Safely get form values, using current player values as defaults if not provided
        first_name = request.POST.get('first_name', player.first_name)
        last_name = request.POST.get('last_name', player.last_name)
        course = request.POST.get('course', player.course)
        age = request.POST.get('age', player.age)
        birthdate = request.POST.get('birthdate', player.birthdate)
        gender = request.POST.get('gender', player.gender)

        # Update the player fields with the new data
        player.first_name = first_name
        player.last_name = last_name
        player.course = course
        player.age = age
        player.birthdate = birthdate
        player.gender = gender  # Assuming 'gender' is a field in your Player model
        player.save()

        # Display a success message to the user
        messages.success(request, 'Player updated successfully')
        return redirect('athletics_info')  # Adjust the redirect URL as needed

    # If GET request, display the current player details in the form
    return render(request, 'edit_player_modal.html', {'player': player})



def cultural_events(request):
    events = Event.objects.all()  # Assuming Event is your model for events
    return render(request, 'cultural_events.html', {'events': events})


def inventory_equipment(request):
    # Logic for Inventory Equipment page
    return render(request, 'inventory_equipment.html')


def home(request):
    # Logic for Inventory Equipment page
    return render(request, 'home.html')


def view_participants(request, event_id, category_id):
    event = get_object_or_404(Event, id=event_id)
    category = get_object_or_404(Category, id=category_id)
    
    # Retrieve participants for the specific category
    participants = category.participants.all()
    
    return render(request, 'view_participants.html', {
        'event': event,
        'category': category,
        'participants': participants
    })


def inventory_equip(request):
    sports = Sport.objects.all()
    sport_form = SportForm()
    equipment_form = EquipmentForm()

    # Prepare data with totals
    sport_data = []
    for sport in sports:
        equipment_items = sport.equipment.all()  # Access related equipment using 'equipment'
        total_quantity = sum(item.quantity for item in equipment_items)
        sport_data.append({
            'sport': sport,
            'equipment_items': equipment_items,
            'total_quantity': total_quantity,
        })

    if request.method == "POST":
        if 'add_sport' in request.POST:
            sport_form = SportForm(request.POST)
            if sport_form.is_valid():
                sport_form.save()
                return redirect('inventory_equip')
        elif 'add_equipment' in request.POST:
            equipment_form = EquipmentForm(request.POST)
            if equipment_form.is_valid():
                equipment_form.save()
                return redirect('inventory_equip')

    return render(request, 'inventory_equip.html', {
        'sport_data': sport_data,
        'sport_form': sport_form,
        'equipment_form': equipment_form,
    })


def edit_equipment(request, equipment_id):
    if request.method == 'POST':
        equipment = Equipment.objects.get(id=equipment_id)
        equipment.name = request.POST.get('name')
        equipment.quantity = request.POST.get('quantity')
        equipment.save()
        
        # Return the updated equipment as a JSON response
        return JsonResponse({
            'success': True,
            'updated_equipment': {
                'name': equipment.name,
                'quantity': equipment.quantity
            }
        })
    return JsonResponse({'success': False, 'message': 'Invalid request'})


def  inventory_equipment(request):
    sports_data = Sport.objects.all().values('id', 'name')
    sports_with_equipment = []

    for sport in sports_data:
        equipment_items = Equipment.objects.filter(sport_id=sport['id'])
        total_quantity = equipment_items.aggregate(total=Sum('quantity'))['total'] or 0
        sports_with_equipment.append({
            'sport_id': sport['id'],
            'sport_name': sport['name'],
            'equipment_items': equipment_items,
            'total_quantity': total_quantity,
        })

    return render(request, 'inventory_equipment.html', {'sports_with_equipment': sports_with_equipment})


@csrf_exempt
def borrow_equipment(request):
    if request.method == "POST":
        try:
            # Parse the JSON request body
            data = json.loads(request.body)
            sport_id = data.get("sport_id")
            equipment_list = data.get("equipment_list", [])
            return_date = data.get('return_date')

            # Check if the user is authenticated
            user = request.user
            if not user.is_authenticated:
                return JsonResponse({"success": False, "error": "User not authenticated."})

            # Validate equipment data
            if not equipment_list:
                return JsonResponse({"success": False, "error": "No equipment selected."})

            # Get the sport name
            try:
                sport = Sport.objects.get(id=sport_id)
                sport_name = sport.name
            except Sport.DoesNotExist:
                return JsonResponse({"success": False, "error": "Sport not found."})

            for equipment in equipment_list:
                # Ensure each item has the necessary fields
                if 'equipment_id' not in equipment or 'quantity' not in equipment or equipment['quantity'] < 1:
                    return JsonResponse({"success": False, "error": "Missing or invalid equipment information."})
                
                # Ensure equipment ID is valid
                equipment_id = equipment['equipment_id']
                if not equipment_id:
                    return JsonResponse({"success": False, "error": f"Invalid equipment ID: {equipment_id}"})

                try:
                    equipment_item = Equipment.objects.get(id=equipment_id)
                except Equipment.DoesNotExist:
                    return JsonResponse({"success": False, "error": f"Equipment with ID {equipment_id} not found."})

                # Create the borrow request with a unique request_id
                BorrowRequest.objects.create(
                    user=user,
                    sport=sport,
                    equipment=equipment_item,
                    quantity=equipment['quantity'],
                    borrow_date=datetime.now(),
                    return_date=return_date,
                    request_id=str(uuid4())  # Ensure each request has a unique ID
                )

            return JsonResponse({"success": True, "message": "Equipment borrowed successfully!"})

        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            return JsonResponse({"success": False, "error": error_message})


@login_required
def equipment_borrowed(request):
    # Fetch all borrow requests by the logged-in user
    borrow_requests = BorrowRequest.objects.filter(user=request.user)
    
    # Group the borrow requests by sport
    grouped_requests = {}
    for borrow in borrow_requests:
        sport_name = borrow.sport.name if borrow.sport else 'Unknown Sport'
        if sport_name not in grouped_requests:
            grouped_requests[sport_name] = []
        grouped_requests[sport_name].append(borrow)

    # Pass the grouped borrow requests to the template
    return render(request, 'equipment_borrowed.html', {'grouped_requests': grouped_requests})



def cancel_borrow_request(request, request_id):
    borrow_request = get_object_or_404(BorrowRequest, id=request_id)
    
    if borrow_request.status == 'waiting':
        borrow_request.status = 'cancelled'  # Update the status to 'cancelled'
        borrow_request.save()
        return redirect('equipment_borrowed')  # Redirect to the page displaying borrowed equipment
    else:
        return HttpResponse('You cannot cancel this request.', status=400) 


@login_required
def admin_view_requests(request):
    # Ensure only admin can access this page
    if not request.user.is_staff:
        return HttpResponse('Unauthorized', status=403)

    # Fetch all borrow requests
    borrow_requests = BorrowRequest.objects.filter(status='waiting')


    # Group the borrow requests by sport for the admin
    grouped_requests = {}
    for borrow_request in borrow_requests:
        sport_name = borrow_request.sport.name if borrow_request.sport else 'Unknown Sport'
        if sport_name not in grouped_requests:
            grouped_requests[sport_name] = []
        grouped_requests[sport_name].append(borrow_request)

    # Pass the grouped borrow requests to the template
    return render(request, 'admin_view_requests.html', {'grouped_requests': grouped_requests})

def handle_request_status(request, request_id, action):
    try:
        # Get the BorrowRequest object
        borrow_request = BorrowRequest.objects.get(id=request_id)
        equipment = borrow_request.equipment  # Assuming 'equipment' is a ForeignKey in BorrowRequest

        # Check if the action is 'accept'
        if action == 'accept':
            if equipment.quantity >= borrow_request.quantity:
                # Decrease the equipment quantity by the number requested
                equipment.quantity -= borrow_request.quantity
                equipment.save()

                # Update the borrow request status
                borrow_request.status = 'accepted'
            else:
                return HttpResponse('Not enough equipment available', status=400)

        elif action == 'reject':
            borrow_request.status = 'rejected'
        else:
            return HttpResponse('Invalid action', status=400)

        # Save the updated borrow request
        borrow_request.save()

        # Redirect to the admin view requests page
        return redirect('admin_view_requests')

    except BorrowRequest.DoesNotExist:
        return HttpResponse('Request not found', status=404)
    except Equipment.DoesNotExist:
        return HttpResponse('Equipment not found', status=404)


def status_request(request):
    accepted_requests = BorrowRequest.objects.filter(status='accepted')
    rejected_requests = BorrowRequest.objects.filter(status='rejected')
    cancelled_requests = BorrowRequest.objects.filter(status='cancelled')

    return render(request, 'status_request.html', {
        'accepted_requests': accepted_requests,
        'rejected_requests': rejected_requests,
        'cancelled_requests': cancelled_requests,
    })

@login_required
def view_coaches(request):
    # Fetch all profiles
    profiles = Profile.objects.exclude(user__is_staff=True)


    # Create a list of user details for display
    user_details = []
    for profile in profiles:
        user = profile.user  # Access the related user
        user_details.append({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'account_type': profile.account_type,  # 'coach' or 'assistant coach'
            'sport': profile.sport if profile.sport else 'N/A',  # Sport related to profile
            'type': profile.department if profile.department else 'N/A',  # Department if available
            'user_id': user.id  # To create a link to the player's detailed view
        })
    
    return render(request, 'view_coaches.html', {'user_details': user_details})

def view_players(request, user_id):
    # Get the user based on the user_id passed in the URL
    user = get_object_or_404(User, id=user_id)
    
    # Get the profile associated with this user
    profile = get_object_or_404(Profile, user=user)
    
    # Fetch players only associated with this user
    players = Player.objects.filter(user=user)
    
    # Render the template with the list of players and profile details
    return render(request, 'player_details.html', {
        'players': players,
        'profile': profile
    })

def create_events(request):
    events = Event.objects.all()
    if request.method == 'POST':
        event_form = EventForm(request.POST)
        if event_form.is_valid():
            event_form.save()
            return redirect('create_events')
    else:
        event_form = EventForm()

    participant_form = ParticipantForm()

    return render(request, 'create_events.html', {
        'event_form': event_form,
        'participant_form': participant_form,
        'events': events,
    })


def add_participant(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    if request.method == 'POST':
        category = request.POST.get('category')
        participant_form = ParticipantForm(request.POST)
        if participant_form.is_valid():
            participant = participant_form.save(commit=False)
            participant.event = event
            participant.category = category  # Pass the category if needed
            participant.save()
            return redirect('create_events')
    return redirect('create_events')


@login_required
def add_category(request, event_id):
    if request.method == 'POST':
        category_name = request.POST.get('category_name')  # Ensure this matches your form field
        event = get_object_or_404(Event, id=event_id)
        # Correctly create a new category and associate it with the event
        Category.objects.create(name=category_name, event=event)
        return redirect('create_events')  # Redirect to the event list view or any desired page

# Change participant_id to id


def edit_participant(request, id):
    participant = get_object_or_404(Participant, id=id)
    
    if request.method == 'POST':
        form = ParticipantForm(request.POST, instance=participant)
        if form.is_valid():
            form.save()
            return redirect('create_events', event_id=participant.event.id)  # Redirect to event detail page after saving
    else:
        form = ParticipantForm(instance=participant)
    
    return render(request, 'edit_participants.html', {'form': form, 'participant': participant})




def delete_participant(request, id):
    participant = get_object_or_404(Participant, id=id)
    event_id = participant.event.id
    participant.delete()
    return redirect('crete_events', event_id=event_id)





