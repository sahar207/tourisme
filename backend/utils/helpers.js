module.exports = {
  // Formatage de date complet et professionnel
  formatDate: function (date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  // Formatage de date et heure complets
  formatDateTime: function (date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Formatage d'heure uniquement
  formatTime: function (date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Formatage relatif (il y a...)
  formatRelativeTime: function (date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    
    // Si plus d'une semaine, afficher la date complète
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  // Formatage relatif simple (sans HTML)
  formatRelativeTimeSimple: function (date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    // Si plus d'une semaine, afficher la date complète
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  // Formatage avec icône et style
  formatNotificationDate: function (date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '<i class="fas fa-clock text-green-500"></i> À l\'instant';
    if (diffMins < 60) return `<i class="fas fa-clock text-blue-500"></i> Il y a ${diffMins} min`;
    if (diffHours < 24) return `<i class="fas fa-clock text-orange-500"></i> Il y a ${diffHours}h`;
    if (diffDays < 7) return `<i class="fas fa-calendar text-purple-500"></i> Il y a ${diffDays}j`;
    
    return `<i class="fas fa-calendar text-gray-500"></i> ${d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })}`;
  },

  // Formatage compact pour mobile
  formatCompactDate: function (date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const notificationDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.floor((today - notificationDate) / 86400000);

    if (diffDays === 0) {
      // Aujourd'hui - afficher l'heure
      return d.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffDays === 1) {
      // Hier
      return 'Hier';
    } else if (diffDays < 7) {
      // Cette semaine
      return d.toLocaleDateString('fr-FR', {
        weekday: 'short'
      });
    } else {
      // Plus ancien
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short'
      });
    }
  },

  eq: function (a, b) { return a === b; },
  ne: function (a, b) { return a !== b; },
  and: function (a, b) { return a && b; },
  gt: function (a, b) { return a > b; },
  lt: function (a, b) { return a < b; },
  mod: function (a, b) { return a % b; },
  times: function (n, options) {
    let result = '';
    for (let i = 0; i < n; i++) {
      result += options.fn(this);
    }
    return result;
  },
  substring: function (str, start, end) {
    if (!str) return '';
    return str.substring(start, end || str.length);
  },
  split: function (str, separator) {
    if (!str) return [];
    return str.split(separator).map(s => s.trim()).filter(s => s);
  },
  json: function (obj) {
    return JSON.stringify(obj);
  }
};