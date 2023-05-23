import React, { useEffect, useState, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";

const API_URL = "https://random-word-api.herokuapp.com/word?length=5";

function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [turns, setTurns] = useState(0);

  const onHandleSubmission = useCallback(() => {
    const copyOfGuesses = [...guesses];
    const foundGuess = copyOfGuesses.findIndex((val) => val === null);

    copyOfGuesses.splice(foundGuess, 1, currentGuess);

    setGuesses(copyOfGuesses);
    setCurrentGuess("");
    setTurns(0);
  }, [guesses, currentGuess]);

  const handleKeyDown = useCallback(
    (event) => {
      if (turns !== 5) {
        setTurns((prevTurn) => prevTurn + 1);
        setCurrentGuess((oldGuess) => oldGuess + event.key.toUpperCase());
      }

      if (event.key === "Enter" && turns === 5) {
        onHandleSubmission();
      }
    },
    [onHandleSubmission, turns]
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
  console.log(turns);
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
