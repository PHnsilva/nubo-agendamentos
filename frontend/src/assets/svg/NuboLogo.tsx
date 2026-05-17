export function NuboLogo() {
  return (
    <svg className="logo-mark" viewBox="0 0 226 72" role="img" aria-label="Nubo">
      <defs>
        <linearGradient id="nuboOrange" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff8a00" />
          <stop offset="100%" stopColor="#e85d04" />
        </linearGradient>
      </defs>
      <path
        d="M19 49V29c0-8 9.6-11.9 15.2-6.2l24.6 25c5.6 5.7 15.2 1.7 15.2-6.3V20"
        fill="none"
        stroke="#071f3d"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="13"
      />
      <circle cx="19" cy="49" r="8" fill="url(#nuboOrange)" stroke="#071f3d" strokeWidth="7" />
      <circle cx="74" cy="20" r="11" fill="#fff8ef" stroke="url(#nuboOrange)" strokeWidth="7" />
      <path
        d="M32 9c-10 0-18 8.1-18 18.1 0 13.4 18 32.3 18 32.3S50 40.5 50 27.1C50 17.1 42 9 32 9Zm0 25a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
        fill="url(#nuboOrange)"
      />
      <path d="M100 53V19h9.4l18.1 20.4V19h10.2v34h-9.3l-18.2-20.4V53H100Zm59.5.7c-9.1 0-14.9-5.8-14.9-14.7V24.8h10.2v13.6c0 4.1 2.1 6.4 5.8 6.4 3.9 0 6.2-2.7 6.2-6.8V24.8H177V53h-9.7v-3.5c-2 2.6-4.6 4.2-7.8 4.2Zm35.1 0c-4.2 0-7.4-1.4-9.6-4V53h-9.7V17h10.2v11.9c2.2-2.7 5.5-4.4 9.4-4.4 8.1 0 14.5 6.4 14.5 14.5 0 8.2-6.6 14.7-14.8 14.7Zm-2.4-8.2c4.2 0 7.2-2.9 7.2-6.6s-3-6.5-7.2-6.5c-4.1 0-7.1 2.8-7.1 6.5s3 6.6 7.1 6.6Z" fill="#071f3d" />
      <path d="M213.1 53.7c-9.2 0-16.2-6.4-16.2-14.7 0-8.2 7-14.5 16.2-14.5 9.1 0 16.1 6.3 16.1 14.5 0 8.3-7 14.7-16.1 14.7Zm0-8.2c4 0 6.6-2.7 6.6-6.5s-2.6-6.4-6.6-6.4c-4.1 0-6.7 2.6-6.7 6.4s2.6 6.5 6.7 6.5Z" fill="#071f3d" />
    </svg>
  );
}
