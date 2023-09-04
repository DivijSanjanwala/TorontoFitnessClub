from django.db.models import F
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from studios.models import  Studio, StudioImages, StudioAmenities, Class, ClassInstance, UsersEnrolled
from subscriptions.models import Subscription
from django.core.files.images import ImageFile

from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404

from datetime import datetime
from django.utils import timezone

class GetClosestView(APIView):
    """Return studios in the order of closest to user"""
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        
        user_longitude, user_latitude = 0.0, 0.0
        
        try:
            user_longitude = float(kwargs.get('longitude'))
            user_latitude = float(kwargs.get('latitude'))
        except:
            return Response({'success': False, 'msg': 'longitude and latitude must be numbers'})
        
        Studio.objects.all().update(user_distance = ((F('longitude') - user_longitude) ** 2 + (F('latitude') - user_latitude) ** 2) * 0.5)
        studioObjects =  Studio.objects.all().order_by('user_distance')

        listView = []
        for studioObj in studioObjects:
            new_object = {
                'id': studioObj.id,
                'name': studioObj.name,
                'address': studioObj.address,
                'longitude': studioObj.longitude,
                'latitude': studioObj.latitude,
                'postal_code': studioObj.postal_code,
                'phone_number': studioObj.phone_number
            }
            listView.append(new_object)

        return Response({'success': True, 'data': listView})


class GetStudioDetails(APIView):
    """Get the details of a studio. Required fields: studio id"""
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        
        studio_id = kwargs.get('id', '')
        
        try:
            studio_id = int(studio_id)
        except:
            return Response({'success': False, 'msg': 'id must be a number'})
        
        studio_object = get_object_or_404(Studio, id=studio_id)

        new_object = {
            'name': studio_object.name,
            'address': studio_object.address,
            'longitude': studio_object.longitude,
            'latitude': studio_object.latitude,
            'postal_code': studio_object.postal_code,
            'phone_number': studio_object.phone_number,
            'images': [image.image.url for image in StudioImages.objects.filter(studio = studio_object)],
        }

        return Response({'success':True, 'data': new_object})

class GetStudioImages(APIView):
    """Get the images of a studio. Required fields: studio id"""
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        
        studio_id = kwargs.get('id', '')
        
        try:
            studio_id = int(studio_id)
        except:
            return Response({'success': False, 'msg': 'id must be a number'})
        
        studio_object = get_object_or_404(Studio, id=studio_id)

        new_object = {
            'images': [image.image.url for image in StudioImages.objects.filter(studio = studio_object)],
        }

        return Response({'success':True, 'data': new_object})

class StudioSearchandFiltering(APIView):
    """Search for studios by name, type, class, coach (provided as query parameters)"""

    def get(self, request, *args, **kwargs):
        
        studio_name = request.GET.get('name', None)
        studio_amenity = request.GET.get('type', None)
        studio_class = request.GET.get('class', None)
        studio_coach = request.GET.get('coach', None)

        all_studios = Studio.objects.all()
        all_studios = all_studios.filter(name = studio_name) if studio_name else all_studios
    
        all_studios =  all_studios.filter(studioamenities__type = studio_amenity) if studio_amenity else all_studios
        all_studios = all_studios.filter(class__name = studio_class) if studio_class else all_studios
        all_studios = all_studios.filter(class__coach = studio_coach) if studio_coach else all_studios
        
        listView = []
        
        for studioObj in all_studios:
            new_object = {
                'id': studioObj.id,
                'name': studioObj.name,
                'address': studioObj.address,
                'longitude': studioObj.longitude,
                'latitude': studioObj.latitude,
                'postal_code': studioObj.postal_code,
                'phone_number': studioObj.phone_number
            }
            listView.append(new_object)

        return Response({'success': True, 'data': listView})

