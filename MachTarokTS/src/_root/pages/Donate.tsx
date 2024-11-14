import { bitcoinDonationAddress, cashappDonationLink, ethDonationAddress, paypalDonationLink } from '@/constants'
import { useToast } from '@/context/ToastContext'
import { Underline } from 'lucide-react'
import React from 'react'

const Donate = () => {

    const { showToast } = useToast();

    const copyToClipboard = async (text: string, subject: string) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log(`${subject} copied to clipboard!`);
            showToast(`Successfully copied ${subject}`, 'success');
        } catch (err) {
            console.error(`Failed to copy ${subject}: `, err);
            showToast(`Failed to copy ${subject}`, 'error');
        }
    };

    return (
        <div className='flex justify-center w-full h-full'>
            <div className="mt-20 mb-40 w-4/5 xl:w-3/4">
                <h2 className="h2-bold mb-10">Donate</h2>
                <div className='flex flex-col gap-2 items-start justify-center'>
                    <h4 className='h4'>Bitcoin: <span className='hover:underline hover:cursor-copy' onClick={() => copyToClipboard(bitcoinDonationAddress, "Bitcoin address")}>{bitcoinDonationAddress}</span></h4>
                    <h4 className='h4'>EVM: <span className='hover:underline hover:cursor-copy' onClick={() => copyToClipboard(ethDonationAddress, "EVM address")}>{ethDonationAddress}</span></h4>
                    <h4 className='h4 flex flex-row'>PayPal:<span className='hover:underline hover:cursor-copy ml-1' onClick={() => copyToClipboard(paypalDonationLink, "PayPal link")}>{paypalDonationLink}</span><a className='ml-1 hover:cursor-pointer flex items-center justify-center' href={"https://" + paypalDonationLink} target='_blank'><img src={"/assets/icons/link-to-dark.svg"} height={16} width={16} /></a></h4>
                    <h4 className='h4 flex flex-row'>CashApp:<span className='hover:underline hover:cursor-copy ml-1' onClick={() => copyToClipboard(cashappDonationLink, "CashApp link")}>{cashappDonationLink}</span><a className='ml-1 hover:cursor-pointer flex items-center justify-center' href={"https://" + cashappDonationLink} target='_blank'><img src={"/assets/icons/link-to-dark.svg"} height={16} width={16} /></a></h4>
                </div>
            </div>
        </div>
    )
}

export default Donate