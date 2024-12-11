import React, { useState } from 'react'
import { Filter } from 'lucide-react';

const Sidebar = () => {
    const [selectedFilters, setSelectedFilters] = useState({
      framework: [],
      type: [],
      age: []
    });
  
    const filterSections = [
      {
        key: 'framework',
        title: 'Framework',
        options: ['React', 'Vue', 'Angular', 'Svelte', 'Solid']
      },
      {
        key: 'type',
        title: 'Component Type',
        options: ['Button', 'Input', 'Card', 'Modal', 'Navigation']
      },
      {
        key: 'age',
        title: 'Age',
        options: ['New', 'Old', 'Trending']
      }
    ];
  
    const toggleFilter = (sectionKey, option) => {
      setSelectedFilters(prev => ({
        ...prev,
        [sectionKey]: prev[sectionKey].includes(option)
          ? prev[sectionKey].filter(item => item !== option)
          : [...prev[sectionKey], option]
      }));
    };
  
    return (
      <div className="w-64 bg-white border-r border-black/10 h-screen fixed left-0 top-16 p-4 overflow-y-auto">
        <div className="flex items-center mb-4">
          <Filter className="mr-2 text-black/60" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        {filterSections.map((section, idx) => (
          <div key={idx} className="mb-4">
            <h3 className="font-medium text-black/70 mb-2">{section.title}</h3>
            <div className="space-y-2">
              {section.options.map((option, optIdx) => (
                <FilterOption 
                  key={optIdx}
                  label={option} 
                  isSelected={selectedFilters[section.key]?.includes(option)}
                  onToggle={() => toggleFilter(section.key, option)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const FilterOption = ({ label, isSelected, onToggle }) => (
    <div 
      className={`flex items-center space-x-2 cursor-pointer ${
        isSelected ? 'text-black' : 'text-black/60'
      }`}
      onClick={onToggle}
    >
      <div 
        className={`w-4 h-4 border ${
          isSelected 
            ? 'bg-black border-black' 
            : 'border-black/30 bg-transparent'
        }`}
      />
      <span>{label}</span>
    </div>
  );
  
export default Sidebar