import ColorBlindnessSim from '@/components/colors/ColorBlindnessSim';
import ColorContrast from '@/components/colors/ColorContrast';
import FocusStyleTest from '@/components/colors/FocusStyleTest';
import styles from '@/styles/Home.module.sass';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <ColorContrast />
        <FocusStyleTest />
        <ColorBlindnessSim />
      </div>
    </main>
  );
}
