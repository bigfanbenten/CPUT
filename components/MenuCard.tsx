
import React from 'react';
import { Dish } from '../types';

interface MenuCardProps {
  dish: Dish;
  onClick: (dish: Dish) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ dish, onClick }) => {
  return (
    <div 
      onClick={() => onClick(dish)}
      className="group cursor-pointer overflow-hidden bg-white border border-stone-100 hover:shadow-xl transition-all duration-500 rounded-sm"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={dish.image_url} 
          alt={dish.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {dish.tags?.map(tag => (
            <span key={tag} className="bg-stone-900/80 text-white text-[10px] px-2 py-1 tracking-widest uppercase backdrop-blur-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif text-stone-800 group-hover:text-amber-700 transition-colors">
            {dish.name}
          </h3>
          <span className="text-sm font-medium text-amber-800 whitespace-nowrap ml-4">
            {dish.price}
          </span>
        </div>
        <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">
          {dish.description}
        </p>
      </div>
    </div>
  );
};
