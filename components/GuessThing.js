import { useState } from 'react';

import Map from 'components/Map';
import styles from 'styles/GuessThing.module.scss';

const center = {
    lat: 51.505,
    lng: -0.09,
};

const GuessThing = ({ fileName, index }) => {
    const [location, setLocation] = useState(center);

    return (
        <div className={styles.container}>
        <h2>Photo {index + 1}</h2>
        <img className={styles.photo} src={`uploads/${fileName}`} />
        <br />
        <Map onPositionChanged={e => setLocation(e)} />
        <input
            className={styles.coords}
            readOnly
            name={`coords_${index}`}
            id={`coords_${index}`}
            value={JSON.stringify({
                lat: location.lat,
                lng: location.lng,
            })}
        />
        <br />
        <br />
        <label htmlFor={`name_${index}`}>Whose photo is this? (Photo {index + 1}) </label>
        <input name={`name_${index}`} id={`name_${index}`} />
        </div>
    )
};

export default GuessThing;
