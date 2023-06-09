import { createSignal, Index, onCleanup } from 'solid-js';

import reader1 from './assets/reader-1.png';
import reader2 from './assets/reader-2.png';
import reader3 from './assets/reader-3.png';
import reader4 from './assets/reader-4.png';

import styles from './App.module.scss';

const MAX_POWER = 12000;
const INCREMENT_AMOUNT = 3000;
const POWER_UP_AMOUNT = 200;
const INCREMENTS_COUNT = MAX_POWER / INCREMENT_AMOUNT;
const METER_INCREMENT_PERCENTAGE = 100 / INCREMENTS_COUNT

let timeout;

function App() {

  const [powerLevel, setPowerLevel] = createSignal(0);
  const powerLevelPercentage = () => powerLevel() / MAX_POWER * 100;

  onCleanup(() => clearTimeout(timeout));

  function handleOnPowerUp() {
    if ( powerLevel() >= MAX_POWER ) return;
    setPowerLevel(powerLevel() + POWER_UP_AMOUNT);
    clearTimeout(timeout);
    releasePower();
  }

  function releasePower() {
    timeout = setTimeout(() => {
      const isAbovePowerIncrement = powerLevel() % INCREMENT_AMOUNT !== 0;
      if ( powerLevel() > 0 && isAbovePowerIncrement) {
        setPowerLevel(powerLevel() - POWER_UP_AMOUNT);
        releasePower();
      }
    }, 500);
  }


  return (
    <div class={styles.app}>
      <main class={styles.main}>
        <div class={styles.power}>
          <span class={styles.powerMeter}>
            <span class={styles.powerMeterLevel} style={{
              height: `${powerLevelPercentage()}%`
            }} />

            <Index each={[...Array(INCREMENTS_COUNT + 1)]}>
              {(_, index) => (
                <span
                  class={styles.powerMeterIncrement}
                  data-power-active={METER_INCREMENT_PERCENTAGE * index <= powerLevelPercentage()}
                  style={{
                    bottom: `${METER_INCREMENT_PERCENTAGE * index}%`
                  }}
                />
              )}
            </Index>
          </span>

        </div>
        <div class={styles.reader}>
          <p class={styles.readerImage}>
            <img width="960" height="540" src={reader1} alt="Watching" loading="eager" style={{
              "z-index": powerLevel() >= 0 && powerLevel() < 3000 ? 1 : 0
            }} />
            <img width="960" height="540" src={reader2} alt="Concerned" loading="lazy" style={{
              "z-index": powerLevel() >= 3000 && powerLevel() < 6000 ? 1 : 0
            }} />
            <img width="960" height="540" src={reader3} alt="Surprised" loading="lazy" style={{
              "z-index": powerLevel() >= 6000 && powerLevel() < 9000 ? 1 : 0
            }} />
            <img width="960" height="540" src={reader4} alt="OVER 9000?!" loading="lazy" style={{
              "z-index": powerLevel() >= 9000 ? 1 : 0
            }} />
          </p>
          <p class={styles.readerLevel}>
            <span>{ powerLevel() }</span>
            <button onClick={handleOnPowerUp}>Power Up</button>
          </p>
        </div>
      </main>
      <footer class={styles.footer}>
        <div>
          <p>
            By <a href="https://twitter.com/colbyfayock">Colby Fayock</a> with <a href="https://www.solidjs.com/">Solid.js</a>.
          </p>
          <p>
            <a href="https://github.com/colbyfayock/meme-generator">View the source</a> or <a href="https://www.youtube.com/watch?v=-LAil8T78Ns">learn how to build this</a>!
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
