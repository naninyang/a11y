import { useEffect, useState } from 'react';
import { LeftArrow } from '@/components/Svgs';
import Anchor from '@/components/Anchor';
import Seo, { originTitle } from '@/components/Seo';
import styles from '@/styles/Guideline.module.sass';

type AriaData = {
  속성명: string;
  설명: string;
  '속성 유형': string;
  '값 유형': string;
  '적용 대상 역할': string;
  참고사항: string;
  예제: string;
};

type VariousData = {
  속성명: string;
  설명: string;
  '값 유형': Record<string, string>[];
  참고사항: string;
  예제: string;
};

type RoleData = {
  속성값: string;
  설명: string;
  예제: string;
  추천?: string;
};

const apiList = [
  { key: 'ARIA', label: 'WAI-ARIA', endpoint: 'aria' },
  { key: 'VARIOUS', label: '다양한 속성값', endpoint: 'various' },
  { key: 'ROLE', label: 'Role', endpoint: 'role' },
];

export default function WaiAria() {
  const [selected, setSelected] = useState('ARIA');
  const [dataMap, setDataMap] = useState<Record<string, AriaData[] | VariousData[] | RoleData[]>>({});

  useEffect(() => {
    const fetchAll = async () => {
      const result = await Promise.all(
        apiList.map(async ({ key, endpoint }) => {
          const res = await fetch(`/api/${endpoint}`);
          const json = await res.json();
          return [key, json];
        }),
      );
      setDataMap(Object.fromEntries(result));
    };

    fetchAll();
  }, []);

  const renderAria = (data: AriaData[]) =>
    data.map((item, index) => (
      <section key={index}>
        <h2>{item['속성명']}</h2>
        <p>{item['설명']}</p>
        <dl>
          <div>
            <dt>속성 유형</dt>
            <dd>{item['속성 유형']}</dd>
          </div>
          <div>
            <dt>값 유형</dt>
            <dd>{item['값 유형']}</dd>
          </div>
          <div>
            <dt>적용 대상 역할</dt>
            <dd>{item['적용 대상 역할']}</dd>
          </div>
          <div>
            <dt>참고사항</dt>
            <dd>{item['참고사항'] || '―'}</dd>
          </div>
        </dl>
        <code>{item['예제']}</code>
      </section>
    ));

  const renderVarious = (data: VariousData[]) =>
    data.map((item, index) => (
      <section key={index}>
        <h2>{item['속성명']}</h2>
        <p>{item['설명']}</p>
        <h3>값 유형</h3>
        <dl>
          {item['값 유형'].map((type, idx) => {
            const [key, desc] = Object.entries(type)[0];
            return (
              <div key={idx}>
                <dt>{key}</dt>
                <dd>{desc}</dd>
              </div>
            );
          })}
        </dl>
        <h3>참고사항</h3>
        <p>{item['참고사항'] || '―'}</p>
        <h3>예제</h3>
        <code>{item['예제']}</code>
      </section>
    ));

  const renderRole = (data: RoleData[]) =>
    data.map((item, index) => (
      <section key={index}>
        <h2>role=&#34;{item['속성값']}&#34;</h2>
        <p>{item['설명']}</p>
        <h3>예제</h3>
        <code>{item['예제']}</code>

        {item['추천']?.trim() && (
          <>
            <h3>추천</h3>
            <code>{item['추천']}</code>
          </>
        )}
      </section>
    ));

  const renderContent = () => {
    const data = dataMap[selected];
    if (!data) return <p className="loading">로딩 중...</p>;

    switch (selected) {
      case 'ARIA':
        return renderAria(data as AriaData[]);
      case 'VARIOUS':
        return renderVarious(data as VariousData[]);
      case 'ROLE':
        return renderRole(data as RoleData[]);
      default:
        return null;
    }
  };

  const timestamp = Date.now();

  return (
    <main className={styles.main}>
      <Seo
        pageTitles={`WAI-ARIA 1.2 가이드 - ${originTitle}`}
        pageTitle={`WAI-ARIA 1.2 가이드`}
        pageDescription={`WAI-ARIA 1.2 가이드을 볼 수 있습니다`}
        pageImg={`https://a11y.dev1stud.io/og-aria.webp?ts=${timestamp}`}
      />
      <div className={styles.container}>
        <div className={styles.backlink}>
          <Anchor href="/">
            <LeftArrow />
            <span>뒤로가기</span>
          </Anchor>
        </div>
        <div className={styles.headline}>
          <h1>WAI-ARIA 1.2 점검 기준</h1>
          <p>WAI-ARIA 1.2에서 deprecated 처리된 속성은 생략하였습니다.</p>
        </div>
        <div className={styles.section}>
          <div className={styles.module}>
            <div className={styles.tablist} role="tablist" aria-label="속성 유형 선택">
              {apiList.map(({ key, label }) => (
                <div key={key} className={styles.button}>
                  <button
                    role="tab"
                    className={selected === key ? styles.selected : ''}
                    aria-selected={selected === key}
                    aria-controls={`panel-${key}`}
                    id={`tab-${key}`}
                    type="button"
                    onClick={() => setSelected(key)}
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
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
