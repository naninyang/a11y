import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const WCAG_API_URL = process.env.WCAG_API_URL;
    const response = await fetch(`${WCAG_API_URL}/lv2`);

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API 호출 실패:', error);
    res.status(500).json({ message: '서버 내부 오류' });
  }
}
