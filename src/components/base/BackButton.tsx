import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
  to?: string;
}

export default function BackButton({ label = 'عودة', to }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer inline-flex items-center gap-2 whitespace-nowrap group"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        fontFamily: "'Outfit', sans-serif",
        fontSize: '0.7rem',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#9aaa96',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a2617'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9aaa96'; }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '1px solid rgba(154,170,150,0.4)',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
        className="group-hover:border-[#1a2617]"
      >
        <i className="ri-arrow-left-line" style={{ fontSize: '13px' }} />
      </span>
      {label}
    </button>
  );
}
