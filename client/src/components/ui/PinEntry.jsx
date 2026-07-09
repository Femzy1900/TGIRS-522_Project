import React, { useState, useRef } from 'react';
import Button from './Button';

const PinEntry = ({ onVerify, error }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    // only allow digits
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // auto focus next
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4).replace(/\D/g, '');
    if (pastedData) {
      const newPin = [...pin];
      for (let i = 0; i < pastedData.length; i++) {
        newPin[i] = pastedData[i];
      }
      setPin(newPin);
      if (pastedData.length < 4) {
        inputRefs[pastedData.length].current.focus();
      } else {
        inputRefs[3].current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullPin = pin.join('');
    if (fullPin.length === 4) {
      setLoading(true);
      await onVerify(fullPin);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm max-w-md mx-auto mt-12">
      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
      <p className="text-gray-500 text-center mb-8">Please enter your 4-digit PIN to access the dashboard.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
        <div className="flex gap-4 mb-6">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
            />
          ))}
        </div>
        
        {error && <p className="text-red-500 text-sm mb-6 font-medium bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}
        
        <Button 
          type="submit" 
          disabled={pin.join('').length !== 4 || loading}
          className="w-full py-3"
        >
          {loading ? 'Verifying...' : 'Unlock Dashboard'}
        </Button>
      </form>
    </div>
  );
};

export default PinEntry;
