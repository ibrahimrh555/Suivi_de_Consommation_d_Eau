from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include


def health_check(_request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('core/', include('core.urls')),
]
