import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const Variants = cva(
  'block h-[57px] w-[70px] rounded-[50%] flex items-center justify-center relative active:translate-y-[8px] active:shadow-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-default shadow-[0_8px_0_var(--shadow-primary-color)]',
        disabled: 'bg-[#e5e5e5] shadow-[0_8px_0_#afafaf]'
      }
    },

    defaultVariants: {
      variant: 'primary'
    }
  }
)

export const Icons = {
  star(foreground: string, background: string, fill: string = 'white') {
    return (
      <svg width='42' height='34' viewBox='0 0 42 34' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <g clipPath='url(#clip0_7030_116432)'>
          <path
            d='M18.7521 4.41157C19.6598 2.52948 22.3402 2.52948 23.2479 4.41157L25.8539 9.81517C26.225 10.5847 26.9639 11.1109 27.8125 11.2099L33.7906 11.9076C35.9269 12.1569 36.7684 14.8114 35.1658 16.2459L30.8845 20.0785C30.224 20.6697 29.9267 21.567 30.1035 22.4357L31.2468 28.053C31.6684 30.124 29.4857 31.7487 27.6228 30.7506L22.1786 27.8339C21.4424 27.4395 20.5576 27.4395 19.8214 27.8339L14.3772 30.7506C12.5143 31.7487 10.3316 30.124 10.7532 28.053L11.8965 22.4357C12.0733 21.567 11.776 20.6697 11.1155 20.0785L6.83415 16.2459C5.23162 14.8114 6.07307 12.1569 8.20939 11.9076L14.1875 11.2099C15.0361 11.1109 15.775 10.5847 16.1461 9.81517L18.7521 4.41157Z'
            fill={fill}
          />
        </g>
        <defs>
          <clipPath id='clip0_7030_116432'>
            <rect width='30' height='28' fill={fill} transform='translate(6 3)' />
          </clipPath>
        </defs>
      </svg>
    )
  },

  chest(foreground: string, background: string, fill: string = 'white') {
    return (
      <svg width='80' height='90' viewBox='0 0 80 90' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect opacity='0.3' y='38' width='80' height='40' rx='4' fill='#AFAFAF' />
        <path
          d='M8.28882 39.7366C8.28882 34.2001 12.777 29.7119 18.3135 29.7119H60.7557C66.2922 29.7119 70.7804 34.2001 70.7804 39.7366V66.3203C70.7804 68.5349 68.9851 70.3302 66.7705 70.3302H12.2987C10.0841 70.3302 8.28882 68.5349 8.28882 66.3203V39.7366Z'
          fill='#9A9A9A'
        />
        <path
          d='M6.12195 25.2274C6.12195 19.6909 10.6102 15.2027 16.1467 15.2027H63.2628C68.7993 15.2027 73.2876 19.6909 73.2876 25.2274V55.051H6.12195V25.2274Z'
          fill='#9A9A9A'
        />
        <rect x='3.10956' y='42.7716' width='73.8089' height='11.5284' fill='#D8D8D8' />
        <path
          d='M67.0209 25.477H74.9174C76.0247 25.477 76.9223 26.3746 76.9223 27.4819V45.777H67.0209V25.477Z'
          fill='#D8D8D8'
        />
        <path
          d='M3.10956 27.4819C3.10956 26.3746 4.0072 25.477 5.1145 25.477H11.5072C12.6145 25.477 13.5122 26.3746 13.5122 27.4819V43.7721C13.5122 44.8794 12.6145 45.777 11.5072 45.777H5.1145C4.0072 45.777 3.10956 44.8794 3.10956 43.7721V27.4819Z'
          fill='#D8D8D8'
        />
        <path
          d='M6.12195 14.0049C6.12195 12.8976 7.01959 12 8.12689 12H18.6528C19.7601 12 20.6578 12.8976 20.6578 14.0049V34.5027H6.12195V14.0049Z'
          fill='#D8D8D8'
        />
        <path
          d='M58.7524 14.0049C58.7524 12.8976 59.6501 12 60.7574 12H71.2833C72.3906 12 73.2883 12.8976 73.2883 14.0049V34.5027H58.7524V14.0049Z'
          fill='#D8D8D8'
        />
        <path d='M6.25378 24.1446L20.6019 20.5723V33.2222L6.25378 33.0464V24.1446Z' fill='#EDEDED' />
        <path d='M6.12195 31.725H20.6578V46.2197H6.12195V31.725Z' fill='#BFBFBF' />
        <path
          d='M6.12195 52.5436C6.12195 51.4363 7.01959 50.5386 8.12689 50.5386H18.6528C19.7601 50.5386 20.6578 51.4363 20.6578 52.5436V70.3903C20.6578 71.4976 19.7601 72.3953 18.6528 72.3953H8.12689C7.01959 72.3953 6.12195 71.4976 6.12195 70.3903V52.5436Z'
          fill='#BFBFBF'
        />
        <path
          d='M57.4348 52.5436C57.4348 51.4363 58.3325 50.5386 59.4398 50.5386H69.9657C71.073 50.5386 71.9707 51.4363 71.9707 52.5436V70.3903C71.9707 71.4976 71.073 72.3953 69.9657 72.3953H59.4398C58.3325 72.3953 57.4348 71.4976 57.4348 70.3903V52.5436Z'
          fill='#BFBFBF'
        />
        <rect x='58.7524' y='31.725' width='14.5358' height='14.4947' fill='#BFBFBF' />
        <rect x='36.9485' y='49.9128' width='5.51359' height='9.71144' fill='#C4C4C4' />
        <rect x='6.12195' y='55.3079' width='14.5358' height='4.88705' fill='#9A9A9A' />
        <rect x='57.4348' y='55.3079' width='14.5358' height='4.88705' fill='#9A9A9A' />
        <rect x='20.6531' y='63.818' width='36.7782' height='2.63149' fill='#898989' />
        <rect x='20.6531' y='23.6395' width='38.0939' height='2.63149' fill='#898989' />
        <rect opacity='0.92' x='20.6531' y='55.3079' width='36.7782' height='4.88705' fill='#888888' />
        <rect opacity='0.92' x='20.6531' y='35.3047' width='38.0939' height='7.46567' fill='#898989' />
        <path
          d='M3.10956 46.2159H76.9185V55.3008C76.9185 56.4081 76.0208 57.3058 74.9135 57.3058H5.1145C4.0072 57.3058 3.10956 56.4081 3.10956 55.3008V46.2159Z'
          fill='#BFBFBF'
        />
        <rect x='28.9253' y='38.383' width='20.9266' height='18.2007' rx='3.00742' fill='#D8D8D8' />
        <path
          d='M33.6012 38.383H31.9327C30.2718 38.383 28.9253 39.7294 28.9253 41.3904V53.5763C28.9253 55.2372 30.2718 56.5837 31.9327 56.5837H32.9367C33.4621 56.5837 33.8848 56.1518 33.8735 55.6265L33.6012 42.9729V38.383Z'
          fill='#EDEDED'
        />
        <rect x='28.9253' y='42.8631' width='20.9266' height='17.9407' rx='3.00742' fill='#BFBFBF' />
        <ellipse cx='39.0436' cy='49.7057' rx='3.94723' ry='3.54472' fill='#8A8A8A' />
        <path
          d='M38.147 51.6033C38.5164 50.8645 39.5708 50.8645 39.9402 51.6033L41.7365 55.1957C42.0698 55.8622 41.5852 56.6465 40.8399 56.6465H37.2473C36.5021 56.6465 36.0174 55.8622 36.3507 55.1957L38.147 51.6033Z'
          fill='#8A8A8A'
        />
        <path d='M58.7855 16.3848L73.2562 12.8931V20.8578L58.7855 24.3496V16.3848Z' fill='#EDEDED' />
        <rect x='20.4848' y='42.358' width='8.44234' height='3.80299' fill='#EDEDED' />
      </svg>
    )
  }
}

type LessonButtonProps = {
  href?: string
  icon: keyof typeof Icons
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
} & VariantProps<typeof Variants>

export const LessonButton: React.FC<LessonButtonProps> = ({
  icon,
  href,
  variant,
  className,
  style = {},
  disabled = false
}) => {
  if (!href) {
    return 'button without href'
  }

  return (
    <a
      href={href || '#'}
      className={cn(Variants({ variant }), className, disabled && 'pointer-events-not-allowed')}
      style={style}>
      {Icons[icon]('', '', disabled ? '#afafaf' : '#fff')}
    </a>
  )
}