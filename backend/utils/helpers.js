module.exports = {
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
  }
};