<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🇲🇬 Convertisseur + Calculatrice Madagascar</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🇲🇬 Outil Complet Madagascar</h1>

        <!-- Onglets -->
        <div class="tabs">
            <button class="tab-btn active" data-tab="converter">💱 Convertisseur</button>
            <button class="tab-btn" data-tab="calculator">🧮 Calculatrice</button>
        </div>

        <!-- Convertisseur -->
        <div id="converter" class="tab-content active">
            <div class="input-group">
                <input type="text" id="amount" placeholder="Montant" value="1" oninput="convert()">
            </div>
            <div class="input-group">
                <select id="from" onchange="convert()"></select>
            </div>
            <div class="switch-btn" onclick="switchCurrencies()">⇄</div>
            <div class="input-group">
                <select id="to" onchange="convert()"></select>
            </div>
            <div class="result" id="result">—</div>
            <div class="rate-info" id="rateInfo">Chargement des taux...</div>
            <button class="btn-refresh" onclick="loadCurrencies()">↻ Actualiser</button>
        </div>

        <!-- Calculatrice -->
        <div id="calculator" class="tab-content">
            <div class="calc-display">
                <input type="text" id="calc-display" readonly value="0">
            </div>
            <div class="calc-keypad">
                <!-- Ligne 1 -->
                <button onclick="calcClear()">C</button>
                <button onclick="calcBackspace()">⌫</button>
                <button onclick="calcAppend('/')">÷</button>
                <button onclick="calcAppend('*')">×</button>

                <!-- Ligne 2 -->
                <button onclick="calcAppend('7')">7</button>
                <button onclick="calcAppend('8')">8</button>
                <button onclick="calcAppend('9')">9</button>
                <button onclick="calcAppend('-')">−</button>

                <!-- Ligne 3 -->
                <button onclick="calcAppend('4')">4</button>
                <button onclick="calcAppend('5')">5</button>
                <button onclick="calcAppend('6')">6</button>
                <button onclick="calcAppend('+')">+</button>

                <!-- Ligne 4 -->
                <button onclick="calcAppend('1')">1</button>
                <button onclick="calcAppend('2')">2</button>
                <button onclick="calcAppend('3')">3</button>
                <button class="equals" onclick="calcEquals()">=</button>

                <!-- Ligne 5 -->
                <button onclick="calcAppend('0')">0</button>
                <button onclick="calcAppend('.')">.</button>
                <button onclick="calcToggleSign()">±</button>
                <button class="equals" style="background:#2ecc71;" onclick="calcPercent()">%</button>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>