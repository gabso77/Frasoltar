from django.urls import path
from .views import logout_view
from . import views


urlpatterns = [
    path('lista_citta', views.lista_citta, name='lista_citta'),
    path('lista_tratte', views.lista_tratte, name='lista_tratte'),
    path('conferma_Prenotazione', views.conferma_Prenotazione, name='conferma_Prenotazione'),
    path('chat', views.stream_assistant, name='chat'),
    path('login', views.login, name='login'),
    path('signup', views.registra_persona, name='signup'),
    path('logout', logout_view, name='logout')
]