import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#10b981',
            letterSpacing: '0.25em',
          }}
        >
          BPM QUIZ
        </div>
        <div
          style={{
            fontSize: 200,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1,
            fontFamily: 'monospace',
          }}
        >
          128
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#52525b',
            marginTop: 8,
          }}
        >
          Can you find the beat?
        </div>
      </div>
    ),
    { ...size }
  )
}
