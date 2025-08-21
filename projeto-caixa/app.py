from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

saldo = 0
extrato = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_saldo', methods=['GET'])
def get_saldo():
    return jsonify({'saldo': f'R$ {saldo:.2f}'})

@app.route('/get_extrato', methods=['GET'])
def get_extrato():
    return jsonify({'extrato': extrato, 'saldo': f'R$ {saldo:.2f}'})

@app.route('/depositar', methods=['POST'])
def depositar():
    global saldo, extrato
    data = request.get_json()
    valor = data.get('valor')

    if valor is None or not isinstance(valor, (int, float)) or valor <= 0:
        return jsonify({'success': False, 'message': 'Valor inválido para depósito.'}), 400
    
    saldo += valor
    extrato.append(f'Depósito: R$ {valor:.2f}')
    return jsonify({'success': True, 'message': f'Depósito de R$ {valor:.2f} realizado com sucesso!'})

@app.route('/sacar', methods=['POST'])
def sacar():
    global saldo, extrato
    data = request.get_json()
    valor = data.get('valor')

    if valor is None or not isinstance(valor, (int, float)) or valor <= 0:
        return jsonify({'success': False, 'message': 'Valor inválido para saque.'}), 400

    if valor > saldo:
        return jsonify({'success': False, 'message': 'Saldo Insuficiente.'}), 400

    saldo -= valor
    extrato.append(f'Saque: R$ {valor:.2f}')
    return jsonify({'success': True, 'message': f'Saque de R$ {valor:.2f} realizado com sucesso!'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)