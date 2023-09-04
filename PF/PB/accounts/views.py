from rest_framework.views import APIView
from rest_framework.response import Response   
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User  
from accounts.models import Avatar, Card
from django.http import QueryDict
import re
    
class Signup(APIView):
    """Create user profile. Mandatory fields: username, password, email, first_name, last_name. Optional fields: avatar"""
    
    def verify(self, data):
        
        if data.get('username', '') == '':  
            return (False, 'Username is required')  
        elif User.objects.filter(username=data.get('username')).exists():  
            return (False, 'A user with that username already exists')  
              
        if data.get('password', '') == '':  
            return (False, 'Password is required')  
        elif len(data.get('password', '')) < 8:  
            return (False, 'This password is too short. It must contain at least 8 characters')  
        
        if data.get('first_name', '') == '':  
            return (False, 'first name is required')  
        
        if data.get('last_name', '') == '':  
            return (False, 'last name is required')
        
        if data.get('email', '') == '':
            return (False, 'email is required')
        else:
            email_check = r'^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'  
        
            if data.get('email', '') != '' and not re.match(email_check, data.get('email')):  
                return (False, "Enter a valid email address") 

        return (True, '')
        
    def post(self, request):
        
        success, msg = self.verify(request.data)
        
        if success:
            user = User.objects.create_user(  
                username=request.data.get('username'),  
                password=request.data.get('password'),   
                email=request.data.get('email'),  
                first_name=request.data.get('first_name'),  
                last_name=request.data.get('last_name')
            )
            
            if len(request.data.getlist('avatar')) > 0:
                Avatar.objects.create(user=user, avatar=request.data.getlist('avatar')[0])
                
            return Response({'success': True})
        else:
            return Response({'success': False, 'msg': msg}) 

class EditProfile(APIView):
    """Edit user profile. fields: username, password, email, first_name, last_name, avatar"""
    
    permission_classes = (IsAuthenticated,)
    
    def verify_email(self, email):
        email_check = r'^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'  
        
        if email!= '' and not re.match(email_check, email):  
            return (False, "Enter a valid email address")
        return (True, '')
        
    def post(self, request):
        
        if request.data.get('email', '') != '':
            status, msg = self.verify_email(request.data.get('email', ''))
            if status:
                request.user.email = request.data.get('email')
            else:
                return Response({'success': False, 'msg': msg})
        
        if request.data.get('first_name', '') != '':
            request.user.first_name = request.data.get('first_name')
                
        if request.data.get('last_name', '') != '':
            request.user.last_name = request.data.get('last_name')
        
        if isinstance(request.data, QueryDict) and len(request.data.getlist('avatar')) > 0:
            avatar = Avatar.objects.get(user=request.user)
            avatar.avatar = request.data.getlist('avatar')[0]
            avatar.save()
            
        request.user.save()
        
        return Response({'success': True})

class AddUpdateCard(APIView):
        """Add or update card details. Mandtory fields: number, name"""
        
        permission_classes = (IsAuthenticated,)
        
        def post(self, request):
            
            if request.data.get('number', '') == '':
                return Response({'success': False, 'msg': 'card number is required'})
            
            if request.data.get('name', '') == '':
                return Response({'success': False, 'msg': 'card name is required'})
            
            if Card.objects.filter(user=request.user).exists():
                card = Card.objects.get(user=request.user)
                card.number = request.data.get('number')
                card.name = request.data.get('name')
                card.save()
            else:
                Card.objects.create(user=request.user, number=request.data.get('number'), name=request.data.get('name'))
            
            return Response({'success': True})
        
class ping(APIView):
    """Test if the user is logged in"""
    
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        return Response('ping')

class UserInfo(APIView):
    """Get user info"""
    
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        }
        
        if Avatar.objects.filter(user=user).exists():
            data['avatar'] = Avatar.objects.get(user=user).avatar
        
        if Card.objects.filter(user=user).exists():
            card = Card.objects.get(user=user)
            data['card'] = {
                'number': card.number,
                'name': card.name
            }
        
        return Response({'success': True, 'data': data})
