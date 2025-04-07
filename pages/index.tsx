import Seo from '@/components/Seo';
import ColorBlindnessSim from '@/components/colors/ColorBlindnessSim';
import ColorContrast from '@/components/colors/ColorContrast';
import FocusStyleTest from '@/components/colors/FocusStyleTest';
import styles from '@/styles/Home.module.sass';

export default function Home() {
  const timestamp = Date.now();
  return (
    <main className={styles.main}>
      <Seo pageImg={`https://a11y.dev1stud.io/og.webp?ts=${timestamp}`} />
      <p className="seo">웹에 안전한 컬러인지 알려드립니다.</p>
      <div className={styles.container}>
        <ColorContrast />
        <FocusStyleTest />
        <ColorBlindnessSim />
      </div>
    </main>
  );
}
