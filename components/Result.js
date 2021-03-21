import styles from 'styles/GuessThing.module.scss';
import Map from 'components/Map';

const Result = ({ submission, guesses }) => (
  <div className={styles.container}>
    <img className={styles.photo} src={`uploads/${submission.fileName}`} />
    <br />
    <Map onPositionChanged={() => {}} draggable={false} location={submission.coords} markers={guesses} />
    <br />
    <table>
      <tr>
        <td>✰</td>{guesses.map(({teamNum}) => <td key={teamNum}>{teamNum}</td>)}
      </tr>
      <tr>
        <td>{submission.name}</td>{guesses.map(({name, teamNum}) => <td key={teamNum}>{name}</td>)}
      </tr>
    </table>
  </div>
);

export default Result;
