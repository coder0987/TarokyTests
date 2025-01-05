import React from 'react';

interface TemplateSelectProps {
  templates: string[];
  saves: string[];
}

const TemplateSelect: React.FC<TemplateSelectProps> = ({ templates, saves }) => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full p-4">
        <h2>MachTarok Templates</h2>
        {templates ? (templates.map((value, key) => {
            return (
                <div key={key}>
                    {value}
                </div>
            );
        })) : (
            <div>
                <p>Loading</p>
            </div>
        )}
      </div>
      {saves && saves.length > 0 && 
        (
            <div className="w-full p-4">
                <h2>Custom Templates</h2>
                {
                    templates.map((value, key) => {
                        return (
                            <div key={key}>
                                {value}
                            </div>
                        );
                    })
                }
            </div>
        )}
        <div className="w-full p-4">
            <h2>Import</h2>
            <p>Input box (coming soon)</p>
        </div>
    </div>
  );
};

export default TemplateSelect;
