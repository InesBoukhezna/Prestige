// Variables globales
let panier = JSON.parse(localStorage.getItem('panier')) || [];
let chartMarges, chartBenefices, chartVentesRevenus, chartVentesCategories;

// Fonction pour calculer l'article
function calculerArticle() {
    const prixAchat = parseFloat(document.getElementById('prixAchat').value);
    const marge = parseFloat(document.getElementById('marge').value) / 100;
    const tva = parseFloat(document.getElementById('pays').value) / 100;
    const quantite = parseInt(document.getElementById('quantite').value);

    if (isNaN(prixAchat) || isNaN(marge) || prixAchat <= 0 || marge <= 0) {
        alert('Veuillez entrer des valeurs valides pour le prix d\'achat et la marge.');
        return;
    }

    const prixVenteHT = prixAchat * (1 + marge);
    const prixVenteTTC = prixVenteHT * (1 + tva);
    const benefice = prixVenteHT - prixAchat;

    document.getElementById('prixVenteHT').textContent = (prixVenteHT * quantite).toFixed(2) + ' DZD';
    document.getElementById('prixVenteTTC').textContent = (prixVenteTTC * quantite).toFixed(2) + ' DZD';
    document.getElementById('benefice').textContent = (benefice * quantite).toFixed(2) + ' DZD';
}

// Fonction pour ajouter au panier
function ajouterAuPanier() {
    const prixAchat = parseFloat(document.getElementById('prixAchat').value);
    const marge = parseFloat(document.getElementById('marge').value) / 100;
    const tva = parseFloat(document.getElementById('pays').value) / 100;
    const quantite = parseInt(document.getElementById('quantite').value);

    if (isNaN(prixAchat) || isNaN(marge) || prixAchat <= 0 || marge <= 0) {
        alert('Calculez d\'abord l\'article.');
        return;
    }

    const article = {
        prixAchat,
        marge,
        tva,
        quantite,
        prixVenteHT: prixAchat * (1 + marge),
        prixVenteTTC: prixAchat * (1 + marge) * (1 + tva),
        benefice: prixAchat * marge
    };

    panier.push(article);
    localStorage.setItem('panier', JSON.stringify(panier));
    afficherPanier();
}

// Fonction pour afficher le panier
function afficherPanier() {
    const panierEl = document.getElementById('panier');
    panierEl.innerHTML = '';
    let total = 0;

    panier.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            Article ${index + 1}: ${item.quantite} x ${item.prixVenteTTC.toFixed(2)} DZD TTC
            <button onclick="supprimerDuPanier(${index})">Supprimer</button>
        `;
        panierEl.appendChild(li);
        total += item.prixVenteTTC * item.quantite;
    });

    document.getElementById('totalPanier').textContent = total.toFixed(2) + ' DZD';
}

// Fonction pour supprimer du panier
function supprimerDuPanier(index) {
    panier.splice(index, 1);
    localStorage.setItem('panier', JSON.stringify(panier));
    afficherPanier();
}

// Fonction pour vider le panier
function viderPanier() {
    panier = [];
    localStorage.removeItem('panier');
    afficherPanier();
}

// Fonction pour générer un reçu
function genererRecu() {
    if (panier.length === 0) {
        alert('Le panier est vide.');
        return;
    }
    let recu = 'Reçu Prestige\n\n';
    panier.forEach((item, index) => {
        recu += `Article ${index + 1}: ${item.quantite} x ${item.prixVenteTTC.toFixed(2)} DZD TTC\n`;
    });
    recu += `\nTotal TTC: ${document.getElementById('totalPanier').textContent}`;
    alert(recu); // En production, imprimez ou envoyez par email
}

// Fonction pour mettre à jour les graphiques
function updateCharts() {
    const ctxMarges = document.getElementById('chartMarges').getContext('2d');
    const ctxBenefices = document.getElementById('chartBenefices').getContext('2d');

    const marges = panier.map(item => item.marge * 100);
    const benefices = panier.map(item => item.benefice * item.quantite);

    if (chartMarges) chartMarges.destroy();
    if (chartBenefices) chartBenefices.destroy();

    chartMarges = new Chart(ctxMarges, {
        type: 'bar',
        data: {
            labels: panier.map((_, i) => `Article ${i + 1}`),
            datasets: [{ label: 'Marges (%)', data: marges, backgroundColor: '#FFD700' }]
        }
    });

    chartBenefices = new Chart(ctxBenefices, {
        type: 'line',
        data: {
            labels: panier.map((_, i) => `Article ${i + 1}`),
            datasets: [{ label: 'Bénéfices (DZD)', data: benefices, borderColor: '#FFA500' }]
        }
    });
}

// Fonction pour mettre à jour les graphiques de ventes
function updateVentesCharts() {
    const ctxRevenus = document.getElementById('chartVentesRevenus').getContext('2d');
    const ctxCategories = document.getElementById('chartVentesCategories').getContext('2d');

    // Données fictives pour simulation (remplacez par données réelles)
    const revenus = [1000, 1500, 1200, 1800]; // Ex: par mois
    const categories = ['Luxe', 'Électronique', 'Mode', 'Autre'];

    if (chartVentesRevenus) chartVentesRevenus.destroy();
    if (chartVentesCategories) chartVentesCategories.destroy();

    chartVentesRevenus = new Chart(ctxRevenus, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr'],
            datasets: [{ label: 'Revenus (DZD)', data: revenus, borderColor: '#FFD700' }]
        }
    });

    chartVentesCategories = new Chart(ctxCategories, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{ data: [40, 30, 20, 10], backgroundColor: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520'] }]
        }
    });
}

// Fonction pour basculer le backoffice
function toggleBackoffice() {
    const backoffice = document.getElementById('backoffice');
    backoffice.style.display = backoffice.style.display === 'block' ? 'none' : 'block';
}

// Fonction pour sauvegarder les edits
function sauvegarderEdits() {
    const header = document.getElementById('editHeader').value;
    const content = document.getElementById('editContent').value;
    const footer = document.getElementById('editFooter').value;

    localStorage.setItem('siteHeader', header);
    localStorage.setItem('siteContent', content);
    localStorage.setItem('siteFooter', footer);
    alert('Édits sauvegardés.');
}

// Fonction pour charger les edits
function chargerEdits() {
    document.getElementById('editHeader').value = localStorage.getItem('siteHeader') || '';
    document.getElementById('editContent').value = localStorage.getItem('siteContent') || '';
    document.getElementById('editFooter').value = localStorage.getItem('siteFooter') || '';
}

// Fonctions pour les modales
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Fonction pour inscrire un admin (simulation)
function inscrireAdmin() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    if (user && pass) {
        localStorage.setItem('admin', JSON.stringify({ user, pass }));
        alert('Admin inscrit.');
        closeModal('adminModal');
    } else {
        alert('Remplissez tous les champs.');
    }
}

// Fonction pour lier Facebook (simulation)
function lierFacebook() {
    const appId = document.getElementById('facebookAppId').value;
    const token = document.getElementById('facebookToken').value;
    if (appId && token) {
        alert('Lié à Facebook Ads (simulation).');
        closeModal('facebookModal');
    } else {
        alert('Remplissez tous les champs.');
    }
}

// Fonction pour lier le site de vente
function lierVente() {
    const url = document.getElementById('venteUrl').value;
    if (url) {
        window.open(url, '_blank');
        closeModal('venteModal');
    } else {
        alert('Entrez une URL valide.');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    afficherPanier();
    chargerEdits();
});