class StudioClosestSearchAndFilter(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        
        user_longitude, user_latitude = 0.0, 0.0
        
        try:
            user_longitude = float(kwargs.get('longitude'))
            user_latitude = float(kwargs.get('latitude'))
        except:
            return Response({'success': False, 'msg': 'longitude and latitude must be numbers'})
        
        studio_name = request.GET.get('name', None)
        studio_amenity = request.GET.get('type', None)
        studio_class = request.GET.get('class', None)
        studio_coach = request.GET.get('coach', None)
        
        Studio.objects.all().update(user_distance = ((F('longitude') - user_longitude) ** 2 + (F('latitude') - user_latitude) ** 2) * 0.5)
        
        all_studios =  Studio.objects.all()
        
        all_studios = all_studios.filter(name = studio_name) if studio_name else all_studios
    
        all_studios =  all_studios.filter(studioamenities__type = studio_amenity) if studio_amenity else all_studios
        all_studios = all_studios.filter(class__name = studio_class) if studio_class else all_studios
        all_studios = all_studios.filter(class__coach = studio_coach) if studio_coach else all_studios
        
        all_studios =  all_studios.order_by('user_distance')
        
        listview = []
        
        for studioObj in all_studios:
            new_object = {
                'id': studioObj.id,
                'name': studioObj.name,
                'address': studioObj.address,
                'longitude': studioObj.longitude,
                'latitude': studioObj.latitude,
                'postal_code': studioObj.postal_code,
                'phone_number': studioObj.phone_number
            }
            listview.append(new_object)
        
        page = request.GET.get('page')
        paginator = Paginator(listview, 5)

        return Response({'num_pages': paginator.num_pages , 'prev': paginator.page(page).has_previous(), \
            'next': paginator.page(page).has_next(), 'data': paginator.page(page).object_list})
        
        
class StudioClassesScehdule(APIView):
    """Get the classes schedule of a studio. Required studio id"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs): 
        
        listView = []
        studio_id = kwargs.get('id', '')
        
        try:
            studio_id = int(studio_id)
        except:
            return Response({'success': False, 'msg': 'id must be a number'})
        
        studio_object = get_object_or_404(Studio, id = studio_id)
        
        class_objects = Class.objects.filter(studio = studio_object)
            
        for classObj in class_objects:
                instances = ClassInstance.objects.filter(classobj = classObj)
                
                for instance in instances:
                    if timezone.make_naive(instance.time) >= datetime.now():
                        
                        listView.append({
                        'class_name': classObj.name,
                        'class_coach': classObj.coach,
                        'datetime': instance.time,
                        'discrption': classObj.description,
                        'capacity': classObj.capacity,
                        'currently_enrolled': instance.current_capacity,
                        'keywords': classObj.keywords
                        })
        
        listView = sorted(listView, key=lambda d: timezone.make_naive(d['datetime']) - datetime.now()) 
        return Response({'success': True, 'data': listView})

class EnrollClassInstance(APIView):
    """Enroll a user in a class session. Required fields: class instance id"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs): 
        
        class_id = kwargs.get('id', '')
        
        try:
            class_id = int(class_id)
        except:
            return Response({'success': False, 'msg': 'id must be a number'})
        
        class_object = get_object_or_404(ClassInstance, id = class_id)
        
        if Subscription.objects.filter(user = request.user, studio = class_object.classobj.studio).exists():
            if not UsersEnrolled.objects.filter(user = request.user, classinstance = class_object).exists():
                if class_object.current_capacity < class_object.classobj.capacity:
                    if timezone.make_naive(class_object.time)  > datetime.now():
                        
                        class_object.current_capacity = class_object.current_capacity + 1
                        UsersEnrolled.objects.create(user = request.user, classinstance = class_object)
                        class_object.save()
                        return Response({'success': True, 'msg': 'Enrolled'})
                    else:
                        return Response({'success': False, 'msg': 'Class has already started'})
                else:
                    return Response({'success': False ,'msg': 'Class is full'})
            else:
                return Response({'success': False, 'msg': 'You are enrolled in this class'})
        else:
            return Response({'success': False, 'msg': 'You are not subscribed to this studio'}) 
    
    
class EnrollClass(APIView):
    """Enroll a user in a class. Required fields: class id"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs): 
        
        class_id = kwargs.get('id', '')
        
        try:
            class_id = int(class_id)
        except:
            return Response({'success': False, 'msg': 'id must be a number'})
        
        class_object = get_object_or_404(Class, id = class_id)
        
        instances = ClassInstance.objects.filter(classobj = class_object)
        
        if Subscription.objects.filter(user = request.user, studio = class_object.studio).exists():
            
            enrolled_classes = 0
            total_classes = 0
            
            for instance in instances:
                total_classes = total_classes + 1
                
                if not UsersEnrolled.objects.filter(user = request.user, classinstance = instance).exists():
                    if instance.current_capacity < instance.classobj.capacity:
                        if timezone.make_naive(instance.time) >= datetime.now():
                            
                            enrolled_classes = enrolled_classes + 1
                            instance.current_capacity = instance.current_capacity + 1
                            UsersEnrolled.objects.create(user = request.user, classinstance = instance)
                            instance.save()

            return Response({'success': True, 'total enrolled': enrolled_classes, 'total classes': total_classes})
        else:
            return Response({'success': False, 'msg': 'You are not subscribed to this studio'})  
        

class DropClassInstance(APIView):
    """Drop a user from a class session. Required fields: class instance id"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs): 
        
        class_id = kwargs.get('id', '')
        
        try:
            class_id = int(class_id)
        except:
            return Response({'success': False, 'msg': 'id must be a number'})
        
        class_object = get_object_or_404(ClassInstance, id = class_id)
        
        if Subscription.objects.filter(user = request.user, studio = class_object.classobj.studio).exists():
            if UsersEnrolled.objects.filter(user = request.user, classinstance = class_object).exists():
                UsersEnrolled.objects.filter(user = request.user, classinstance = class_object).delete()
                class_object.current_capacity = class_object.current_capacity - 1
                class_object.save()
                return Response({'success': True, 'msg': 'Dropped'})
            else:
                return Response({'success': False, 'msg': 'You are not enrolled in this class'})
        else:
            return Response({'success': False, 'msg': 'You are not subscribed to this studio'})


class DropClass(APIView):
    """Drop a user from a class. Required fields: class id"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs): 
        
        class_id = kwargs.get('id', '')
        
        try:
            class_id = int(class_id)
        except:
            return Response({'success': False, 'msg': 'id must be a number'})
        
        class_object = get_object_or_404(Class, id = class_id)
        
        total_dropped = 0
        total_iterated = 0
        
        if Subscription.objects.filter(user = request.user, studio = class_object.studio).exists():
            instances = ClassInstance.objects.filter(classobj = class_object)
            
            for instance in instances:
                
                total_iterated += 1
                
                if UsersEnrolled.objects.filter(user = request.user, classinstance = instance).exists():
                    total_dropped += 1
                    
                    UsersEnrolled.objects.filter(user = request.user, classinstance = instance).delete()
                    instance.current_capacity = instance.current_capacity - 1
                    instance.save()
                
            return Response({'success': True, 'total dropped': total_dropped, 'total classes': total_iterated})
        else:
            return Response({'success': False, 'msg': 'You are not subscribed to the studio'})
        
class UserSchedule(APIView):
    """Return the schedule of a user."""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        
        listView = []
        enrolled_classes = UsersEnrolled.objects.filter(user = request.user)
        
        for enrolled_class in enrolled_classes:
            
            listView.append({
                'id': enrolled_class.classinstance.id,
                'name': enrolled_class.classinstance.classobj.name,
                'coach': enrolled_class.classinstance.classobj.coach,
                'datetime': enrolled_class.classinstance.time,
                'discrption': enrolled_class.classinstance.classobj.description,
                'capacity': enrolled_class.classinstance.classobj.capacity,
                'currently_enrolled': enrolled_class.classinstance.current_capacity,
                'keywords': enrolled_class.classinstance.classobj.keywords
            })
            
        listView = sorted(listView, key=lambda d: timezone.make_naive(d['datetime'])) 
        paginator = Paginator(listView, 10)
        page = request.GET.get('page')
            
        return Response({'num_pages': paginator.num_pages , 'prev': paginator.page(page).has_previous(), \
            'next': paginator.page(page).has_next(), 'data': paginator.page(page).object_list})
        

class SearchClasses(APIView):
    """Search for classes using name of the studio, class name, coach name, date, or range. Required fields: studio id"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        
        studio_id = request.GET.get('studio', '')
        
        try:
            studio_id = int(studio_id)
        except:
            return Response({'success': False, 'msg': 'id must be a number'})
        
        studio = get_object_or_404(Studio, id = studio_id)
        
        name = request.GET.get('name', None)
        coach = request.GET.get('coach', None)
        date =  request.GET.get('date', None)
        after = request.GET.get('after', None)
        before = request.GET.get('before', None)
        
        listview = []
        classes_listview = []
        
        classes = Class.objects.filter(studio = studio)
        classes = classes.filter(name = name) if name else classes
        classes = classes.filter(coach = coach) if coach else classes
        
        for classobj in classes:
            
            instances = ClassInstance.objects.filter(classobj = classobj)
            
            try:
                instances = ClassInstance.objects.filter(time = datetime.strptime(date, '%Y-%m-%dT%H:%M:%S')) if date else instances
                instances = instances.filter(time__gte = datetime.strptime(after, '%Y-%m-%dT%H:%M:%S')) if after else instances
                instances = instances.filter(time__lte = datetime.strptime(before, '%Y-%m-%dT%H:%M:%S')) if before else instances
            except ValueError:
                return Response({'success': False, 'msg': 'Invalid date format'})
            
            instances = instances.order_by('time')
            
            enrolled_instances = 0
            total_instances = 0
            
            page = request.GET.get('page')
            sessions = request.GET.get('sessions')
            
            classid = request.GET.get('class', None)
                
            for instance in instances:
                
                enrolled = UsersEnrolled.objects.filter(classinstance = instance, user = request.user).exists()
                
                if timezone.make_naive(instance.time) >= datetime.now():
                    if not classid or classid == str(classobj.id):
                        listview.append({
                            'id': instance.id,
                            'class_id': classobj.id,
                            'name': classobj.name,
                            'coach': classobj.coach,
                            'datetime': instance.time,
                            'discrption': classobj.description,
                            'capacity': classobj.capacity,
                            'currently_enrolled': instance.current_capacity,
                            'keywords': classobj.keywords,
                            'enrolled': enrolled
                        })
                    
                        total_instances += 1 
                        enrolled_instances += 1 if enrolled else 0

            if total_instances != 0:
                if total_instances == enrolled_instances:
                    classes_listview.append({
                        'id': classobj.id,
                        'name': classobj.name,
                        'coach': classobj.coach,
                        'capacity': classobj.capacity,
                        'keywords': classobj.keywords,
                        'enrolled': True 
                    })
                else:
                    classes_listview.append({
                        'id': classobj.id,
                        'name': classobj.name,
                        'coach': classobj.coach,
                        'capacity': classobj.capacity,
                        'keywords': classobj.keywords,
                        'enrolled': False
                    })
        
        if sessions == 'true':
            paginator = Paginator(listview, 10)
            return Response({'num_pages': paginator.num_pages , 'prev': paginator.page(page).has_previous(), \
                'next': paginator.page(page).has_next(), 'data': paginator.page(page).object_list})
        else:
            paginator = Paginator(classes_listview, 10)
            return Response({'num_pages': paginator.num_pages , 'prev': paginator.page(page).has_previous(), \
                'next': paginator.page(page).has_next(), 'data': paginator.page(page).object_list})
        
        
        
        
        
        
        
        
      

        

