import React from 'react';
import { Link } from 'react-router-dom';
import { MATERIAL_CATEGORIES } from '../../data/materials';
import { Package, Boxes, Layers, Shield, Database, Recycle, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

const categoryIcons = {
  Package,
  Boxes,
  Layers,
  Shield,
  Database,
  Recycle
};

export const CategoryGrid = () => {
  return (
    <section id="categories" className="py-20 border-b border-slate-200/80 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <Badge variant="blue" size="sm">Material Streams</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 font-display">
              Secondary Packaging Categories
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Standardized feedstock classifications across industrial packaging fractions.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5"
          >
            <span>Explore all categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MATERIAL_CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.iconName] || Package;
            return (
              <Link key={cat.id} to={`/marketplace?category=${cat.id}`}>
                <Card
                  hoverEffect
                  className="p-6 h-full flex flex-col justify-between hover:border-blue-300 hover:shadow-card-hover group bg-white"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 font-medium">
                        {cat.activeLots} lots
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition font-display">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="text-[11px] group-hover:text-slate-900">View Active Supply</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
