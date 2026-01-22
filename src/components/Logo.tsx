import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
    const sizeClasses = {
        sm: {
            container: 'h-8',
            text: 'text-xl',
            plus: 'h-4 w-4',
            square: 'h-2 w-2',
        },
        md: {
            container: 'h-12',
            text: 'text-3xl',
            plus: 'h-6 w-6',
            square: 'h-3 w-3',
        },
        lg: {
            container: 'h-16',
            text: 'text-4xl',
            plus: 'h-8 w-8',
            square: 'h-4 w-4',
        },
        xl: {
            container: 'h-24',
            text: 'text-6xl',
            plus: 'h-12 w-12',
            square: 'h-6 w-6',
        },
    };

    const sizes = sizeClasses[size];

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`flex items-center ${sizes.container}`}>
                {/* AVSER Text */}
                <h1 className={`${sizes.text} font-black bg-gradient-to-r from-sky-500 via-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight`}>
                    AVSER
                </h1>

                {/* Colorful Plus Symbol */}
                <div className={`relative ${sizes.plus} ml-1`}>
                    {/* Yellow square - top */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${sizes.square} bg-yellow-400 rounded-sm`} />

                    {/* Red square - right */}
                    <div className={`absolute top-1/2 right-0 -translate-y-1/2 ${sizes.square} bg-red-500 rounded-sm`} />

                    {/* Pink/Magenta square - center (overlapping) */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${sizes.square} bg-pink-500 rounded-sm z-10`} />

                    {/* Green square - bottom */}
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${sizes.square} bg-emerald-500 rounded-sm`} />

                    {/* Teal square - left */}
                    <div className={`absolute top-1/2 left-0 -translate-y-1/2 ${sizes.square} bg-teal-500 rounded-sm`} />
                </div>
            </div>

            {/* Optional tagline */}
            {showText && size !== 'sm' && (
                <div className="hidden md:block">
                    <p className="text-[10px] text-gray-600 font-medium leading-tight max-w-[200px]">
                        Aspirant Verification, Screening,
                        <br />
                        Evaluation & Recruitment
                    </p>
                </div>
            )}
        </div>
    );
};

export default Logo;
