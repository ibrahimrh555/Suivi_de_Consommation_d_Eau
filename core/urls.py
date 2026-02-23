from django.urls import path, include
from .views import LoginView,StatistiqueListView, ObjectifListView,StatistiqueJournalierView,weekly_stats
from . import views
from rest_framework.routers import DefaultRouter
from .views import AlerteViewSet

router = DefaultRouter()
router.register(r'alertes', AlerteViewSet, basename='alertes')


urlpatterns = [
    # Chemin de connexion
    path("login/", LoginView.as_view(), name="login"),

    # Chemins de mesures
    path('mesures/last/<int:abonne_id>/', views.last_measure, name='last_measure'),
    path('mesures/today/<int:abonne_id>/', views.today_measures, name='today_measures'),
    path("mesures/yesterday/<int:abonne_id>/", views.yesterday_total),

    # Chemins des paramètres utilisateur
    path('settings/user/<int:abonne_id>/', views.user_settings),
    path('settings/objectifs/<int:abonne_id>/', views.objectifs_settings),

    # Chemins d'alerte
    path("alertes/<int:abonne_id>/", views.abonne_alertes, name="abonne_alertes"),

    # Chemins statistiques
    path("stats/comparisons/<abonne_id>/", views.comparisons_stats, name="comparisons_stats"),
    path("stats/", StatistiqueListView.as_view(), name="stats"),
    path("objectifs/", ObjectifListView.as_view(), name="objectifs"),
    path("stats/weekly/<int:abonne_id>/", weekly_stats, name="weekly_stats"),
    path("stats/journalier/", StatistiqueJournalierView.as_view(), name="stats_journalier"),
    path('', include(router.urls)),
    path('alertes/marquer_vues/<int:abonne_id>/', views.marquer_alertes_vues, name='marquer_alertes_vues'),
]
