const CREATE_ENDPOINT = "/api/create_request";

// Load endpoint configuration
(async () => {
    try {
        const res = await fetch('/api/config');
        const config = await res.json();
        document.getElementById('endpointUrl').textContent = config.endpoint;
    } catch (err) {
        document.getElementById('endpointUrl').textContent = 'Erreur de chargement';
    }
})();

document.getElementById('woForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const label = document.getElementById('btnLabel');
    const spin = document.getElementById('spinner');

    btn.disabled = true;
    label.textContent = 'Envoi en cours…';
    spin.style.display = 'block';

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    try {
        const res = await fetch(CREATE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        showResponse(syntaxHighlight(JSON.stringify(data, null, 2)));
        showToast(res.ok ? 'success' : 'error',
            res.ok ? `Ordre créé (${res.status})` : `Erreur ${res.status}`);
    } catch (err) {
        showResponse(escapeHtml(String(err)));
        showToast('error', `Échec : ${String(err)}`);
    } finally {
        btn.disabled = false;
        label.textContent = "Soumettre l'ordre";
        spin.style.display = 'none';
    }
});

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('description').value = 'problème de clavier';
    document.getElementById('assetnum').value = '7507';
    document.getElementById('location').value = 'REPAIR';
    document.getElementById('reportedby').value = 'Maria';
    document.getElementById('affectedpersonid').value = 'MAXADMIN';
    document.getElementById('status').value = 'NEW';
    document.getElementById('siteid').value = 'BEDFORD';
});

function showResponse(htmlContent) {
    const panel = document.getElementById('responsePanel');
    const body = document.getElementById('responseBody');
    body.innerHTML = htmlContent || '(réponse vide)';
    panel.classList.add('visible');
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>');
}

function syntaxHighlight(json) {
    return escapeHtml(json).replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
            if (/^"/.test(match)) {
                return /:$/.test(match)
                    ? `<span class="json-key">${match}</span>`
                    : `<span class="json-str">${match}</span>`;
            }
            if (/true|false/.test(match)) return `<span class="json-bool">${match}</span>`;
            if (/null/.test(match)) return `<span class="json-null">${match}</span>`;
            return `<span class="json-num">${match}</span>`;
        }
    );
}

function showToast(type, msg) {
    const toast = document.getElementById('toast');
    const text = document.getElementById('toastMsg');
    toast.className = `toast ${type}`;
    text.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
}

// Made with Bob
