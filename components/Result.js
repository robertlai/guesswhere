"use client";
import { useState } from "react";
import Map from "@/components/Map";
import styles from "@/styles/GuessThing.module.scss";

function distance(p1j, p2j) {
  const p1 = JSON.parse(p1j);
  const p2 = JSON.parse(p2j);
  if (!p1 || !p2) return Infinity;
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a =
    0.5 -
    c((p2.lat - p1.lat) * p) / 2 +
    (c(p1.lat * p) * c(p2.lat * p) * (1 - c((p2.lng - p1.lng) * p))) / 2;

  return 7917.5 * Math.asin(Math.sqrt(a)); // 12742 km
}

const Result = ({ submission, guesses }) => {
  const [revealed, setRevealed] = useState(false);
  const distances = guesses.map((guess) =>
    distance(guess.coords, submission.coords)
  );
  const minDist = Math.min(...distances);

  const guessesWithDistances = guesses
    .map((guess, i) => ({
      ...guess,
      distance: distances[i],
    }))
    .sort((a, b) => a.distance - b.distance);

  return (
    <>
      <img className={styles.photo} src={`api/file/${submission.fileName}`} />
      <Map
        onPositionChanged={() => {}}
        draggable={false}
        location={revealed ? submission.coords : null}
        markers={guesses}
      />
      <table>
        <thead>
          <tr>
            <th>Guesser</th>
            <th>Name</th>
            <th>Distance</th>
          </tr>
          <tr>
            <th style={{ color: "gold" }}>★</th>
            <th>{revealed ? submission.name : "?"}</th>
            <th>0 miles</th>
          </tr>
        </thead>
        <tbody>
          {guessesWithDistances.map(({ teamNum, name, coords, distance }) => {
            return (
              <tr key={teamNum}>
                <td>{revealed ? teamNum : "?"}</td>
                <td>{revealed ? name : "?"}</td>
                <td style={{ fontWeight: minDist == distance ? "bold" : null }}>
                  {revealed && `${distance.toFixed(2)} miles`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!revealed && <button onClick={() => setRevealed(true)}>Reveal</button>}
    </>
  );
};

export default Result;
