import { useState } from 'react';
import styles from './App.module.less';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.app}>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;
