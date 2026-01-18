
import React from 'react';
import { Dish } from '../types';

interface DishModalProps {
  dish: Dish | null;
  onClose: () => void;
}

export const DishModal: React.FC<DishModalProps> = ({ dish, onClose }) => {
  if (!dish) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
      <div className="bg-white max-w-4xl w-full rounded-sm overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        <div className="md:w-1/2 aspect-square md:aspect-auto">
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-stone-400 hover:text-stone-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <span className="text-amber-700 text-xs tracking-widest uppercase mb-4 block">
            {dish.category}
          </span>
          <h2 className="text-4xl font-serif text-stone-900 mb-4">{dish.name}</h2>
          <p className="text-2xl font-light text-amber-800 mb-8">{dish.price}</p>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2">Ghi chú món ăn</h4>
              <p className="text-stone-600 leading-relaxed italic">
                "{dish.description}"
              </p>
            </div>
            
            <div className="pt-8 border-t border-stone-100 text-sm text-stone-500">
              <p>Món ăn được chế biến từ những nguyên liệu tươi ngon nhất trong ngày, đảm bảo hương vị và giá trị dinh dưỡng cao nhất.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
