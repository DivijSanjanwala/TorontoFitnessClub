from django.db import models
from django.contrib.auth.models import User

class Avatar(models.Model):
    """
    user: user object from django's User model
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars', blank=True, null=True)
    
class Card(models.Model):
    """
    user, name, number
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    number = models.CharField(max_length=100)
