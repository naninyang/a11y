import { useEffect, useState } from 'react';
import Anchor from '@/components/Anchor';
import Seo, { originTitle } from '@/components/Seo';
import { LeftArrow } from '@/components/Svgs';
import styles from '@/styles/Guideline.module.sass';

type Guideline = {
  '성공 기준': string;
  레벨: string;
  '기준 설명': string;
  '점검 항목': string[];
  예제: string[];
  '고려 사항': string[];
};

const levelsList = [
  { key: 'LV1', label: '레벨 #1' },
  { key: 'LV2', label: '레벨 #2' },
  { key: 'LV3', label: '레벨 #3' },
  { key: 'LV4', label: '레벨 #4' },
];

export default function Wcag() {
  const [levels, setLevels] = useState<Record<string, Guideline[]>>({});
  const [selected, setSelected] = useState<string>('LV1');

  useEffect(() => {
    const fetchLevels = async () => {
      const endpoints = ['lv1', 'lv2', 'lv3', 'lv4'];
      const data = await Promise.all(
        endpoints.map(async (lv) => {
          const res = await fetch(`/api/${lv}`);
          const json = await res.json();
          return [lv.toUpperCase(), json] as [string, Guideline[]];
        }),
      );
      setLevels(Object.fromEntries(data));
    };

    fetchLevels();
  }, []);

  const handleSelect = (lv: string) => {
    setSelected(lv);
  };

  const timestamp = Date.now();

  return (
    <main className={styles.main}>
      <Seo
        pageTitles={`WCAG 2.2 레벨별 가이드 - ${originTitle}`}
        pageTitle={`WCAG 2.2 레벨별 가이드`}
        pageDescription={`WCAG 2.2 레벨별 가이드을 볼 수 있습니다`}
        pageImg={`https://a11y.dev1stud.io/og-wcag.webp?ts=${timestamp}`}
      />
      <div className={styles.container}>
        <div className={styles.backlink}>
          <Anchor href="/">
            <LeftArrow />
            <span>뒤로가기</span>
          </Anchor>
        </div>
        <div className={styles.headline}>
          <h1>WCAG 2.2 레벨별 점검 기준</h1>
          <p>AAA 레벨은 난이도가 높거나 현실적으로 어려운 부분들이 있을 수 있습니다.</p>
        </div>
        <div className={styles.section}>
          <div className={styles.module}>
            <div className={styles.tablist} role="tablist" aria-label="WCAG 레벨 선택">
              {levelsList.map(({ key, label }) => (
                <div className={styles.button} key={key}>
                  <button
                    role="tab"
                    className={selected === key ? styles.selected : ''}
                    aria-selected={selected === key}
                    aria-controls={`panel-${key}`}
                    id={`tab-${key}`}
                    type="button"
                    onClick={() => handleSelect(key)}
                  >
                    {label}
                  </button>
                </div>
              ))}
            </div>
            <div
              className={styles.content}
              role="tabpanel"
              id={`panel-${selected}`}
              aria-labelledby={`tab-${selected}`}
              tabIndex={0}
            >
              {levels[selected]?.map((item, index) => (
                <section key={index} className={item['레벨'] === 'AAA' ? styles.high : ''}>
                  <h2>
                    {item['성공 기준']} ({item['레벨']} 레벨)
                  </h2>
                  <p>{item['기준 설명']}</p>
                  <div className={styles.detail}>
                    <h3>점검 항목에 따른 예제 및 고려 사항</h3>
                    <div>
                      {item['점검 항목'].map((check, idx) => (
                        <div key={idx}>
                          <h4>{check}</h4>
                          {item['예제'][idx] ? <code>{item['예제'][idx]}</code> : <p>예제 없음</p>}
                          <p>{item['고려 사항'][idx] || '고려 사항 없음'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
