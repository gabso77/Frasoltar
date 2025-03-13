from django.db import models

# Create your models here.

# immagine = models.ImageField()

class Tratta(models.Model):
    partenza = models.CharField(max_length=20)
    arrivo = models.CharField(max_length=20)
    tipo_corsa = models.CharField(max_length=20)
    ora = models.TimeField(default = '00:00')
    prezzo = models.FloatField()

    def __str__(self):
      return self.partenza+'-'+self.arrivo


class Citta(models.Model):
    citta = models.CharField(max_length = 20)

    def __str__(self):
      return self.citta
    

class Prenotazione(models.Model):
    tratta = models.ForeignKey(Tratta, on_delete=models.CASCADE)
    data = models.DateField()
    timestamp = models.DateTimeField(auto_now_add=True)  # Data e ora di creazione
    
    def __str__(self):
        return f"Prenotazione {self.id} - {self.tratta} per il {self.data}"


