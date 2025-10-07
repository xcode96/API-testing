import React, { useRef } from 'react';
import { User, AppSettings } from '../../types';
import Certificate from '../Certificate';

// Since jsPDF and html2canvas are loaded via script tags, we declare them globally for TypeScript
declare const jspdf: any;
declare const html2canvas: any;

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    settings: AppSettings;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, user, settings }) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handleDownloadPNG = async () => {
        if (!certificateRef.current || !user) return;
        const { toPng } = (window as any).htmlToImage;
        try {
            const dataUrl = await toPng(certificateRef.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `Certificate-${user.username}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Failed to generate PNG:", error);
            alert("Could not generate PNG certificate.");
        }
    };

    const handleDownloadPDF = async () => {
        if (!certificateRef.current || !user) return;
        try {
            const { jsPDF } = jspdf;
            const canvas = await html2canvas(certificateRef.current, { scale: 3 });
            const imgData = canvas.toDataURL('image/png');
            
            const pdfWidth = 1100;
            const pdfHeight = 850;

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [pdfWidth, pdfHeight]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Certificate-${user.username}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Could not generate PDF certificate.");
        }
    };
    
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white rounded-2xl p-4 max-w-6xl w-full shadow-xl relative transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="absolute top-4 right-4 z-10">
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white/50 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                {/* Certificate Preview */}
                <div className="overflow-hidden rounded-lg flex justify-center items-center bg-slate-100 p-4">
                    <div className="transform scale-[0.8] origin-center">
                       <Certificate ref={certificateRef} user={user} settings={settings} />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center items-center gap-4 py-4">
                     <button onClick={handleDownloadPNG} className="bg-slate-600 text-white font-semibold rounded-lg py-2.5 px-6 hover:bg-slate-700 transition-colors duration-300 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                        Download PNG
                    </button>
                    <button onClick={handleDownloadPDF} className="bg-indigo-500 text-white font-semibold rounded-lg py-2.5 px-6 hover:bg-indigo-600 transition-colors duration-300 shadow-lg shadow-indigo-500/30 flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificateModal;