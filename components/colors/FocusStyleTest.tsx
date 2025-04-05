import { useEffect, useRef, useState } from 'react';
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

function getContrastLevel(ratio: number): string {
  if (ratio >= 7) return '매우 잘 구분됨';
  if (ratio >= 4.5) return '잘 구분됨';
  return '거의 구분되지 않음';
}

export default function FocusStyleTest() {
  const [bg, setBg] = useState('#ffffff');
  const [outline, setOutline] = useState('#0000ff');
  const [btnBg, setBtnBg] = useState('#007acc');
  const [btnText, setBtnText] = useState('#ffffff');
  const [btnBorder, setBtnBorder] = useState('#005fa3');
  const [selectedColor, setSelectedColor] = useState<'bg' | 'outline' | 'btnBg' | 'btnText' | 'btnBorder' | null>(null);
  const [showBasis, setShowBasis] = useState(false);

  const comparisons = [
    {
      label: '브라우저 배경 ↔ 아웃라인',
      fg: outline,
      bg: bg,
    },
    {
      label: '아웃라인 ↔ 버튼 배경',
      fg: outline,
      bg: btnBg,
    },
    {
      label: '버튼 테두리 ↔ 아웃라인',
      fg: outline,
      bg: btnBorder,
    },
    {
      label: '브라우저 배경 ↔ 버튼 배경',
      fg: btnBg,
      bg: bg,
    },
    {
      label: '버튼 배경 ↔ 버튼 텍스트',
      fg: btnText,
      bg: btnBg,
    },
    {
      label: '브라우저 배경 ↔ 버튼 테두리',
      fg: btnBorder,
      bg: bg,
    },
    {
      label: '버튼 테두리 ↔ 버튼 배경',
      fg: btnBorder,
      bg: btnBg,
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.module}>
        <h2>포커스 스타일 테스트</h2>
        <div className={styles['basis-button']}>
          <button
            className={styles.toggleBasis}
            onClick={() => setShowBasis((prev) => !prev)}
            aria-expanded={showBasis}
            aria-controls="focus-basis"
            type="button"
          >
            {showBasis ? '근거 닫기' : '근거 보기'}
          </button>
        </div>
        <div className={styles['basis-group']} id="focus-basis" hidden={!showBasis} aria-hidden={!showBasis}>
          <div className={styles.basis}>
            <h3>근거 #1: WCAG 2.2 – 1.4.11: Non-text Contrast</h3>
            <blockquote cite="WCAG 2.2" lang="en">
              <p>
                Visual presentation of the following have a contrast ratio of at least 3:1 against adjacent color(s):
              </p>
              <ul>
                <li>
                  User Interface Components: Visual information required to identify user interface components and
                  states.
                </li>
                <li>
                  Graphical Objects: Parts of graphics required to understand the content, except when a particular
                  presentation is essential to the information being conveyed.
                </li>
              </ul>
            </blockquote>
            <blockquote cite="WCAG 2.2" lang="ko">
              <p>다음 항목은 인접한 색상과 최소 3:1 이상의 명도 대비 비율을 가져야 합니다.</p>
              <ul>
                <li>사용자 인터페이스 컴포넌트: 버튼, 토글 등 인터페이스 요소의 구분을 위한 시각 정보</li>
                <li>그래픽 객체: 콘텐츠 이해에 필요한 그래픽 구성 요소 (단, 특별한 시각적 표현이 필수인 경우 제외)</li>
              </ul>
            </blockquote>
            <dl>
              <dt>근거 외 추가 기능</dt>
              <dd>아웃라인, 버튼 테두리, 배경, 텍스트 간의 대비를 실시간으로 계산</dd>
              <dd>시각 정보로서의 색상 역할을 분석하고 결과 출력 (매우 잘 구분됨, 거의 구분되지 않음 등)</dd>
            </dl>
          </div>
          <div className={styles.basis}>
            <h3>근거 #2: WCAG 2.2 – 2.4.11: Focus Appearance (Minimum)</h3>
            <blockquote cite="WCAG 2.2" lang="en">
              <p>
                When a user interface component receives keyboard focus, the component has a visible focus indicator
                that:
              </p>
              <ul>
                <li>has an area of at least the size of a 1 CSS pixel border of the component</li>
                <li>
                  has a contrast ratio of at least 3:1 between the same pixels in the focused and unfocused states
                </li>
              </ul>
            </blockquote>
            <blockquote cite="WCAG 2.2" lang="ko">
              <p>
                UI 컴포넌트(예: 버튼)가 키보드 포커스를 받을 때, 다음 조건을 만족하는 명확한 포커스 표시가 있어야
                합니다.
              </p>
              <ul>
                <li>포커스 표시 면적은 최소 1 CSS 픽셀 테두리 크기 이상</li>
                <li>포커스 상태와 비포커스 상태의 해당 픽셀 간 명도 대비가 3:1 이상이어야 함</li>
              </ul>
            </blockquote>
            <dl>
              <dt>근거 외 추가 기능</dt>
              <dd>아웃라인 색상 (outline)과 버튼 배경/테두리 간 대비를 명도 대비 기준으로 측정</dd>
              <dd>시각적으로 outline-color를 포커스 상태에서 5px 두께로 표시</dd>
              <dd>포커스 스타일이 기존 버튼 스타일과 충분히 구분되는지 측정 가능</dd>
            </dl>
          </div>
          <div className={styles.basis}>
            <h3>근거 #3: WCAG 2.2 – 2.5.8: Target Size (Minimum)</h3>
            <blockquote cite="WCAG 2.2" lang="en">
              <p>
                The size of the target for pointer inputs is at least 44 by 44 CSS pixels except when: (some exceptions
                apply)
              </p>
            </blockquote>
            <blockquote cite="WCAG 2.2" lang="ko">
              <p>
                포인터(마우스, 터치 등) 입력을 위한 대상 요소의 크기는 최소 44x44 CSS 픽셀 이상이어야 합니다. (예외:
                인접 요소와 충분히 떨어졌거나 다른 방식으로 접근 가능한 경우)
              </p>
            </blockquote>
          </div>
        </div>
        <div className={styles.input}>
          <h3>테스트값 입력</h3>
          <div className={styles.groups}>
            <div className={styles.group}>
              <label htmlFor="bg">배경 색상</label>
              <input id="bg" type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
            </div>
            <div className={styles.group}>
              <label htmlFor="outline">아웃라인 색상</label>
              <input id="outline" type="color" value={outline} onChange={(e) => setOutline(e.target.value)} />
            </div>
            <div className={styles.group}>
              <label htmlFor="btnBg">버튼 배경 색상</label>
              <input id="btnBg" type="color" value={btnBg} onChange={(e) => setBtnBg(e.target.value)} />
            </div>
            <div className={styles.group}>
              <label htmlFor="btnText">버튼 텍스트 색상</label>
              <input id="btnText" type="color" value={btnText} onChange={(e) => setBtnText(e.target.value)} />
            </div>
            <div className={styles.group}>
              <label htmlFor="btnBorder">버튼 테두리 색상</label>
              <input id="btnBorder" type="color" value={btnBorder} onChange={(e) => setBtnBorder(e.target.value)} />
            </div>
          </div>
        </div>
        <div className={styles.output}>
          <h3>미리보기</h3>
          <p>* 버튼에 포커싱이 되면 포커싱된 컬러가 나옵니다. (두께는 5픽셀)</p>
          <div className={styles.preview} style={{ backgroundColor: bg }}>
            <button
              className={styles.testButton}
              type="button"
              style={
                {
                  backgroundColor: btnBg,
                  color: btnText,
                  borderColor: btnBorder,
                  '--outline-color': outline,
                } as React.CSSProperties
              }
            >
              예제 테스트 버튼입니다
            </button>
          </div>
        </div>
        <div className={styles.a11y}>
          <h3>색상 확대 보기</h3>
          <div className={styles['expand-toggle']}>
            <div className={styles.radios}>
              <div className={`${styles.radio} ${styles.none}`}>
                <input
                  type="radio"
                  name="selectedColorFS"
                  value="none"
                  id="selectedNoneFS"
                  checked={selectedColor === null}
                  onChange={() => setSelectedColor(null)}
                />
                <label htmlFor="selectedNoneFS">끄기</label>
              </div>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="selectedColorFS"
                  value="bg"
                  id="selectedBg"
                  checked={selectedColor === 'bg'}
                  onChange={() => setSelectedColor('bg')}
                />
                <label htmlFor="selectedBg">브라우저 배경</label>
              </div>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="selectedColorFS"
                  value="outline"
                  id="selectedOutline"
                  checked={selectedColor === 'outline'}
                  onChange={() => setSelectedColor('outline')}
                />
                <label htmlFor="selectedOutline">아웃라인 색상</label>
              </div>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="selectedColorFS"
                  value="btnBg"
                  id="selectedBtnBg"
                  checked={selectedColor === 'btnBg'}
                  onChange={() => setSelectedColor('btnBg')}
                />
                <label htmlFor="selectedBtnBg">버튼 배경</label>
              </div>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="selectedColorFS"
                  value="btnText"
                  id="selectedBtnText"
                  checked={selectedColor === 'btnText'}
                  onChange={() => setSelectedColor('btnText')}
                />
                <label htmlFor="selectedBtnText">버튼 텍스트</label>
              </div>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="selectedColorFS"
                  value="btnBorder"
                  id="selectedBtnBorder"
                  checked={selectedColor === 'btnBorder'}
                  onChange={() => setSelectedColor('btnBorder')}
                />
                <label htmlFor="selectedBtnBorder">버튼 테두리</label>
              </div>
            </div>
            {selectedColor && (
              <div
                className={styles['selected-color']}
                style={{
                  backgroundColor:
                    selectedColor === 'bg'
                      ? bg
                      : selectedColor === 'outline'
                        ? outline
                        : selectedColor === 'btnBg'
                          ? btnBg
                          : selectedColor === 'btnText'
                            ? btnText
                            : selectedColor === 'btnBorder'
                              ? btnBorder
                              : undefined,
                }}
              >
                <dl>
                  {selectedColor === 'bg' && (
                    <div>
                      <dt>배경 색상</dt>
                      <dd>{bg}</dd>
                    </div>
                  )}
                  {selectedColor === 'outline' && (
                    <div>
                      <dt>아웃라인 색상</dt>
                      <dd>{outline}</dd>
                    </div>
                  )}
                  {selectedColor === 'btnBg' && (
                    <div>
                      <dt>버튼 배경 색상</dt>
                      <dd>{btnBg}</dd>
                    </div>
                  )}
                  {selectedColor === 'btnText' && (
                    <div>
                      <dt>버튼 텍스트 색상</dt>
                      <dd>{btnText}</dd>
                    </div>
                  )}
                  {selectedColor === 'btnBorder' && (
                    <div>
                      <dt>버튼 테두리 색상</dt>
                      <dd>{btnBorder}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.results} ${styles['result-fs']}`}>
          <h3>대비 결과</h3>
          <dl>
            {comparisons.map(({ label, fg, bg }) => {
              const ratio = getContrastRatio(fg, bg);
              const level = getContrastLevel(ratio);
              return (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    <strong>{level}</strong> <em>({ratio} / 21 대비)</em>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
