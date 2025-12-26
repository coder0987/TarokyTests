import { SettingsScroller } from '@/components/shared'
import { Label } from '@/components/ui/label';
import { emitSaveSettings, emitSettings } from '@/engine/SocketEmitter';
import { useAuthSlice } from '@/hooks/useAuthSlice';
import { useGameSlice } from '@/hooks/useGameSlice';
import { Difficulty, DifficultyReverse, GameSettings } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { SettingsNumberInput } from './SettingsNumberInput';
import { Button } from '../ui/button';

enum SettingsTypes {
    Difficulty = 'difficulty',
    Timeout = 'timeout',
    AceHigh = 'aceHigh',
    Lock = 'lock',
    BotPlayTime = 'botPlayTime',
    BotThinkTime = 'botThinkTime',
}

const SettingsMenu = ({ locked = false }: { locked?: boolean }) => {
    const aceList = ['Ace High', 'Ace Low'];
    const publiciseList = ['Public', 'Private'];
    const difficultyList = Object.keys(Difficulty);

    const username = useAuthSlice(useCallback(auth => auth.user, [])) ?? "Guest";
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        setAuthenticated(username !== 'Guest');
    }, [username]);

    const defaultSettings = useAuthSlice((auth) => auth.preferences.defaultSettings);

    // "front-end" state, which will be sent to server on change
    const [uiSettings, setUiSettings] = useState<GameSettings>({
        locked: defaultSettings.locked,
        difficulty: defaultSettings.difficulty,
        timeout: defaultSettings.timeout / 1000,
        aceHigh: defaultSettings.aceHigh,
        botPlayTime: defaultSettings.botPlayTime / 1000,
        botThinkTime: defaultSettings.botThinkTime / 1000,
    });

    const settings = useGameSlice((game) => game.gameState?.settings);

    useEffect(() => {
        if (!settings) return;

        setUiSettings({
            locked: settings.locked,
            difficulty: settings.difficulty,
            timeout: settings.timeout / 1000,
            aceHigh: settings.aceHigh,
            botPlayTime: settings.botPlayTime / 1000,
            botThinkTime: settings.botThinkTime / 1000,
        });
    }, [settings]);

    const aceHighOnChange = (v: boolean) => {
        setUiSettings(s => ({ ...s!, aceHigh: v }));
        emitSettings(SettingsTypes.AceHigh, v);
    }

    const visibilityOnChange = (v: boolean) => {
        setUiSettings(s => ({ ...s!, locked: v }));
        emitSettings(SettingsTypes.Lock, v);
    };

    const difficultyOnChange = (v: number) => {
        setUiSettings(s => ({ ...s!, difficulty: v }));
        emitSettings(SettingsTypes.Difficulty, v);
    };

    const timeoutOnChange = (v: number) => {
        setUiSettings(s => ({ ...s!, timeout: v }));
        emitSettings(SettingsTypes.Timeout, v * 1000);
    };

    const botPlayTimeOnChange = (v: number) => {
        setUiSettings(s => ({ ...s!, botPlayTime: v }));
        emitSettings(SettingsTypes.BotPlayTime, v * 1000);
    };

    const botThinkTimeOnChange = (v: number) => {
        setUiSettings(s => ({ ...s!, botThinkTime: v }));
        emitSettings(SettingsTypes.BotThinkTime, v * 1000);
    };

    return (
        <div className="w-full space-y-4">
            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">Ace Value</Label>
                <SettingsScroller
                    list={aceList}
                    value={uiSettings.aceHigh ? aceList[0] : aceList[1]}
                    onChange={(v: string) => {aceHighOnChange(v === aceList[0]);}}
                    disabled={locked}
                />
                
            </div>

            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">Room Visibility</Label>
                <SettingsScroller
                    list={publiciseList}
                    value={uiSettings.locked ? 'Private' : 'Public'}
                    onChange={(v: string) => {visibilityOnChange(v === 'Private');}}
                    disabled={locked}
                />
            </div>

            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">Bot Difficulty</Label>
                <SettingsScroller
                    list={difficultyList}
                    value={difficultyList[uiSettings.difficulty]}
                    onChange={(v: string) => difficultyOnChange(DifficultyReverse[v])}
                    disabled={locked}
                />
            </div>

            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">
                    Turn Timeout (seconds)
                </Label>
                <SettingsNumberInput
                    value={uiSettings.timeout}
                    onChange={timeoutOnChange}
                    min={20}
                    max={300}
                    step={1}
                    disabled={locked}
                />
            </div>

            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">
                    Bot Play Time (seconds)
                </Label>
                <SettingsNumberInput
                    value={uiSettings.botPlayTime}
                    onChange={botPlayTimeOnChange}
                    min={0}
                    max={60}
                    step={1}
                    disabled={locked}
                />
            </div>

            <div className="setting-group">
                <Label className="text-sm text-gray-600 block mb-1">
                    Bot Thinking Time (seconds)
                </Label>
                <SettingsNumberInput
                    value={uiSettings.botThinkTime}
                    onChange={botThinkTimeOnChange}
                    min={0}
                    max={30}
                    step={1}
                    disabled={locked}
                />
            </div>

            <div className='setting-group'>
                <Label className='text-sm text-gray-600 block mb-1'>
                    Save These Settings as Default
                </Label>
                <Button disabled={authenticated} className={`flex flex-row border border-gray-200 w-full items-center justify-between bg-white rounded-md h-10 overflow-hidden transition-opacity ${!authenticated ? "opacity-50 cursor-not-allowed " : ""
                }`} onClick={() => {
                    emitSaveSettings();
                }}>
                    {authenticated ? "Save" : "Please sign in to save your default settings"}
                </Button>
            </div>

        </div>
    );
}

export default SettingsMenu;