import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  Bookmark, 
  ChevronRight, 
  Briefcase, 
  TrendingUp, 
  DollarSign,
  ChevronDown,
  Check,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { careersStorage, savedCareersStorage } from '../../../utils/storage';
import { careerGlossary } from '../../../data/careers';

export default function CareerLibrary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [sortBy, setSortBy] = useState<'match' | 'title'>('match');
  const [careers, setCareers] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if admin has added any careers
    const adminCareers = careersStorage.get([]);
    let allCareers: any[] = [];
    
    if (adminCareers.length > 0) {
      allCareers = adminCareers.map((c: any) => ({
        id: c.id,
        title: c.name || c.title,
        category: c.category || 'General',
        salary: `$${c.salaryMin || '50k'} - $${c.salaryMax || '100k'}`,
        growth: 'High',
        education: "Bachelor's Degree",
        match: c.match || `${Math.floor(Math.random() * 35) + 65}%`,
        image: c.image || `https://picsum.photos/seed/${c.id}/600/400`,
        description: c.description || `A professional role in the ${c.category} sector.`
      }));
    } else {
      // Generate initial careers from the glossary
      let idCounter = 1;
      for (const [cluster, jobs] of Object.entries(careerGlossary)) {
        // Pick a few jobs from each cluster to show initially if no admin careers exist
        const sampleJobs = (jobs as string[]).slice(0, 5);
        sampleJobs.forEach((job: string) => {
          allCareers.push({
            id: idCounter++,
            title: job,
            category: cluster,
            salary: '$60k - $120k',
            growth: 'Medium',
            education: "Bachelor's Degree",
            match: `${Math.floor(Math.random() * 30) + 68}%`,
            image: `https://picsum.photos/seed/${idCounter * 7}/600/400`,
            description: `A professional in the ${cluster} industry focusing on ${job.toLowerCase()} tasks, strategy, and daily operations.`
          });
        });
      }
    }

    // Sort by match percentage (highest first)
    const sorted = [...allCareers].sort((a, b) => {
      const matchA = parseInt(a.match) || 0;
      const matchB = parseInt(b.match) || 0;
      return matchB - matchA;
    });

    setCareers(sorted);

    const saved = savedCareersStorage.get([]);
    setSavedIds(saved.map((c: any) => c.id));
  }, []);

  // Compute available unique industries from data
  const availableIndustries = useMemo(() => {
    const list = Array.from(new Set(careers.map(c => c.category).filter(Boolean)));
    return list.sort();
  }, [careers]);

  // Compute counts for each industry
  const industryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    careers.forEach(c => {
      if (c.category) {
        counts[c.category] = (counts[c.category] || 0) + 1;
      }
    });
    return counts;
  }, [careers]);

  // Filtered industries within the dropdown search
  const filteredDropdownIndustries = useMemo(() => {
    if (!dropdownSearch.trim()) return availableIndustries;
    return availableIndustries.filter(ind => 
      ind.toLowerCase().includes(dropdownSearch.toLowerCase())
    );
  }, [availableIndustries, dropdownSearch]);

  // Handle toggling individual industry in multi-select
  const handleToggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => {
      if (prev.includes(industry)) {
        return prev.filter(item => item !== industry);
      } else {
        return [...prev, industry];
      }
    });
  };

  // Select all industries
  const handleSelectAllIndustries = () => {
    setSelectedIndustries([]);
  };

  // Clear all industry filters
  const handleClearIndustries = () => {
    setSelectedIndustries([]);
  };

  // Clear all filters including search
  const handleResetAllFilters = () => {
    setSearchQuery('');
    setSelectedIndustries([]);
    setDropdownSearch('');
  };

  // Main career filtering logic: search by career title, industry, or description + multi-industry filtering
  const filteredCareers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    return careers
      .filter(career => {
        // Industry filter check: if selectedIndustries is empty, it means 'All'
        const matchesIndustry = selectedIndustries.length === 0 || 
                                selectedIndustries.includes(career.category);
        
        // Search query check: matches career title, industry category, or description
        let matchesSearch = true;
        if (query) {
          const titleMatch = career.title.toLowerCase().includes(query);
          const categoryMatch = career.category.toLowerCase().includes(query);
          const descMatch = career.description?.toLowerCase().includes(query) || false;
          matchesSearch = titleMatch || categoryMatch || descMatch;
        }

        return matchesIndustry && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        // default match score
        const matchA = parseInt(a.match) || 0;
        const matchB = parseInt(b.match) || 0;
        return matchB - matchA;
      });
  }, [careers, searchQuery, selectedIndustries, sortBy]);

  const handleSaveCareer = (career: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentSaved = savedCareersStorage.get([]);
    const isSaved = currentSaved.find((c: any) => c.id === career.id);
    
    let updated;
    if (isSaved) {
      updated = currentSaved.filter((c: any) => c.id !== career.id);
    } else {
      updated = [...currentSaved, career];
    }
    
    savedCareersStorage.save(updated);
    setSavedIds(updated.map((c: any) => c.id));
  };

  const isAllSelected = selectedIndustries.length === 0;

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand/10 text-brand border border-brand/15 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Exploration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Career Library</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Discover and explore career paths that match your interests, skills, and aspirations.
          </p>
        </div>
      </div>

      {/* Expanded Search & Multi-Select Filter Bar */}
      <div className="bg-white p-3.5 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Expanded Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search careers, job titles, or industries (e.g., Software, Healthcare, Designer)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-brand rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Industry Multi-Select Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full lg:w-auto min-w-[240px] px-4 py-3.5 rounded-2xl font-bold text-sm border flex items-center justify-between gap-3 transition-all ${
                isDropdownOpen || !isAllSelected
                  ? 'bg-brand/5 border-brand/40 text-brand shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Briefcase className="w-4 h-4 text-brand shrink-0" />
                <span className="truncate">
                  {isAllSelected 
                    ? 'All Industries' 
                    : selectedIndustries.length === 1 
                      ? selectedIndustries[0] 
                      : `${selectedIndustries.length} Industries Selected`}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  isAllSelected ? 'bg-slate-200/70 text-slate-600' : 'bg-brand text-white'
                }`}>
                  {isAllSelected ? 'All' : selectedIndustries.length}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-brand' : ''}`} />
              </div>
            </button>

            {/* Dropdown Popover */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-full sm:w-96 bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 z-50 p-3 flex flex-col max-h-[420px]"
                >
                  {/* Dropdown Header & Quick Actions */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 px-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Layers className="w-3.5 h-3.5 text-brand" />
                      <span>Filter by Industry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllIndustries}
                        className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors ${
                          isAllSelected ? 'text-brand bg-brand/10' : 'text-slate-500 hover:text-brand hover:bg-slate-100'
                        }`}
                      >
                        All
                      </button>
                      {!isAllSelected && (
                        <button
                          type="button"
                          onClick={handleClearIndustries}
                          className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search inside dropdown */}
                  <div className="relative my-2.5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Find an industry..."
                      value={dropdownSearch}
                      onChange={(e) => setDropdownSearch(e.target.value)}
                      className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-brand focus:bg-white outline-none font-medium text-slate-800"
                    />
                    {dropdownSearch && (
                      <button 
                        onClick={() => setDropdownSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Industry Options List */}
                  <div className="overflow-y-auto space-y-1 flex-1 pr-1 divide-y divide-transparent">
                    {/* All Industries Option */}
                    <div
                      onClick={handleSelectAllIndustries}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        isAllSelected 
                          ? 'bg-brand/10 text-brand' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isAllSelected ? 'bg-brand border-brand text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isAllSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>All Industries</span>
                      </div>
                      <span className={`text-[11px] font-semibold ${isAllSelected ? 'text-brand' : 'text-slate-400'}`}>
                        {careers.length}
                      </span>
                    </div>

                    {/* Specific Industries */}
                    {filteredDropdownIndustries.map((ind) => {
                      const isSelected = selectedIndustries.includes(ind);
                      const count = industryCounts[ind] || 0;
                      return (
                        <div
                          key={ind}
                          onClick={() => handleToggleIndustry(ind)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-brand/10 text-brand font-bold' 
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? 'bg-brand border-brand text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="truncate">{ind}</span>
                          </div>
                          <span className={`text-[11px] font-semibold shrink-0 ${isSelected ? 'text-brand' : 'text-slate-400'}`}>
                            {count}
                          </span>
                        </div>
                      );
                    })}

                    {filteredDropdownIndustries.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No industry matches "{dropdownSearch}"
                      </div>
                    )}
                  </div>

                  {/* Dropdown Footer summary */}
                  <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                    <span>
                      {selectedIndustries.length === 0 
                        ? 'Showing all industries' 
                        : `${selectedIndustries.length} of ${availableIndustries.length} chosen`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(false)}
                      className="px-3 py-1 bg-brand text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl outline-none focus:border-brand transition-all cursor-pointer"
              >
                <option value="match">Highest Match</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
              <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filters Display & Results Count */}
        {(!isAllSelected || searchQuery.trim()) && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1">Active filters:</span>
              
              {/* Search query chip */}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  <span>Search: "{searchQuery}"</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Selected industry chips */}
              {selectedIndustries.map(ind => (
                <span 
                  key={ind}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-brand/10 text-brand border border-brand/20"
                >
                  <span className="truncate max-w-[180px]">{ind}</span>
                  <button 
                    onClick={() => handleToggleIndustry(ind)}
                    className="p-0.5 rounded-full hover:bg-brand/20 text-brand"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                onClick={handleResetAllFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 ml-1 py-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all</span>
              </button>
            </div>

            <div className="text-xs font-bold text-slate-500">
              Showing <span className="text-brand font-extrabold">{filteredCareers.length}</span> of {careers.length} careers
            </div>
          </div>
        )}
      </div>

      {/* Results Header (when no active filter bar is shown) */}
      {isAllSelected && !searchQuery.trim() && (
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
          <span>Showing all <span className="text-slate-900 font-extrabold">{filteredCareers.length}</span> career pathways</span>
          <span>Sorted by match score</span>
        </div>
      )}

      {/* Career Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredCareers.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.04, 0.4) }}
            onClick={() => navigate(`/student/careers/${career.id}`)}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
          >
            {/* Image Header with Badge and Bookmark */}
            <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-100">
              <img 
                src={career.image} 
                alt={career.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />
              
              {/* Bookmark Button */}
              <div className="absolute top-3.5 right-3.5">
                <button 
                  onClick={(e) => handleSaveCareer(career, e)}
                  className={`p-2.5 rounded-2xl backdrop-blur-md transition-all shadow-xs ${
                    savedIds.includes(career.id) 
                      ? 'bg-brand text-white' 
                      : 'bg-white/85 text-slate-700 hover:bg-white hover:text-brand'
                  }`}
                  title={savedIds.includes(career.id) ? 'Saved' : 'Save career'}
                >
                  <Bookmark className={`w-4 h-4 ${savedIds.includes(career.id) ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Match Score Badge */}
              <div className="absolute bottom-3.5 left-3.5">
                <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-extrabold text-white flex items-center gap-1.5 shadow-xs">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{career.match} Match</span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[11px] font-extrabold text-brand uppercase tracking-wider px-2.5 py-1 bg-brand/10 rounded-lg line-clamp-1 border border-brand/15">
                    {career.category}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2 group-hover:text-brand transition-colors line-clamp-1">
                  {career.title}
                </h3>

                <p className="text-slate-500 text-xs sm:text-sm font-medium line-clamp-2 leading-relaxed mb-4">
                  {career.description}
                </p>
              </div>

              <div>
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 pt-3.5 pb-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-700 truncate">{career.salary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-bold text-slate-700 truncate">{career.growth} Growth</span>
                  </div>
                </div>

                {/* View Details Action */}
                <button 
                  onClick={() => navigate(`/student/careers/${career.id}`)}
                  className="w-full py-3 bg-slate-50 group-hover:bg-brand text-slate-700 group-hover:text-white font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCareers.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No careers match your search</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
            {searchQuery 
              ? `We couldn't find any careers matching "${searchQuery}" in the selected industries.`
              : 'No careers found for the selected industry filters.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button 
              onClick={handleResetAllFilters}
              className="px-5 py-2.5 bg-brand text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:bg-cyan-600 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



