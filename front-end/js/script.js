// DATA E ORA
function minDataPrenotazione(evento)  {

    document.addEventListener(evento, function() {
        // Ottieni la data odierna nel formato corretto
        let today = new Date();
        let yyyy = today.getFullYear();
        let mm = String(today.getMonth() + 1).padStart(2, '0'); // Mese (aggiungi 1 poiché i mesi partono da 0)
        let dd = String(today.getDate()).padStart(2, '0'); // Giorno
    
        // Formatta la data in yyyy-mm-ddThh:mm
        let currentDate = yyyy + '-' + mm + '-' + dd + 'T' + today.getHours() + ':' + String(today.getMinutes()).padStart(2, '0');
    
        // Imposta la data minima per gli input di tipo datetime-local
        let datapullman = document.getElementById("data-pullman")
        let datatreni = document.getElementById("data-treni")
        if(datapullman)
            {datapullman.setAttribute("min", currentDate);}
        if(datatreni)
            {datatreni.setAttribute("min", currentDate);}
        
    });
    
}
minDataPrenotazione("DOMContentLoaded")
minDataPrenotazione("change") // Esegue la stessa logica del DOM anche al click





    // SUBMIT MODULO PULLMAN
document.addEventListener('DOMContentLoaded', async function() {
    // index.html
    const pullmanForm = document.getElementById('pullmanForm');
    const treniForm = document.getElementById('treniForm');
    
    if (pullmanForm) {
        // Recupero dati luoghi partenza pullman
            let luoghiPartenzaPullman = await fetch('http://127.0.0.1:8000/pullman/lista_citta')  //Effettuo una chiamata di tipo GET sul database per recuperare dati dei luoghi di partenza pullman
        luoghiPartenzaPullman = await luoghiPartenzaPullman.json()
        for (
            let luogo of luoghiPartenzaPullman
        ) {
            luogo = luogo.citta  // Modifica della variabile temporanea luogo col valore ricavato dall'oggetto (associato alla chiave "citta")
            let option = document.createElement('option')   // Creazione di un oggetto js legato all' option    
            option.value = luogo    // Impostazione valore dell'option con il luogo recuperato
            option.innerHTML = luogo // Impostazione testo che comparirà nel menù a tendina
            let select = document.getElementById('luogo-partenza-pullman') // Recupero del menù a tendina che comprenderà i luoghi
            if (select) //Solo se getElementById ha ricavato l'elemento cercato
            {
                select.appendChild(option) // Inserimento nel menù a tendina l'oggetto option contenente il luogo ricavato
            }
        }
        // Recupero dati luoghi arrivo pullman
        let luoghiArrivoPullman = await fetch('http://127.0.0.1:8000/pullman/lista_citta') 
        luoghiArrivoPullman = await luoghiArrivoPullman.json()
        for (
            let luogo of luoghiArrivoPullman
        ) {
            luogo = luogo.citta  
            let option = document.createElement('option')     
            option.value = luogo   
            option.innerHTML = luogo 
            let select = document.getElementById('luogo-arrivo-pullman') 
            if (select) 
            {
                select.appendChild(option) 
            }
        } 
        pullmanForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita il submit tradizionale
            
            // Prendere i dati dal modulo
            const partenza = document.getElementById('luogo-partenza-pullman').value;
            const arrivo = document.getElementById('luogo-arrivo-pullman').value;
            const data = document.getElementById('data-pullman').value;
            const ora = document.getElementById('ora-pullman').value;
            
            // Creare l'URL per i risultati dei pullman
            const url = `./pages/risultatipullman.html?partenza=${encodeURIComponent(partenza)}&arrivo=${encodeURIComponent(arrivo)}&data=${encodeURIComponent(data)}&ora=${encodeURIComponent(ora)}`;
            window.location.href = url; // Reindirizza
        });
    }





    // SUBMIT MODULO TRENI
    if (treniForm) {
        // Recupero dati luoghi partenza treni
        let luoghiPartenzaTreni = await fetch('http://127.0.0.1:8000/pullman/lista_citta')  
        luoghiPartenzaTreni = await luoghiPartenzaTreni.json()
        for (
            let luogo of luoghiPartenzaTreni
        ) {
            luogo = luogo.citta  
            let option = document.createElement('option')     
            option.value = luogo    
            option.innerHTML = luogo 
            let select = document.getElementById('luogo-partenza-treni') 
            if (select)
            {
                select.appendChild(option) 
            }
        }
        // Recupero dati luoghi arrivo treni
        let luoghiArrivoTreni = await fetch('http://127.0.0.1:8000/pullman/lista_citta')  
        luoghiArrivoTreni = await luoghiArrivoTreni.json()
        for (
            let luogo of luoghiArrivoTreni
        ) {
            luogo = luogo.citta 
            let option = document.createElement('option') 
            option.value = luogo 
            option.innerHTML = luogo 
            let select = document.getElementById('luogo-arrivo-treni')
            if (select) 
            {
                select.appendChild(option) 
            }
        } 
        treniForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita il submit tradizionale
            
            // Prendere i dati dal modulo
            const partenza = document.getElementById('luogo-partenza-treni').value;
            const arrivo = document.getElementById('luogo-arrivo-treni').value;
            const data = document.getElementById('data-treni').value;
            const ora = document.getElementById('ora-treni').value;
            
            // Creare l'URL per i risultati dei treni
            const url = `./pages/risultatitreni.html?partenza=${encodeURIComponent(partenza)}&arrivo=${encodeURIComponent(arrivo)}&data=${encodeURIComponent(data)}&ora=${encodeURIComponent(ora)}`;
            window.location.href = url; // Reindirizza
        });
    }





    // RICERCA DATI PULLMAN
    //risultatipullman.html
    let tableprenotap = document.getElementById("tablep")
    if(tableprenotap) {
        let query = new URLSearchParams(window.location.search)
        let data = new FormData()
        data.append('partenza', query.get('partenza'))
        data.append('arrivo', query.get('arrivo'))
        data.append('data', query.get('data'))
        data.append('ora', query.get('ora'))
        let datiricercap = await fetch("http://127.0.0.1:8000/pullman/lista_tratte", {
            method: 'POST',
            body: data
        })
        datiricercap = await datiricercap.json()
        tableprenotap = tableprenotap.getElementsByTagName("tbody")
        tableprenotap = tableprenotap[0]
        let Data = query.get('data')
        for ( let datitempo of datiricercap ) {
            console.log(datitempo)
            // Creazione riga e dati
            let btn = document.createElement("button")
            let tr = document.createElement("tr")
            let tdP = document.createElement("td")
            let tdA = document.createElement("td")
            let tdData = document.createElement("td")
            let tdOra = document.createElement("td")
            let tdTipoCorsa = document.createElement("td")
            let tdPrezzo = document.createElement("td")
            let tdButton = document.createElement("td")
            tdP.innerHTML = datitempo.partenza
            tdA.innerHTML = datitempo.arrivo
            tdData.innerHTML = Data
            tdOra.innerHTML = datitempo.ora
            tdTipoCorsa.innerHTML = datitempo.tipo_corsa
            tdPrezzo.innerHTML = "€ " + datitempo.prezzo
            btn.innerHTML = "Acquista"
            // btn.value = datitempo.partenza + datitempo.arrivo + datitempo.ora + datitempo.tipo_corsa + datitempo.prezzo + query.get('data')
            btn.value = datitempo.id
            tdButton.appendChild(btn)
            // Import dati su schermo
            tr.appendChild(tdP)
            tr.appendChild(tdA)
            tr.appendChild(tdData)
            tr.appendChild(tdOra)
            tr.appendChild(tdTipoCorsa)
            tr.appendChild(tdPrezzo)
            tr.appendChild(tdButton)
            tableprenotap.appendChild(tr)
            // Redirect conferma
            btn.addEventListener("click", function() {
            // window.location.href = '../pages/conferma.html?'+ btn.value;
            window.location.href = `../pages/conferma.html?id=${datitempo.id}&partenza=${datitempo.partenza}&arrivo=${datitempo.arrivo}&ora=${datitempo.ora}&tipo_corsa=${datitempo.tipo_corsa}&prezzo=${datitempo.prezzo}&data=${Data}` 
            });
        } 
        // Testo errore
        if(datiricercap.length == 0)
        {
            let trErrore = document.createElement("tr")
            let tdErrore = document.createElement("td")
            tdErrore.innerHTML = "Nessun risultato trovato"
            tdErrore.colSpan = "5"
            tdErrore.style.textAlign = "center"
            trErrore.appendChild(tdErrore)
            tableprenotap.appendChild(trErrore)
        }
    }






    // RICERCA DATI TRENI
    //risultatitreni.html
    let tableprenotat = document.getElementById("tablet")
    if(tableprenotat) {
        let query = new URLSearchParams(window.location.search)
        let data = new FormData()
        data.append('partenza', query.get('partenza'))
        data.append('arrivo', query.get('arrivo'))
        data.append('data', query.get('data'))
        data.append('ora', query.get('ora'))
        let datiricercat = await fetch("http://127.0.0.1:8000/pullman/lista_tratte", {
            method: 'POST',
            body: data
        })
        datiricercat = await datiricercat.json()
        tableprenotat = tableprenotat.getElementsByTagName("tbody")
        tableprenotat = tableprenotat[0]
        for ( let datitempo of datiricercat ) {
            console.log(datitempo)
            // Creazione riga e dati
            let btn = document.createElement("button")
            let tr = document.createElement("tr")
            let tdP = document.createElement("td")
            let tdA = document.createElement("td")
            let tdData = document.createElement("td")
            let tdOra = document.createElement("td")
            let tdTipoCorsa = document.createElement("td")
            let tdPrezzo = document.createElement("td")
            let tdButton = document.createElement("td")
            tdP.innerHTML = datitempo.partenza
            tdA.innerHTML = datitempo.arrivo
            tdData.innerHTML = query.get('data')
            tdOra.innerHTML = datitempo.ora
            tdTipoCorsa.innerHTML = datitempo.tipo_corsa
            tdPrezzo.innerHTML = "€ " + datitempo.prezzo
            btn.innerHTML = "Acquista"
            btn.value = datitempo.id
            tdButton.appendChild(btn)
            // Import dati su schermo
            tr.appendChild(tdP)
            tr.appendChild(tdA)
            tr.appendChild(tdData)
            tr.appendChild(tdOra)
            tr.appendChild(tdTipoCorsa)
            tr.appendChild(tdPrezzo)
            tr.appendChild(tdButton)
            tableprenotat.appendChild(tr)
            // Redirect conferma
            btn.addEventListener("click", function() {
            // window.location.href = '../pages/conferma.html?partenza='+ btn.value;
            window.location.href = `../pages/conferma.html?id=${datitempo.id}&partenza=${datitempo.partenza}&arrivo=${datitempo.arrivo}&ora=${datitempo.ora}&tipo_corsa=${datitempo.tipo_corsa}&prezzo=${datitempo.prezzo}&data=${Data}` 
            });
        } 
        // Testo errore
        if(datiricercat.length == 0)
        {
            let trErrore = document.createElement("tr")
            let tdErrore = document.createElement("td")
            tdErrore.innerHTML = "Nessun risultato trovato"
            tdErrore.colSpan = "5"
            tdErrore.style.textAlign = "center"
            trErrore.appendChild(tdErrore)
            tableprenotat.appendChild(trErrore)
        }
    }

    //Invio Dati Tratta per mostrarli come riepilogo dopo la scelta del biglietto
    let datiriga = document.getElementById("datirigascelta")
    if (datiriga)
    {
        let query = window.location.search // Questa riga prende tutto ciò che è scritto nella barra dell'indirizzo web
        let parametriURL = new URLSearchParams(query)
        let partenza = parametriURL.get("partenza")
        let arrivo = parametriURL.get("arrivo")
        let data = parametriURL.get("data")
        let ora = parametriURL.get("ora")
        let tipoCorsa = parametriURL.get("tipo_corsa")
        let prezzo = parametriURL.get("prezzo")
        datiriga.innerHTML = `
        <p>Tratta: ${partenza} - ${arrivo}<br>
        Tipo Corsa: ${tipoCorsa}<br>
        Data: ${data}<br>
        Ora: ${ora}<br>
        Totale: € ${prezzo}</p>
            `
    }
});


