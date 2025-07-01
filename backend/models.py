from django.db import models
from django.contrib.auth.hashers import check_password

# Create your models here.

# immagine = models.ImageField()

class Tratta(models.Model):
    partenza = models.CharField(max_length=100)
    arrivo = models.CharField(max_length=100)
    tipo_corsa = models.CharField(max_length=20)
    ora = models.TimeField(default = '00:00')
    prezzo = models.FloatField()

    def __str__(self):
      return self.partenza+'-'+self.arrivo


class Citta(models.Model):
    citta = models.CharField(max_length = 100)

    def __str__(self):
      return self.citta
    

class Prenotazione(models.Model):
    tratta = models.ForeignKey(Tratta, on_delete=models.CASCADE)
    data = models.DateField()
    timestamp = models.DateTimeField(auto_now_add=True)  # Data e ora di creazione
    
    def __str__(self):
        return f"Prenotazione {self.id} - {self.tratta} per il {self.data}"


class Utenti(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=300)
    last_login = models.DateTimeField(null=True, blank=True)
    email = models.EmailField(unique=True, max_length=254)
    nome = models.CharField(max_length=100)
    cognome = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15)
    
    def __str__(self):
        return self.username

