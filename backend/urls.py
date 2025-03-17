from django.urls import path
from . import views


urlpatterns = [
    path('', views.pullman, name = 'home'),
    path('contattaci', views.contattaci, name = 'contattaci'),
    path('tratte', views.tratte, name = 'tratte'),
    path('tratte/', views.tratta_view, name='tratta_view'),
    path('conferma_prenotazione/<int:tratta_id>/', views.conferma_prenotazione, name='conferma_prenotazione'),
    path('conferma_successo/<int:prenotazione_id>/', views.conferma_successo, name='conferma_successo'),
    path('lista_citta', views.lista_citta, name='lista_citta'),
    path('lista_tratte', views.lista_tratte, name='lista_tratte'),
    path('conferma_Prenotazione', views.conferma_Prenotazione, name='conferma_Prenotazione'),
]