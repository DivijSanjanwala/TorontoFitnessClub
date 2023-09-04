from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from accounts.views import Signup, EditProfile, ping, AddUpdateCard, UserInfo

urlpatterns = [
    path('login/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh_token/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', Signup.as_view()),
    path('edit_profile/', EditProfile.as_view()),
    path('ping/', ping.as_view()),
    path('add_card/', AddUpdateCard.as_view()),
    path('userinfo/', UserInfo.as_view())
]