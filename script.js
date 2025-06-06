// Éléments du DOM
const addButton = document.getElementById('addButton');
const recordsList = document.getElementById('recordsList');
const userNameInput = document.getElementById('userName');
const autocompleteContainer = document.getElementById('userNameAutocomplete');
const missionTypeSelect = document.getElementById('missionType');
const missionDetailSelect = document.getElementById('missionDetail');
let records = [];
let currentlyEditingId = null;
let currentFocus = -1;

// Données
const users = [
    "Abdelkader BenHammouda", "Abderazak Houssaini", "Afef Karaani", "Ahlem Abdrabbou",
    "Zouhour Jazi"
].sort();

const missionTypes = {
    support: "Support/Assistance",
    maintenance: "Maintenance Matérielle",
    network: "Réseau & Configuration",
    software: "Logiciels & Mises à jour",
    security: "Sécurité/Sauvegarde",
    microsoft: "Applications Microsoft",
    printing: "Impression",
    equipment: "Équipements",
    purchase: "Achat",
    training: "Formation/Sensibilisation"
};

const missionDetails = {
    support: ["Helpdesk (Assistance)", "Assistance/Support"],
    maintenance: ["Changement de disque dur"],
    network: ["Configuration de routeur"],
    software: ["Mise à jour logicielle"],
    security: ["Sauvegarde des données"],
    microsoft: ["Excel - Formation"],
    printing: ["Dépannage imprimante"],
    equipment: ["Installation poste"],
    purchase: ["Devis matériel"],
    training: ["Formations utilisateurs", "Ateliers ou événements"]
};

// Fonctions
function formatCollaboratorName(name) {
    const parts = name.split(' ');
    if (parts.length >= 2) {
        const firstName = parts[0];
        const lastName = parts.slice(1).join(' ').toUpperCase();
        return `${firstName} ${lastName}`;
    }
    return name;
}

function renderRecords() {
    const activeRecords = records.filter(record => !record.archived);

    if (activeRecords.length === 0) {
        recordsList.innerHTML = '<p>Aucune mission enregistrée pour le moment.</p>';
        return;
    }

    activeRecords.sort((a, b) => a.priority - b.priority);

    recordsList.innerHTML = activeRecords.map(record => {
        const priorityClass = `priority-${record.priority === 1 ? 'high' : record.priority === 2 ? 'medium' : 'low'}`;
        const interventionClass = `intervention-${record.interventionType}`;
        const interventionText = record.interventionType === 'remote' ? 'À distance' :
            record.interventionType === 'onsite' ? 'Sur place' : 'Les deux';
        const isEditing = currentlyEditingId === record.id;

        return `
            <div class="record-item ${interventionClass}" data-id="${record.id}">
                <div class="mission-details">
                    <span class="collaborator-name">${formatCollaboratorName(record.userName)}</span> - ${record.missionTypeLabel}
                    <div class="problem-details">${record.missionDetail}</div>
                    ${isEditing ?
                `<textarea class="edit-description">${record.description || ''}</textarea>` :
                (record.description ? `<div class="description">${record.description}</div>` : '')
            }
                    <small>${interventionText} • ${record.date}</small>
                </div>
                <div class="mission-actions">
                    <div class="priority-controls">
                        <button class="priority-btn" onclick="changePriority(${record.id}, 'up')">↑</button>
                        <div class="priority-value ${priorityClass}">${record.priority}</div>
                        <button class="priority-btn" onclick="changePriority(${record.id}, 'down')">↓</button>
                    </div>
                    ${isEditing ?
                `<button class="edit-btn" onclick="saveEdit(${record.id})">Enregistrer</button>` :
                `<button class="edit-btn" onclick="startEdit(${record.id})">Modifier</button>`
            }
                    <button class="archive-btn" onclick="archiveRecord(${record.id})">Archiver</button>
                </div>
            </div>
        `;
    }).join('');
}

// Fonctions globales (nécessaires pour les handlers inline)
window.changePriority = function (id, direction) {
    const record = records.find(r => r.id === id);
    if (record) {
        if (direction === 'up' && record.priority > 1) record.priority--;
        if (direction === 'down' && record.priority < 3) record.priority++;
        localStorage.setItem('missionRecords', JSON.stringify(records));
        renderRecords();
    }
};

