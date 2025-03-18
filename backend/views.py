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
def pullman(request):
    citta = Citta.objects.all()
    return render(request,'pullman/Index.html', {'citta': citta})
    

def contattaci(request):
    return render(request,'pullman/contattaci.html')


def tratte(request):
    return render(request,'pullman/tratte.html')


# View per gestire i dati inviati dal form e confrontarli con il database
def tratta_view(request):
    if request.method == 'POST':
        partenza = request.POST.get('partenza')
        arrivo = request.POST.get('destinazione')
        data = request.POST.get('data')
        orario = request.POST.get('orario')
        posti = request.POST.get('posti')

        orario_richiesto = datetime.strptime(orario, "%H:%M").time()

        # Cerca nel database una tratta che corrisponde ai dati forniti
        try:
            tratta = Tratta.objects.filter(partenza=partenza, destinazione=arrivo, ora__gte=orario_richiesto).order_by('ora')#, ora=orario
            return render(request, 'pullman/tratte.html', {'tratte': tratta, 'data': data})
    #         # Controlla se ci sono posti sufficienti
    #         if int(posti) <= 50:  # Qui puoi aggiungere una logica per gestire i posti rimanenti
    #             return HttpResponse(f"Tratta trovata: {tratta.partenza} -> {tratta.destinazione} alle {tratta.ora}. Posti richiesti: {posti}")
    #         else:
    #             return HttpResponse("Numero di posti richiesti non disponibile.")
        except Tratta.DoesNotExist:
            return HttpResponse("La tratta richiesta non esiste.")
    
    return render(request, 'pullman/Index.html')
   

    # # Se non è una richiesta POST, ritorna al form
    # return render(request, 'index.html')

def conferma_prenotazione(request, tratta_id):
    tratta = get_object_or_404(Tratta, id=tratta_id)
    data = request.GET.get('data', '')  # Recupera la data dalla sessione
    
    if request.method == 'POST':
        # Creazione della prenotazione
        prenotazione = Prenotazione.objects.create(
            tratta=tratta,
            data=data
        )
        
        # Salva la prenotazione e mostra un messaggio di conferma
        prenotazione.save()
        messages.success(request, f"Prenotazione confermata! ID Prenotazione: {prenotazione.id}")
        
        return redirect('conferma_successo', prenotazione_id=prenotazione.id)  # Redireziona alla pagina di successo
    
    return render(request, 'pullman/conferma_prenotazione.html', {'tratta': tratta, 'data': data})


def conferma_successo(request, prenotazione_id):
    prenotazione = get_object_or_404(Prenotazione, id=prenotazione_id)
    return render(request, 'pullman/conferma_successo.html', {'prenotazione': prenotazione})


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