// REDIRECT ACQUISTO
function redirectToPage() {
    let query = window.location.search
    let dati = new URLSearchParams(query)
    let id = dati.get('id')
    let data = dati.get('data')
    let formData = new FormData()
    formData.append('id',id)
    formData.append('data',data)
    fetch("http://127.0.0.1:8000/pullman/conferma_Prenotazione", {
        method: 'POST',
        body: formData
        })
.then((response)=> response.json())
.then((dati)=> {
    if (dati.success == true) {
        window.location.href = '../pages/acquistoeffettuato.html'
    }
    else {
        window.location.href = '../pages/acquistoerrato.html'
    }
})
}



//SCRIPT LOGIN
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.endsWith("login.html")) {
    document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita il refresh della pagina
    

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
        // Recupera i dati dal file JSON con gli utenti registrati
        const response = await fetch("../json/login.json"); 
        if (!response.ok) {
            throw new Error("Impossibile caricare i dati utente.");
        }
        const users = await response.json();

        // Controlla se l'utente esiste e se la password è corretta
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem("loggedInUser", user.username);
            window.location.href = "../index.html"; 
        // Reindirizzamento alla pagina 
        } else {
            alert("Email o password errati!");
        }
    } catch (error) {
        console.error("Errore nel login:", error);
        alert("Si è verificato un errore. Riprova più tardi.");
    }
});


}});


