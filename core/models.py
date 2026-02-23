from django.db import models

# Table Abonné
class Abonne(models.Model):
    id_abonne = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    adresse = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(max_length=150, unique=True)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    numPolice = models.CharField(max_length=50, unique=True)
    mot_de_passe = models.CharField(max_length=255)   # tu pourras utiliser make_password() de Django
    date_inscription = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} {self.prenom}"


# Table Mesure (relevés capteur)
class Mesure(models.Model):
    id_mesure = models.AutoField(primary_key=True)
    date_heure = models.DateTimeField()
    debit_L_min = models.FloatField()
    volume_L = models.FloatField()
    pression_bar = models.FloatField(blank=True, null=True)
    abonne = models.ForeignKey(Abonne, on_delete=models.CASCADE)

    def __str__(self):
        return f"Mesure {self.id_mesure} - {self.date_heure}"


# Table Objectif
class Objectif(models.Model):
    OBJECTIF_CHOICES = [
        ('jour', 'Jour'),
        ('semaine', 'Semaine'),
        ('mois', 'Mois'),
    ]

    id_objectif = models.AutoField(primary_key=True)
    type_objectif = models.CharField(max_length=10, choices=OBJECTIF_CHOICES)
    volume_cible_L = models.FloatField()
    abonne = models.ForeignKey(Abonne, on_delete=models.CASCADE)

    def __str__(self):
        return f"Objectif {self.type_objectif} - {self.volume_cible_L}L"


# Table Statistique
class Statistique(models.Model):
    PERIODE_CHOICES = [
        ('jour', 'Jour'),
        ('semaine', 'Semaine'),
        ('mois', 'Mois'),
    ]

    id_statistique = models.AutoField(primary_key=True)
    periode_date = models.DateField()
    type_periode = models.CharField(max_length=10, choices=PERIODE_CHOICES)
    volume_total_L = models.FloatField()
    volume_max_L = models.FloatField()  # ✅ correspond au pic de conso
    abonne = models.ForeignKey(Abonne, on_delete=models.CASCADE)

    def __str__(self):
        return f"Stat {self.type_periode} {self.periode_date} - {self.volume_total_L}L"


# Table Alerte
class Alerte(models.Model):
    ALERTE_CHOICES = [
        ('fuite', 'Fuite'),
        ('surconsommation', 'Surconsommation'),
        ('autre', 'Autre'),
    ]

    STATUT_CHOICES = [
        ('vu', 'Vu'),
        ('non_vu', 'Non vu'),
    ]

    id_alerte = models.AutoField(primary_key=True)
    type_alerte = models.CharField(max_length=20, choices=ALERTE_CHOICES)
    message = models.TextField()
    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default='non_vu')
    date_alerte = models.DateTimeField(auto_now_add=True)
    mesure = models.ForeignKey(Mesure, on_delete=models.CASCADE)

    def __str__(self):
        return f"Alerte {self.type_alerte} ({self.statut})"
