// STRUCTURE DE DONNÉES COMBINÉE
const app = {
    db: {
        missions: [],
        archives: [],
        users: ["Abdelkader BenHammouda", "Abderazak Houssaini", /* ... votre liste complète ... */]
    },
    
    init: function() {
        this.loadData();
        this.setupForm();
        this.setupAutocomplete();
        this.renderMissions();
    },
    
    // FONCTIONS ORIGINALES (adaptées)
    formatName: function(name) {
        const parts = name.split(' ');
        return parts.length >= 2 
            ? `${parts[0]} ${parts.slice(1).join(' ').toUpperCase()}` 
            : name;
    },
    
    setupForm: function() {
        // Votre logique de formulaire originale
        document.getElementById('missionType').addEventListener('change', function() {
            // ... votre gestion des menus déroulants ...
        });
        
        document.getElementById('addButton').addEventListener('click', () => {
            // Validation et ajout de mission
            const newMission = {
                id: Date.now(),
                userName: document.getElementById('userName').value,
                // ... autres valeurs du formulaire ...
                archived: false
            };
            
            this.db.missions.push(newMission);
            this.saveData();
            this.renderMissions();
        });
    },
    
    // NOUVELLES FONCTIONS D'ARCHIVAGE
    archiveMission: function(id) {
        const mission = this.db.missions.find(m => m.id === id);
        if (mission) {
            this.db.archives.push({
                ...mission,
                archivedDate: new Date().toISOString()
            });
            this.db.missions = this.db.missions.filter(m => m.id !== id);
            this.saveData();
            this.renderMissions();
        }
    },
    
    restoreMission: function(id) {
        const archive = this.db.archives.find(a => a.id === id);
        if (archive) {
            this.db.missions.push({
                ...archive,
                archivedDate: undefined
            });
            this.db.archives = this.db.archives.filter(a => a.id !== id);
            this.saveData();
            this.renderAll();
        }
    },
    
    // FONCTIONS D'AFFICHAGE COMBINÉES
    renderAll: function() {
        this.renderMissions();
        this.renderArchives();
    },
    
    renderArchives: function() {
        const html = this.db.archives.map(archive => `
            <div class="record-item archived-item">
                <div>${this.formatName(archive.userName)}</div>
                <button onclick="app.restoreMission(${archive.id})" class="restore-btn">Restaurer</button>
            </div>
        `).join('');
        
        document.getElementById('archivesList').innerHTML = html || "<p>Aucune archive</p>";
    }
};

// INITIALISATION
document.addEventListener('DOMContentLoaded', () => app.init());

// FONCTIONS GLOBALES POUR LES HANDLERS HTML
window.toggleArchives = function() {
    const container = document.querySelector('.archives-container');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
    if (container.style.display === 'block') app.renderArchives();
};
