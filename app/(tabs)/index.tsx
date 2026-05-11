import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

const BUTTONS = [
  [
    { label: 'AC', action: 'clear', type: 'func' },
    { label: '+/-', action: 'toggle', type: 'func' },
    { label: '%', action: 'percent', type: 'func' },
    { label: '÷', action: 'op', type: 'op', val: '÷' },
  ],
  [
    { label: '7', action: 'num', type: 'num', val: '7' },
    { label: '8', action: 'num', type: 'num', val: '8' },
    { label: '9', action: 'num', type: 'num', val: '9' },
    { label: '×', action: 'op', type: 'op', val: '×' },
  ],
  [
    { label: '4', action: 'num', type: 'num', val: '4' },
    { label: '5', action: 'num', type: 'num', val: '5' },
    { label: '6', action: 'num', type: 'num', val: '6' },
    { label: '−', action: 'op', type: 'op', val: '−' },
  ],
  [
    { label: '1', action: 'num', type: 'num', val: '1' },
    { label: '2', action: 'num', type: 'num', val: '2' },
    { label: '3', action: 'num', type: 'num', val: '3' },
    { label: '+', action: 'op', type: 'op', val: '+' },
  ],
  [
    { label: '0', action: 'num', type: 'num', val: '0', wide: true },
    { label: '.', action: 'decimal', type: 'num' },
    { label: '=', action: 'equals', type: 'op' },
  ],
];

function compute(a, op, b) {
  switch (op) {
    case '÷': return b === 0 ? null : a / b;
    case '×': return a * b;
    case '−': return a - b;
    case '+': return a + b;
    default: return b;
  }
}

function fmt(num) {
  if (num === null || isNaN(num) || !isFinite(num)) return 'Error';
  const s = parseFloat(num.toPrecision(12)).toString();
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s;
}

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [activeOp, setActiveOp] = useState(null);
  const [newNum, setNewNum] = useState(true);
  const [expression, setExpression] = useState('');

  const updateDisplay = (val) => setDisplay(String(val));

  const handlePress = (btn) => {
    if (btn.action === 'num') {
      if (display === 'Error') { updateDisplay('0'); setNewNum(true); }
      if (newNum) {
        updateDisplay(btn.val === '0' && display === '0' ? '0' : btn.val);
        setNewNum(false);
      } else {
        updateDisplay(display === '0' ? btn.val : display + btn.val);
      }
      setActiveOp(null);
    }

    else if (btn.action === 'decimal') {
      if (newNum) { updateDisplay('0.'); setNewNum(false); return; }
      if (!display.includes('.')) updateDisplay(display + '.');
    }

    else if (btn.action === 'op') {
      if (display === 'Error') return;
      const cur = parseFloat(display);
      if (prev !== null && !newNum) {
        const res = compute(prev, op, cur);
        const resStr = fmt(res);
        updateDisplay(resStr);
        setPrev(res === null ? null : parseFloat(resStr));
      } else {
        setPrev(cur);
      }
      setOp(btn.val);
      setActiveOp(btn.val);
      setNewNum(true);
      setExpression(display + ' ' + btn.val);
    }

    else if (btn.action === 'equals') {
      if (!op || display === 'Error') return;
      const cur = parseFloat(display);
      const res = compute(prev, op, cur);
      setExpression(expression + ' ' + display + ' =');
      updateDisplay(fmt(res));
      setPrev(null);
      setOp(null);
      setActiveOp(null);
      setNewNum(true);
    }

    else if (btn.action === 'clear') {
      updateDisplay('0');
      setPrev(null);
      setOp(null);
      setActiveOp(null);
      setNewNum(true);
      setExpression('');
    }

    else if (btn.action === 'toggle') {
      if (display === '0' || display === 'Error') return;
      updateDisplay(fmt(parseFloat(display) * -1));
    }

    else if (btn.action === 'percent') {
      if (display === 'Error') return;
      updateDisplay(fmt(parseFloat(display) / 100));
    }
  };

  const fontSize =
    display.length > 10 ? 30 : display.length > 7 ? 42 : 56;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Display */}
      <View style={styles.display}>
        <Text style={styles.expression} numberOfLines={1}>
          {expression}
        </Text>
        <Text style={[styles.result, { fontSize }]} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {BUTTONS.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((btn) => {
              const isActiveOp = btn.type === 'op' && activeOp === btn.val;
              return (
                <TouchableOpacity
                  key={btn.label}
                  style={[
                    styles.btn,
                    btn.type === 'func' && styles.funcBtn,
                    btn.type === 'op' && styles.opBtn,
                    btn.type === 'num' && styles.numBtn,
                    btn.wide && styles.wideBtn,
                    isActiveOp && styles.activeOpBtn,
                  ]}
                  onPress={() => handlePress(btn)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.btnText,
                      btn.type === 'func' && styles.funcText,
                      btn.type === 'op' && styles.opText,
                      btn.type === 'num' && styles.numText,
                      isActiveOp && styles.activeOpText,
                      btn.label === '=' || btn.label === '÷' || btn.label === '×'
                        ? styles.largeOpText
                        : null,
                    ]}
                  >
                    {btn.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const BTN_SIZE = 78;
const BTN_GAP = 12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  display: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  expression: {
    color: '#666',
    fontSize: 16,
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  result: {
    color: '#fff',
    fontWeight: '200',
    letterSpacing: -2,
  },
  keypad: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: BTN_GAP,
  },
  row: {
    flexDirection: 'row',
    gap: BTN_GAP,
  },
  btn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideBtn: {
    width: BTN_SIZE * 2 + BTN_GAP,
    borderRadius: BTN_SIZE / 2,
    alignItems: 'flex-start',
    paddingLeft: 28,
  },
  funcBtn: { backgroundColor: '#a5a5a5' },
  opBtn: { backgroundColor: '#ff9f0a' },
  numBtn: { backgroundColor: '#333333' },
  activeOpBtn: { backgroundColor: '#fff' },
  btnText: { fontSize: 26, fontWeight: '400' },
  funcText: { color: '#000' },
  opText: { color: '#fff' },
  numText: { color: '#fff' },
  activeOpText: { color: '#ff9f0a' },
  largeOpText: { fontSize: 30 },
});
