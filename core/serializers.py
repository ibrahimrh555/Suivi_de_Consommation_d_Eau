from rest_framework import serializers
from django.contrib.auth.hashers import check_password, identify_hasher, make_password
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

        stored_password = abonne.mot_de_passe
        try:
            identify_hasher(stored_password)
            valid_password = check_password(mot_de_passe, stored_password)
        except ValueError:
            valid_password = mot_de_passe == stored_password
            if valid_password:
                abonne.mot_de_passe = make_password(mot_de_passe)
                abonne.save(update_fields=["mot_de_passe"])

        if not valid_password:
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
    mot_de_passe = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = Abonne
        fields = ['id_abonne', 'nom', 'prenom', 'email', 'telephone', 'adresse', 'mot_de_passe']

    def update(self, instance, validated_data):
        password = validated_data.pop("mot_de_passe", None)
        instance = super().update(instance, validated_data)
        if password:
            instance.mot_de_passe = make_password(password)
            instance.save(update_fields=["mot_de_passe"])
        return instance

