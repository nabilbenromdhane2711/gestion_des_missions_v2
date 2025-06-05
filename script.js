// Initialisation du formulaire
function initForm() {
    const missionTypeSelect = document.getElementById('missionType');
    const missionDetailSelect = document.getElementById('missionDetail');
    
    missionTypeSelect.addEventListener('change', function() {
        const selectedType = this.value;
        missionDetailSelect.innerHTML = '';
        
        if (!selectedType) {
            missionDetailSelect.disabled = true;
            missionDetailSelect.innerHTML = '<option value="">Sélectionnez d\'abord le type de mission</option>';
            return;
        }
        
        missionDetailSelect.disabled = false;
        const details = getMissionDetails(selectedType);
        
        details.forEach(detail => {
            const option = document.createElement('option');
            option.value = detail;
            option.textContent = detail;
            missionDetailSelect.appendChild(option);
        });
    });

    document.getElementById('addButton').addEventListener('click', addMission);
}

// Fonction pour ajouter une mission
function addMission() {
    const formElements = {
        userName: document.getElementById('userName'),
        interventionType: document.getElementById('interventionType'),
        missionType: document.getElementById('missionType'),
        missionDetail: document.getElementById('missionDetail'),
        priority: document.getElementById('priority'),
        description: document.getElementById('missionDescription')
    };

    // Validation
    let isValid = true;
    Object.values(formElements).forEach(el => {
        if (el.required && !el.value) {
            el.classList.add('error');
            isValid = false;
        } else {
            el.classList.remove('error');
        }
    });

    if (!isValid) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    // Création de la mission
    const newMission = {
        id: Date.now(),
        userName: formElements.userName.value,
        interventionType: formElements.interventionType.value,
        missionType: formElements.missionType.value,
        missionDetail: formElements.missionDetail.value,
        priority: parseInt(formElements.priority.value),
        description: formElements.description.value,
        date: new Date().toLocaleString('fr-FR')
    };

    db.missions.push(newMission);
    saveDB();
    renderMissions();
    resetForm();
}

function resetForm() {
    document.getElementById('userName').value = '';
    document.getElementById('interventionType').value = '';
    document.getElementById('missionType').value = '';
    document.getElementById('missionDetail').innerHTML = '<option value="">Sélectionnez d\'abord le type de mission</option>';
    document.getElementById('missionDetail').disabled = true;
    document.getElementById('priority').value = '';
    document.getElementById('missionDescription').value = '';
}

// Initialisation complète
function init() {
    loadDB();
    initForm();
    initAutocomplete();
    renderMissions();
}

document.addEventListener('DOMContentLoaded', init);
