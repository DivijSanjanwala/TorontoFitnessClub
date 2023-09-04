from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from subscriptions.models import Subscription, SubscriptionPlan
from accounts.models import Card
from studios.models import Class, UsersEnrolled, Studio, ClassInstance
from datetime import date
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.utils import timezone

from django.core.paginator import Paginator

from django.shortcuts import get_object_or_404

class GetSubscriptionDetails(APIView):
    """Get subscription details. Mandatory fields: subscription_id"""
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        
        sub_id = kwargs.get('subscription_id')
        
        try:
            sub_id = int(sub_id)
        except:
            return Response({'status': False, 'msg': 'Invalid subscription id'})
        
        subscription_id = sub_id
        subscription_object = get_object_or_404(Subscription, id=subscription_id)

        new_object = {
            'id': subscription_object.id,
            'user': subscription_object.user.id,
            'studio': subscription_object.studio.id,
            'plan': subscription_object.plan.id,
            'plan_name': subscription_object.plan.name,
            'start_date': subscription_object.start_date,
            'end_date': subscription_object.end_date,
            'payment_time': subscription_object.payment_time,
        }

        return Response({'status': True, 'data': new_object})

class GetAllSubscriptionDetails(APIView):
    """Get subscription details. Mandatory fields: subscription_id"""
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):

        current_subscriptions = Subscription.objects.filter(user=request.user)
        return_list = []
        for subscription in current_subscriptions:
            dict_element = {
                'id': subscription.id,
                'user': subscription.user.id,
                'studio': subscription.studio.id,
                'plan': subscription.plan.id,
                'plan_name': subscription.plan.name,
                'start_date': subscription.start_date,
                'end_date': subscription.end_date,
                'payment_time': subscription.payment_time,
            }
            return_list.append(dict_element)
        
        page = request.GET.get('page')
        paginator = Paginator(return_list, 10)

        return Response({'num_pages': paginator.num_pages , 'prev': paginator.page(page).has_previous(), \
            'next': paginator.page(page).has_next(), 'data': paginator.page(page).object_list})


class GetPaymentHistory(APIView):
    """Gets the Payment history for Subscribed Subscriptions, if the User hasn’t subscribed or has canceled a Subscription, they wouldn’t be able to view the payment history. """
    permission_classes = [IsAuthenticated]
    def get(self, request):
        current_subscriptions = Subscription.objects.filter(user=request.user)

        history = []
        for subscription in current_subscriptions:

            current = subscription.start_date

            if subscription.plan.subscription_type == 'recurring':
                
                iterator = subscription.payment_time

                while iterator <= date.today() and \
                    iterator <= subscription.end_date:
                    iterator += relativedelta(months=1)

                subscription.payment_time = iterator
                subscription.save()

                i = 0
                
                while current < subscription.payment_time:

                    new_object = {
                        'user': subscription.user.id,
                        'plan': subscription.plan.id,
                        'plan_name': subscription.plan.name,
                        'payment_time': current,
                        'payment_number': i,
                        'card_name': subscription.card_name,
                        'card_number': subscription.card_number
                    }
                    history.append(new_object)
                    # Increment by monthly subscription.
                    current += relativedelta(months=1)
                    i +=1

            else:
                new_object = {
                        'user': subscription.user.id,
                        'plan': subscription.plan.id,
                        'plan_name': subscription.plan.name,
                        'payment_time': subscription.payment_time,
                        'card_name': subscription.card_name,
                        'card_number': subscription.card_number
                    }
                history.append(new_object)
        
        page = request.GET.get('page')
        paginator = Paginator(history, 10)

        return Response({'num_pages': paginator.num_pages , 'prev': paginator.page(page).has_previous(), \
            'next': paginator.page(page).has_next(), 'data': paginator.page(page).object_list})


class GetSubscriptionPlanDetails(APIView):
    """Gets the Subscription Plans available for subscription for the users """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        plans = []

        for subscription_plan in SubscriptionPlan.objects.all():

            new_object = {
                'id': subscription_plan.id,
                'plan_name': subscription_plan.name,
                'name': subscription_plan.name,
                'price': subscription_plan.price,
                'duration': subscription_plan.duration,
                'description': subscription_plan.description
            }

            plans.append(new_object)
        
        return Response({'status': True, 'data': plans})

