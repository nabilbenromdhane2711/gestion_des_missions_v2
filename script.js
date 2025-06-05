// Base de données
const db = {
    missions: [],
    archives: [],
    lastUpdate: new Date().toISOString()
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadDB();
    initForm();
    renderMissions();
});

// Gestion de la base de données
function saveDB() {
    const compressed = LZString.compressToUTF16(JSON.stringify(db));
    localStorage.setItem('missionDB', compressed);
}

function loadDB() {
    const compressed = localStorage.getItem('missionDB');
    if (compressed) {
        const data = JSON.parse(LZString.decompressFromUTF16(compressed));
        Object.assign(db, data);
    }
}

// Fonctions d'archivage
function archiveMission(id) {
    const mission = db.missions.find(m => m.id === id);
    if (mission && confirm("Archiver cette mission ?")) {
        db.archives.push({
            ...mission,
            archivedDate: new Date().toISOString()
        });
        db.missions = db.missions.filter(m => m.id !== id);
        saveDB();
        renderMissions();
    }
}

function restoreMission(id) {
    const archive = db.archives.find(a => a.id === id);
    if (archive && confirm("Restaurer cette mission ?")) {
        db.missions.push({
            ...archive,
            archivedDate: undefined
        });
        db.archives = db.archives.filter(a => a.id !== id);
        saveDB();
        renderMissions();
        renderArchives();
    }
}

// Affichage
function toggleArchives() {
    const container = document.querySelector('.archives-container');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
    if (container.style.display === 'block') renderArchives();
}

function renderArchives() {
    const archivesList = document.getElementById('archivesList');
    archivesList.innerHTML = db.archives.length ? 
        db.archives.map(archive => `
            <div class="record-item archived-item" data-id="${archive.id}">
                <div class="mission-details">
                    <span>${formatName(archive.userName)}</span> - ${archive.missionTypeLabel}
                    <div class="problem-details">${archive.missionDetail}</div>
                    <small>Archivé le ${new Date(archive.archivedDate).toLocaleString('fr-FR')}</small>
                </div>
                <button class="restore-btn" onclick="restoreMission(${archive.id})">Restaurer</button>
            </div>
        `).join('') : '<p>Aucune mission archivée</p>';
}

// [Vos autres fonctions existantes (renderMissions, initForm, etc.)]
// Pensez à remplacer archiveRecord() par archiveMission()