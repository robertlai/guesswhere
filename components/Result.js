import { useState } from 'react';
import styles from 'styles/GuessThing.module.scss';
import Map from 'components/Map';

function distance(p1j, p2j) {
  const p1 = JSON.parse(p1j);
  const p2 = JSON.parse(p2j);
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((p2.lat - p1.lat) * p)/2 +
          c(p1.lat * p) * c(p2.lat * p) *
          (1 - c((p2.lng - p1.lng) * p))/2;

  return 7917.5 * Math.asin(Math.sqrt(a)); // 12742 km
}

const Result = ({ submission, guesses }) => {
  const [revealed, setRevealed] = useState(false);
  const distances = guesses.map(guess => distance(guess.coords, submission.coords));
  const minDist = Math.min(...distances);
  return (
    <div className={styles.container}>
      <img className={styles.photo} src={`uploads/${submission.fileName}`} />
      <br />
      <Map onPositionChanged={() => {}} draggable={false} location={revealed ? submission.coords : null} markers={guesses} />
      <br />
      <table>
        <tr>
          <td style={{color: 'gold'}}>★</td>{guesses.map(({teamNum}) => <td key={teamNum}>Team {teamNum}</td>)}
        </tr>
        <tr>
          <td>{revealed ? submission.name : '?'}</td>{guesses.map(({name, teamNum}) => <td key={teamNum}>{name}</td>)}
        </tr>
        <tr>
          <td>0 miles</td>{distances.map(distance => <td key={distance} style={{fontWeight: minDist == distance ? 'bold' : null}}>{revealed && `${distance.toFixed(2)} miles`}</td>)}
        </tr>
      </table>
      <br />
      <button onClick={() => setRevealed(true)}>Reveal</button>
    </div>
  );
};

export default Result;