// UTENTE LOGGATO
document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
    
    const userInfoDiv = document.getElementById("user-info");
    const usernameSpan = document.getElementById("username");
    const signupBtn = document.getElementById("signup-btn");
    const loginBtn = document.getElementById("login-btn");

    if (loggedInUser) {
        usernameSpan.textContent = loggedInUser; // Imposta il contenuto dell'elemento span con l'username
        userInfoDiv.style.display = "block"; // Mostra il div con l'username
        signupBtn.style.display = "none"; // Nasconde il bottone di registrazione
        loginBtn.style.display = "none"; // Nasconde il bottone di login
    }
});










// SCRIPT SIGNUP
document.addEventListener("DOMContentLoaded", () => {
    let btnsignup = document.getElementById('bottonesignup');
    if (btnsignup) {
        btnsignup.addEventListener('click', async (event) => {
            event.preventDefault(); // Impedisce il comportamento predefinito dell'invio del modulo

            const emailForm = document.getElementById('emailnew').value.trim(); // Ottiene il valore dell'input email e lo rimuove dagli spazi
            const usernameForm = document.getElementById('usernamenew').value.trim(); // Ottiene il valore dell'input username
            const nomeForm = document.getElementById('nome').value.trim(); // Ottiene il valore dell'input nome
            const cognomeForm = document.getElementById('cognome').value.trim(); // Ottiene il valore dell'input cognome
            const passwordForm = document.getElementById('password').value.trim(); // Ottiene il valore dell'input password
            const telefonoForm = document.getElementById('telefono').value.trim(); // Ottiene il valore dell'input telefono
            let errorMessage = '';

            let emailExists = false; // Variabile booleana inizializzata a false

            // Valida gli input
            if (!emailForm || !emailForm.includes('@') || emailForm.indexOf('@') === 0 || emailForm.indexOf('@') === emailForm.length - 1) {
                alert('Per favore, inserisci un\'email valida.');
                return; // Esci dalla funzione se l'email è vuota o non valida
            }

            if (!usernameForm) {
                alert('Per favore, inserisci un username.');
                return; // Esci se lo username è vuoto
            }

            if (!nomeForm) {
                alert('Per favore, inserisci il tuo nome.');
                return; // Esci se il nome è vuoto
            }

            if (!cognomeForm) {
                alert('Per favore, inserisci il tuo cognome.');
                return; // Esci se il cognome è vuoto
            }

            if (!passwordForm) {
                errorMessage += "La password non può essere vuota.\n";
            } 
            if (passwordForm.length < 8) {
                errorMessage += "La password deve essere lunga almeno 8 caratteri.\n";
            } 
            if (!/[A-Z]/.test(passwordForm)) {
                errorMessage += "La password deve contenere almeno una lettera maiuscola.\n";
            } 
            if (!/[a-z]/.test(passwordForm)) {
                errorMessage += "La password deve contenere almeno una lettera minuscola.\n";
            } 
            if (!/[0-9]/.test(passwordForm)) {
                errorMessage += "La password deve contenere almeno un numero.\n";
            } 
            if (!/[^A-Za-z0-9]/.test(passwordForm)) {
                errorMessage += "La password deve contenere almeno un carattere speciale (esempio: !, @, #, $, %, ^, &, *, (, )).\n";
            }

            // Se ci sono errori, mostriamo l'alert
            if (errorMessage) {
                alert(errorMessage);
                return;  // Ferma l'esecuzione se ci sono errori
            }

            if (!telefonoForm || telefonoForm.length !== 10 || !/^\d+$/.test(telefonoForm)) {
                alert('Per favore, inserisci un numero di telefono valido di 10 cifre.');
                return; // Esci se il telefono è vuoto o non è un numero valido di 10 cifre
            }

            try {
                // Ottiene il file login.json
                const response = await fetch('../json/login.json');
                const data = await response.json(); // Aggiorna la variabile con await

                // Controlla ogni oggetto nell'array
                for (const user of data) {
                    if (emailForm === user.email) { // Confronto stretto
                        emailExists = true; // Imposta la variabile booleana su true
                        break; // Esci dal ciclo
                    }
                }

                // Se l'email esiste, mostra un avviso
                if (emailExists) {
                    alert('Questa email è già registrata.');
                } else {
                    alert('Registrazione completata con successo!'); // Puoi eseguire altre azioni qui, come inviare il modulo
                }

            } catch (error) {
                console.error('Errore durante il fetch:', error);
            }
        });  
    }
});




