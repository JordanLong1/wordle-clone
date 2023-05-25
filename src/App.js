import React, { useEffect, useState, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";

import classnames from "classnames";

const API_URL = "https://random-word-api.herokuapp.com/word?length=5";

function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [turns, setTurns] = useState(0);
  const [shouldCheckGuess, setShouldCheckGuess] = useState(false);

  const formatGuess = useCallback(() => {
    let solutionArray = [...solution];
    let formattedGuess = [...currentGuess].map((l) => {
      return { key: l, color: "grey" };
    });

    // find any green letters
    formattedGuess.forEach((l, i) => {
      if (solution[i] === l.key) {
        formattedGuess[i].color = "green";
        solutionArray[i] = null;
      }
    });

    // find any yellow letters
    formattedGuess.forEach((l, i) => {
      if (solutionArray.includes(l.key) && l.color !== "green") {
        formattedGuess[i].color = "yellow";
        solutionArray[solutionArray.indexOf(l.key)] = null;
      }
    });

    return formattedGuess;
  }, [solution, currentGuess]);

  const onHandleSubmission = useCallback(() => {
    setShouldCheckGuess(true);
    const copyOfGuesses = [...guesses];
    const foundGuess = copyOfGuesses.findIndex((val) => val === null);

    copyOfGuesses.splice(foundGuess, 1, currentGuess);

    setGuesses(copyOfGuesses);
    // setCurrentGuess("");
    // setTurns(0);
    const test = formatGuess();
    console.log(test);
  }, [guesses, currentGuess, formatGuess]);

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

    let isCorrectTile = false;
    let hasLetterInside = false;

    for (let i = 0; i < guessLength; i++) {
      const character = guess[i];

      tiles.push(
        <div
          key={i}
          className={classnames("tile", {
            isCorrectTile: isCorrectTile,
            hasLetterInside: hasLetterInside,
            // hasNoMatches: !isCorrectTile && !hasLetterInside,
          })}
        >
          {character}
        </div>
      );
    }

    return <div className="row">{tiles}</div>;
  }
  console.log("solution", solution);
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
