import { useState } from 'react';
import styles from '@/styles/Home.module.sass';

function getLuminance(hex: string): number {
  const rgb = hex
    .replace('#', '')
    .match(/.{2}/g)
    ?.map((v) => parseInt(v, 16) / 255) || [0, 0, 0];
  const adjusted = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * adjusted[0] + 0.7152 * adjusted[1] + 0.0722 * adjusted[2];
}

function getContrastRatio(fg: string, bg: string): number {
  const L1 = getLuminance(fg);
  const L2 = getLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export default function ColorContrast() {
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [exampleText, setExampleText] = useState('여기에 테스트 문장을 입력하세요');
  const [selectedColor, setSelectedColor] = useState<'fg' | 'bg' | null>(null);
  const [showBasis, setShowBasis] = useState(false);

  const contrast = getContrastRatio(fgColor, bgColor);

  const getLevel = (): string => {
    if (contrast >= 7) return 'AAA';
    if (contrast >= 4.5) return 'AA';
    return 'Fail';
  };

  return (
    <section className={styles.section}>
      <div className={styles.module}>
        <h2>색상 대비 테스트</h2>
        <div className={styles['basis-button']}>
          <button
            className={styles.toggleBasis}
            onClick={() => setShowBasis((prev) => !prev)}
            aria-expanded={showBasis}
            aria-controls="contrast-basis"
            type="button"
          >
            {showBasis ? '근거 닫기' : '근거 보기'}
          </button>
        </div>
        <div className={styles['basis-group']} id="contrast-basis" hidden={!showBasis} aria-hidden={!showBasis}>
          <div className={styles['basis-group']}>
            <h3>근거 #1: WCAG 2.2 – 1.4.3 Contrast (Minimum)</h3>
            <blockquote cite="WCAG 2.2" lang="en">
              <p>
                The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for
                the following:
              </p>
              <p></p>
              <ul>
                <li>
                  Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 3:1;
                </li>
                <li>
                  Incidental: Text or images of text that are part of an inactive user interface component, that are
                  pure decoration, that are not visible to anyone, or that are part of a picture that contains
                  significant other visual content, have no contrast requirement.
                </li>
                <li>Logotypes: Text that is part of a logo or brand name has no contrast requirement.</li>
              </ul>
            </blockquote>
            <blockquote cite="WCAG 2.2" lang="ko">
              <p>
                텍스트 및 텍스트 이미지의 시각적 표현은 다음 예외를 제외하고 최소 4.5:1의 명도 대비 비율을 가져야
                합니다.
              </p>
              <p></p>
              <ul>
                <li>큰 텍스트: 대형 텍스트 및 대형 텍스트 이미지의 경우 최소 3:1의 대비 비율만 요구됩니다.</li>
                <li>
                  부수적 요소: 사용하지 않는 UI 컴포넌트의 텍스트, 장식용 텍스트, 시각적으로 보이지 않는 텍스트, 또는
                  복잡한 이미지 일부로 포함된 텍스트는 대비 요건이 없습니다.
                </li>
                <li>로고 및 상표: 로고 또는 브랜드 이름의 일부인 텍스트는 대비 요건이 없습니다.</li>
              </ul>
            </blockquote>
            <dl>
              <dt>적용대상</dt>
              <dd>일반 텍스트</dd>
              <dd>버튼</dd>
              <dd>폼 필드 안의 텍스트</dd>
              <dd>본문</dd>
              <dd>링크 텍스트 등 UI 전반의 읽기 가능한 요소</dd>
            </dl>
          </div>
          <div className={styles.basis}>
            <h3>근거 #2: WCAG 2.2 – 1.4.6 Contrast (Enhanced)</h3>
            <blockquote cite="WCAG 2.2" lang="en">
              <p>
                The visual presentation of text and images of text has a contrast ratio of at least 7:1, except for the
                following:
              </p>
              <ul>
                <li>
                  Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;
                </li>
                <li>Incidental and Logotypes: Same exceptions as for 1.4.3.</li>
              </ul>
            </blockquote>
            <blockquote cite="WCAG 2.2" lang="ko">
              <p>
                텍스트 및 텍스트 이미지의 시각적 표현은 다음 예외를 제외하고 최소 7:1의 명도 대비 비율을 가져야 합니다.
              </p>
              <ul>
                <li>큰 텍스트: 대형 텍스트 및 대형 텍스트 이미지의 경우 최소 4.5:1의 대비 비율이 요구됩니다.</li>
                <li>부수적 요소와 로고: 1.4.3과 동일한 예외 사항이 적용됩니다.</li>
              </ul>
            </blockquote>
            <dl>
              <dt>적용 대상</dt>
              <dd>AAA 등급을 목표로 하는 환경에서의 텍스트</dd>
              <dd>고대비 접근성을 강화해야 하는 콘텐츠</dd>
              <dd>고령자 또는 저시력 사용자가 자주 이용하는 서비스</dd>
            </dl>
          </div>
        </div>
        <div className={styles.input}>
          <h3>테스트값 입력</h3>
          <div className={styles.groups}>
            <div className={styles.group}>
              <label htmlFor="FgColor">텍스트 색상</label>
              <input id="FgColor" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
            </div>
            <div className={styles.group}>
              <label htmlFor="bgColor">배경 색상</label>
              <input id="bgColor" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </div>
            <div className={styles.group} aria-hidden />
            <div className={styles.group} aria-hidden />
            <div className={styles.group} aria-hidden />
          </div>
        </div>
        <div className={styles.output}>
          <h3>미리보기</h3>
          <div className={styles.preview} style={{ backgroundColor: bgColor }}>
            <input
              type="text"
              value={exampleText}
              onChange={(e) => setExampleText(e.target.value)}
              style={{ color: fgColor }}
              placeholder="여기에 테스트 문장을 입력하세요"
            />
          </div>
        </div>
        <div className={styles.a11y}>
          <h3>색상 확대 보기</h3>
          <div className={styles['expand-toggle']}>
            <div className={styles.radios}>
              <div className={`${styles.radio} ${styles.none}`}>
                <input
                  type="radio"
                  name="selectedColorCC"
                  value="none"
                  id="selectedNoneCC"
                  checked={selectedColor === null}
                  onChange={() => setSelectedColor(null)}
                />
                <label htmlFor="selectedNoneCC">끄기</label>
              </div>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="selectedColorCC"
                  value="fgColor"
                  id="selectedFgColor"
                  checked={selectedColor === 'fg'}
                  onChange={() => setSelectedColor('fg')}
                />
                <label htmlFor="selectedFgColor">텍스트 색상</label>
              </div>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="selectedColorCC"
                  value="bg"
                  id="selectedBgColor"
                  checked={selectedColor === 'bg'}
                  onChange={() => setSelectedColor('bg')}
                />
                <label htmlFor="selectedBgColor">배경 색상</label>
              </div>
            </div>
            {selectedColor && (
              <div
                className={styles['selected-color']}
                style={{
                  backgroundColor: selectedColor === 'fg' ? fgColor : selectedColor === 'bg' ? bgColor : undefined,
                }}
              >
                <dl>
                  {selectedColor === 'fg' && (
                    <div>
                      <dt>텍스트 색상</dt>
                      <dd>{fgColor}</dd>
                    </div>
                  )}
                  {selectedColor === 'bg' && (
                    <div>
                      <dt>배경 색상</dt>
                      <dd>{bgColor}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.results} ${styles['result-cc']}`}>
          <h3>대비 결과</h3>
          <dl>
            <div>
              <dt>대비 비율</dt>
              <dd>{contrast}</dd>
            </div>
            <div>
              <dt>등급</dt>
              <dd>{getLevel()}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
