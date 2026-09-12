import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../../data/metrics';
import { PlusCircle, Search, Handshake, Truck, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

const stepIcons = {
  PlusCircle,
  Search,
  Handshake,
  Truck
};

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 border-b border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="blue" size="sm">Operational Workflow</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 font-display">
            How Circular Exchange Works
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            A frictionless 4-step B2B process from material generation to certified closed-loop delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((step) => {
            const Icon = stepIcons[step.iconName] || PlusCircle;
            return (
              <Card
                key={step.step}
                className="p-6 flex flex-col justify-between hover:border-blue-300 transition duration-150 relative group bg-slate-50/50 hover:bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-mono font-bold text-slate-300 group-hover:text-blue-600 transition-colors">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 group-hover:text-blue-600 group-hover:border-blue-300 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{step.tag}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-blue-600" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
