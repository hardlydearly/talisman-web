import * as React from 'react'
import { SVGProps } from 'react'
const SvgDroplet = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 2.69L17.66 8.35C18.7794 9.46861 19.5418 10.8941 19.8509 12.4461C20.16 13.998 20.0019 15.6068 19.3965 17.069C18.7912 18.5311 17.7658 19.7808 16.4501 20.6601C15.1344 21.5394 13.5875 22.0087 12.005 22.0087C10.4225 22.0087 8.87561 21.5394 7.5599 20.6601C6.24419 19.7808 5.21882 18.5311 4.61347 17.069C4.00812 15.6068 3.85 13.998 4.15911 12.4461C4.46822 10.8941 5.23066 9.46861 6.35001 8.35L12 2.69Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgDroplet
