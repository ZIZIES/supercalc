'use client';

import { useState } from 'react';

type Base = 'DEC' | 'HEX' | 'BIN' | 'OCT';

export default function Home() {
  const [mode, setMode] = useState<'basic' | 'scientific' | 'programmer'>('basic');
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [base, setBase] = useState<Base>('DEC');

  const handleNumber = (num: string) => {
    // validate input based on current base in programmer mode
    if (mode === 'programmer') {
      const validChars: Record<Base, string> = {
        BIN: '01',
        OCT: '01234567',
        DEC: '0123456789',
        HEX: '0123456789ABCDEF',
      };
      if (!validChars[base].includes(num.toUpperCase())) return;
    }

    if (currentValue === '0') {
      setCurrentValue(num);
      setDisplay(num);
    } else {
      const newValue = currentValue + num;
      setCurrentValue(newValue);
      setDisplay(newValue);
    }
  };

  const handleOperation = (op: string) => {
    setPreviousValue(currentValue);
    setOperation(op);
    setCurrentValue('0');
  };

  const handleEquals = () => {
    if (previousValue === null || operation === null) return;

    let prev = parseFloat(previousValue);
    let curr = parseFloat(currentValue);

    // convert from current base if in programmer mode
    if (mode === 'programmer') {
      prev = parseInt(previousValue, getBaseNumber(base));
      curr = parseInt(currentValue, getBaseNumber(base));
    }

    let result = 0;

    switch (operation) {
      case '+':
        result = prev + curr;
        break;
      case '-':
        result = prev - curr;
        break;
      case '×':
        result = prev * curr;
        break;
      case '÷':
        result = prev / curr;
        break;
      case '^':
        result = Math.pow(prev, curr);
        break;
      case 'AND':
        result = prev & curr;
        break;
      case 'OR':
        result = prev | curr;
        break;
      case 'XOR':
        result = prev ^ curr;
        break;
    }

    // convert back to current base if in programmer mode
    if (mode === 'programmer') {
      const resultStr = Math.floor(result).toString(getBaseNumber(base)).toUpperCase();
      setDisplay(resultStr);
      setCurrentValue(resultStr);
    } else {
      setDisplay(result.toString());
      setCurrentValue(result.toString());
    }

    setPreviousValue(null);
    setOperation(null);
  };

  const getBaseNumber = (b: Base): number => {
    switch (b) {
      case 'BIN': return 2;
      case 'OCT': return 8;
      case 'DEC': return 10;
      case 'HEX': return 16;
    }
  };

  const handleBaseChange = (newBase: Base) => {
    // convert current value to new base
    const decValue = parseInt(currentValue, getBaseNumber(base));
    if (isNaN(decValue)) {
      setBase(newBase);
      return;
    }
    const newValue = decValue.toString(getBaseNumber(newBase)).toUpperCase();
    setCurrentValue(newValue);
    setDisplay(newValue);
    setBase(newBase);
  };

  const handleScientific = (func: string) => {
    const curr = parseFloat(currentValue);
    let result = 0;

    switch (func) {
      case 'sin':
        result = Math.sin(curr);
        break;
      case 'cos':
        result = Math.cos(curr);
        break;
      case 'tan':
        result = Math.tan(curr);
        break;
      case 'log':
        result = Math.log10(curr);
        break;
      case 'ln':
        result = Math.log(curr);
        break;
      case '√':
        result = Math.sqrt(curr);
        break;
      case 'x²':
        result = curr * curr;
        break;
      case '1/x':
        result = 1 / curr;
        break;
      case '±':
        result = curr * -1;
        break;
    }

    setDisplay(result.toString());
    setCurrentValue(result.toString());
  };

  const handleClear = () => {
    setDisplay('0');
    setCurrentValue('0');
    setPreviousValue(null);
    setOperation(null);
  };

  const handleDecimal = () => {
    if (mode === 'programmer') return; // no decimals in programmer mode
    if (!currentValue.includes('.')) {
      const newValue = currentValue + '.';
      setCurrentValue(newValue);
      setDisplay(newValue);
    }
  };

  const basicButtons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['C', '0', '.', '+'],
    ['', '', '', '='],
  ];

  const scientificButtons = [
    ['sin', 'cos', 'tan', 'log'],
    ['√', 'x²', '^', 'ln'],
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['C', '0', '.', '+'],
    ['±', '1/x', 'π', '='],
  ];

  const programmerButtons = [
    ['HEX', 'DEC', 'BIN', 'OCT'],
    ['A', 'B', 'C', 'D'],
    ['E', 'F', '7', '8'],
    ['9', '4', '5', '6'],
    ['1', '2', '3', '÷'],
    ['AND', '0', 'OR', '×'],
    ['XOR', 'C', '', '='],
  ];

  const getButtons = () => {
    switch (mode) {
      case 'basic':
        return basicButtons;
      case 'scientific':
        return scientificButtons;
      case 'programmer':
        return programmerButtons;
    }
  };

  const handleButtonClick = (btn: string) => {
    if (!btn) return;
    
    if (btn === 'C') {
      handleClear();
    } else if (btn === '=') {
      handleEquals();
    } else if (btn === '.') {
      handleDecimal();
    } else if (btn === 'π') {
      setCurrentValue(Math.PI.toString());
      setDisplay(Math.PI.toString());
    } else if (['HEX', 'DEC', 'BIN', 'OCT'].includes(btn)) {
      handleBaseChange(btn as Base);
    } else if (['+', '-', '×', '÷', '^', 'AND', 'OR', 'XOR'].includes(btn)) {
      handleOperation(btn);
    } else if (['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²', '1/x', '±'].includes(btn)) {
      handleScientific(btn);
    } else {
      // handle numbers and hex letters
      handleNumber(btn);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Mode Switcher */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('basic')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              mode === 'basic'
                ? 'bg-cyan-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            basic
          </button>
          <button
            onClick={() => setMode('scientific')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              mode === 'scientific'
                ? 'bg-cyan-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            scientific
          </button>
          <button
            onClick={() => setMode('programmer')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              mode === 'programmer'
                ? 'bg-cyan-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            programmer
          </button>
        </div>

        {/* Calculator Body */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          {/* Display */}
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            {mode === 'programmer' && (
              <div className="text-xs text-cyan-400 mb-2 font-mono">{base}</div>
            )}
            <div className="text-4xl font-mono text-white break-all text-right">{display}</div>
          </div>

          {/* Button Grid */}
          <div className="grid gap-2">
            {getButtons().map((row, i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                {row.map((btn, j) => (
                  btn ? (
                    <button
                      key={`${btn}-${j}`}
                      onClick={() => handleButtonClick(btn)}
                      className={`py-3 px-2 rounded-lg font-semibold transition-colors text-xs ${
                        ['+', '-', '×', '÷', '=', '^'].includes(btn)
                          ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                          : btn === 'C'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : ['HEX', 'DEC', 'BIN', 'OCT'].includes(btn)
                          ? base === btn
                            ? 'bg-green-600 text-white'
                            : 'bg-white/20 hover:bg-white/30 text-white'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      {btn}
                    </button>
                  ) : (
                    <div key={`empty-${j}`} />
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
