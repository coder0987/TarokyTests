interface TemplateCardProps {
  name: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ name }) => {

    return (
      <div className="p-4 rounded-lg bg-white">
        <h3>{name}</h3>
      </div>
    );
  };
  
  export default TemplateCard;
  