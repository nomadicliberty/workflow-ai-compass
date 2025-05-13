
import React from 'react';
import { CategoryAssessment, categoryLabels } from '../../types/audit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryCard from './CategoryCard';

interface CategoryTabsProps {
  categories: CategoryAssessment[];
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Detailed Results</h2>
      
      <Tabs defaultValue={categories[0].category}>
        <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.category} value={category.category}>
              {categoryLabels[category.category]}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category.category} value={category.category}>
            <CategoryCard assessment={category} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default CategoryTabs;
