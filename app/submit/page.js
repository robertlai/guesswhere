"use client";
import { useState } from "react";

import Map from "@/components/Map";
import styles from "@/styles/page.module.scss";

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
        <section>
          <div>
            <h2>Instructions</h2>
            <p>
              Please upload 2 photos (preferrably photos that you took), and
              drag the map markers to the precise location where they were
              taken.
            </p>
          </div>
        </section>
        <section>
          <div>
            <h2>Your name</h2>
            <input id="name" name="name" />
          </div>
        </section>
        <section>
          <div>
            <label htmlFor="photo_1">Choose a photo: </label>
            <input
              type="file"
              id="photo_1"
              name="photo_1"
              accept="image/png, image/jpeg"
            />
          </div>
          <Map onPositionChanged={(e) => setLocationOne(e)} />
          <input
            style={{ display: "none" }}
            readOnly
            name="coords_1"
            id="coords_1"
            value={JSON.stringify({
              lat: locationOne.lat,
              lng: locationOne.lng,
            })}
          />
        </section>
        <section>
          <div>
            <label htmlFor="photo_1">Choose a second photo: </label>
            <input
              type="file"
              id="photo_2"
              name="photo_2"
              accept="image/png, image/jpeg"
            />
          </div>
          <Map onPositionChanged={(e) => setLocationTwo(e)} />
          <input
            style={{ display: "none" }}
            readOnly
            name="coords_2"
            id="coords_2"
            value={JSON.stringify({
              lat: locationTwo.lat,
              lng: locationTwo.lng,
            })}
          />
        </section>
        <section>
          <input type="submit" value="Submit" />
        </section>
      </form>
    </div>
  );
};

export default SubmitPage;
