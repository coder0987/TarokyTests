import { SettingsScroller } from '@/components/shared'
import { Label } from '@/components/ui/label';

const SettingsMenu = ({ locked = false }: { locked?: boolean }) => {
    const aceList = ['Ace High', 'Ace Low'];
    const callList = ['XIX', 'XX', 'King'];
    const timeoutList = ['Timed', 'Not timed'];
    const publiciseList = ['Public', 'Private'];
    const oneonendList = ['2/4', '4/8', '5/10', '10/20'];
    const difficcultyList = ['Beginner', 'Easy', 'Normal', 'Hard', 'Ruthless', 'AI'];

    return (
        <div className="w-full space-y-4">
            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">Ace Value</Label>
                <SettingsScroller list={aceList} disabled={locked} />
            </div>

            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">Call Card</Label>
                <SettingsScroller list={callList} disabled={locked} />
            </div>

            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">Turn Timeout</Label>
                <SettingsScroller list={timeoutList} disabled={locked} />
            </div>

            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">Room Visibility</Label>
                <SettingsScroller list={publiciseList} disabled={locked} />
            </div>

            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">Blind Stakes</Label>
                <SettingsScroller list={oneonendList} disabled={locked} />
            </div>

            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">Bot Difficulty</Label>
                <SettingsScroller list={difficcultyList} disabled={locked} />
            </div>
        </div>
    );
}

export default SettingsMenu;