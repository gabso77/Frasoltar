from django.shortcuts import render
from django.http import HttpResponse
from .models import Prenotazione, Tratta
from .models import Citta
from datetime import datetime
from zoneinfo import ZoneInfo
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

def lista_citta(request):
    # Recupera tutti i prodotti dal database e li converte in una lista di dizionari
    citta = list(Citta.objects.values())
    # safe=False permette di ritornare una lista (non solo un dizionario)
    return JsonResponse(citta, safe=False, )

@csrf_exempt
def lista_tratte(request):
    if request.method == 'POST':
        partenza = request.POST.get('partenza')
        arrivo = request.POST.get('arrivo')
        ora = request.POST.get('ora')

        orario_richiesto = datetime.strptime(ora, "%H:%M").time()
        
        try:
            tratta = Tratta.objects.filter(partenza=partenza, arrivo=arrivo, ora__gte=orario_richiesto).order_by('ora')#, ora=orario
            tratta_lista = list(tratta.values())
            return JsonResponse(tratta_lista, safe = False)

        except Tratta.DoesNotExist:
            return HttpResponse("La tratta richiesta non esiste.")
    
    # return render(request, 'pullman/Index.html')
        
@csrf_exempt
def conferma_Prenotazione(request):
    print("Dati ricevuti:", request.POST)
    tratta_id = request.POST.get('id')
    tratta = get_object_or_404(Tratta, id=tratta_id)
    data = request.POST.get('data')  # Recupera la data dalla sessione
    
    if request.method == 'POST':
        # Creazione della prenotazione
        prenotazione = Prenotazione.objects.create(tratta=tratta, data=data)
        
        # Salva la prenotazione e mostra un messaggio di conferma
        prenotazione.save()
        messages.success(request, f"Prenotazione confermata! ID Prenotazione: {prenotazione.id}")
        
       # Risposta in JSON (ad esempio un messaggio)
        return JsonResponse({
            'success': True,
            'message': 'Prenotazione creata correttamente',
            'prenotazione_id': prenotazione.id
        })
    else:
        # Se arriva una GET o altro, rispondi come preferisci
        return JsonResponse({'error': 'Metodo non supportato'}, status=400)