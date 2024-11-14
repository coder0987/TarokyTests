import { bitcoinDonationAddress, cashappDonationLink, ethDonationAddress, paypalDonationLink } from '@/constants'
import { Underline } from 'lucide-react'
import React from 'react'

const Donate = () => {
    return (
        <div className='flex justify-center w-full h-full'>
            <div className="mt-20 mb-40 w-4/5 xl:w-3/4">
                <h2 className="h2-bold mb-10">Donate</h2>
                <div className='flex flex-col gap-2 items-start justify-center'>
                    <h4 className='h4'>Bitcoin: <span className='hover:underline hover:cursor-copy'>{bitcoinDonationAddress}</span></h4>
                    <h4 className='h4'>EVM: <span className='hover:underline hover:cursor-copy'>{ethDonationAddress}</span></h4>
                    <h4 className='h4 flex flex-row'>PayPal:<span className='hover:underline hover:cursor-copy ml-1'>{paypalDonationLink}</span><a className='ml-1 hover:cursor-pointer flex items-center justify-center' href={"https://" + paypalDonationLink} target='_blank'><img src={"/assets/icons/link-to-dark.svg"} height={16} width={16} /></a></h4>
                    <h4 className='h4 flex flex-row'>CachApp:<span className='hover:underline hover:cursor-copy ml-1'>{cashappDonationLink}</span><a className='ml-1 hover:cursor-pointer flex items-center justify-center' href={"https://" + cashappDonationLink} target='_blank'><img src={"/assets/icons/link-to-dark.svg"} height={16} width={16} /></a></h4>
                </div>
            </div>
        </div>
    )
}

export default Donate