class AddSubscription(APIView):
    """Enables Users to add a Subscription, ie: subscribe to one of the available subscriptions."""

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        
        
        if request.data.get('start_date', '') == '':
            return Response({'status': False, 'reason': 'A start date was not provided'})
        
        if request.data.get('end_date', '') == '':
            return Response({'status': False, 'reason': 'An end date was not provided'})
        
        sub_id = None
        studio_id = None

        try:
            sub_id = int(request.data.get('plan', ''))
            studio_id = int(request.data.get('studio', ''))
        except:
            return Response(
                {
                    'status': False,
                    'reason': "Plan or Studio ID was not provided or is incorrect"
                })

        studio = get_object_or_404(Studio, id=studio_id)
        plan = get_object_or_404(SubscriptionPlan, id=sub_id)

        if not Subscription.objects.filter(user=request.user, studio=studio, plan=plan).exists():

            start_date = \
                datetime.strptime(request.data.get('start_date'), \
                    '%Y-%m-%d')
            end_date = \
                datetime.strptime(request.data.get('end_date'), \
                    '%Y-%m-%d')

            if Card.objects.filter(user=request.user).exists():
                
                card = Card.objects.get(user = request.user)

                Subscription.objects.create(
                    studio=studio,
                    user=request.user,
                    plan=plan,
                    start_date=start_date,
                    end_date=end_date,
                    payment_time=date.today(),
                    card_name=card.name,
                    card_number=card.number
                )

                return Response(
                    {
                        'status': True
                    })
            else:
                return Response({'status': False, 'reason': 'not card provided'})

        else:
            return Response(
                {
                    'status': False,
                    'reason': 'unknown'
                })

class CancelSubscription(APIView):
    """Enables a User to cancel subscription"""

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        user_id = self.request.user.id
        empty_field_error_dict = {
            'status': False, 
            'reason': 'Empty Field, please fill the blank'
        }
        # Error catching for empty field in POST Request
        for data_value in request.data.values():
            if len(data_value) == 0:
                return Response(empty_field_error_dict)

        subscription_id = None

        try:
            subscription_id = int(kwargs.get('subscription_id', ''))
        except Exception as e:
            return Response(
                {
                    'status': False,
                    'reason': e
                })

        subscription = get_object_or_404(Subscription, id=subscription_id)

        classes = Class.objects.filter(studio = subscription.studio)

        for c in classes:
            instances = ClassInstance.objects.filter(classobj = c)
            for instance in instances:                
                UsersEnrolled.objects.filter(user=user_id, \
                    classinstance=instance).delete()
                instance.current_capacity -= 1

        subscription.delete()

        return Response({'status': True})

class EditSubscriptions(APIView):
    """Enables editing the subscription, ie: enables Users to change Subscription Plans. For instance another plan is available ie: a yearly subscription, then the User can subscribe to that particular Plan."""

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        
        plan_to_change = None
        
        try:
            plan_to_change = int(request.data.get('plan', ''))
            subscription_to_change = int(kwargs.get('subscription_id', ''))
        except Exception as e:
            return Response(
                {
                    'status': False,
                    'reason': e
                })
        
        subscription = get_object_or_404(Subscription, id=subscription_to_change)
        subscription_plan = get_object_or_404(SubscriptionPlan, id=plan_to_change)

        subscription.plan = subscription_plan
        subscription.save()

        return Response({'status': True})

class hasSubscription(APIView):
    """Checks if the user has a subscription"""

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        
        try:
            studio_id = int(kwargs.get('id', ''))
            # studio = Studio.objects.get(id=studio_id)
        except:
            return Response({'status': False, 'msg': 'Invalid Studio ID'})
            
        if Subscription.objects.filter(user=self.request.user, studio=studio_id).exists():
            return Response({'status': True, 'data': True})
        else:
            return Response({'status': True, 'data': False})