from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Profile  # Import the Profile model
from .models import Application
from .serializers import AppSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer
from rest_framework.views import APIView
from django.utils import timezone
import random


import logging

logger = logging.getLogger(__name__)

stored_request = {}





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    if not request.user.is_staff:
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    # Only admins can access this view
    users = User.objects.all()
    user_data = [{"id": user.id, "username": user.username} for user in users]
    return Response(user_data, status=status.HTTP_200_OK)



@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    print(f"User authenticated: {user}, is_staff: {user.is_staff if user else 'N/A'}")

    if user is not None and user.is_staff:  # Check if user is an admin
        refresh = RefreshToken.for_user(user)
        return Response({'token': str(refresh.access_token)}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials or not an admin.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def login_view(request):
    """
    Handles user login. Authenticates the user and returns a JWT token if successful.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    # Authenticate the user
    user = authenticate(username=username, password=password)

    if user is not None:
        # Check if user is a client
        if hasattr(user, 'profile') and user.profile.is_client:
            return Response({"error": "Client accounts cannot log in here."}, status=status.HTTP_403_FORBIDDEN)

        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "message": "Login successful"
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def signup_view(request):
    logger.info("Signup request data: %s", request.data)
    """
    Handles user signup. Validates the input and creates a new user if valid.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

   

    try:
        # Create a new user
        user = User.objects.create_user(username=username, password=password, email=email)
        user.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    except ValidationError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def login_client(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        # Check if user is a client
        if not hasattr(user, 'profile') or not user.profile.is_client:
            return Response({"error": "This account is not a client account."}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            "message": "Client login successful"
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials or not a client"}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this endpoint
def add_client(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)

    # Create a profile for the user and set is_client to True
    Profile.objects.create(user=user, is_client=True)  # Ensure is_client is set to True

    return Response({"message": "Client added successfully"}, status=status.HTTP_201_CREATED)

    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def create_application(request):
    try:
        if request.method == 'GET':
            applications = Application.objects.filter(user=request.user, status='Checking Application')
            serializer = AppSerializer(applications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            serializer = AppSerializer(data=request.data)
            if serializer.is_valid():
                application = serializer.save(user=request.user)
                return Response({'id': application.id}, status=status.HTTP_201_CREATED)
            else:
                print('Validation Errors:', serializer.errors)
                raise ValidationError(serializer.errors)
    except Exception as e:
        print('Error:', str(e))
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['GET'])
def get_applications(request):
    applications = Application.objects.all()
    serializer = AppSerializer(applications, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_application_detail(request, id):
    try:
        application = Application.objects.get(id=id)
        serializer = AppSerializer(application)
        return Response(serializer.data)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def approve_application(request, pk):
    try:
        # Fetch the application using primary key (pk)
        application = Application.objects.get(pk=pk)

        # Check if the user is a staff member
        if not request.user:
            return Response({'error': 'You are not authorized to approve applications.'}, status=status.HTTP_403_FORBIDDEN)

        if request.method == 'GET':
            # Return the approval status in the GET response
            approval_status = {
                'id': application.id,
                'is_approved': application.is_approved,
                'checked_by': application.checked_by,
                'user_name': application.user.username,
                'client_name': f"{application.user.first_name} {application.user.last_name}"
            }
            return Response(approval_status, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            # Ensure 'checked_by' reflects the staff member who is approving the application
            client_name = f"{request.user.first_name} {request.user.last_name}"
            # Mark the application as approved and set the person who approved it
            application.is_approved = True
            application.checked_by = client_name  # Default to staff member's name
            application.save()

            # Return the updated approval status in the POST response
            return Response({
                'id': application.id,
                'is_approved': application.is_approved,
                'checked_by': application.checked_by,
                'client_name': client_name
            }, status=status.HTTP_200_OK)
    
    except Application.DoesNotExist:
        # Handle case when application does not exist
        return Response({'error': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        # Handle any other unexpected errors
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def disapprove_application(request, pk):
    try:
        application = Application.objects.get(pk=pk)

        if request.method == 'GET':
            approval_status = {
                'id': application.id,
                'is_disapproved': application.is_disapproved,
                'disapproved_by': application.disapproved_by,
                'user_name': application.user.username,
                'client_name': f"{application.user.first_name} {application.user.last_name}"
            }
            return Response(approval_status, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            # Assuming client_name is the name of the user disapproving the application
            client_name = f"{request.user.first_name} {request.user.last_name}"
            application.is_disapproved = True
            application.disapproved_by = client_name
            application.app_status = 'Disapproved'
            application.status = 'Disapproved'
            application.payment_status = 'reject'
            application.save()

            return Response({
                'id': application.id,
                'is_disapproved': application.is_disapproved,
                'disapproved_by': application.disapproved_by,
                'client_name': client_name,
                'app_status': application.app_status,
                'status': application.status,
                'payment_status' : application.payment_status
            }, status=status.HTTP_200_OK)

    except Application.DoesNotExist:
        return Response({'error': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def client2_approve_application(request, pk):
    try:
        application = Application.objects.get(pk=pk)
        if not request.user:
            return Response({'error': 'You are not authorized to approve applications.'}, status=status.HTTP_403_FORBIDDEN)


        if request.method == 'GET':
            approval_status = {
                'id': application.id,
                'is_client2_approved': application.is_client2_approved,
                'approved_by': application.approved_by,
                'user_name': application.user.username,
                'client_name': f"{application.user.first_name} {application.user.last_name}"
            }
            return Response(approval_status, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            client_name = f"{request.user.first_name} {request.user.last_name}"
            # Mark the application as approved and set the person who approved it
            application.is_client2_approved = True
            application.approved_by = client_name
            application.save()

            return Response({
                'id': application.id,
                'is_client2_approved': application.is_client2_approved,
                'approved_by': application.approved_by,
                'client_name': client_name
                
                
            }, status=status.HTTP_200_OK)  # Return the updated approval status
    except Application.DoesNotExist:
        return Response({'error': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_to_person2(request, application_id):
    try:
        # Find the application by ID
        application = Application.objects.get(id=application_id, user=request.user)
        
        # Update the application's status to mark it as submitted
        if application.status != 'Checking Application':
            return Response({'error': 'Application can only be submitted if it is in pending status.'},status=status.HTTP_400_BAD_REQUEST)

            # Update application status to indicate it’s been submitted to Person 2
        application.status = 'Waiting Approval'
        application.save()
        
        # Optionally, you can serialize the updated application data to send back
        serializer = AppSerializer(application)
        return Response({
            'message': 'Application successfully submitted to Person 2.',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Application.DoesNotExist:
        return Response({
            'error': 'Application not found.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def proceed_to_payment(request, pk):
    try:
        # Find the application by ID
        application = Application.objects.get(pk=pk)
        
        # Update the application's status to mark it as submitted

            # Update application status to indicate it’s been submitted to Person 2
        application.status = 'Proceed to Payment'
        application.save()
        
        # Optionally, you can serialize the updated application data to send back
        serializer = AppSerializer(application)
        return Response({
            'message': 'Application Proceed.',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Application.DoesNotExist:
        return Response({
            'error': 'Application not found.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_submitted_applications(request):
    print(f"Authenticated User: {request.user}")  # Log the current user
    applications = Application.objects.all()
    
    print(f"Applications Found: {applications}")  # Log the query result
    if not applications:
        print("No applications found.")  # Log if no applications match the filter

    serializer = AppSerializer(applications, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_submitted(request):
    applications = Application.objects.filter(user = request.user, status = 'Waiting Approval')
    serializer = AppSerializer(applications, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_application_by_id(request, application_id):
    try:
        application = get_object_or_404(Application, id=application_id, user=request.user)
        serializer = AppSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def process_payment(request, application_id):
    try:
        # Retrieve the application object
        application = get_object_or_404(Application, id=application_id)

        # Get payment method, amount, reference number, date, and time from request data
        payment_method = request.data.get('payment_method')
        amount = request.data.get('amount')
        reference_number = request.data.get('reference_number')
        payment_date = request.data.get('date')
        payment_time = request.data.get('time')

        if not (payment_method and amount and reference_number and payment_date and payment_time):
            return Response({"error": "Missing payment details"}, status=status.HTTP_400_BAD_REQUEST)

        # Combine payment date and time into a single naive datetime object
        payment_datetime_naive = timezone.datetime.strptime(f"{payment_date} {payment_time}", '%Y-%m-%d %H:%M')

        # Convert naive datetime to aware datetime
        

        # Update application with payment details
        application.payment_type = payment_method
        application.paid_amount = amount
        application.reference_number = reference_number
        application.payment_date = payment_datetime_naive # Save the aware payment date  # Save the time part separately if needed
        application.save()

        # Return response with reference number and payment date
        return Response({
            "message": "Payment successful",
            "reference_number": application.reference_number,
            "payment_date": application.payment_date.strftime('%Y-%m-%d %H:%M:%S')  # Return formatted payment date
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def accept_application(request, application_id):
    try:
        # Fetch the application by ID
        application = Application.objects.get(id=application_id)

        # Mark the payment status as accepted
        application.payment_status = 'paid'
        application.status = 'Payment Done'
        application.app_status = 'Done'
        application.accepted_at = timezone.now()  # You can add an `accepted_at` field if needed.
        application.save()

        return Response({'message': 'Payment accepted successfully.'}, status=status.HTTP_200_OK)

    except Application.DoesNotExist:
        return Response({'error': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def reject_application(request, application_id):
    try:
        # Fetch the application by ID
        application = Application.objects.get(id=application_id)

        # Mark the payment status as rejected
        application.payment_status = 'unpaid'
        application.status = 'Proceed to Payment'
        application.rejected_at = timezone.now()  # You can add a `rejected_at` field if needed.
        application.save()

        return Response({'message': 'Payment rejected successfully.'}, status=status.HTTP_200_OK)

    except Application.DoesNotExist:
        return Response({'error': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_pending_application(request):
    # Filter for pending applications by the logged-in user
    has_pending = Application.objects.filter(user=request.user, app_status='Pending', status= 'Disapproved' ).exists()

    return Response({'pending': has_pending})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_done_application(request, application_id):
     try:
        # Fetch application by ID and ensure the status is 'Payment Done'
        application = Application.objects.get(id=application_id, status='Payment Done')

        # Get the admin name from the logged-in user
        admin_name = request.user.get_full_name() or request.user.username

        data = {
            "applicationNo": application.id,  # Assuming `id` serves as the application number
            "name": application.name,
            "amountPaid": application.paid_amount,
            "orNoDate": application.or_no,
            "stickerNo": application.sticker_number,
            "adminName": admin_name,
        }
        serializer = AppSerializer(application)
        data.update(serializer.data)  # Add serialized data to the response
        
        return Response(data)
    
     except Application.DoesNotExist:
        return Response({'error': 'Application not found or status not done.'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def client2_approved(request):
    get_application = Application.objects.filter(is_client2_approved=True, user=request.user)
    serializer = AppSerializer(get_application, many=True)
    approved_ids = [app['id'] for app in serializer.data]  # Extract only IDs
    print("Approved Application IDs:", approved_ids)  # Print for debugging
    return Response({"approved_ids": approved_ids})

class GetUsers(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_id(request):
    try:
        # Get applications for the authenticated user
        applications = Application.objects.filter(user=request.user)  # Filter applications by user
        app_data = [
            {
                'id': app.id,
                'status': app.status,
                # Include other fields as needed
            }
            for app in applications
        ]
        return Response(app_data, status=200)
    except Exception as e:
        return Response({'error': 'Failed to retrieve applications'}, status=500)



