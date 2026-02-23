from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer, MesureSerializer, AbonneSerializer, ObjectifSerializer, StatistiqueSerializer, AlerteSerializer
from django.db.models import Sum
from .models import Mesure, Abonne, Objectif, Statistique, Alerte
from rest_framework import generics, viewsets
from datetime import date, timedelta
from django.utils.timezone import now
from django.shortcuts import get_object_or_404


# Login d un abonné
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            abonne = serializer.validated_data
            return Response({
                "message": "Connexion réussie",
                "abonne": {
                    "id": abonne.id_abonne,
                    "nom": abonne.nom,
                    "prenom": abonne.prenom,
                    "email": abonne.email,
                    "numPolice": abonne.numPolice,
                    "telephone": abonne.telephone,
                    "adresse": abonne.adresse,
                    "mot_de_passe": abonne.mot_de_passe,
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Dernière mesure
@api_view(['GET'])
def last_measure(request, abonne_id):
    """Retourne la dernière mesure d’un abonné"""
    mesure = Mesure.objects.filter(abonne_id=abonne_id).order_by('-date_heure').first()
    if mesure:
        return Response(MesureSerializer(mesure).data)
    return Response({"message": "Aucune mesure"}, status=404)
# mesures d'aujourd'hui
@api_view(['GET'])
def today_measures(request, abonne_id):
    """Retourne toutes les mesures d’aujourd’hui"""
    today = now().date()
    mesures = Mesure.objects.filter(
        abonne_id=abonne_id,
        date_heure__date=today
    ).order_by('date_heure')
    return Response(MesureSerializer(mesures, many=True).data)
# total d'hier
@api_view(['GET'])
def yesterday_total(request, abonne_id):
    """Retourne la consommation totale d’hier"""
    yesterday = now().date() - timedelta(days=1)

    total = (
        Mesure.objects.filter(abonne_id=abonne_id, date_heure__date=yesterday)
        .aggregate(total=Sum("volume_L"))
        .get("total")
        or 0
    )
    return Response({"total": round(total, 2)})



# Récupérer / Modifier infos utilisateur
@api_view(['GET', 'PUT'])
def user_settings(request, abonne_id):
    abonne = get_object_or_404(Abonne, id_abonne=abonne_id)

    if request.method == 'GET':
        return Response(AbonneSerializer(abonne).data)

    if request.method == 'PUT':
        serializer = AbonneSerializer(abonne, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Récupérer / Modifier seuils
@api_view(['GET', 'PUT'])
def objectifs_settings(request, abonne_id):
    objectifs = Objectif.objects.filter(abonne_id=abonne_id)

    if request.method == 'GET':
        return Response(ObjectifSerializer(objectifs, many=True).data)

    if request.method == 'PUT':
        for obj in request.data:  # [{type_objectif: "jour", volume_cible_L: 100}, ...]
            objectif, _ = Objectif.objects.update_or_create(
                abonne_id=abonne_id,
                type_objectif=obj['type_objectif'],
                defaults={'volume_cible_L': obj['volume_cible_L']}
            )
        return Response({"message": "Objectifs mis à jour"}, status=status.HTTP_200_OK)



# Alertes d’un abonné
@api_view(['GET'])
def abonne_alertes(request, abonne_id):
    alertes = Alerte.objects.filter(mesure__abonne_id=abonne_id).order_by('-date_alerte')
    from .serializers import AlerteSerializer
    return Response(AlerteSerializer(alertes, many=True).data)



# comparaisons semaine/mois/année
@api_view(['GET'])
def comparisons_stats(request, abonne_id):
    today = date.today()

    # --- Semaine ---
    start_this_week = today - timedelta(days=today.weekday())
    start_last_week = start_this_week - timedelta(days=7)

    this_week = Statistique.objects.filter(
        abonne_id=abonne_id, type_periode="jour", periode_date__gte=start_this_week
    ).aggregate(Sum("volume_total_L"))["volume_total_L__sum"] or 0

    last_week = Statistique.objects.filter(
        abonne_id=abonne_id, type_periode="jour",
        periode_date__gte=start_last_week, periode_date__lt=start_this_week
    ).aggregate(Sum("volume_total_L"))["volume_total_L__sum"] or 0

    # --- Mois ---
    this_month = Statistique.objects.filter(
        abonne_id=abonne_id, type_periode="jour", periode_date__month=today.month
    ).aggregate(Sum("volume_total_L"))["volume_total_L__sum"] or 0

    last_month = Statistique.objects.filter(
        abonne_id=abonne_id, type_periode="mois", 
        periode_date__month=today.month-1 if today.month > 1 else 12,
        periode_date__year=today.year if today.month > 1 else today.year-1
    ).aggregate(Sum("volume_total_L"))["volume_total_L__sum"] or 0

    # --- Année ---
    this_year = Statistique.objects.filter(
        abonne_id=abonne_id, type_periode="mois", periode_date__year=today.year
    ).aggregate(Sum("volume_total_L"))["volume_total_L__sum"] or 0

    last_year = Statistique.objects.filter(
        abonne_id=abonne_id, type_periode="mois", periode_date__year=today.year-1
    ).aggregate(Sum("volume_total_L"))["volume_total_L__sum"] or 0

    # helper pour calcul différence + %
    def build_obj(label, current, previous):
        diff = current - previous
        perc = (diff / previous * 100) if previous > 0 else 0
        return {
            "period": label,
            "current": round(current, 2),
            "previous": round(previous, 2),
            "difference": round(diff, 2),
            "percentage": round(perc, 1),
        }

    data = [
        build_obj("Cette semaine vs semaine dernière", this_week, last_week),
        build_obj("Ce mois vs mois dernier", this_month, last_month),
        build_obj("Cette année vs année dernière", this_year, last_year),
    ]

    return Response(data)

# Statistiques des mois
class StatistiqueListView(generics.ListAPIView):
    serializer_class = StatistiqueSerializer

    def get_queryset(self):
        abonne_id = self.request.query_params.get("abonne_id")
        return Statistique.objects.filter(abonne_id=abonne_id,type_periode="mois").order_by("-periode_date")[:12]

# Statistiques journalières (30 derniers jours)
class StatistiqueJournalierView(generics.ListAPIView):
    serializer_class = StatistiqueSerializer

    def get_queryset(self):
        abonne_id = self.request.query_params.get("abonne_id")
        return (
            Statistique.objects
            .filter(abonne_id=abonne_id, type_periode="jour")
            .order_by("-periode_date")[:30]  # les 30 derniers jours
        )
    
# statistiques hebdomadaires
@api_view(['GET'])
def weekly_stats(request, abonne_id):
    """Retourne la consommation quotidienne de la semaine en cours"""
    today = date.today()
    start_week = today - timedelta(days=today.weekday())  # lundi
    stats = (
        Statistique.objects
        .filter(abonne_id=abonne_id, type_periode="jour", periode_date__gte=start_week)
        .order_by("periode_date")
    )
    return Response(StatistiqueSerializer(stats, many=True).data)
# Objectifs
class ObjectifListView(generics.ListAPIView):
    serializer_class = ObjectifSerializer

    def get_queryset(self):
        abonne_id = self.request.query_params.get("abonne_id")
        return Objectif.objects.filter(abonne_id=abonne_id)

    





class AlerteViewSet(viewsets.ModelViewSet):
    queryset = Alerte.objects.all().order_by('-date_alerte')
    serializer_class = AlerteSerializer
    

    def get_queryset(self):
        qs = super().get_queryset()
        statut = self.request.query_params.get('statut')
        abonne_id = self.request.query_params.get('abonne_id')

        if statut:
            qs = qs.filter(statut=statut)
        if abonne_id:
            qs = qs.filter(mesure__abonne__id_abonne=abonne_id)

        return qs


# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Alerte

@api_view(['POST'])
def marquer_alertes_vues(request, abonne_id):
    Alerte.objects.filter(mesure__abonne_id=abonne_id, statut="non_vu").update(statut="vu")
    return Response({"success": True, "message": "Toutes les alertes ont été marquées comme vues."})
