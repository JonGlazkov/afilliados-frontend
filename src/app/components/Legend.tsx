import React from 'react';

interface LegendProps {
  items: { [key: number]: string };
  colors: { [key: number]: string };
  transactionType: number;
}

const Legend: React.FC<LegendProps> = ({ items, colors, transactionType }) => {
  return (
    <div className="flex">
      {Object.entries(items).map(([key, value]) => {
        const currentType = Number(key);

        if (currentType === transactionType) {
          return (
            <div key={key} className="flex items-center ">
              <div
                className={`w-4 h-4 mr-2 ${colors[currentType]} rounded-full`}
              />
              <span>{value}</span>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default Legend;
