import React, { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';

const Donate = () => {
    const [notification, setNotification] = useState(null);

    const notifyCopied = (content) => {
        const isUrl = content.startsWith("http");
        const message = isUrl ? "Link Copied!" : "Address Copied!";

        setNotification(message);

        setTimeout(() => {
            setNotification(null);
        }, 2000);
    };

    const copy = async (value) => {
        try {
            await navigator.clipboard.writeText(value);
            notifyCopied(value);
        } catch (err) {
            // Fallback for older browsers
            const inp = document.createElement("input");
            document.body.appendChild(inp);
            inp.value = value;
            inp.select();
            document.execCommand("copy");
            inp.remove();
            notifyCopied(value);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 text-blue-900 relative">
            {/* Notification */}
            {notification && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
                    {notification}
                </div>
            )}

            <div className="flex flex-col items-center justify-center w-full">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-900">Donate</h1>
                </div>

                {/* Donation Cards */}
                <div className="flex justify-center">
                    <div className="w-full max-w-md lg:max-w-lg">

                        {/* PayPal */}
                        <div className="bg-white rounded-lg shadow-sm border-0 mb-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center justify-between gap-3 p-4">
                                <img
                                    src="/assets/external/paypal.svg"
                                    alt="PayPal Logo"
                                    className="h-9 object-contain"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copy('https://PayPal.Me/MachTarok')}
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-md transition-colors duration-200"
                                        title="Copy PayPal link"
                                    >
                                        <img
                                            src="/assets/icons/copy.svg"
                                            alt="Copy"
                                            className="w-4 h-4"
                                        />
                                    </button>
                                    <a
                                        href="https://PayPal.Me/MachTarok"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors duration-200"
                                        title="Open PayPal"
                                    >
                                        <img
                                            src="/assets/icons/external-link.svg"
                                            alt="Copy"
                                            className="w-4 h-4"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Cash App */}
                        <div className="bg-white rounded-lg shadow-sm border-0 mb-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center justify-between gap-3 p-4">
                                <img
                                    src="/assets/external/cashapp.svg"
                                    alt="CashApp Logo"
                                    className="h-9 object-contain"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copy('https://cash.app/$MachTarok')}
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-md transition-colors duration-200"
                                        title="Copy Cash App link"
                                    >
                                        <img
                                            src="/assets/icons/copy.svg"
                                            alt="Copy"
                                            className="w-4 h-4"
                                        />
                                    </button>
                                    <a
                                        href="https://cash.app/$MachTarok"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors duration-200"
                                        title="Open Cash App"
                                    >
                                        <img
                                            src="/assets/icons/external-link.svg"
                                            alt="Copy"
                                            className="w-4 h-4"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Bitcoin */}
                        <div className="bg-white text-black rounded-lg shadow-sm border-0 mb-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3 p-4">
                                <img
                                    src="https://static.debank.com/image/avax_token/logo_url/0x152b9d0fdc40c096757f570a51e494bd4b943e50/2411fb147c1cc4328edff5d204f09f80.png"
                                    alt="Bitcoin Logo"
                                    className="w-10 h-10 object-contain"
                                />
                                <div className="flex-grow">
                                    <span className="sm:text-lg font-semibold text-gray-800">
                                        MachTarok on Bitcoin
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copy('bc1qjqfv40dswdl0lssp45tmuwa5ts8p03dfx45nxl')}
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-md transition-colors duration-200"
                                        title="Copy Bitcoin address"
                                    >
                                        <img
                                            src="/assets/icons/copy.svg"
                                            alt="Copy"
                                            className="w-4 h-4"
                                        />
                                    </button>
                                    <a
                                        href="https://mempool.space/address/bc1qjqfv40dswdl0lssp45tmuwa5ts8p03dfx45nxl"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors duration-200"
                                        title="View on blockchain explorer"
                                    >
                                        <img
                                            src="/assets/icons/external-link.svg"
                                            alt="Copy"
                                            className="w-4 h-4"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* EVM (Ethereum) */}
                        <div className="bg-white text-black rounded-lg shadow-sm border-0 mb-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3 p-4">
                                <img
                                    src="https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png"
                                    alt="Ethereum Logo"
                                    className="w-10 h-10 object-contain"
                                />
                                <div className="flex-grow">
                                    <span className="sm:text-lg font-semibold text-gray-800">
                                        MachTarok on EVM
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copy('0x5f2CfF4a4850Bd209e721b0C26fcF63F0EB79c6a')}
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-md transition-colors duration-200"
                                        title="Copy EVM address"
                                    >
                                        <img
                                            src="/assets/icons/copy.svg"
                                            alt="Copy"
                                            className="w-4 h-4"
                                        />
                                    </button>
                                    <a
                                        href="https://debank.com/profile/0x5f2CfF4a4850Bd209e721b0C26fcF63F0EB79c6a"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors duration-200"
                                        title="View on Debank"
                                    >
                                        <img
                                            src="/assets/icons/external-link.svg"
                                            alt="Copy"
                                            className="w-4 h-4"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donate;