from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView
from subscriptions.views import GetSubscriptionDetails, \
    GetSubscriptionPlanDetails, AddSubscription, \
        CancelSubscription, EditSubscriptions, \
            GetPaymentHistory, GetAllSubscriptionDetails, \
            hasSubscription
            
        
app_name = 'subscriptions'

urlpatterns = [
    path('<int:subscription_id>/', GetSubscriptionDetails.as_view()),
    path('subscriptionplans/', GetSubscriptionPlanDetails.as_view()),
    path('all/', GetAllSubscriptionDetails.as_view()),
    path('create/', AddSubscription.as_view()),
    path('paymenthistory/', GetPaymentHistory.as_view()),
    path('<int:subscription_id>/cancel/', CancelSubscription.as_view()),
    path('<int:subscription_id>/update/', EditSubscriptions.as_view()),
    path('check_subscription/<int:id>/', hasSubscription.as_view())
]