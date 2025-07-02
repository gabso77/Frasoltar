document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.getElementById('chat-button');
    const chatModal = document.getElementById('chat-modal');
    const closeChat = document.getElementById('close-chat');
    const sendChat = document.getElementById('send-chat');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');
  
    // Apri la chat
    chatButton.addEventListener('click', function() {
      chatModal.style.display = 'block';
    });
  
    // Chiudi la chat
    closeChat.addEventListener('click', function() {
      chatModal.style.display = 'none';
    });
  
    chatInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault(); // Impedisce invio form o newline
        sendChat.click(); // Simula il click sul bottone
      }
    });


    // Invia messaggio
    sendChat.addEventListener('click', function() {
      const message = chatInput.value.trim();
      if (!message) return;
  
      // Mostra il messaggio dell'utente
      appendMessage("Tu", message);
      chatInput.value = '';
  
      // Apri una connessione SSE al server, passando il messaggio come query param
      const url = `http://127.0.0.1:8000/pullman/chat?message=${encodeURIComponent(message)}`;
      const eventSource = new EventSource(url);
  
      eventSource.onmessage = function(e) {
        try {
          const data = JSON.parse(e.data);
          if (data.response) {
            // Ogni chunk di testo viene aggiunto alla chat
            appendMessage("Assistente", data.response);
          }
          if (data.error) {
            appendMessage("Errore", data.error);
          }
        } catch (err) {
          console.error("Errore di parsing SSE:", err);
        }
      };
  
      eventSource.onerror = function(e) {
        console.error("Errore nella connessione SSE:", e);
        eventSource.close();
      };
    });
  
    function appendMessage(sender, text) {
      const msgDiv = document.createElement('div');
      msgDiv.textContent = sender + ": " + text;
      msgDiv.style.marginBottom = "10px";
      chatBody.appendChild(msgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  });
  