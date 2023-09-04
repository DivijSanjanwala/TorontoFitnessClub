from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from studios.views import GetClosestView, GetStudioDetails
from studios.views import StudioClassesScehdule, EnrollClassInstance, EnrollClass, DropClassInstance, DropClass, UserSchedule
from studios.views import StudioSearchandFiltering, SearchClasses, StudioClosestSearchAndFilter, GetStudioImages

app_name = 'studios'

urlpatterns = [   
    path('closest/<str:longitude>/<str:latitude>/', GetClosestView.as_view()),
    path('details/<int:id>/', GetStudioDetails.as_view()),
    path('search/', StudioSearchandFiltering.as_view()),
    path('schedule/<int:id>/', StudioClassesScehdule.as_view()),
    path('classes/enroll/<int:id>/', EnrollClass.as_view()),
    path('classes/drop/<int:id>/', DropClass.as_view()),
    path('classes/enroll/session/<int:id>/', EnrollClassInstance.as_view()),
    path('classes/drop/session/<int:id>/', DropClassInstance.as_view()),
    path('user/schedule/', UserSchedule.as_view()),
    path('classes/search/', SearchClasses.as_view()),
    path('search/closest/<str:longitude>/<str:latitude>/', StudioClosestSearchAndFilter.as_view()),
    path('images/<int:id>/', GetStudioImages.as_view())
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


