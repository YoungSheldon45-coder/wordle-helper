import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [wordLength, setWordLength] = useState(5);
  const [positions, setPositions] = useState(Array(wordLength).fill(''));
  const [includedChars, setIncludedChars] = useState('');
  const [excludedChars, setExcludedChars] = useState('');
  const [possibleWords, setPossibleWords] = useState([]);
  const [wordList, setWordList] = useState([]);

  // Load the word list when the component mounts
  useEffect(() => {
    fetch('/words.txt')
      .then((response) => response.text())
      .then((data) => {
        const words = data.split('\n').map(word => word.trim().toLowerCase());
        setWordList(words);
      });
  }, []);

  // Update positions array when wordLength changes
  useEffect(() => {
    setPositions(Array(wordLength).fill(''));
  }, [wordLength]);

  const searchWords = () => {
    const filteredWords = wordList.filter(word => {
      if (word.length !== wordLength) return false;

      for (let i = 0; i < wordLength; i++) {
        if (positions[i] && word[i] !== positions[i]) return false;
      }

      for (let char of includedChars) {
        if (!word.includes(char)) return false;
      }

      for (let char of excludedChars) {
        if (word.includes(char)) return false;
      }

      return true;
    });

    setPossibleWords(filteredWords);
  };

  return (
    <div className="app-container">
      <h1>Wordle Helper</h1>

      {/* Word Length Dropdown */}
      <div className="input-group">
        <label>Word Length: </label>
        <select
          value={wordLength}
          onChange={(e) => setWordLength(parseInt(e.target.value))}
        >
          {[4, 5, 6, 7, 8].map((len) => (
            <option key={len} value={len}>
              {len} Letters
            </option>
          ))}
        </select>
      </div>

      {/* Known Positions Section */}
      <div className="input-group">
        <label>Known Positions:</label>
        <div className="positions-container">
          {Array(wordLength).fill().map((_, idx) => (
            <input
              key={idx}
              type="text"
              maxLength="1"
              value={positions[idx]}
              onChange={(e) => {
                const newPositions = [...positions];
                newPositions[idx] = e.target.value.toLowerCase();
                setPositions(newPositions);
              }}
              className="position-input"
            />
          ))}
        </div>
      </div>

      {/* Included and Excluded Characters */}
      <div className="input-group">
        <label>Included Characters: </label>
        <input
          type="text"
          value={includedChars}
          onChange={(e) => setIncludedChars(e.target.value.toLowerCase())}
          placeholder="Characters to include"
          className='included-chars'
        />
      </div>

      <div className="input-group">
        <label>Excluded Characters: </label>
        <input
          type="text"
          value={excludedChars}
          onChange={(e) => setExcludedChars(e.target.value.toLowerCase())}
          placeholder="Characters to exclude"
          className='excluded-chars'
        />
      </div>

      {/* Search Button */}
      <button onClick={searchWords} className="search-button">Find Words</button>

      {/* Display of Word Count and Possible Words */}
      <div className="results-container">
        <h2>Possible Words ({possibleWords.length}):</h2>
        {possibleWords.length > 0 ? (
          <ul className="results-list">
            {possibleWords.map((word, index) => (
              <li key={index} className="result-item">{word}</li>
            ))}
          </ul>
        ) : (
          <p>No matching words found</p>
        )}
      </div>
    </div>
  );
}

export default App;
