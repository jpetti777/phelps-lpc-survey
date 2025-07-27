import React, { useState, useEffect, useCallback } from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Survey Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We encountered an error. Please refresh the page and try again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Footer Component
const Footer = () => (
  <div className="mt-8 pt-6">
    <hr className="border-gray-300 mb-4" />
    <div className="text-center">
      <p className="text-gray-500 text-sm">Brockport NY Forward</p>
    </div>
  </div>
);

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, singleButton = false, singleButtonOnly = false, buttonText = null }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          {singleButtonOnly ? (
            // Single gray button only (for incomplete evaluation)
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              {buttonText || 'OK'}
            </button>
          ) : singleButton ? (
            // Single blue button (for other single-button dialogs)
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {buttonText || 'OK'}
            </button>
          ) : (
            // Two buttons (Cancel + Confirm)
            <>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {buttonText || 'Confirm'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const LPCProjectEvaluationSurvey = () => {
  // Real project data from the spreadsheet
  const projects = [
    {
      id: 1,
      title: "Create an Accessible Venue at the Brockport Welcome Center",
      location: "11 Water Street (Brockport Welcome Center)",
      description: "This project will retrofit and expand accessible outdoor seating at the Brockport Welcome Center to enhance waterfront amenities for residents and Erie Canal visitors. The project includes installing durable, inclusive seating with waterfront views, along with site preparation and infrastructure improvements that will transform the Welcome Center into a more inviting community gathering place.",
      nyForwardRequest: 150000,
      totalCost: 150000,
      image: "/images/project-1.jpg"
    },
    {
      id: 2,
      title: "Enhance the Clinton Street Streetscape",
      location: "Clinton Street from Main Street to Utica Street",
      description: "This project will enhance Clinton Street from Main Street to Utica Street with wider sidewalks, improved lighting, crosswalks, landscaping, and road repaving to create safer pedestrian access connecting downtown, SUNY Brockport, and the Erie Canal waterfront while supporting local businesses.",
      nyForwardRequest: 1000000,
      totalCost: 1000000,
      image: "/images/project-2.jpg"
    },
    {
      id: 3,
      title: "Enhance the Main Street Streetscape",
      location: "Main Street from the Main Street Bridge to Holley Street",
      description: "This project will revitalize Main Street's historic commercial district from the Main Street Bridge to Holley Street by replacing sidewalks, protecting street trees, modernizing LED lighting with power connections for events, and adding bike racks to preserve and enhance downtown's historic character and support local businesses.",
      nyForwardRequest: 2000000,
      totalCost: 2000000,
      image: "/images/project-3.jpg"
    },
    {
      id: 4,
      title: "Develop a Downtown Branding and Marketing Strategy",
      location: "Downtown Brockport",
      description: "This project will develop a comprehensive marketing and branding initiative to strengthen the village's identity as a premier canalfront destination and attract more residents, employers, and visitors. The project will include the creation of a new brand identity, targeted messaging for different audiences, and implementation through both digital collateral and wayfinding signage.",
      nyForwardRequest: 300000,
      totalCost: 300000,
      image: "/images/project-4.jpg"
    },
    {
      id: 5,
      title: "Enhance Accessibility at St. Luke's Episcopal Church",
      location: "14 State Street",
      description: "This project will rehabilitate the historic St. Luke's Episcopal Church to enhance accessibility to the Brockport Ecumenical Food Shelf and Clothing Center through three key improvements: installing an elevator, repairing the Main Street entry stairs and ramp to ensure ADA accessibility, and renovating the basement with updated layout and moisture-proofing solutions.",
      nyForwardRequest: 500000,
      totalCost: 550000,
      image: "/images/project-5.jpg"
    },
    {
      id: 6,
      title: "Modernize Brockport Fire Station",
      location: "38 Market Street",
      description: "This project will replace eight overhead bay doors with high-quality aluminum full-view doors for improved thermal performance and custom red paint to match department branding, enhancing the downtown streetscape appearance while improving operational efficiency and energy performance as part of broader revitalization efforts.",
      nyForwardRequest: 102250,
      totalCost: 205428,
      image: "/images/project-6.jpg"
    },
    {
      id: 7,
      title: "Enhance 2 Main Street as a Canal Gateway",
      location: "2 Main Street",
      description: "This project will enhance the mixed-use property at 2 Main Street to strengthen its appeal as a gateway to the canal. The project will make comprehensive improvements to the property's three commercial storefronts and six apartments, including new parking, roofing, siding, windows, central air for storefronts, energy-efficient laundry facilities, and landscaping with canal-side benches to attract canal visitors and support local businesses.",
      nyForwardRequest: 100000,
      totalCost: 200000,
      image: "/images/project-7.jpg"
    },
    {
      id: 8,
      title: "Revitalize Blighted Property at 41 Clark Street with New Townhomes",
      location: "41 Clark Street",
      description: "This project will demolish a blighted single-family home and barn to construct four buildings with 12 townhomes, each with 3 bedrooms, 2.5 bathrooms, and a single-car garage. Project work will include final engineering plans, village approvals, demolition, site preparation with new road and sidewalk, and townhome construction. Note: This project is located outside the NY Forward Area.",
      nyForwardRequest: 800000,
      totalCost: 3466011,
      image: "/images/project-8.jpg"
    },
    {
      id: 9,
      title: "Improve Accessibility at the Lift Bridge Book Shop",
      location: "45 Main Street",
      description: " This project will enhance accessibility at the Lift Bridge Book Shop by modifying the front entrance to meet ADA requirements, installing interior ramp access to the lower level, and constructing a fully accessible bathroom, in addition to replacing deteriorating facades, windows, and exterior walls to address water leaks, mold issues, and energy inefficiency.",
      nyForwardRequest: 500000,
      totalCost: 550000,
      image: "/images/project-9.jpg"
    },
    {
      id: 10,
      title: "Restore Upper Floor Apartments and Facade at 46-50 Main Street",
      location: "46-50 Main Street",
      description: "This project will restore and renovate three vacant third-floor apartment units at 46-50 Main Street, increasing total residential units at the building from two to five. The apartments will be targeted at graduate students and young professionals. The project will also enhance the facade by replacing the building's 1970s vinyl siding with historically appropriate brickwork.",
      nyForwardRequest: 263392,
      totalCost: 526785,
      image: "/images/project-10.jpg"
    },
    {
      id: 11,
      title: "Develop Sustainable Mixed-Income Apartments at 60-90 Clinton Street",
      location: "60-90 Clinton Street",
      description: "This project will transform the vacant lot at 60-90 Clinton Street into a new 25,000-square foot apartment building featuring a mix of 25 one- and two-bedroom units with sustainable high-efficiency electric heating and cooling systems and fully electric appliances. The project will provide high-quality, mixed income housing options, serving households earning up to 80% of Area Median Income (AMI).",
      nyForwardRequest: 1500000,
      totalCost: 8484033,
      image: "/images/project-11.jpg"
    },
    {
      id: 12,
      title: "Upgrade 73 Main Street Exterior Facade and Accessibility",
      location: "73 Main Street",
      description: "This project will upgrade the mixed-use building at 73 Main Street to improve the exterior facade that is visible from the public parking lot, install energy-efficient windows, replace the steep stairway, and install  a stair lift for improved accessibility.",
      nyForwardRequest: 55275,
      totalCost: 110550,
      image: "/images/project-12.jpg"
    },
    {
      id: 13,
      title: "Construct New Mixed-Use Building on Vacant Main Street Lot",
      location: "173 Main Street",
      description: "This project will construct a new 3,000-square foot mixed-use building on a vacant lot (formerly destroyed by fire in 2008) featuring 1,500 square feet of Main Street-facing retail space and three one-bedroom apartments that will provide new commercial and residential opportunities downtown. Note: This project is located outside the NY Forward Area.",
      nyForwardRequest: 300000,
      totalCost: 600000,
      image: "/images/project-13.jpg"
    },
    {
      id: 14,
      title: "Complete Historic Bed and Breakfast Restoration at 205 Park Avenue",
      location: "205 Park Avenue",
      description: "This project will complete the renovation and restoration of a historic Victorian hotel which has been transformed into a bed and breakfast. The project will add one guest room and bathroom, restore the historical front porch, install a back deck with accessibility ramp, finish walkways and flooring, replace the end-of-life roof, and install second-floor air ducting. This project will be the last phase of a larger renovation project, which has already invested more than $200,000 in historical restoration work and infrastructure. Note: This project is located outside the NY Forward Area.",
      nyForwardRequest: 41665,
      totalCost: 83331,
      image: "/images/project-14.jpg"
    },
    {
      id: 15,
      title: "Restore the Morgan Manning House Post-Fire",
      location: "151 Main Street",
      description: "This project will restore the Morgan-Manning House, addressing areas affected by the January 2025 fire, including refinishing flooring and installing custom cabinetry in the Victorian-style kitchen. The project will also enhance accessibility to the museum with a new ADA ramp connection from the back parking area, restructured restrooms, and a widened driveway. Enhanced security systems will also be installed.",
      nyForwardRequest: 108968,
      totalCost: 108968,
      image: "/images/project-15.jpg"
    },
    {
      id: 16,
      title: "Replace Roof at 43 Main Street",
      location: "43 Main Street",
      description: "This project will replace the roof and decorative architectural overhangs at the historic 43 Main Street mixed-use building.",
      nyForwardRequest: 300000,
      totalCost: 300000,
      image: "/images/project-16.jpg"
    },
    {
      id: 17,
      title: "Renovate 2 Market Street Apartment",
      location: "2 Market Street",
      description: "This project will completely renovate a 600-square foot apartment unit at 2 Market Street with new ceilings, floors, windows, HVAC, plumbing, and structural improvements.",
      nyForwardRequest: 300000,
      totalCost: 300000,
      image: "/images/project-17.jpg"
    },
    {
      id: 18,
      title: "Establish a Small Project Grant Fund",
      location: "NY Forward Area",
      description: "The Small Project Grant Fund will provide financial assistance to property and business owners for building improvements, facades, renovations, signage, equipment, and public art installations to strengthen Brockport's historic character and support downtown businesses, covering up to 75% of project costs with recipients providing a 25% match.",
      nyForwardRequest: 300000,
      totalCost: 390000,
      image: "/images/project-18.jpg"
    }
  ];

  // State management
  const [currentPage, setCurrentPage] = useState('welcome');
  const [userName, setUserName] = useState('');
  const [currentProject, setCurrentProject] = useState(0);
  const [evaluations, setEvaluations] = useState({});
  const [projectSelections, setProjectSelections] = useState({});
  const [scores, setScores] = useState({});
  const [categories, setCategories] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const [validationErrors, setValidationErrors] = useState({});

  // Evaluation criteria
  const brockportStrategies = [
    "This project leverages our identity as a canal community and the pilot Empire State Trail Town.",
    "This project improves accessibility, walkability, and multimodal access, positioning Brockport as the premier inclusive waterfront community along the Erie Canal.",
    "This project supports the development of diverse, affordable, and accessible housing options on Main Street and near the Erie Canal.",
    "This project reinforces Brockport's unique sense of place and Victorian character, creating an inviting downtown where people can connect and feel at home.",
    "This project does NOT align with any of the above strategies."
  ];

  const stateGoals = [
    "This project creates an active downtown with a strong sense of place.",
    "This project provides amenities that support and enhance downtown living and quality of life.",
    "This project attracts new businesses that create a robust mix of shopping, entertainment, and service options for residents and visitors, and that provide job opportunities for a variety of skills and salaries.",
    "This project enhances public spaces for arts and cultural events that serve the existing members of the community but also draw in visitors from around the region.",
    "This project builds a diverse population, with residents and workers supported by complementary varied housing and employment opportunities.",
    "This project reduces greenhouse gas emissions and supports investments that are more resilient to future climate change impacts.",
    "This project grows the local property tax base.",
    "This project does NOT align with any of the above goals."
  ];

  // API warming function
  const warmUpAPI = useCallback(async () => {
    try {
      const start = Date.now();
      await fetch('/api/health');
      const duration = Date.now() - start;
      console.log(`✅ API warmed up (${duration}ms)`);
      return true;
    } catch (error) {
      console.log('⚠️ API warmup failed (not critical):', error);
      return false;
    }
  }, []);

  // Calculate score for a project
  const calculateScore = useCallback((projectId) => {
    const eval_ = evaluations[projectId];
    if (!eval_ || eval_.recused) return 0;

    let score = 0;

    // Brockport Strategies (0-3 points)
    if (eval_.brockportStrategies.includes(4)) {
      score += 0;
    } else {
      const selectedStrategies = eval_.brockportStrategies.filter(idx => idx !== 4).length;
      if (selectedStrategies >= 3) score += 3;
      else if (selectedStrategies === 2) score += 2;
      else if (selectedStrategies === 1) score += 1;
    }

    // State Goals (0-3 points)
    if (eval_.stateGoals.includes(7)) {
      score += 0;
    } else {
      const selectedGoals = eval_.stateGoals.filter(idx => idx !== 7).length;
      if (selectedGoals >= 5) score += 3;
      else if (selectedGoals >= 3) score += 2;
      else if (selectedGoals >= 1) score += 1;
    }

    // Drop-down criteria (1-3 points each)
    const dropdownCriteria = ['levelOfImpact', 'projectReadiness', 'costEffectiveness', 'benefitsToComm'];
    dropdownCriteria.forEach(criteria => {
      if (eval_[criteria] === 'High') score += 3;
      else if (eval_[criteria] === 'Medium') score += 2;
      else if (eval_[criteria] === 'Low') score += 1;
    });

    // Priority criteria (1 or 3 points each)
    const priorityCriteria = ['enhancesAccessibility', 'createsHousing', 'providesCommunityBenefits'];
    priorityCriteria.forEach(criteria => {
      if (eval_[criteria] === 'Yes') score += 3;
      else if (eval_[criteria] === 'No') score += 1;
    });

    return score;
  }, [evaluations]);

  // Categorize project based on score
  const categorizeProject = useCallback((score) => {
    if (score >= 22) return 'High';
    if (score >= 16) return 'Medium';
    return 'Low';
  }, []);

  // Initialize evaluations and load from backup
  useEffect(() => {
    // Try to load from localStorage backup
    const backup = localStorage.getItem('lpc-survey-backup');
    if (backup) {
      try {
        const parsed = JSON.parse(backup);
        setUserName(parsed.userName || '');
        setEvaluations(parsed.evaluations || {});
        // Don't restore project selections from backup to ensure clean start
        setProjectSelections({});
      } catch (error) {
        console.error('Error loading backup:', error);
      }
    }

    // Initialize evaluations if not loaded from backup
    const initialEvaluations = {};
    projects.forEach(project => {
      initialEvaluations[project.id] = {
        brockportStrategies: [],
        stateGoals: [],
        levelOfImpact: '',
        projectReadiness: '',
        costEffectiveness: '',
        benefitsToComm: '',
        enhancesAccessibility: '',
        createsHousing: '',
        providesCommunityBenefits: '',
        recused: false
      };
    });

    if (Object.keys(evaluations).length === 0) {
      setEvaluations(initialEvaluations);
    }
  }, []); // Remove dependencies to prevent infinite loop

  // Auto-save to localStorage (but not project selections until Step 2)
  useEffect(() => {
    // Only save if we have actual data to save
    if (userName || Object.keys(evaluations).length > 0) {
      const backup = {
        userName,
        evaluations,
        // Only save project selections if we're on step 2
        projectSelections: currentPage === 'step2-selection' ? projectSelections : {},
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lpc-survey-backup', JSON.stringify(backup));
    }
  }, [userName, evaluations, projectSelections, currentPage]);

  // Clear validation errors whenever the current project changes
  useEffect(() => {
    setValidationErrors({});
  }, [currentProject]);

  // Update scores and categories when evaluations change
  useEffect(() => {
    const newScores = {};
    const newCategories = {};
    projects.forEach(project => {
      const score = calculateScore(project.id);
      newScores[project.id] = score;
      newCategories[project.id] = categorizeProject(score);
    });

    // Only update if scores actually changed
    const scoresChanged = JSON.stringify(newScores) !== JSON.stringify(scores);
    const categoriesChanged = JSON.stringify(newCategories) !== JSON.stringify(categories);

    if (scoresChanged) {
      setScores(newScores);
    }
    if (categoriesChanged) {
      setCategories(newCategories);
    }
  }, [evaluations]); // Only depend on evaluations, not on scores/categories to prevent loops

  // Warm up API when user first arrives
  useEffect(() => {
    if (currentPage === 'welcome' && userName) {
      // Only warm up once user enters their name (shows intent to proceed)
      warmUpAPI();
    }
  }, [currentPage, userName, warmUpAPI]);

  // Pre-warm before entering Step 2 (selection phase)
  useEffect(() => {
    if (currentPage === 'step2-selection') {
      warmUpAPI();
    }
  }, [currentPage, warmUpAPI]);

  // Validate current project evaluation
  const validateCurrentProject = () => {
    const project = projects[currentProject];
    const eval_ = evaluations[project.id];
    const errors = {};

    if (!eval_ || eval_.recused) return {};

    if (eval_.brockportStrategies.length === 0) {
      errors.brockportStrategies = "Please select at least one of the following options";
    }

    if (eval_.stateGoals.length === 0) {
      errors.stateGoals = "Please select at least one of the following options";
    }

    const requiredDropdowns = [
      { key: 'levelOfImpact', label: 'Level of Impact' },
      { key: 'projectReadiness', label: 'Project Readiness' },
      { key: 'costEffectiveness', label: 'Cost-Effectiveness' },
      { key: 'benefitsToComm', label: 'Benefits to the Community' }
    ];

    requiredDropdowns.forEach(({ key, label }) => {
      if (!eval_[key]) {
        errors[key] = `Please select a rating for ${label}`;
      }
    });

    const requiredPriorities = [
      { key: 'enhancesAccessibility', label: 'Enhances ADA Accessibility' },
      { key: 'createsHousing', label: 'Creates Housing Options' },
      { key: 'providesCommunityBenefits', label: 'Provides Community Benefits' }
    ];

    requiredPriorities.forEach(({ key, label }) => {
      if (!eval_[key]) {
        errors[key] = `Please select Yes or No for ${label}`;
      }
    });

    return errors;
  };

  // Check if current project evaluation is complete
  const isCurrentProjectComplete = () => {
    const errors = validateCurrentProject();
    return Object.keys(errors).length === 0;
  };

  // Handle alignment changes with validation
  const handleAlignmentChange = (projectId, section, index, checked) => {
    setEvaluations(prev => {
      const newEval = { ...prev };
      const projectEval = { ...newEval[projectId] };

      if (section === 'brockportStrategies') {
        if (index === 4) { // "does not align" option
          projectEval.brockportStrategies = checked ? [4] : [];
        } else {
          if (checked) {
            projectEval.brockportStrategies = [...projectEval.brockportStrategies.filter(i => i !== 4), index];
          } else {
            projectEval.brockportStrategies = projectEval.brockportStrategies.filter(i => i !== index);
          }
        }
      } else if (section === 'stateGoals') {
        if (index === 7) { // "does not align" option
          projectEval.stateGoals = checked ? [7] : [];
        } else {
          if (checked) {
            projectEval.stateGoals = [...projectEval.stateGoals.filter(i => i !== 7), index];
          } else {
            projectEval.stateGoals = projectEval.stateGoals.filter(i => i !== index);
          }
        }
      }

      newEval[projectId] = projectEval;
      return newEval;
    });

    // Clear validation errors for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[section];
      return newErrors;
    });
  };

  // Handle dropdown changes
  const handleDropdownChange = (projectId, field, value) => {
    setEvaluations(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value
      }
    }));

    // Clear validation error for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  // Handle recusal with confirmation
  const handleRecusal = (projectId, recused) => {
    if (recused) {
      setConfirmDialog({
        isOpen: true,
        title: 'Confirm Recusal',
        message: 'Are you sure you want to recuse yourself from evaluating this project? This action will skip this project and move to the next one.',
        onConfirm: () => {
          setEvaluations(prev => ({
            ...prev,
            [projectId]: {
              ...prev[projectId],
              recused: true
            }
          }));

          // Clear validation errors when recusing
          setValidationErrors({});
          setConfirmDialog({ isOpen: false });

          // Move to next project immediately without delay
          if (currentProject < projects.length - 1) {
            setCurrentProject(currentProject + 1);
          } else {
            setCurrentPage('step2-selection');
          }
          window.scrollTo(0, 0);
        },
        onCancel: () => setConfirmDialog({ isOpen: false })
      });
    } else {
      setEvaluations(prev => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          recused: false
        }
      }));
    }
  };

  // Handle next project with validation
  const handleNextProject = () => {
    const errors = validateCurrentProject();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setConfirmDialog({
        isOpen: true,
        title: 'Incomplete Evaluation',
        message: 'Please evaluate all the criteria before proceeding.',
        onConfirm: () => setConfirmDialog({ isOpen: false }),
        singleButtonOnly: true,
        buttonText: 'Return to Evaluation'
      });
      return;
    }

    // Clear validation errors when moving to next project
    setValidationErrors({});
    if (currentProject < projects.length - 1) {
      setCurrentProject(currentProject + 1);
    } else {
      setCurrentPage('step2-selection');
    }

    // Scroll to top
    window.scrollTo(0, 0);
  };

  // Handle next page from welcome with validation
  const handleNextPageFromWelcome = () => {
    if (!userName.trim()) {
      return; // Do nothing if name is not filled
    }

    setCurrentPage('evaluation');
    window.scrollTo(0, 0);
  };

  // Calculate total NY Forward Request for selected projects
  const calculateTotal = () => {
    return Object.keys(projectSelections)
      .filter(projectId => {
        const isSelected = projectSelections[projectId];
        const isRecused = evaluations[projectId]?.recused;
        // Only count selected projects that are NOT recused
        return isSelected && !isRecused;
      })
      .reduce((total, projectId) => {
        const project = projects.find(p => p.id === parseInt(projectId));
        return total + (project ? project.nyForwardRequest : 0);
      }, 0);
  };

  // Save data to MongoDB via API
  const saveToDatabase = async (data) => {
    try {
      console.log('📤 Attempting to submit survey data:', {
        userName: data.userName,
        totalRequest: data.totalRequest,
        evaluationsCount: Object.keys(data.evaluations).length,
        selectionsCount: Object.keys(data.projectSelections).length
      });

      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log('📡 API Response status:', response.status);

      const result = await response.json();
      console.log('📥 API Response data:', result);

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: Failed to submit survey`);
      }

      console.log('✅ Survey submitted successfully:', result);
      localStorage.removeItem('lpc-survey-backup'); // Clear backup after successful submission

      // Show success page
      setTimeout(() => {
        setCurrentPage('success');
        window.scrollTo(0, 0);
      }, 1000);

    } catch (error) {
      console.error('❌ Error saving survey:', error);

      // Show error to user
      setConfirmDialog({
        isOpen: true,
        title: 'Submission Error',
        message: `Failed to submit survey: ${error.message}. Please try again or contact support.`,
        onConfirm: () => setConfirmDialog({ isOpen: false }),
        singleButton: true,
        buttonText: 'OK'
      });
    }
  };

  // Handle final submission with confirmation
  const handleSubmit = () => {
    const total = calculateTotal();
    if (total >= 6000000 && total <= 8000000) {
      setConfirmDialog({
        isOpen: true,
        title: 'Confirm Submission',
        message: `Are you sure you want to submit your survey?`,
        onConfirm: async () => {
          // Pre-warm API right before submission
          console.log('🔥 Pre-warming API before submission...');
          await warmUpAPI();

          const submissionData = {
            userName,
            timestamp: new Date().toISOString(),
            evaluations,
            scores,
            categories,
            projectSelections,
            totalRequest: total
          };
          saveToDatabase(submissionData);
          setConfirmDialog({ isOpen: false });
        },
        onCancel: () => setConfirmDialog({ isOpen: false })
      });
    }
  };

  // Render welcome page
  const renderWelcomePage = () => (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="pt-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">LPC Project Evaluation Survey</h1>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Instructions</h2>
          <p className="mb-4 text-sm md:text-base">
            This survey will walk you through a two-step process for evaluating the proposed projects. 
            It is designed to help you identify the projects you think are most competitive for funding, 
            in addition to the projects that could be removed from consideration.
          </p>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
            <p className="font-semibold text-sm md:text-base">Important: Please complete this survey in one sitting. It should take you approximately 30 minutes to complete. Your progress will NOT be saved if you close or refresh this window before submitting the survey.</p>
          </div>

          <div className="space-y-4 mb-6 text-sm md:text-base">
            <p><strong>Step 1:</strong> You will evaluate each project based on how well it aligns with the evaluation criteria established by the State and the LPC, using a scale of High, Medium, Low. Your answers will be aggregated and used to sort each project into three categories: High Rating projects that you scored the highest, Medium Rating projects that you scored moderately-well, and Low Rating projects that you scored the lowest.</p>

            <p><strong>Step 2:</strong> You will choose which projects you want to "fund" for the purposes of this exercise. As you select projects, a calculator will automatically sum the total NY Forward Request amount. You will only be able to submit your survey if the total NY Forward Request amount is between $6 million to $8 million. <em>Note: This is only an exercise. Your selections in this exercise are not definitive. There will be on-going discussions at the upcoming LPC meetings to narrow down the list of projects.</em></p>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">How We Will Use This Data</h2>
          <p className="mb-4 text-sm md:text-base">
            The evaluations from all LPC members will be combined to create an overall rating for each project, either High, Medium, or Low. At the next LPC meeting, we will present which projects fell into each of the categories. This will help the LPC make decisions about which projects to keep under consideration for potential funding and which projects could be removed. <em>Note: Your individual responses will remain anonymous. Other LPC members will NOT be able to see your answers.</em>
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Name:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
          <p className="text-xs md:text-sm text-gray-600 mt-2">
            <em>Your name will only be used to confirm that we have received responses from all LPC members. Your responses will NOT be tied to your name.</em>
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNextPageFromWelcome}
            disabled={!userName.trim()}
            className={`px-4 md:px-6 py-3 rounded-lg font-medium transition-colors ${
              userName.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next Page
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );

  // Render project evaluation page
  const renderProjectEvaluation = () => {
    const project = projects[currentProject];
    const eval_ = evaluations[project.id] || {};
    const percentage = Math.round((project.nyForwardRequest / project.totalCost) * 100);

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="pt-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Step 1: Project Evaluation</h1>
          </div>

          {/* Project Info in Gray Box */}
          <div className="bg-gray-100 rounded-lg p-4 md:p-6 mb-6">
            <p className="text-lg text-black mb-4">Project {currentProject + 1} of {projects.length}</p>
            <h2 className="text-xl md:text-2xl font-bold mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-4 text-sm md:text-base">{project.location}</p>

            <div className="mb-4">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full object-cover rounded-lg"
                style={{ height: 'auto' }}
              />
            </div>

            <p className="mb-4 text-sm md:text-base">{project.description}</p>

            <p className="font-semibold text-sm md:text-base">
              NY Forward Request: ${project.nyForwardRequest.toLocaleString()} ({percentage}% of total cost)
            </p>
            <p className="font-semibold text-sm md:text-base">
              Total Project Cost: ${project.totalCost.toLocaleString()}
            </p>
          </div>

          {/* Recusal checkbox */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex space-x-3">
              <input
                type="checkbox"
                checked={eval_.recused || false}
                onChange={(e) => handleRecusal(project.id, e.target.checked)}
                className="w-4 h-4 mt-0.5"
                style={{ minWidth: '16px', minHeight: '16px', maxWidth: '16px', maxHeight: '16px' }}
              />
              <label className="text-xs md:text-sm flex-1 cursor-pointer" onClick={(e) => {
                e.preventDefault();
                const checkbox = e.currentTarget.previousElementSibling;
                if (!checkbox.disabled) {
                  checkbox.click();
                }
              }}>
                <strong>Recusal:</strong> I need to recuse myself from evaluating this project because I or my family member: (1) have a financial interest in the project, (2) have an interest as a board member, owner, officer, employee, or investor in the project sponsor, or (3) have an interest as a board member, owner, officer, employee, or investor in a potential competitor of the project.
              </label>
            </div>
          </div>

          {!eval_.recused && (
            <div className="space-y-6 md:space-y-8">
              {/* Brockport Strategies */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Alignment with Brockport's Revitalization Strategies</h3>
                <p className="text-sm text-gray-600 mb-4">This project aligns with the following strategies for the Village of Brockport's revitalization (select all that apply):</p>
                {validationErrors.brockportStrategies && (
                  <p className="text-red-600 text-sm mb-3">{validationErrors.brockportStrategies}</p>
                )}
                <div className="space-y-3">
                  {brockportStrategies.map((strategy, index) => (
                    <div key={index} className="flex space-x-3 items-start">
                      <input
                        type="checkbox"
                        checked={eval_.brockportStrategies?.includes(index) || false}
                        onChange={(e) => handleAlignmentChange(project.id, 'brockportStrategies', index, e.target.checked)}
                        disabled={index !== 4 && eval_.brockportStrategies?.includes(4)}
                        className="mt-1"
                        style={{ 
                          width: '16px', 
                          height: '16px',
                          minWidth: '16px', 
                          minHeight: '16px', 
                          maxWidth: '16px', 
                          maxHeight: '16px',
                          flexShrink: 0,
                          appearance: 'checkbox'
                        }}
                      />
                      <label className="text-xs md:text-sm flex-1 cursor-pointer leading-tight" onClick={(e) => {
                        e.preventDefault();
                        const checkbox = e.currentTarget.previousElementSibling;
                        if (!checkbox.disabled) {
                          checkbox.click();
                        }
                      }}>{strategy}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* State Goals */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Alignment with State Goals for the NY Forward Program</h3>
                <p className="text-sm text-gray-600 mb-4">This project aligns with the following statewide goals for the NY Forward program (select all that apply):</p>
                {validationErrors.stateGoals && (
                  <p className="text-red-600 text-sm mb-3">{validationErrors.stateGoals}</p>
                )}
                <div className="space-y-3">
                  {stateGoals.map((goal, index) => (
                    <label key={index} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={eval_.stateGoals?.includes(index) || false}
                        onChange={(e) => handleAlignmentChange(project.id, 'stateGoals', index, e.target.checked)}
                        disabled={index !== 7 && eval_.stateGoals?.includes(7)}
                        className="mt-1 w-4 h-4"
                      />
                      <span className="text-xs md:text-sm">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dropdown criteria */}
              {[
                { key: 'levelOfImpact', label: 'Level of Impact', desc: 'This project will have a significant positive impact on downtown Brockport and could spur additional investment. (Rate on a scale of High, Medium, Low.)' },
                { key: 'projectReadiness', label: 'Project Readiness', desc: 'This project is well-developed and can be ready to break ground in a timely manner. (Rate on a scale of High, Medium, Low.)' },
                { key: 'costEffectiveness', label: 'Cost-Effectiveness', desc: 'This project is a good use of public funds and the budget is reasonable. (Rate on a scale of High, Medium, Low.)' },
                { key: 'benefitsToComm', label: 'Benefits to the Community', desc: 'This project will result in benefits to the broader community, beyond just the project sponsor. (Rate on a scale of High, Medium, Low.)' }
              ].map(criteria => (
                <div key={criteria.key} className="border border-gray-300 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{criteria.label}</h3>
                  <p className="text-sm text-gray-600 mb-4">{criteria.desc}</p>
                  {validationErrors[criteria.key] && (
                    <p className="text-red-600 text-sm mb-3">{validationErrors[criteria.key]}</p>
                  )}
                  <select
                    value={eval_[criteria.key] || ''}
                    onChange={(e) => handleDropdownChange(project.id, criteria.key, e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              ))}

              {/* Priority criteria - all in one box */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Priority Scoring</h3>
                <p className="text-sm text-gray-600 mb-4">Projects that align with the following criteria will receive additional priority points.</p>

                <div className="space-y-6">
                  {[
                    { key: 'enhancesAccessibility', label: 'ADA Accessibility', desc: 'This project enhances ADA accessibility to downtown businesses, buildings, or public spaces.' },
                    { key: 'createsHousing', label: 'Housing Options', desc: 'This project creates quality and/or diverse housing options in the village.' },
                    { key: 'providesCommunityBenefits', label: 'Community Benefits', desc: 'This project provides services or benefits to the broader Brockport community.' }
                  ].map(criteria => (
                    <div key={criteria.key}>
                      <h4 className="text-base font-medium mb-2">{criteria.label}</h4>
                      <p className="text-sm text-gray-600 mb-3">{criteria.desc}</p>
                      {validationErrors[criteria.key] && (
                        <p className="text-red-600 text-sm mb-3">{validationErrors[criteria.key]}</p>
                      )}
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={`${project.id}-${criteria.key}`}
                            value="Yes"
                            checked={eval_[criteria.key] === 'Yes'}
                            onChange={(e) => handleDropdownChange(project.id, criteria.key, e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm"><strong>Yes,</strong> this project achieves this criteria.</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={`${project.id}-${criteria.key}`}
                            value="No"
                            checked={eval_[criteria.key] === 'No'}
                            onChange={(e) => handleDropdownChange(project.id, criteria.key, e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm"><strong>No,</strong> this project does not achieve this criteria.</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                // Clear validation errors when navigating back
                setValidationErrors({});
                if (currentProject === 0) {
                  setCurrentPage('welcome');
                } else {
                  setCurrentProject(currentProject - 1);
                }
                window.scrollTo(0, 0);
              }}
              className="px-4 md:px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {currentProject === 0 ? 'Previous Page' : 'Previous Project'}
            </button>

            <button
              onClick={handleNextProject}
              className={`px-4 md:px-6 py-3 rounded-lg font-medium ${
                eval_.recused || isCurrentProjectComplete()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-pointer'
              }`}
            >
              Next Project
            </button>
          </div>

          <Footer />
        </div>
      </div>
    );
  };

  // Render step 2 selection
  const renderStep2Selection = () => {
    const total = calculateTotal();
    const isValidTotal = total >= 6000000 && total <= 8000000;
    const hasSelections = total > 0;

    // Determine calculator color
    let calculatorColor = 'bg-gray-100 text-gray-800'; // Default gray
    if (hasSelections) {
      if (isValidTotal) {
        calculatorColor = 'bg-green-100 text-green-800';
      } else {
        calculatorColor = 'bg-red-100 text-red-800';
      }
    }

    // Sort projects by score (highest first)
    const sortedProjects = [...projects].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));

    return (
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="pt-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Step 2: Project Selection</h1>
          </div>

          {/* Instructions Box */}
          <div className="bg-gray-100 rounded-lg p-4 md:p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Instructions</h2>
            <p className="mb-4 text-sm md:text-base">
              Based on the evaluation you completed in Step 1, your overall rating for each project is shown below. The ratings are on a scale of High, Medium, Low. Use the "Fund this Project" checkboxes to select which projects you wish to fund. As you select projects, a calculator at the bottom of your screen will automatically sum the Total NY Forward Request amount. You will only be able to submit your survey if the Total NY Forward Request amount is between $6 million to $8 million.
            </p>
            <p className="text-xs md:text-sm text-gray-600 italic">
              <em>Remember: This is only an exercise. Your selections in this survey are not definitive. There will be on-going discussions at the upcoming LPC meetings to narrow down the list of projects.</em>
            </p>
          </div>
        </div>

        {/* Scrollable Content with extra bottom padding */}
        <div className="max-w-6xl mx-auto p-4 md:p-6 pb-96 md:pb-80">
          <div className="space-y-4 md:space-y-6 mb-8">
            {sortedProjects.map(project => {
              const eval_ = evaluations[project.id];
              const isRecused = eval_?.recused;
              const isSelected = projectSelections[project.id] || false;
              const category = categories[project.id];
              const categoryColor = category === 'High' ? 'bg-green-100 text-green-800' : 
                                   category === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                   'bg-red-100 text-red-800';

              // Card styling based on selection
              const cardBorderClass = isSelected && !isRecused ? 'border-blue-600 border-2' : 'border border-gray-300';
              const cardBackgroundClass = isSelected && !isRecused ? 'bg-blue-50' : (isRecused ? 'bg-gray-50' : 'bg-white');

              return (
                <div key={project.id} className={`rounded-lg shadow-lg ${cardBorderClass} ${cardBackgroundClass} ${isRecused ? 'opacity-75' : ''}`}>
                  <div className="p-4 md:p-6">
                    {/* Rating above image */}
                    {!isRecused && (
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${categoryColor}`}>
                        Your Rating: {category}
                      </div>
                    )}
                    {isRecused && (
                      <div className="bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                        Recused
                      </div>
                    )}

                    {/* Image - medium size */}
                    <div className="mb-4">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className={`w-32 h-16 md:w-40 md:h-20 object-cover rounded-lg ${isRecused ? 'grayscale' : ''}`}
                      />
                    </div>

                    {/* Project title */}
                    <h3 className={`text-lg md:text-xl font-bold mb-2 ${isRecused ? 'text-gray-500' : ''}`}>{project.title}</h3>

                    {/* Project location */}
                    <p className={`mb-3 text-sm ${isRecused ? 'text-gray-400' : 'text-gray-600'}`}>{project.location}</p>

                    {/* Project description */}
                    <p className={`mb-4 text-sm md:text-base ${isRecused ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>

                    {/* NY Forward Request */}
                    <div className="mb-4">
                      <p className={`font-semibold text-sm ${isRecused ? 'text-gray-400' : ''}`}>
                        NY Forward Request: <span className={`font-bold text-lg ${isRecused ? 'text-gray-400' : 'text-black'}`}>
                          ${project.nyForwardRequest.toLocaleString()}
                        </span>
                      </p>
                    </div>

                    {/* Fund this Project checkbox - highlighted */}
                    {!isRecused && (
                      <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3 inline-block">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={projectSelections[project.id] || false}
                            onChange={(e) => {
                              // Double-check that project is not recused before allowing selection
                              if (!evaluations[project.id]?.recused) {
                                setProjectSelections(prev => ({
                                  ...prev,
                                  [project.id]: e.target.checked
                                }));
                              }
                            }}
                            className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="font-bold text-blue-800 text-sm md:text-base">Fund this Project</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Footer with Total Calculator, Navigation, and Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50 p-4">
          <div className="max-w-6xl mx-auto">
            {/* Total Calculator */}
            <div className={`p-4 rounded-lg font-bold text-lg mb-4 ${calculatorColor}`}>
              Total NY Forward Request: ${total.toLocaleString()}
            </div>
            {!isValidTotal && hasSelections && (
              <p className="text-red-600 mb-4 text-sm md:text-base">
                The Total NY Forward Request should be between $6,000,000 to $8,000,000.
              </p>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mb-4">
              <button
                onClick={() => {
                  // Clear validation errors when going back to evaluation
                  setValidationErrors({});
                  setCurrentProject(projects.length - 1);
                  setCurrentPage('evaluation');
                  window.scrollTo(0, 0);
                }}
                className="px-4 md:px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Previous Page
              </button>

              <button
                onClick={handleSubmit}
                disabled={!isValidTotal}
                className={`px-4 md:px-6 py-3 rounded-lg font-medium ${
                  isValidTotal
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-300">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Brockport NY Forward</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render success page
  const renderSuccessPage = () => (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-green-800">Survey Submitted Successfully!</h1>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            Thank you for completing the LPC Project Evaluation Survey. Your responses have been recorded.
          </p>
          <p className="text-sm text-gray-500">
            You may now close this window.
          </p>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
          singleButton={confirmDialog.singleButton}
          singleButtonOnly={confirmDialog.singleButtonOnly}
          buttonText={confirmDialog.buttonText}
        />

        {currentPage === 'welcome' && renderWelcomePage()}
        {currentPage === 'evaluation' && renderProjectEvaluation()}
        {currentPage === 'step2-selection' && renderStep2Selection()}
        {currentPage === 'success' && renderSuccessPage()}
      </div>
    </ErrorBoundary>
  );
};

export default LPCProjectEvaluationSurvey;