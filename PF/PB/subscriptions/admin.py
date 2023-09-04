from django.contrib import admin

# Register your models here.
from subscriptions.models import SubscriptionPlan, Subscription

admin.site.register(SubscriptionPlan)
admin.site.register(Subscription)

