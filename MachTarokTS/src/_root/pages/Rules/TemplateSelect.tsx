import React from 'react';
import TemplateCard from './TemplateCard';

interface TemplateSelectProps {
    templates: string[];
    saves: string[];
    handleTemplateSelect: (templateName: string) => void;
    handleCustomTemplateSelect: (templateName: string) => void;
}

const TemplateSelect: React.FC<TemplateSelectProps> = ({ templates, saves, handleTemplateSelect, handleCustomTemplateSelect }) => {

    const handleTemplateClick = (key: number) => {
        handleTemplateSelect(templates[key]);
    }

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="w-full p-4 flex flex-col items-start">
                <h2 className='h2 mx-auto mb-6'>MachTarok Templates</h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mx-auto">
                    {templates ? (templates.map((value, key) => {
                        return (
                            <div key={key} className="cursor-pointer" onClick={() => handleTemplateClick(key)}>
                                <TemplateCard name={value} />
                            </div>
                        );
                    })) : (
                        <div>
                            <p>Loading</p>
                        </div>
                    )}
                    <div className="cursor-pointer" onClick={() => handleTemplateClick(-1)}>
                        <TemplateCard name="Continue" />
                    </div>
                    <div className="cursor-pointer" onClick={() => handleTemplateClick(-2)}>
                        <TemplateCard name="Blank" />
                    </div>
                </div>
            </div>
            {saves && saves.length > 0 &&
                (
                    <div className="w-full p-4 flex flex-col items-start">
                        <h2 className='h2 mx-auto mb-6'>Custom Templates</h2>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mx-auto">
                        {
                            saves.map((value, key) => {
                                return (
                                    <div key={key} className="cursor-pointer" onClick={() => handleCustomTemplateSelect(saves[key])}>
                                        <TemplateCard name={value} />
                                    </div>
                                );
                            })
                        }
                        </div>
                    </div>
                )}
        </div>
    );
};

export default TemplateSelect;
