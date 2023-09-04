from django.db import models
from django.contrib.auth.models import User
from studios.models import Studio

class SubscriptionPlan(models.Model):
    """
    name, price, duration, and description
    """

    SUBSCRIPTION_CHOICES = (
        ('one_time', 'One-time Flat Payment'),
        ('recurring', 'Recurring Payment'),
    )
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=4, decimal_places=2)
    duration = models.DurationField()
    description = models.CharField(max_length=200)
    subscription_type = models.CharField(max_length=200, \
        choices=SUBSCRIPTION_CHOICES)
    
class Subscription(models.Model):
    """
    user, plan, start date, and end date
    """
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    payment_time = models.DateField()
    card_name = models.CharField(max_length=200)
    card_number = models.CharField(max_length=200)
