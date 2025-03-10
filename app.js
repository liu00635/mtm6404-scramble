/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const wordsList = ['apple', 'banana', 'orange', 'grape', 'peach', 'lemon', 'kiwi', 'melon', 'mango', 'pear'];

//use react state variables to track game states
function ScrambleGame() {
  const [words, setWords] = React.useState([]);
  const [currentWord, setCurrentWord] = React.useState('');
  const [scrambled, setScrambled] = React.useState('');
  const [guess, setGuess] = React.useState('');
  const [points, setPoints] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [passes, setPasses] = React.useState(3);
  const [message, setMessage] = React.useState('');

  //use localstorage to load the game data
  React.useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('scrambleGame'));
    if (storedData && storedData.words.length > 0) {
      setWords(storedData.words);
      setCurrentWord(storedData.currentWord);
      setScrambled(storedData.scrambled);
      setPoints(storedData.points);
      setStrikes(storedData.strikes);
      setPasses(storedData.passes);
    } else {
      restartGame();
    }
  }, []);

  //save current game progress into local storage
  React.useEffect(() => {
    localStorage.setItem('scrambleGame', JSON.stringify({ words, currentWord, scrambled, points, strikes, passes }));
  }, [words, currentWord, scrambled, points, strikes, passes]);

  //use if condition to check if the user's guess is correct
  const handleGuess = (e) => {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord) {
      setPoints(points + 1);
      setMessage('Correct!');
      nextWord();
    } else {
      setStrikes(strikes + 1);
      setMessage('Incorrect!');
    }
    setGuess('');
  };

  //set next word
  const nextWord = () => {
    const remainingWords = words.slice(1);
    setWords(remainingWords);
    if (remainingWords.length > 0) {
      setCurrentWord(remainingWords[0]);
      setScrambled(shuffle(remainingWords[0]));
    } else {
      setMessage('Game Over! You completed all words.');
    }
  };

  //pass function
  const passWord = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      nextWord();
      setMessage('Word passed!');
    }
  };

  //restart function
  const restartGame = () => {
    const shuffledWords = shuffle([...wordsList]);
    setWords(shuffledWords);
    setCurrentWord(shuffledWords[0]);
    setScrambled(shuffle(shuffledWords[0]));
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setMessage('');
    localStorage.setItem('scrambleGame', JSON.stringify({
      words: shuffledWords,
      currentWord: shuffledWords[0],
      scrambled: shuffle(shuffledWords[0]),
      points: 0,
      strikes: 0,
      passes: 3
    }));
  };

//display the results
  if (strikes >= 3 || words.length === 0) {
    return (
      <div className="game">
        <h1>Game Over!</h1>
        <p>Your Score: {points}</p>
        <button onClick={restartGame}>Play Again</button>
      </div>
    );
  }

  //main render return if the game is on going
  return (
    <div className="game">
      <h1>Scramble Game</h1>
      <p>Points: {points}</p>
      <p>Strikes: {strikes}</p>
      <p>Passes Left: {passes}</p>
      <h2>{scrambled}</h2>
      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess"
          autoFocus
        />
      </form>
      <button onClick={passWord} disabled={passes === 0}>Pass</button>
      <p>{message}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ScrambleGame />);