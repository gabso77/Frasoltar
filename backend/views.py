import asyncio
import json
import os
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout
from django.contrib.auth.hashers import check_password
from django.http import HttpResponse, StreamingHttpResponse
from .models import Prenotazione, Tratta
from .models import Citta, Utenti
from datetime import datetime
from zoneinfo import ZoneInfo
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from openai import OpenAI
# Create your views here.

@csrf_exempt
def registra_persona(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not all([nome, email, password]):
            return JsonResponse({'errore': 'Dati mancanti'}, status=400)

        Utenti.objects.create(nome=nome, email=email, password=password)
        return JsonResponse({'messaggio': 'Registrazione completata'})
    
    return JsonResponse({'errore': 'Metodo non supportato'}, status=405)




def logout_view(request):
    logout(request)
    return redirect('login')



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
    

# Inizializza il client usando la chiave dall'ambiente
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

@csrf_exempt
def stream_assistant(request):
    """
    View sincrona che riceve un messaggio utente e restituisce la risposta di OpenAI in streaming via SSE.
    """
    if request.method == 'GET':
        user_message = request.GET.get('message', '')
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
        except Exception:
            return JsonResponse({'error': 'JSON non valido'}, status=400)
    else:
        return JsonResponse({'error': 'Metodo non consentito'}, status=405)

    if not user_message:
        return JsonResponse({'error': 'Messaggio mancante'}, status=400)

    # Ecco il codice che hai fornito, adattato all'input dell'utente:
    # (ATTENZIONE: se la libreria Python "from openai import OpenAI" *non* supporta davvero questi parametri,
    #  otterrai l'errore "TypeError: create() takes 1 argument(s) but 2 were given").
    try:
        response = client.responses.create(
            model="gpt-4o",
            instructions="""Sei un assistente virtuale di un sitoweb per prenotazione biglietti per pullman e treni, rispondi sempre in maniera breve, ma efficace, con un tono gentile e pacato e cerca di essere sempre professionale, di sotto hai tutti i dati a disposizione che ti servono:
            
1. Tratte Ferroviarie Principali nel Gargano
1.1 Tratta: Foggia ↔ San Severo ↔ Apricena ↔ San Nicandro ↔ Cagnano Varano ↔ Rodi Garganico ↔ Peschici-Calenella
Descrizione: Questa linea collega la città di Foggia al cuore del Gargano, fino a Peschici-Calenella, con varie fermate intermedie (San Severo, Apricena, San Nicandro Garganico, Cagnano Varano, Rodi Garganico).

Principali fermate:

Foggia (stazione principale)
San Severo
Apricena
San Nicandro Garganico
Cagnano Varano (eventuale fermata su richiesta o stagionale)
Rodi Garganico
Peschici-Calenella (stazione terminale)
Orari di Massima (Esempio)

Foggia → Peschici-Calenella
Partenza 06:00 → Arrivo 08:00 (ferma a tutte le stazioni)
Partenza 09:30 → Arrivo 11:30
Partenza 14:00 → Arrivo 16:00
Partenza 17:30 → Arrivo 19:30
Peschici-Calenella → Foggia
Partenza 06:30 → Arrivo 08:30
Partenza 10:00 → Arrivo 12:00
Partenza 15:00 → Arrivo 17:00
Partenza 18:00 → Arrivo 20:00
Frequenza: Corse giornaliere (la domenica alcuni orari potrebbero variare).

Durata media: Circa 2 ore, ma può variare in base alle fermate effettuate.

Servizi a bordo: Sedili prenotabili, climatizzazione, possibili sconti per studenti e anziani.

2. Tratte in Pullman Principali nel Gargano
2.1 Tratta: Foggia ↔ Manfredonia ↔ Mattinata ↔ Vieste ↔ Peschici
Descrizione: Tratta fondamentale per chi desidera raggiungere le principali località turistiche della costa garganica a sud (Manfredonia, Mattinata, Vieste) e poi proseguire fino a Peschici.

Principali fermate:

Foggia (Terminal bus)
Manfredonia (Porto/Terminal)
Mattinata (Centro)
Vieste (Stazione bus principale)
Peschici (Terminal bus)
Orari di Massima (Esempio)

Foggia → Peschici (via Manfredonia, Mattinata, Vieste)
Partenza 07:00 → Arrivo 10:00
Partenza 09:00 → Arrivo 12:00
Partenza 14:30 → Arrivo 17:30
Partenza 17:00 → Arrivo 20:00
Peschici → Foggia (via Vieste, Mattinata, Manfredonia)
Partenza 06:30 → Arrivo 09:30
Partenza 11:00 → Arrivo 14:00
Partenza 15:30 → Arrivo 18:30
Partenza 18:00 → Arrivo 21:00
Frequenza: Corse giornaliere con possibili corse aggiuntive nel periodo estivo.

Durata media: 3 ore (può aumentare nei periodi di alta stagione o in presenza di traffico).

Servizi a bordo: Aria condizionata, bagagliaio, spesso disponibile Wi-Fi, sconti per gruppi.

2.2 Tratta: San Severo ↔ San Marco in Lamis ↔ San Giovanni Rotondo ↔ Monte Sant’Angelo
Descrizione: Questa linea connette San Severo ai centri religiosi di San Giovanni Rotondo (San Pio) e Monte Sant’Angelo (Santuario di San Michele Arcangelo).

Principali fermate:

San Severo (Capolinea)
San Marco in Lamis
San Giovanni Rotondo (Terminal bus/cimitero)
Monte Sant’Angelo (Centro/Santuario)
Orari di Massima (Esempio)

San Severo → Monte Sant’Angelo
Partenza 06:45 → Arrivo 08:15
Partenza 12:00 → Arrivo 13:30
Partenza 16:00 → Arrivo 17:30
Monte Sant’Angelo → San Severo
Partenza 07:00 → Arrivo 08:30
Partenza 13:00 → Arrivo 14:30
Partenza 18:00 → Arrivo 19:30
Frequenza: Alcune corse giornaliere, con aumenti nei periodi di pellegrinaggi.

Durata media: Circa 1 ora e 30 minuti.

Servizi a bordo: Possibilità di trasporto bagagli, aria condizionata.

2.3 Tratta: Manfredonia ↔ Zapponeta ↔ Margherita di Savoia ↔ Barletta (extra Gargano, ma collegamento utile)
Descrizione: Sebbene non tutta la tratta sia nel Gargano, è utile per i viaggiatori che desiderano spostarsi dalla costa garganica verso Barletta (e poi proseguire verso Bari o altre località).

Principali fermate:

Manfredonia (Terminal bus)
Zapponeta (Centro)
Margherita di Savoia (Centro/Termale)
Barletta (Stazione bus)
Orari di Massima (Esempio)

Manfredonia → Barletta
Partenza 07:15 → Arrivo 08:45
Partenza 13:00 → Arrivo 14:30
Barletta → Manfredonia
Partenza 10:00 → Arrivo 11:30
Partenza 17:00 → Arrivo 18:30
Frequenza: Almeno due corse giornaliere feriali, orari ridotti nei festivi.

Durata media: 1 ora e 30 minuti.

3. Dettagli su Biglietti e Prenotazioni
Acquisto online: Attraverso il sito (o l’app) è possibile acquistare biglietti singoli e abbonamenti. I biglietti possono essere mostrati in formato cartaceo o digitale al momento del controllo.
Tariffe ridotte: Disponibili per:
Studenti (fino a 26 anni)
Over 65
Residenti in provincia di Foggia (in alcuni periodi promozionali)
Supplementi:
Bagagli di dimensioni superiori al consentito potrebbero prevedere un supplemento, soprattutto per le tratte in pullman.
Animali domestici di piccola taglia sono generalmente ammessi su entrambe le modalità di trasporto, purché in apposito trasportino.
4. Domande Frequenti (FAQ)
Come posso trovare gli orari aggiornati?

Gli orari vengono aggiornati periodicamente sul nostro sito e sono disponibili tramite l’app dedicata o consultando i tabelloni nelle stazioni/fermate principali.
Posso cambiare o rimborsare il mio biglietto?

Sì, secondo le condizioni di vendita: se il cambio avviene almeno 24 ore prima, viene addebitata solo una piccola penale. Per maggiori dettagli, consultare la sezione “Condizioni di Rimborso” sul sito.
Quanto tempo prima devo arrivare alla stazione o alla fermata?

Si consiglia di arrivare almeno 15 minuti prima per i pullman e 10 minuti prima per i treni, specialmente se bisogna convalidare il titolo di viaggio in biglietteria o alle macchinette automatiche.
Posso portare la bicicletta?

Sui treni, di solito sì, ma in base alla disponibilità di posti e pagando un supplemento. Sui pullman, dipende dalla compagnia e dal tipo di bagagliaio. È preferibile contattare il servizio clienti in anticipo.
Come funzionano le coincidenze tra pullman e treno?

In alcuni casi, gli orari sono organizzati per agevolare le coincidenze (es. arrivo del pullman a Foggia in tempo per la partenza del treno verso il Gargano). È comunque consigliabile lasciare sempre un margine di tempo di sicurezza.
5. Aggiornamenti e Contatti
Aggiornamento Orari: Gli orari potrebbero subire variazioni stagionali (alta stagione estiva, festività, ecc.). Prima di metterti in viaggio, verifica sempre gli ultimi aggiornamenti sul sito o contattando il servizio clienti.
Contatti Assistenza:
Numero Verde: 800-XXXXXX
E-mail: info@nomeservizio.it
Chat Online: disponibile dalle 08:00 alle 20:00.

Tu puoi solo rispondere alle domande inerenti al sito. Non rispondere a domande non inerenti al sito, come ad esempio: "Come posso fare il caffè?" o "Qual è il miglior ristorante in città?". Rispondi solo a domande inerenti al sito.""",
            input=user_message,
            stream=True
        )
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    # Generatore per trasmettere i chunk in formato SSE
    def sse_stream():
        try:
            # Iteriamo sincronicamente sugli eventi
            for event in response:
                # Verifica se l'oggetto 'event' ha un attributo che contiene il testo
                # Qui ipotizziamo "event.text", basandoci sul codice Node.js/JS
                if hasattr(event, "text") and event.text:
                    chunk_data = json.dumps({"response": event.text})
                    yield f"data: {chunk_data}\n\n"
        except Exception as e:
            # In caso di errore, inviamo un chunk di errore al client
            err_data = json.dumps({"error": str(e)})
            yield f"data: {err_data}\n\n"

    return StreamingHttpResponse(sse_stream(), content_type='text/event-stream')



@csrf_exempt
def login(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()

        user = Utenti.objects.filter(email=email).first()

        # Debug output
        print("Email:", email)
        print("Password inserita:", password)
        print("Utente trovato:", user)

        if user and check_password(password, user.password):
            auth_login(request, user)
            return JsonResponse({'success': True, 'username': user.username})
        else:
            return JsonResponse({'success': False, 'error': 'Email o password errati.'}, status=401)
