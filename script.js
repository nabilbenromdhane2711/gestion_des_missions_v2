// Base de données
const db = {
    missions: [],
    archives: [],
    users: ["Abdelkader BenHammouda", "Abderazak Houssaini", /* ... */ ],
    lastUpdate: new Date().toISOString()
};

// Initialisation
function init() {
    loadDB();
    setupEventListeners();
    renderMissions();
}

// Gestion des données
function loadDB() {
    const compressed = localStorage.getItem('missionDB');
    if (compressed) {
        const decompressed = LZString.decompressFromUTF16(compressed);
        if (decompressed) {
            Object.assign(db, JSON.parse(decompressed));
        }
    }
}

function saveDB() {
    const compressed = LZString.compressToUTF16(JSON.stringify(db));
    localStorage.setItem('missionDB', compressed);
}

// Fonctions d'archivage
function archiveMission(id) {
    const mission = db.missions.find(m => m.id === id);
    if (mission) {
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
    if (archive) {
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
function renderMissions() {
    const recordsList = document.getElementById('recordsList');
    recordsList.innerHTML = db.missions.length ? 
        db.missions.map(mission => `
            <div class="record-item" data-id="${mission.id}">
                <!-- [Votre template de mission existant] -->
                <button onclick="archiveMission(${mission.id})" class="archive-btn">Archiver</button>
            </div>
        `).join('') : '<p>Aucune mission active</p>';
}

function renderArchives() {
    const archivesList = document.getElementById('archivesList');
    archivesList.innerHTML = db.archives.length ? 
        db.archives.map(archive => `
            <div class="record-item archived-item" data-id="${archive.id}">
                <!-- [Template similaire à renderMissions] -->
                <button onclick="restoreMission(${archive.id})" class="restore-btn">Restaurer</button>
            </div>
        `).join('') : '<p>Aucune mission archivée</p>';
}

function toggleArchives() {
    const container = document.querySelector('.archives-container');
    container.style.display = container.style.display === '
