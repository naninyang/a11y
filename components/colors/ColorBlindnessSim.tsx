import { useState } from 'react';
import styles from '@/styles/Home.module.sass';

const filters = [
  { type: 'normal', label: '비색각 이상 (원본)', filter: 'none' },
  { type: 'protanopia', label: '적색약 (Protanopia)', filter: 'url(#protanopia)' },
  { type: 'deuteranopia', label: '녹색약 (Deuteranopia)', filter: 'url(#deuteranopia)' },
  { type: 'tritanopia', label: '청색약 (Tritanopia)', filter: 'url(#tritanopia)' },
];

export default function ColorBlindnessSim() {
  const [selected, setSelected] = useState('normal');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'image' | 'color'>('color');
  const [showBasis, setShowBasis] = useState(false);

  const selectedFilter = filters.find((f) => f.type === selected)?.filter || 'none';

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setViewMode('image');
  }

  return (
    <section className={`${styles.section} ${styles['section-cb']}`}>
      <div className={styles.module}>
        <h2>색약/색맹 시뮬레이션</h2>{' '}
        <div className={styles['basis-button']}>
          <button
            className={styles.toggleBasis}
            onClick={() => setShowBasis((prev) => !prev)}
            aria-expanded={showBasis}
            aria-controls="blindness-basis"
            type="button"
          >
            {showBasis ? '근거 닫기' : '근거 보기'}
          </button>
        </div>
        <div className={styles['basis-group']} id="blindness-basis" hidden={!showBasis} aria-hidden={!showBasis}>
          <div className={styles.basis}>
            <h3>근거 #1: WCAG 2.2 – 1.4.1 Use of Color</h3>
            <blockquote cite="WCAG 2.2" lang="en">
              <p>
                Color is not used as the only visual means of conveying information, indicating an action, prompting a
                response, or distinguishing a visual element.
              </p>
            </blockquote>
            <blockquote cite="WCAG 2.2" lang="ko">
              <p>색상만으로 정보를 전달하거나, 동작 유도, 응답 요청, 시각적 구분을 하지 말아야 합니다.</p>
            </blockquote>
          </div>
          <div className={styles.basis}>
            <h3>근거 #2: WCAG 2.2 – 1.4.11 Non-text Contrast</h3>
            <blockquote cite="WCAG 2.2" lang="en">
              <p>
                Visual presentation of the following has a contrast ratio of at least 3:1 against adjacent color(s):
              </p>
              <ul>
                <li>User Interface Components</li>
                <li>Graphical Objects</li>
              </ul>
            </blockquote>
            <blockquote cite="WCAG 2.2" lang="ko">
              <p>다음 항목은 인접 색상과 최소 3:1 이상의 대비 비율을 가져야 합니다.</p>
              <ul>
                <li>사용자 인터페이스 컴포넌트 (버튼, 입력 필드 등)</li>
                <li>그래픽 요소 (중요 정보를 전달하는 도형, 색상 등)</li>
              </ul>
            </blockquote>
          </div>
        </div>
        <div className={styles.input}>
          <h3>팔레트/이미지 선택</h3>
          <p>* 이미지는 서버에 업로드되지 않고 미리보기 용도로만 사용됩니다.</p>
          <div className={styles.radios}>
            {filters.map(({ type, label }) => (
              <div className={styles.radio} key={type}>
                <input
                  type="radio"
                  name="colorfilter"
                  id={`cb__${type}`}
                  value={type}
                  checked={selected === type}
                  onChange={() => setSelected(type)}
                />
                <label htmlFor={`cb__${type}`}>{label}</label>
              </div>
            ))}
          </div>
          <div className={styles.upload}>
            <label htmlFor="img">이미지 선택</label>
            <input id="img" type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          {imageUrl && (
            <div className={styles.radios}>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="viewMode"
                  value="image"
                  id="selectImage"
                  checked={viewMode === 'image'}
                  onChange={() => setViewMode('image')}
                />
                <label htmlFor="selectImage">이미지 보기</label>
              </div>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="viewMode"
                  value="color"
                  id="selectColor"
                  checked={viewMode === 'color'}
                  onChange={() => setViewMode('color')}
                />
                <label htmlFor="selectColor">기본 색상 보기</label>
              </div>
            </div>
          )}
        </div>
        <svg width="0" height="0">
          <defs>
            <filter id="protanopia">
              <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
            </filter>
            <filter id="deuteranopia">
              <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" />
            </filter>
            <filter id="tritanopia">
              <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
            </filter>
          </defs>
        </svg>
        <div className={`${styles.output} ${styles['output-cb']}`}>
          <h3>시큘레이션 결과</h3>
          <div className={styles.preview} style={{ filter: selectedFilter }}>
            {viewMode === 'image' && imageUrl ? (
              <div className={styles.image}>
                <img src={imageUrl} alt="업로드 이미지 미리보기" style={{ filter: selectedFilter }} />
              </div>
            ) : (
              <div className={styles.palette}>
                <div className={styles.colorBox} style={{ backgroundColor: '#ff0000' }}>
                  <span>빨강</span>
                </div>
                <div className={styles.colorBox} style={{ backgroundColor: '#00ff00' }}>
                  <span>초록</span>
                </div>
                <div className={styles.colorBox} style={{ backgroundColor: '#0000ff' }}>
                  <span>파랑</span>
                </div>
                <div className={styles.colorBox} style={{ backgroundColor: '#ffff00' }}>
                  <span>노랑</span>
                </div>
                <div className={styles.colorBox} style={{ backgroundColor: '#ff00ff' }}>
                  <span>자홍</span>
                </div>
                <div className={styles.colorBox} style={{ backgroundColor: '#00ffff' }}>
                  <span>청록</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