window.archiveRecord = function (id) {
    if (confirm("Êtes-vous sûr de vouloir archiver cette mission ?")) {
        const record = records.find(r => r.id === id);
        if (record) {
            record.archived = true;
            localStorage.setItem('missionRecords', JSON.stringify(records));
            renderRecords();
        }
    }
};

window.startEdit = function (id) {
    currentlyEditingId = id;
    renderRecords();
};

window.saveEdit = function (id) {
    const record = records.find(r => r.id === id);
    if (record) {
        const textarea = document.querySelector(`.record-item[data-id="${id}"] .edit-description`);
        if (textarea) {
            record.description = textarea.value;
            localStorage.setItem('missionRecords', JSON.stringify(records));
            currentlyEditingId = null;
            renderRecords();
        }
    }
};

// Initialisation
if (localStorage.getItem('missionRecords')) {
    records = JSON.parse(localStorage.getItem('missionRecords'));
}

// Événements
missionTypeSelect.addEventListener('change', function () {
    const selectedType = this.value;
    missionDetailSelect.innerHTML = selectedType
        ? `<option value="">Sélectionnez un détail</option>${missionDetails[selectedType].map(d => `<option value="${d}">${d}</option>`).join('')}`
        : '<option value="">Sélectionnez d\'abord le type de mission</option>';
    missionDetailSelect.disabled = !selectedType;
});

userNameInput.addEventListener('input', function () {
    const input = this.value.toLowerCase();
    autocompleteContainer.innerHTML = '';
    autocompleteContainer.style.display = 'none';

    if (input.length >= 2) {
        const matches = users.filter(user => user.toLowerCase().includes(input));
        if (matches.length) {
            autocompleteContainer.innerHTML = matches.map(match => {
                const startIdx = match.toLowerCase().indexOf(input);
                return `<div>${[
                    match.substring(0, startIdx),
                    `<strong>${match.substring(startIdx, startIdx + input.length)}</strong>`,
                    match.substring(startIdx + input.length)
                ].join('')}</div>`;
            }).join('');
            autocompleteContainer.style.display = 'block';
        }
    }
});

document.addEventListener('click', (e) => {
    if (e.target !== userNameInput) {
        autocompleteContainer.style.display = 'none';
    }
});

userNameInput.addEventListener('keydown', function (e) {
    const items = autocompleteContainer.children;
    if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowDown') currentFocus = Math.min(currentFocus + 1, items.length - 1);
        if (e.key === 'ArrowUp') currentFocus = Math.max(currentFocus - 1, -1);
        if (e.key === 'Enter' && currentFocus > -1) items[currentFocus].click();

        Array.from(items).forEach((item, i) =>
            item.classList.toggle('autocomplete-active', i === currentFocus));
    }
});

autocompleteContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'DIV') {
        userNameInput.value = e.target.textContent;
        autocompleteContainer.style.display = 'none';
    }
});

addButton.addEventListener('click', function () {
    const userName = userNameInput.value.trim();
    const interventionType = document.getElementById('interventionType').value;
    const missionType = missionTypeSelect.value;
    const missionDetail = missionDetailSelect.value;
    const priority = document.getElementById('priority').value;
    const description = document.getElementById('missionDescription').value;

    if (userName && interventionType && missionType && missionDetail && priority) {
        if (!users.includes(userName)) {
            alert("Nom de collaborateur non reconnu. Veuillez sélectionner un nom dans la liste.");
            return;
        }

        records.push({
            id: Date.now(),
            userName,
            interventionType,
            missionType,
            missionTypeLabel: missionTypes[missionType],
            missionDetail,
            description,
            priority: parseInt(priority),
            date: new Date().toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            archived: false
        });

        localStorage.setItem('missionRecords', JSON.stringify(records));
        renderRecords();

        // Réinitialisation du formulaire
        userNameInput.value = '';
        document.getElementById('interventionType').value = '';
        missionTypeSelect.value = '';
        missionDetailSelect.innerHTML = '<option value="">Sélectionnez d\'abord le type de mission</option>';
        missionDetailSelect.disabled = true;
        document.getElementById('priority').value = '';
        document.getElementById('missionDescription').value = '';
    } else {
        alert('Veuillez remplir tous les champs obligatoires du formulaire.');
    }
});

// Premier rendu
renderRecords();
