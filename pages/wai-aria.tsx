import { useEffect, useState } from 'react';
import styles from '@/styles/Guideline.module.sass';

type AriaAttribute = {
  속성명: string;
  설명: string;
  '속성 유형': string;
  '값 유형': string;
  '적용 대상 역할': string;
  참고사항: string;
  예제: string;
};

export default function WaiAria() {
  const [attributes, setAttributes] = useState<AriaAttribute[]>([]);

  useEffect(() => {
    const fetchAriaData = async () => {
      const res = await fetch('/api/aria');
      const json = await res.json();
      setAttributes(json);
    };
    fetchAriaData();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.headline}>
          <h1>ARIA 속성</h1>
          <div className={styles.section}>
            <div className={styles.module}>
              <div className={styles.content}>
                {attributes.map((attr, index) => (
                  <section key={index}>
                    <h2>{attr['속성명']}</h2>
                    <p>{attr['설명']}</p>
                    <dl>
                      <div>
                        <dt>속성 유형</dt>
                        <dd>{attr['속성 유형']}</dd>
                      </div>
                      <div>
                        <dt>값 유형</dt>
                        <dd>{attr['값 유형']}</dd>
                      </div>
                      <div>
                        <dt>적용 대상 역할</dt>
                        <dd>{attr['적용 대상 역할']}</dd>
                      </div>
                      <div>
                        <dt>참고사항</dt>
                        <dd>{attr['참고사항'] || '참고사항 없음'}</dd>
                      </div>
                    </dl>
                    <code>{attr['예제']}</code>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
