from django import forms
from .models import Tratta

class TrattaForm(forms.ModelForm):
    class Meta:
        model = Tratta
        fields = [ 'ora']
        widgets = {
    'ora': forms.TimeInput(attrs={'type': 'time'}, format='%H:%M'),
    }
        ora_inizio = forms.TimeField(
        input_formats=['%H:%M', '%H:%M:%S'],  
        required=True  
    )

