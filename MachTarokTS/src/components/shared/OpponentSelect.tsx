import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type opponentType = 'Open' | 'Computer' | 'AI';

const OpponentSelect = () => {

    const [selection, setSelection] = useState<opponentType>('Open');

    return (
        <div>
            <Select
                value={selection} onValueChange={(value: opponentType) => setSelection(value)}>
                <SelectTrigger className="w-[150px] border-navy bg-white text-navy">
                    <SelectValue placeholder="opponent" />
                </SelectTrigger>
                <SelectContent className='select-content border-navy'>
                    {['Open', 'Computer', 'AI'].map((item) => (
                        <SelectItem key={item} value={item}>
                            <div className="flex flex-row items-center">
                                <p>{item}</p>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default OpponentSelect