from django.contrib import admin

# Register your models here.
from studios.models import Studio, StudioImages, StudioAmenities, Class, ClassInstance, UsersEnrolled

admin.site.register(StudioImages)
admin.site.register(StudioAmenities)
admin.site.register(UsersEnrolled)

@admin.register(Studio)
class ClassAdmin(admin.ModelAdmin):
    fields = ("name", "address","longitude", "latitude","postal_code", "phone_number")

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_filter = ("studio", )

@admin.register(ClassInstance)
class ClassAdmin(admin.ModelAdmin):
    list_filter = ("classobj", )
