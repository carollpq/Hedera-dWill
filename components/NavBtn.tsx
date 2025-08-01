"use client"

type NavBtnVariant = 'primary' | 'cta' | 'outline' | 'ghost';

type NavBtnProps = {
    text: string;
    variant?: NavBtnVariant;
    className?: string;
    onClick?: () => void;
}

const getVariantClasses = (variant: NavBtnVariant = 'primary') => {
    switch (variant) {
        case 'cta':
            return [
                'rounded-md border border-white/50 text-white opacity-90 hover:opacity-100 transition-opacity bg-[#8B5CF666]',
                'bg-gradient-to-r from-white/50 to-transparent',
                'shadow-[0_12px_34px_0_rgba(0,0,0,0.40)] backdrop-blur'  
            ].join(' ');
        case 'outline':
            return 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900';
        case 'ghost':
            return 'bg-transparent hover:bg-white/10 text-white';
        case 'primary':
        default:
            return 'group relative bg-transparent text-white';
    }
};

export default function NavBtn({ 
    text, 
    variant = 'primary', 
    className = '',
    onClick 
}: NavBtnProps) {
    const variantClasses = getVariantClasses(variant);
    const baseClasses = 'px-4 py-2 rounded-lg mx-5 transition-all duration-200 font-medium flex items-center justify-center hover:cursor-pointer text-white/90 hover:text-white';
    
    return (
        <div className="group relative">
            <button 
                className={`${baseClasses} ${variantClasses} ${className}`}
                onClick={onClick}
            >
                {text}
                {variant === 'primary' && (
                    <span className="absolute bottom-0 mt-2 left-1/2 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                )}
            </button>
        </div>
    )
}