import Anchor from './Anchor';
import { useTheme } from './context/ThemeContext';
import { LogoDark, LogoLight, ModeDark, ModeLight } from './Svgs';
import styles from '@/styles/Header.module.sass';

export default function Header() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <div className={styles.group}>
          <h1>
            <Anchor href="/">
              {isDarkMode ? <LogoLight /> : <LogoDark />}
              <span>Accessible Colors - 안전색깔론 서비스</span>
            </Anchor>
          </h1>
          <ol>
            <li>
              <Anchor href="/wcag">
                <span className={styles.link}>WCAG 2.2</span>
              </Anchor>
            </li>
            <li>
              <Anchor href="/wai-aria">
                <span className={styles.link}>WAI-ARIA 1.2</span>
              </Anchor>
            </li>
          </ol>
        </div>
        <button type="button" onClick={toggleTheme}>
          {isDarkMode ? <ModeLight /> : <ModeDark />}
          <span>{isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}</span>
        </button>
      </div>
    </header>
  );
}
