export function LandingIllustration() {
  return (
    <svg className="hero-illustration" viewBox="0 0 640 500" role="img" aria-label="Interface de agendamento com prestadores locais">
      <defs>
        <linearGradient id="screen" x1="80" x2="560" y1="80" y2="430">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F7F4EC" />
        </linearGradient>
        <linearGradient id="warmRoute" x1="0" x2="1">
          <stop stopColor="#E85D04" />
          <stop offset="1" stopColor="#B77900" />
        </linearGradient>
      </defs>

      <rect x="78" y="64" width="480" height="356" rx="34" fill="url(#screen)" stroke="#E3DCCF" strokeWidth="2" />
      <rect x="110" y="96" width="160" height="26" rx="13" fill="#FFF3E7" />
      <rect x="292" y="96" width="90" height="26" rx="13" fill="#FFF0E1" />
      <rect x="394" y="96" width="110" height="26" rx="13" fill="#FFF4D1" />

      <g transform="translate(112 150)">
        <rect width="176" height="210" rx="22" fill="#07111F" />
        <text x="24" y="40" fill="#FFFFFF" fontSize="21" fontWeight="900">Agenda</text>
        <text x="24" y="66" fill="#E3DCCF" fontSize="13">Hoje, 13 maio</text>
        {[0, 1, 2, 3].map((row) => (
          <g key={row} transform={`translate(22 ${90 + row * 28})`}>
            <rect width="132" height="14" rx="7" fill={row === 1 ? '#E85D04' : '#1C2A3B'} />
            <circle cx="146" cy="7" r="7" fill={row === 1 ? '#B77900' : '#617084'} />
          </g>
        ))}
      </g>

      <g transform="translate(316 150)">
        {[
          ['CL', 'Studio Clara', 'Beleza', '#E85D04', '#FFF0E1'],
          ['RF', 'Rafael Forte', 'Reparos', '#9B3700', '#FFF3E7'],
          ['AV', 'Aula Viva', 'Consultoria', '#10243D', '#E8EDF2'],
        ].map(([initial, name, category, color, bg], index) => (
          <g key={name} transform={`translate(0 ${index * 72})`}>
            <rect width="210" height="56" rx="18" fill="#FFFFFF" stroke="#E3DCCF" />
            <circle cx="30" cy="28" r="18" fill={bg} />
            <text x="30" y="34" fill={color} fontSize="13" fontWeight="900" textAnchor="middle">{initial}</text>
            <text x="62" y="25" fill="#07111F" fontSize="14" fontWeight="900">{name}</text>
            <text x="62" y="43" fill="#617084" fontSize="12">{category}</text>
            <path d="M178 19h14M185 12v14" stroke={color} strokeLinecap="round" strokeWidth="2" />
          </g>
        ))}
      </g>

      <path d="M286 250C326 214 372 220 410 184" fill="none" stroke="url(#warmRoute)" strokeDasharray="9 13" strokeLinecap="round" strokeWidth="5" />
      <circle cx="286" cy="250" r="10" fill="#E85D04" />
      <circle cx="410" cy="184" r="10" fill="#B77900" />

      <g transform="translate(354 342)">
        <rect width="176" height="76" rx="20" fill="#FFFFFF" stroke="#E3DCCF" />
        <circle cx="38" cy="38" r="20" fill="#FFF4D1" />
        <path d="m29 39 6 6 13-16" fill="none" stroke="#07111F" strokeLinecap="round" strokeWidth="4" />
        <text x="72" y="33" fill="#07111F" fontSize="15" fontWeight="900">Curadoria</text>
        <text x="72" y="53" fill="#617084" fontSize="12">perfil aprovado</text>
      </g>
    </svg>
  );
}