// DARK MODE
// Recupera la modalità dall'archivio locale
function loadTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeSwitch.checked = true;  // Imposta lo switch su "on"
    } else {
        themeSwitch.checked = false;  // Imposta lo switch su "off"
    }
}

// Alterna le modalità
function toggleTheme() {
    const themeSwitch = document.getElementById('themeSwitch');
    document.body.classList.toggle('dark-mode');
    const currentTheme = themeSwitch.checked ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
}

// Esegui il caricamento della modalità all'avvio
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();

    // Imposta il listener per lo switch
    const themeSwitch = document.getElementById('themeSwitch');
    themeSwitch.addEventListener('change', toggleTheme);
});





// VISIBILITÀ PASSWORD
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordField = document.getElementById('password');
    const icon = document.getElementById('togglePassword');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';  // Mostra la password
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';  // Nasconde la password
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});




// FORMATTAZIONE NUMERO DI TELEFONO
document.getElementById('telefono').addEventListener('input', function(event) {
    let input = event.target.value.replace(/[^\d]/g, ''); // Rimuove tutto tranne i numeri

    // Aggiungi i trattini dopo ogni terzina di numeri
    if (input.length > 3 && input.length <= 6) {
        input = input.replace(/(\d{3})(\d{0,3})/, '$1-$2');
    } else if (input.length > 6) {
        input = input.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1-$2-$3');
    }

    event.target.value = input; // Imposta il valore formattato
});


