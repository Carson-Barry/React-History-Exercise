import React, { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({jokesToGet = 5}) => {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJokes = async () => {
      try {
        // load jokes one at a time, adding not-yet-seen jokes
        let jokes = [];
        let seenJokes = new Set();
  
        while (jokes.length < jokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { ...joke } = res.data;
  
          if (!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            jokes.push({ ...joke, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }
  
        setJokes(jokes);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    if (jokes.length === 0) {
      getJokes();
    }

  }, [jokesToGet, jokes])

  /* empty joke list, set to loading state, and then call getJokes */

  const generateNewJokes = () => {
    setJokes([]);
    setLoading(true);
  }

  const vote = (id, delta) => {
    setJokes(st => {
      return (st.map(joke => {
        return(joke.id === id ? { ...joke, votes: joke.votes + delta } : joke);
      }));
    })
  }

  if (loading) {
    return (
      <div className="loading">
      <i className="fas fa-4x fa-spinner fa-spin" />
    </div>
    )
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
    <button
      className="JokeList-getmore"
      onClick={generateNewJokes}
    >
      Get New Jokes
    </button>

    {sortedJokes.map(j => (
      <Joke
        text={j.joke}
        key={j.id}
        id={j.id}
        votes={j.votes}
        vote={vote}
      />
    ))}
  </div>
  );

}



export default JokeList;
