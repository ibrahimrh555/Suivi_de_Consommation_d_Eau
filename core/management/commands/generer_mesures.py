from django.core.management.base import BaseCommand, CommandError
from datetime import timedelta
import random
from django.utils import timezone
from django.db.models import Sum, Max
from core.models import Abonne, Mesure, Statistique, Alerte, Objectif


class Command(BaseCommand):
    help = "Génère des mesures réalistes + statistiques + alertes pour un abonné donné."

    def add_arguments(self, parser):
        parser.add_argument('--numPolice', type=str, required=True, help="Numéro de police de l'abonné")
        parser.add_argument('--max-volume', type=float, default=8.0,
                            help="Volume max autorisé sur 5 min (L), par défaut 8 L.")
        parser.add_argument('--seed', type=int, default=None, help="Seed random (optionnel, pour tests reproductibles)")

    def handle(self, *args, **options):
        numPolice = options['numPolice']
        max_volume = options['max_volume']
        seed = options['seed']

        if seed is not None:
            random.seed(seed)

        try:
            abonne = Abonne.objects.get(numPolice=numPolice)
        except Abonne.DoesNotExist:
            raise CommandError(f"❌ Aucun abonné trouvé avec le numPolice={numPolice}")

        # Débit max autorisé
        max_debit = max_volume / 5.0
        start_time = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)

        def get_profile(hour):
            if 0 <= hour < 6:
                return (0.05, 0.1, 0.5)
            elif 6 <= hour < 9:
                return (0.8, 0.5, max_debit)
            elif 9 <= hour < 12:
                return (0.4, 0.2, 0.8 * max_debit)
            elif 12 <= hour < 14:
                return (0.6, 0.3, max_debit)
            elif 14 <= hour < 18:
                return (0.3, 0.2, 0.7 * max_debit)
            elif 18 <= hour < 21:
                return (0.85, 0.5, max_debit)
            else:
                return (0.2, 0.1, 0.5 * max_debit)

        mesures = []
        for i in range(0, 24 * 60, 5):
            hour = (start_time + timedelta(minutes=i)).hour
            prob, dmin, dmax = get_profile(hour)

            if random.random() < prob:
                debit = round(random.uniform(dmin, dmax), 3)
                volume = round(debit * 5, 3)
                if volume > max_volume:
                    volume = max_volume
                    debit = volume / 5
            else:
                debit = 0.0
                volume = 0.0

            pression = round(random.uniform(2.3, 2.8), 2)

            mesures.append(
                Mesure(
                    date_heure=start_time + timedelta(minutes=i),
                    debit_L_min=debit,
                    volume_L=volume,
                    pression_bar=pression,
                    abonne=abonne
                )
            )

        Mesure.objects.bulk_create(mesures)

        # === Génération des Statistiques ===
        self.generate_stats(abonne)

        # === Vérification des Objectifs et Alertes ===
        self.check_alerts(abonne)

        self.stdout.write(self.style.SUCCESS(
            f"✅ {len(mesures)} mesures générées + stats + alertes pour {abonne.nom} {abonne.prenom}"
        ))

    def generate_stats(self, abonne):
        """Crée les statistiques jour, semaine, mois"""
        mesures = Mesure.objects.filter(abonne=abonne)

        if not mesures.exists():
            return

        # Jour (total aujourd’hui)
        today = timezone.now().date()
        stats_jour = mesures.filter(date_heure__date=today).aggregate(
            total=Sum('volume_L'), maxv=Max('volume_L')
        )
        Statistique.objects.create(
            periode_date=today,
            type_periode='jour',
            volume_total_L=stats_jour['total'] or 0,
            volume_max_L=stats_jour['maxv'] or 0,
            abonne=abonne
        )

        # Semaine (lundi–dimanche en cours)
        start_week = today - timedelta(days=today.weekday())
        end_week = start_week + timedelta(days=6)
        stats_semaine = mesures.filter(date_heure__date__range=(start_week, end_week)).aggregate(
            total=Sum('volume_L'), maxv=Max('volume_L')
        )
        Statistique.objects.create(
            periode_date=start_week,
            type_periode='semaine',
            volume_total_L=stats_semaine['total'] or 0,
            volume_max_L=stats_semaine['maxv'] or 0,
            abonne=abonne
        )

        # Mois (1er → dernier jour du mois en cours)
        start_month = today.replace(day=1)
        if today.month == 12:
            end_month = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            end_month = today.replace(month=today.month + 1, day=1) - timedelta(days=1)

        stats_mois = mesures.filter(date_heure__date__range=(start_month, end_month)).aggregate(
            total=Sum('volume_L'), maxv=Max('volume_L')
        )
        Statistique.objects.create(
            periode_date=start_month,
            type_periode='mois',
            volume_total_L=stats_mois['total'] or 0,
            volume_max_L=stats_mois['maxv'] or 0,
            abonne=abonne
        )

    def check_alerts(self, abonne):
        """Crée des alertes en cas de surconsommation ou fuite"""
        objectifs = Objectif.objects.filter(abonne=abonne)
        mesures = Mesure.objects.filter(abonne=abonne)

        if not mesures.exists():
            return

        # Surconsommation (dépasse objectif)
        for obj in objectifs:
            if obj.type_objectif == "jour":
                total = mesures.filter(date_heure__date=timezone.now().date()).aggregate(Sum("volume_L"))["volume_L__sum"] or 0
            elif obj.type_objectif == "semaine":
                start_week = timezone.now().date() - timedelta(days=timezone.now().date().weekday())
                total = mesures.filter(date_heure__date__gte=start_week).aggregate(Sum("volume_L"))["volume_L__sum"] or 0
            else:  # mois
                start_month = timezone.now().date().replace(day=1)
                total = mesures.filter(date_heure__date__gte=start_month).aggregate(Sum("volume_L"))["volume_L__sum"] or 0

            if total > obj.volume_cible_L:
                Alerte.objects.create(
                    type_alerte="surconsommation",
                    message=f"Surconsommation détectée : {total:.2f} L > objectif {obj.volume_cible_L:.2f} L ({obj.type_objectif})",
                    mesure=mesures.latest("date_heure"),
                )

        # Fuite (consommation la nuit entre 0h–5h pendant > 3 pas consécutifs)
        night_measures = mesures.filter(date_heure__hour__lt=5, volume_L__gt=0).order_by("date_heure")
        if night_measures.count() >= 3:
            Alerte.objects.create(
                type_alerte="fuite",
                message="Possible fuite détectée (consommation anormale la nuit)",
                mesure=night_measures.first(),
            )
