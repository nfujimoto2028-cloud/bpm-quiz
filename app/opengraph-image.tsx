import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 240,
            fontWeight: 800,
            color: '#000000',
            lineHeight: 1,
            fontFamily: 'monospace',
          }}
        >
          128Hz
        </div>
      </div>
    ),
    { ...size }
  )
}
