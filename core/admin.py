from django.contrib import admin
from .models import Abonne, Mesure, Objectif, Statistique, Alerte


# Personnalisation de l’affichage Abonné
@admin.register(Abonne)
class AbonneAdmin(admin.ModelAdmin):
    list_display = ("id_abonne", "nom", "prenom", "email", "telephone", "numPolice", "date_inscription")
    search_fields = ("nom", "prenom", "email", "numPolice")
    list_filter = ("date_inscription",)


# Mesures
@admin.register(Mesure)
class MesureAdmin(admin.ModelAdmin):
    list_display = ("id_mesure", "date_heure", "debit_L_min", "volume_L", "pression_bar", "abonne")
    search_fields = ("abonne__nom", "abonne__prenom")
    list_filter = ("date_heure",)


# Objectifs
@admin.register(Objectif)
class ObjectifAdmin(admin.ModelAdmin):
    list_display = ("id_objectif", "type_objectif", "volume_cible_L", "abonne")
    list_filter = ("type_objectif",)


# Statistiques
@admin.register(Statistique)
class StatistiqueAdmin(admin.ModelAdmin):
    list_display = ("id_statistique", "periode_date", "type_periode", "volume_total_L", "volume_max_L", "abonne")
    list_filter = ("type_periode", "periode_date")


# Alertes
@admin.register(Alerte)
class AlerteAdmin(admin.ModelAdmin):
    list_display = ("id_alerte", "type_alerte", "statut", "date_alerte", "mesure")
    list_filter = ("type_alerte", "statut", "date_alerte")
    search_fields = ("message",)
