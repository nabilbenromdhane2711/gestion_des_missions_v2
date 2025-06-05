// Éléments du DOM
const addButton = document.getElementById('addButton');
const recordsList = document.getElementById('recordsList');
const userNameInput = document.getElementById('userName');
const autocompleteContainer = document.getElementById('userNameAutocomplete');
const missionTypeSelect = document.getElementById('missionType');
const missionDetailSelect = document.getElementById('missionDetail');
let records = [];
let archives = []; // Nouveau tableau pour les archives
let currentlyEditingId = null;

// Données
const users = [
    "Abdelkader BenHammouda", "Abderazak Houssaini", /* ... tous les noms ... */ 
    "Zouhour Jazi"
].sort();

const missionTypes = {
    support: "Support/Assistance",
    maintenance: "Maintenance Matérielle",
    // ... autres types ...
};

const missionDetails = {
    support: ["Helpdesk (Assistance)", "Assistance/Support", /* ... */],
    maintenance: ["Changement de disque dur", /* ... */],
    // ... autres détails ...
};

// Fonction d'export et suppression des archives
function exportAndClearArchives() {
    // Vérifier s'il y a des archives
    const archivedRecords = records.filter(record => record.archived);
    
    if (archivedRecords.length === 0) {
        alert("Aucune archive à exporter");
        return;
    }

    // Préparer les données CSV
    const headers = ["ID", "Collaborateur", "Type", "Détail", "Priorité", "Date", "Description"];
    const csvRows = archivedRecords.map(record => [
        record.id,
        `"${record.userName.replace(/"/g, '""')}"`,
        `"${record.missionTypeLabel}"`,
        `"${record.missionDetail.replace(/"/g, '""')}"`,
        record.priority,
        `"${record.date}"`,
        `"${(record.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");

    // Créer et déclencher le téléchargement
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `missions_archives_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Supprimer les archives après export
    records = records.filter(record => !record.archived);
    localStorage.setItem('missionRecords', JSON.stringify(records));
    renderRecords();
}

// Fonction pour archiver un enregistrement (modifiée)
function archiveRecord(id) {
    if (confirm("Êtes-vous sûr de vouloir archiver cette mission ?")) {
        const recordIndex = records.findIndex(r => r.id === id);
        if (recordIndex !== -1) {
            records[recordIndex].archived = true;
            localStorage.setItem('missionRecords', JSON.stringify(records));
            renderRecords();
        }
    }
}

// ... [Conservez toutes vos autres fonctions existantes telles que] ...
// - formatCollaboratorName()
// - renderRecords()
// - changePriority()
// - startEdit()
// - saveEdit()
// - Les écouteurs d'événements

// Initialisation
if (localStorage.getItem('missionRecords')) {
    records = JSON.parse(localStorage.getItem('missionRecords'));
}

// Premier rendu
renderRecords();

// Rendre la fonction disponible globalement
window.exportAndClearArchives = exportAndClearArchives;
