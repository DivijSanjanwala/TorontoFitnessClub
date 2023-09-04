from django.db import models 
# from django.contrib.gis.geos import Point 
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator 

from datetime import datetime, timedelta

class Studio(models.Model):
    """
    name, address, geographical location, postal code, phone number, and a set of images.
    """
    name = models.CharField(max_length= 200)
    address = models.CharField(max_length= 200)
    longitude = models.FloatField()
    latitude = models.FloatField()    
    postal_code = models.CharField(max_length= 200)
    phone_number = models.CharField(max_length=200)
    user_distance = models.FloatField(default=0.0)

class StudioAmenities(models.Model):
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE)
    type = models.CharField(max_length= 200)
    quantity = models.IntegerField()   


class StudioImages(models.Model):
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='__directory-name__', blank=True, null=True)

    
class Class(models.Model):
    """
    name, description, coach, a list of keywords (e.g., upper-body, core, etc.), capacity, and times
    """
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE)
    name = models.CharField(max_length= 200)
    description = models.TextField()
    coach = models.CharField(max_length=200)
    capacity = models.IntegerField()
    start_time = models.DateTimeField(default=datetime.now, blank=True)
    end_time = models.DateTimeField(default=datetime.now, blank=True)
    period = models.IntegerField(default = 7, validators=[MinValueValidator(0)])
    keywords = models.TextField(default='')
    
    def save(self, *args, **kwargs):
        super(Class, self).save(*args, **kwargs)
        
        if self.period == 0:
            ClassInstance.objects.create(classobj = self, time=self.start_time, current_capacity=0)
        else:
            curr_time = self.start_time
            
            while self.end_time >= curr_time:
                ClassInstance.objects.create(classobj = self, time=curr_time, current_capacity=0)
                curr_time += timedelta(days=self.period)
        
        super(Class, self).save(*args, **kwargs)
    
class ClassInstance(models.Model):
    classobj = models.ForeignKey(Class, on_delete=models.CASCADE)
    time = models.DateTimeField()
    current_capacity = models.IntegerField()

class UsersEnrolled(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    classinstance = models.ForeignKey(ClassInstance, on_delete=models.CASCADE)