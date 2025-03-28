"use client";
import { useState } from "react";

import Map from "components/Map";
import styles from "styles/GuessThing.module.scss";
import { DEFAULT_CENTER } from "util/constants";

const GuessThing = ({ fileName, index, names }) => {
  const [location, setLocation] = useState(DEFAULT_CENTER);

  return (
    <>
      <h2>Photo {index + 1}</h2>
      <img className={styles.photo} src={`uploads/${fileName}`} />
      <div>
        <label htmlFor={`name_${index}`}>
          Whose photo is this? (Photo {index + 1}){" "}
        </label>
        <select name={`name_${index}`} id={`name_${index}`}>
          <option value={""}>Select an option</option>
          {names.map((name) => (
            <option value={name} key={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`name_${index}`}>
          Where was it taken? (Photo {index + 1}){" "}
        </label>
        <Map onPositionChanged={(e) => setLocation(e)} />
      </div>
      <input
        style={{ display: "none" }}
        readOnly
        name={`coords_${index}`}
        id={`coords_${index}`}
        value={JSON.stringify({
          lat: location.lat,
          lng: location.lng,
        })}
      />
    </>
  );
};

export default GuessThing;
