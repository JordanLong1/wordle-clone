import React, { useEffect, useState, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";

import Row from "./Row";

const API_URL = "https://random-word-api.herokuapp.com/word?length=5";

function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [turns, setTurns] = useState(0);

  const onHandleSubmission = useCallback(() => {
    const copyOfGuesses = [...guesses];
    copyOfGuesses.push(currentGuess);
    setGuesses(copyOfGuesses);
    setCurrentGuess("");
  }, [guesses, currentGuess]);

  const handleKeyDown = useCallback(
    (event) => {
      setCurrentGuess((oldGuess) => oldGuess + event.key.toUpperCase());
      if (event.key === "Enter") {
        onHandleSubmission();
      }
    },
    [onHandleSubmission]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch(API_URL);
      const words = await response.json();
      setSolution(words[0]);
    };

    fetchWords();
  }, []);

  function Line({ guess }) {
    const tiles = [];

    const guessLength = 5;

    for (let i = 0; i < guessLength; i++) {
      const character = guess[i];
      tiles.push(
        <div key={i} className="tile">
          {character}
        </div>
      );
    }
    return <div className="row">{tiles}</div>;
  }

  return (
    <div className="App">
      <h1>Wordle</h1>
      {guesses.map((guess, index) => {
        const isCurrentGuess =
          index === guesses.findIndex((val) => val === null);
        return (
          <Line
            key={index}
            guess={isCurrentGuess ? currentGuess : guess ?? ""}
          />
        );
      })}
    </div>
  );
}

export default App;
