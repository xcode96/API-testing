import React, { forwardRef, useMemo } from 'react';
import { User, AppSettings } from '../types';

// --- Reusable utility components ---

const CornerBorder: React.FC<{ position: string }> = ({ position }) => {
    const baseClasses = "absolute w-20 h-20";
    const rotations: { [key: string]: string } = {
        'top-0 left-0': 'rotate-0',
        'top-0 right-0': 'rotate-90',
        'bottom-0 right-0': 'rotate-180',
        'bottom-0 left-0': '-rotate-90',
    };
    return (
        <div className={`${baseClasses} ${position}`}>
            <div className={`w-full h-full transform ${rotations[position]}`}>
                <div className="absolute top-0 left-0 w-full h-3 bg-green-600" style={{ backgroundImage: 'linear-gradient(to right, #16a34a, #15803d)' }}></div>
                <div className="absolute top-0 left-0 w-3 h-full bg-green-600" style={{ backgroundImage: 'linear-gradient(to bottom, #16a34a, #15803d)' }}></div>
                 {/* This creates the inner diagonal pattern */}
                <div className="absolute top-5 left-5 w-10 h-10 overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}>
                    <div className="w-20 h-20 -translate-x-1/2 -translate-y-1/2" style={{
                         backgroundImage: 'repeating-linear-gradient(45deg, #16a34a, #16a34a 4px, #15803d 4px, #15803d 8px)'
                    }}></div>
                </div>
            </div>
        </div>
    );
};

interface CertificateProps {
    user: User;
    settings: AppSettings;
}

// --- Main Certificate Component ---

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(({ user, settings }, ref) => {
    
    const memoizedData = useMemo(() => {
        const date = user.submissionDate ? new Date(user.submissionDate) : new Date();
        const since = date.getFullYear();
        const number = `${since}-${user.id.toString().padStart(4, '0')}`;
        
        const endDate = new Date(date);
        endDate.setFullYear(date.getFullYear() + (settings.certificationCycleYears || 3));
        
        const cycleStart = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const cycleEnd = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        return {
            certifiedSince: since,
            certificationNumber: number,
            certificationCycleStart: cycleStart,
            certificationCycleEnd: cycleEnd,
        }

    }, [user, settings.certificationCycleYears]);

    return (
        <div
            ref={ref}
            className="bg-white font-[serif] flex flex-col shadow-lg border border-gray-200 relative p-8"
            style={{ width: '1100px', height: '850px' }}
        >
            <CornerBorder position="top-0 left-0" />
            <CornerBorder position="top-0 right-0" />
            <CornerBorder position="bottom-0 right-0" />
            <CornerBorder position="bottom-0 left-0" />
            
            {settings.logo && (
                <img src={settings.logo} alt="Watermark" className="absolute inset-0 m-auto w-1/2 h-1/2 object-contain opacity-5 z-0" />
            )}

            <div className="relative z-10 flex flex-col h-full text-center p-12 border-2 border-gray-300">
                <header className="flex items-center justify-center gap-4 mb-4">
                    {settings.logo && <img src={settings.logo} alt="Company Logo" className="h-16 object-contain" />}
                    <div>
                    <h1 className="text-4xl font-bold text-gray-800 tracking-wide">{settings.companyFullName.split(' ')[0]}</h1>
                    <h2 className="text-2xl text-green-700">{settings.companyFullName.substring(settings.companyFullName.indexOf(' ')+1)}</h2>
                    </div>
                </header>

                <p className="text-gray-600 text-lg mb-8">The Board of Directors hereby awards</p>
                <div className="mb-8">
                    <h3 className="text-6xl font-semibold text-gray-900">{user.fullName}</h3>
                    <p className="text-gray-500 mt-2 text-lg">the credential of</p>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">{settings.courseName}</h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-center leading-relaxed mb-auto">
                    {settings.certificationBodyText}
                </p>

                <footer className="flex justify-between items-end w-full mt-8">
                    <div className="flex flex-col gap-8 text-left">
                        <div className="w-64">
                            {settings.signature1 && <img src={settings.signature1} alt="Signature 1" className="h-12 object-contain mb-1" />}
                            <div className="border-t border-gray-400 pt-1">
                                <p className="font-bold text-sm">{settings.signature1Name}</p>
                                <p className="text-xs text-gray-500">{settings.signature1Title}</p>
                            </div>
                        </div>
                        <div className="w-64">
                            {settings.signature2 && <img src={settings.signature2} alt="Signature 2" className="h-12 object-contain mb-1" />}
                            <div className="border-t border-gray-400 pt-1">
                                <p className="font-bold text-sm">{settings.signature2Name}</p>
                                <p className="text-xs text-gray-500">{settings.signature2Title}</p>
                            </div>
                        </div>
                    </div>

                    {settings.certificationSeal && (
                        <img src={settings.certificationSeal} alt="Certification Seal" className="h-24 object-contain" />
                    )}

                    <div className="text-left text-sm">
                        <div className="border-b border-gray-400 pb-2 mb-2">
                            <p className="text-gray-500 text-xs">Certification Number</p>
                            <p className="font-semibold text-gray-800">{memoizedData.certificationNumber}</p>
                        </div>
                        <div className="border-b border-gray-400 pb-2 mb-2">
                            <p className="text-gray-500 text-xs">Certification Cycle</p>
                            <p className="font-semibold text-gray-800">{memoizedData.certificationCycleStart} - {memoizedData.certificationCycleEnd}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs">Certified Since: {memoizedData.certifiedSince}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
});

export default Certificate;