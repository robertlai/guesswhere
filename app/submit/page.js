"use client";
import { useState } from "react";

import Map from "components/Map";
import styles from "styles/SubmitPage.module.scss";

const center = {
  lat: 51.505,
  lng: -0.09,
};

const SubmitPage = () => {
  const [locationOne, setLocationOne] = useState(center);
  const [locationTwo, setLocationTwo] = useState(center);

  return (
    <div className={styles.container}>
      <form action="/api/submit" method="post" encType="multipart/form-data">
        <div className={styles.section}>
          <label htmlFor="name">Enter your name: </label>
          <input id="name" name="name" />
        </div>
        <div className={styles.section}>
          <p>Please upload 2 photos (preferrably photos that you took).</p>
        </div>
        <div className={styles.section}>
          <label htmlFor="photo_1">Choose a photo: </label>
          <input
            type="file"
            id="photo_1"
            name="photo_1"
            accept="image/png, image/jpeg"
          />
          <p>
            Drag the marker to the precise location that the photo was taken
            from.
          </p>
          <Map onPositionChanged={(e) => setLocationOne(e)} />
          <input
            className={styles.coords}
            readOnly
            name="coords_1"
            id="coords_1"
            value={JSON.stringify({
              lat: locationOne.lat,
              lng: locationOne.lng,
            })}
          />
        </div>
        <div className={styles.section}>
          <label htmlFor="photo_1">Choose a second photo: </label>
          <input
            type="file"
            id="photo_2"
            name="photo_2"
            accept="image/png, image/jpeg"
          />
          <p>
            Drag the marker to the precise location that the photo was taken
            from.
          </p>
          <Map onPositionChanged={(e) => setLocationTwo(e)} />
          <input
            className={styles.coords}
            readOnly
            name="coords_2"
            id="coords_2"
            value={JSON.stringify({
              lat: locationTwo.lat,
              lng: locationTwo.lng,
            })}
          />
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default SubmitPage;
