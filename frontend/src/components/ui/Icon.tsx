import type { ReactNode, SVGProps } from 'react';

export type IconName =
  | 'arrowRight'
  | 'briefcase'
  | 'calendar'
  | 'check'
  | 'clock'
  | 'heart'
  | 'home'
  | 'location'
  | 'message'
  | 'phone'
  | 'search'
  | 'shield'
  | 'sliders'
  | 'spark'
  | 'star'
  | 'tools'
  | 'userCheck'
  | 'wallet'
  | 'x';

const paths: Record<IconName, ReactNode> = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  briefcase: <path d="M10 7V6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm0 5h16" />,
  calendar: <path d="M7 3v4M17 3v4M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <path d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  heart: <path d="M20 8.5c0 5-8 10-8 10s-8-5-8-10A4.5 4.5 0 0 1 12 5a4.5 4.5 0 0 1 8 3.5Z" />,
  home: <path d="m4 11 8-7 8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8Z" />,
  location: <path d="M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0Z" />,
  message: <path d="M5 5h14v10H8l-3 4V5Zm4 4h6M9 12h4" />,
  phone: <path d="M7 5 5 7c1 6 6 11 12 12l2-2-4-4-2 2c-2-1-4-3-5-5l2-2-3-3Z" />,
  search: <path d="m21 21-4.2-4.2M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />,
  shield: <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Zm-3 9 2 2 4-5" />,
  sliders: <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M8 15v4" />,
  spark: <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Zm7 13 .8 2.7L22 18l-2.2.3L19 21l-.8-2.7L16 18l2.2-.3L19 15Z" />,
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  tools: <path d="M14 6a4 4 0 0 0 5 5l-7 7a3 3 0 0 1-4-4l7-7Zm-9 1 4 4M3 5l2-2 5 5-2 2-5-5Z" />,
  userCheck: <path d="M15 19a6 6 0 0 0-12 0M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 3 2 2 4-5" />,
  wallet: <path d="M4 7h14a2 2 0 0 1 2 2v9H6a2 2 0 0 1-2-2V7Zm0 0V6a2 2 0 0 1 2-2h10M16 13h4" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