// FILE PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Genera un ID univoco per la ricevuta
    const invoiceId = "INV-" + Math.floor(Math.random() * 100000);
    const currentDate = new Date().toLocaleDateString();

    // Creiamo un oggetto immagine per il logo
    const logo = new Image();
    logo.src = "../img/newlogo.png"; // Percorso del logo

    logo.onload = function() {
        const aspectRatio = logo.width / logo.height;
        const logoWidth = 40; // Larghezza fissa
        const logoHeight = logoWidth / aspectRatio; // Altezza calcolata automaticamente

        // Aggiungiamo il logo in alto a destra
        doc.addImage(logo, "PNG", 150, 10, logoWidth, logoHeight);

        // Formattiamo il testo con più spazio tra le righe
        const lineSpacing = 10; // Spazio tra le righe
        let y = 40; // Posizione iniziale verticale

        doc.setFontSize(16);
        doc.text("Ricevuta di Pagamento", 20, y);
        y += lineSpacing + 5; // Maggiore distanza sotto il titolo

        doc.setFontSize(12);
        doc.text(`Numero Ricevuta: ${invoiceId}`, 20, y);
        y += lineSpacing;

        doc.text(`Data: ${currentDate}`, 20, y);
        y += lineSpacing;

        doc.text(`Cliente: Mario Rossi`, 20, y);
        y += lineSpacing;

        doc.text(`Importo: €100.00`, 20, y);
        y += lineSpacing * 2; // Più spazio prima del QR code

        // Frase legale o di avviso
        doc.setFontSize(10);
        doc.setTextColor(100); // Grigio scuro
        doc.text(
            "Attenzione: questo documento ha valore solo ai sensi dell'Articolo 12 comma 3 del DPR 633/72.", 
            20, y, { maxWidth: 170 }
        );
        y += lineSpacing;

        doc.text(
            "Conservare la ricevuta come prova di acquisto.", 
            20, y, { maxWidth: 170 }
        );
        y += lineSpacing * 2; // Più spazio prima del QR code

        // Genera e aggiunge il QR code
        const qr = new QRious({
            value: `https://www.tuosito.com/verifica-ricevuta?id=${invoiceId}`,
            size: 100
        });

        const qrDataURL = qr.toDataURL();
        doc.addImage(qrDataURL, "PNG", 80, y, 50, 50);

        // Salva il PDF con nome univoco
        doc.save(`ricevuta_${invoiceId}.pdf`);
    };

    logo.onerror = function() {
        alert("Errore: il logo non è stato trovato!");
    };
}

