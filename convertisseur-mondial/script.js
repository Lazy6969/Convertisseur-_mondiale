// =============== ONGLETS ===============
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Retirer classe active
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Ajouter classe active
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// =============== CONVERTISSEUR ===============
const API_URL = 'https://open.er-api.com/v6/latest/USD';
const USD_TO_MGA = 4500; // Ajustez selon le marché
const USD_TO_MGF = USD_TO_MGA * 5;

let exchangeRates = null;

window.onload = () => {
    loadCurrencies();
};

async function loadCurrencies() {
    const rateInfo = document.getElementById('rateInfo');
    rateInfo.textContent = 'Chargement...';

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.result !== 'success') throw new Error();

        exchangeRates = { ...data.rates };
        exchangeRates['MGA'] = USD_TO_MGA;
        exchangeRates['MGF'] = USD_TO_MGF;

        populateCurrencySelects();
        convert();
        rateInfo.textContent = `Taux mis à jour : ${new Date(data.time_last_update_utc).toLocaleDateString('fr-FR')}`;
    } catch (e) {
        rateInfo.textContent = '❌ Erreur de connexion';
        // Remplir avec devises de base si offline
        exchangeRates = { USD: 1, EUR: 0.93, MGA: USD_TO_MGA, MGF: USD_TO_MGF };
        populateCurrencySelects();
    }
}

function populateCurrencySelects() {
    const fromSel = document.getElementById('from');
    const toSel = document.getElementById('to');
    fromSel.innerHTML = '';
    toSel.innerHTML = '';

    const custom = ['MGA', 'MGF'];
    custom.forEach(code => {
        const name = getCurrencyName(code);
        fromSel.appendChild(new Option(`${name} (${code})`, code));
        toSel.appendChild(new Option(`${name} (${code})`, code));
    });

    fromSel.appendChild(new Option('──────────', '', false, true));
    toSel.appendChild(new Option('──────────', '', false, true));

    const others = Object.keys(exchangeRates).filter(c => !custom.includes(c)).sort();
    others.forEach(code => {
        const name = getCurrencyName(code);
        fromSel.appendChild(new Option(`${name} (${code})`, code));
        toSel.appendChild(new Option(`${name} (${code})`, code));
    });

    fromSel.value = 'MGA';
    toSel.value = 'MGF';
}

function getCurrencyName(code) {
    const names = {
        MGA: 'Ariary malgache',
        MGF: 'Franc malgache (hist.)',
        USD: 'Dollar américain',
        EUR: 'Euro',
        GBP: 'Livre sterling',
        JPY: 'Yen japonais',
        CNY: 'Yuan chinois',
        INR: 'Roupie indienne',
        XOF: 'Franc CFA',
    };
    return names[code] || code;
}

function convert() {
    if (!exchangeRates) return;
    const amount = parseFloat(document.getElementById('amount').value.replace(',', '.'));
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const res = document.getElementById('result');

    if (isNaN(amount)) { res.textContent = '—'; return; }

    const rFrom = exchangeRates[from];
    const rTo = exchangeRates[to];
    if (!rFrom || !rTo) { res.textContent = '❌'; return; }

    const result = (amount / rFrom) * rTo;
    res.textContent = result.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: result < 1 ? 6 : 2
    }) + ' ' + to;
}

function switchCurrencies() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    document.getElementById('from').value = to;
    document.getElementById('to').value = from;
    convert();
}

// =============== CALCULATRICE ===============
let calcDisplay = document.getElementById('calc-display');

function calcAppend(value) {
    let current = calcDisplay.value;
    if (current === '0' && value !== '.') {
        calcDisplay.value = value;
    } else {
        // Éviter les opérateurs multiples
        const lastChar = current.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar) && ['+', '-', '*', '/'].includes(value)) {
            calcDisplay.value = current.slice(0, -1) + value;
        } else {
            calcDisplay.value += value;
        }
    }
}

function calcClear() {
    calcDisplay.value = '0';
}

function calcBackspace() {
    calcDisplay.value = calcDisplay.value.length > 1 ? calcDisplay.value.slice(0, -1) : '0';
}

function calcToggleSign() {
    if (calcDisplay.value !== '0') {
        if (calcDisplay.value.startsWith('-')) {
            calcDisplay.value = calcDisplay.value.slice(1);
        } else {
            calcDisplay.value = '-' + calcDisplay.value;
        }
    }
}

function calcPercent() {
    try {
        const expr = calcDisplay.value;
        // Remplacer les opérateurs pour évaluer la dernière valeur comme %
        const parts = expr.split(/([+\-*/])/);
        if (parts.length >= 3) {
            const lastNum = parseFloat(parts[parts.length - 1]);
            const prevNum = parseFloat(parts[parts.length - 3]);
            const op = parts[parts.length - 2];
            let percentValue;
            switch (op) {
                case '+': percentValue = prevNum * (lastNum / 100); break;
                case '-': percentValue = prevNum * (lastNum / 100); break;
                case '*': percentValue = prevNum * (lastNum / 100); break;
                case '/': percentValue = prevNum * (lastNum / 100); break;
                default: return;
            }
            parts[parts.length - 1] = percentValue.toString();
            calcDisplay.value = parts.join('');
        }
    } catch (e) {
        calcDisplay.value = 'Erreur';
    }
}

function calcEquals() {
    try {
        let expr = calcDisplay.value
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');

        // Sécurité basique
        if (/[^0-9+\-*/().\s]/.test(expr)) throw new Error('Invalid');

        let result = Function('"use strict"; return (' + expr + ')')();
        calcDisplay.value = parseFloat(result.toFixed(10)).toString();
    } catch (e) {
        calcDisplay.value = 'Erreur';
        setTimeout(() => calcClear(), 1500);
    }
}