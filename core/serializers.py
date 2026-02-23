from rest_framework import serializers
from .models import Abonne, Mesure, Objectif, Statistique, Alerte

class LoginSerializer(serializers.Serializer):
    numPolice = serializers.CharField()
    mot_de_passe = serializers.CharField(write_only=True)

    def validate(self, data):
        numPolice = data.get("numPolice")
        mot_de_passe = data.get("mot_de_passe")

        try:
            abonne = Abonne.objects.get(numPolice=numPolice)
        except Abonne.DoesNotExist:
            raise serializers.ValidationError({"numPolice": "Numéro de police invalide"})

        # Comparaison simple (⚠ pas sécurisé)
        if mot_de_passe != abonne.mot_de_passe:
            raise serializers.ValidationError({"mot_de_passe": "Mot de passe incorrect"})

        return abonne

class MesureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesure
        fields = ['id_mesure', 'date_heure', 'debit_L_min', 'volume_L', 'pression_bar', 'abonne']

class StatistiqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistique
        fields = '__all__'

class ObjectifSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objectif
        fields = '__all__'

class AlerteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alerte
        fields = '__all__'

class AbonneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Abonne
        fields = ['id_abonne', 'nom', 'prenom', 'email', 'telephone', 'adresse', 'mot_de_passe']


